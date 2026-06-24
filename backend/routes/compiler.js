const express = require('express');
const router = express.Router();

// ── Judge0 API Integration ────────────────────────────────────────────────────
// Judge0 CE public API (no key needed for low-rate usage)
const JUDGE0_API_URL = 'https://ce.judge0.com/submissions?base64_encoded=false&wait=true';

// Map languages to Judge0 language IDs
const LANGUAGE_MAP = {
  javascript: 93, // Node.js 18.15.0
  python: 92,     // Python 3.11.2
  java:   91,     // Java JDK 17
  cpp:    54,     // C++ GCC 9.2.0
};

// Judge0 status IDs  →  human-readable
// https://ce.judge0.com/#statuses-and-languages-status-get
const STATUS_MAP = {
  1:  { label: 'In Queue',             kind: 'pending' },
  2:  { label: 'Processing',           kind: 'pending' },
  3:  { label: 'Accepted',             kind: 'accepted' },
  4:  { label: 'Wrong Answer',         kind: 'wrong_answer' },
  5:  { label: 'Time Limit Exceeded',  kind: 'tle' },
  6:  { label: 'Compilation Error',    kind: 'compile_error' },
  7:  { label: 'Runtime Error (SIGSEGV)', kind: 'runtime_error' },
  8:  { label: 'Runtime Error (SIGXFSZ)', kind: 'runtime_error' },
  9:  { label: 'Runtime Error (SIGFPE)',  kind: 'runtime_error' },
  10: { label: 'Runtime Error (SIGABRT)', kind: 'runtime_error' },
  11: { label: 'Runtime Error (NZEC)',    kind: 'runtime_error' },
  12: { label: 'Runtime Error (Other)',   kind: 'runtime_error' },
  13: { label: 'Internal Error',          kind: 'runtime_error' },
  14: { label: 'Exec Format Error',       kind: 'runtime_error' },
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
router.post('/execute', async (req, res) => {
  try {
    const { language, code, stdin, expected_output } = req.body;

    if (!language || !code) {
      return res.status(400).json({ error: 'Language and code are required.' });
    }

    const langId = LANGUAGE_MAP[language.toLowerCase()];
    if (!langId) {
      return res.status(400).json({ error: `Language "${language}" is not supported.` });
    }

    const payload = {
      source_code:     code,
      language_id:     langId,
      stdin:           stdin           || '',
      expected_output: expected_output || undefined,  // let Judge0 do the comparison when provided
    };

    const j0Res = await fetch(JUDGE0_API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    if (!j0Res.ok) {
      const errText = await j0Res.text();
      console.error('Judge0 HTTP error:', errText);
      return res.status(502).json({ error: 'Code execution service is unavailable. Please try again later.' });
    }

    const result = await j0Res.json();

    const statusId    = result.status?.id ?? 0;
    const statusLabel = result.status?.description ?? STATUS_MAP[statusId]?.label ?? 'Unknown';
    const statusKind  = STATUS_MAP[statusId]?.kind ?? 'runtime_error';

    res.json({
      status: {
        id:    statusId,
        label: statusLabel,
        kind:  statusKind,
      },
      stdout:          result.stdout          || '',
      stderr:          result.stderr          || '',
      compile_output:  result.compile_output  || '',
      time:            result.time            || null,   // seconds as string e.g. "0.012"
      memory:          result.memory          || null,   // KB
      expected_output: expected_output        || null,
    });

  } catch (error) {
    console.error('Compiler Route Error:', error);
    res.status(500).json({ error: 'Internal server error during compilation.' });
  }
});

module.exports = router;
