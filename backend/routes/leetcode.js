const express = require('express');
const router = express.Router();

// ─── helpers ────────────────────────────────────────────────────────────────

/**
 * Strip HTML tags from a string, preserving newlines around block elements.
 */
function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(p|div|li|tr|td|th)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Parse the example testcase blocks from the HTML content LeetCode returns.
 * Returns an array of { input: string, output: string } objects (up to 3).
 */
function parseExamples(htmlContent, exampleTestcasesRaw, metaDataRaw) {
  const examples = [];

  // ── 1. Extract expected outputs from <pre> blocks ─────────────────────────
  // Each <pre> block looks like:
  //   Input: nums = [2,7,11,15], target = 9
  //   Output: [0,1]
  //   Explanation: ...
  const preRegex = /<pre>([\s\S]*?)<\/pre>/gi;
  let match;
  while ((match = preRegex.exec(htmlContent)) !== null) {
    const text = stripHtml(match[1]);
    const outputMatch = text.match(/Output[:\s]+([\s\S]+?)(?:\n|$)/i);
    if (outputMatch) {
      examples.push({ expectedOutput: outputMatch[1].trim() });
    }
  }

  // ── 2. Parse the raw testcase stdin lines into per-case stdin strings ─────
  if (!exampleTestcasesRaw || !metaDataRaw) return examples;

  try {
    const meta = JSON.parse(metaDataRaw);
    const numParams = meta.params ? meta.params.length : 1;
    const paramNames = meta.params ? meta.params.map(p => p.name) : ['input'];

    const lines = exampleTestcasesRaw.split('\n');
    const stdinCases = [];
    for (let i = 0; i < lines.length; i += numParams) {
      if (lines[i] === undefined) break;
      // Build a labelled stdin block like LeetCode shows in the testcase tab
      let tCase = '';
      for (let j = 0; j < numParams; j++) {
        if (lines[i + j] !== undefined) {
          tCase += `${paramNames[j]} =\n${lines[i + j]}\n`;
        }
      }
      if (tCase) stdinCases.push(tCase.trim());
    }

    // Merge stdin into examples array
    for (let i = 0; i < stdinCases.length; i++) {
      if (examples[i]) {
        examples[i].stdin = stdinCases[i];
        // Also build a plain stdin (just the raw lines) for the executor
        const rawLines = [];
        for (let j = 0; j < numParams; j++) {
          const lineIdx = i * numParams + j;
          if (lines[lineIdx] !== undefined) rawLines.push(lines[lineIdx]);
        }
        examples[i].rawStdin = rawLines.join('\n');
      }
    }
  } catch (_) {}

  return examples.slice(0, 3);
}

// ─── route ──────────────────────────────────────────────────────────────────

router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
      body: JSON.stringify({
        query: `
          query questionData($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              content
              metaData
              exampleTestcases
            }
          }
        `,
        variables: { titleSlug: slug },
      }),
    });

    const data = await response.json();
    const q = data?.data?.question;

    if (!q?.content) {
      return res.status(404).json({ error: 'Problem not found on LeetCode.' });
    }

    const examples = parseExamples(q.content, q.exampleTestcases, q.metaData);

    res.json({
      content:          q.content,
      metaData:         q.metaData,
      exampleTestcases: q.exampleTestcases,
      examples,          // ← rich parsed array: [{ stdin, rawStdin, expectedOutput }]
    });
  } catch (error) {
    console.error('LeetCode API Error:', error);
    res.status(500).json({ error: 'Failed to fetch from LeetCode.' });
  }
});

module.exports = router;
