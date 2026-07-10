const express = require('express');
const rateLimit = require('express-rate-limit');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

const compilerLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15,             // limit each IP to 15 executions per windowMs
  message: { error: 'Too many code execution requests from this IP, please try again after a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Judge0 API Integration ────────────────────────────────────────────────────
// Judge0 CE public API (no key needed for low-rate usage)
const JUDGE0_API_URL = 'https://ce.judge0.com/submissions?base64_encoded=true&wait=true';

// Map languages to Judge0 language IDs
const LANGUAGE_MAP = {
  javascript: 93, // Node.js 18.15.0
  python: 92,     // Python 3.11.2
  java: 91,     // Java JDK 17
  cpp: 54,     // C++ GCC 9.2.0
};

// Judge0 status IDs  →  human-readable
// https://ce.judge0.com/#statuses-and-languages-status-get
const STATUS_MAP = {
  1: { label: 'In Queue', kind: 'pending' },
  2: { label: 'Processing', kind: 'pending' },
  3: { label: 'Accepted', kind: 'accepted' },
  4: { label: 'Wrong Answer', kind: 'wrong_answer' },
  5: { label: 'Time Limit Exceeded', kind: 'tle' },
  6: { label: 'Compilation Error', kind: 'compile_error' },
  7: { label: 'Runtime Error (SIGSEGV)', kind: 'runtime_error' },
  8: { label: 'Runtime Error (SIGXFSZ)', kind: 'runtime_error' },
  9: { label: 'Runtime Error (SIGFPE)', kind: 'runtime_error' },
  10: { label: 'Runtime Error (SIGABRT)', kind: 'runtime_error' },
  11: { label: 'Runtime Error (NZEC)', kind: 'runtime_error' },
  12: { label: 'Runtime Error (Other)', kind: 'runtime_error' },
  13: { label: 'Internal Error', kind: 'runtime_error' },
  14: { label: 'Exec Format Error', kind: 'runtime_error' },
};

/**
* POST /api/compiler/execute
* Body: { language, code, stdin, expected_output? }
*
* Returns:
* {
*   status: { id, label, kind },   // e.g. kind: 'accepted' | 'wrong_answer' | 'tle' | 'compile_error' | 'runtime_error'
*   stdout: string,
*   stderr: string,
*   compile_output: string,
*   time: string,
*   memory: number,
*   expected_output: string,       // echoed back so the frontend can show it
* }
*/
router.post('/execute', authMiddleware, compilerLimiter, async (req, res) => {
  try {
    const { language, code, stdin, expected_output, metaData } = req.body;

    if (!language || !code) {
      return res.status(400).json({ error: 'Language and code are required.' });
    }

    const langId = LANGUAGE_MAP[language.toLowerCase()];
    if (!langId) {
      return res.status(400).json({ error: `Language "${language}" is not supported.` });
    }

    // --- Inject LeetCode Driver Code ---
    const driverGenerator = require('../utils/driverGenerator');
    const finalCode = driverGenerator(language, code, metaData);

    // Helper to base64 encode strings for Judge0
    const encodeBase64 = (str) => {
      if (str === null || str === undefined) return undefined;
      return Buffer.from(String(str), 'utf8').toString('base64');
    };

    const payload = {
      source_code: encodeBase64(finalCode),
      language_id: langId,
      stdin: encodeBase64(stdin || ''),
      expected_output: expected_output ? encodeBase64(expected_output) : undefined,  // let Judge0 do the comparison when provided
    };

    const j0Res = await fetch(JUDGE0_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!j0Res.ok) {
      const errText = await j0Res.text();
      console.error('Judge0 HTTP error:', errText);
      // Try to surface whatever detail Judge0 returned (e.g. rate-limit messages)
      let judgeErrMsg = 'Code execution service is unavailable. Please try again later.';
      try {
        const parsed = JSON.parse(errText);
        judgeErrMsg = parsed.message || parsed.error || errText || judgeErrMsg;
      } catch (_) {
        if (errText) judgeErrMsg = errText;
      }
      return res.status(502).json({ error: judgeErrMsg });
    }

    const result = await j0Res.json();

    let statusId = result.status?.id ?? 0;
    let statusLabel = result.status?.description ?? STATUS_MAP[statusId]?.label ?? 'Unknown';
    let statusKind = STATUS_MAP[statusId]?.kind ?? 'runtime_error';

    // Helper to decode base64 outputs from Judge0
    const decodeBase64 = (str) => {
      if (!str) return '';
      try {
        return Buffer.from(String(str), 'base64').toString('utf8');
      } catch (e) {
        return String(str);
      }
    };

    // Build a single consolidated error message (LeetCode style)
    // Priority: compile_output (syntax/sematics errors) > stderr (runtime stack traces) > message
    const compileOut = decodeBase64(result.compile_output).trim();
    const stderrOut  = decodeBase64(result.stderr).trim();
    const messageOut = decodeBase64(result.message).trim();
    const stdoutOut  = decodeBase64(result.stdout);

    let error_message = null;
    if (compileOut) {
      error_message = compileOut;           // e.g. "Line 5: SyntaxError: missing ; before statement"
    } else if (stderrOut) {
      error_message = stderrOut;            // e.g. "Traceback (most recent call last): ..."
    } else if (messageOut) {
      error_message = messageOut;
    }

    // Detect Syntax / Compilation errors in interpreted languages (Python, JS) or unmapped compiler errors
    if (error_message && (statusKind === 'runtime_error' || statusKind === 'compile_error')) {
      if (/(SyntaxError|IndentationError|TabError|ParseError|TokenError|invalid syntax|unexpected token|unexpected indent|missing \)|missing \}|illegal return|unexpected eof)/i.test(error_message)) {
        statusKind = 'compile_error';
        statusLabel = 'Syntax Error';
        statusId = 6;
      } else if (/(compilation error|error:\s+expected|error:\s+invalid|undefined reference|cannot find symbol)/i.test(error_message)) {
        statusKind = 'compile_error';
        statusLabel = 'Compilation Error';
        statusId = 6;
      }
    }

    res.json({
      status: {
        id: statusId,
        label: statusLabel,
        kind: statusKind,
      },
      stdout: stdoutOut || '',
      stderr: stderrOut,
      compile_output: compileOut,
      error_message,                        // null on success, full detail string on any error
      time: result.time || null,            // seconds as string e.g. "0.012"
      memory: result.memory || null,        // KB
      expected_output: expected_output || null,
    });

  } catch (error) {
    console.error('Compiler Route Error:', error);
    res.status(500).json({ error: 'Internal server error during compilation.' });
  }
});

module.exports = router;
