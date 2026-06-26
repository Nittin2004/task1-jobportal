import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DSA_TOPICS, ALL_QUESTIONS } from '../data/dsaData';
import toast from 'react-hot-toast';
import { getProfile } from '../services/api';
import PremiumModal from '../components/PremiumModal';
import { Lock } from 'lucide-react';

// ── localStorage helpers ────────────────────────────────────────────────────
const load = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// ── Pattern → TC / SC / Approach ────────────────────────────────────────────
const PATTERN_INFO = {
  'Hashing':                  { tc: 'O(n)',       sc: 'O(n)',        icon: '#', approach: 'Store elements in a HashMap for O(1) lookups. Iterate once and check for complement/match.', hint: 'What do you need to remember from previous iterations?' },
  'Binary Search':            { tc: 'O(log n)',   sc: 'O(1)',        icon: '🔍', approach: 'Maintain lo/hi pointers. Compute mid and eliminate half the search space each step.', hint: 'Find the monotonic condition — what makes you go left vs right?' },
  'Two Pointers':             { tc: 'O(n)',       sc: 'O(1)',        icon: '👆', approach: 'Use left and right pointers that move toward each other or in the same direction.', hint: 'When should each pointer move?' },
  'Sliding Window':           { tc: 'O(n)',       sc: 'O(k)',        icon: '🪟', approach: 'Maintain a window [l, r] and shrink/expand it. Track window state to avoid recomputation.', hint: 'When do you shrink the window? What invariant must hold?' },
  'Dynamic Programming':      { tc: 'O(n²)',      sc: 'O(n)',        icon: '💎', approach: 'Break into subproblems. Memoize results in a dp[] array. Build bottom-up or top-down.', hint: 'Define dp[i] as the answer for subproblem i. Find the recurrence.' },
  'Greedy':                   { tc: 'O(n log n)', sc: 'O(1)',        icon: '🤑', approach: 'Make locally optimal choices. Sort first or pick max/min greedily at each step.', hint: 'Prove that the greedy choice never leads to a worse global solution.' },
  'Backtracking':             { tc: 'O(2^n)',     sc: 'O(n)',        icon: '🔄', approach: 'Try all options recursively. On invalid path, backtrack and try the next option.', hint: 'Add a choice → recurse → remove choice (backtrack).' },
  'DFS':                      { tc: 'O(V+E)',     sc: 'O(V)',        icon: '🌳', approach: 'Go deep before going wide. Use a recursive call stack or explicit stack.', hint: 'Mark visited nodes to avoid cycles in graphs.' },
  'BFS':                      { tc: 'O(V+E)',     sc: 'O(V)',        icon: '🚶', approach: 'Explore layer by layer using a queue. Perfect for shortest-path in unweighted graphs.', hint: 'Use a visited set/array to prevent revisiting nodes.' },
  'Topological Sort':         { tc: 'O(V+E)',     sc: 'O(V)',        icon: '📊', approach: 'Use Kahn\'s algorithm (BFS with indegree) or DFS post-order to get a valid ordering.', hint: 'Build an adjacency list and track indegrees of all nodes.' },
  "Kadane's Algorithm":       { tc: 'O(n)',       sc: 'O(1)',        icon: '📈', approach: 'Track localMax and globalMax as you scan. localMax = max(nums[i], localMax + nums[i]).', hint: 'Decide: extend the existing subarray or start fresh?' },
  'Prefix Sum':               { tc: 'O(n)',       sc: 'O(n)',        icon: '➕', approach: 'Precompute prefix sums so any range sum [l, r] = prefix[r] - prefix[l-1] in O(1).', hint: 'Build prefix array once, then answer range queries in O(1).' },
  'Monotonic Stack':          { tc: 'O(n)',       sc: 'O(n)',        icon: '📚', approach: 'Maintain a stack in increasing or decreasing order. Pop when a larger/smaller element arrives.', hint: 'Each element is pushed/popped at most once → O(n) total.' },
  'Divide & Conquer':         { tc: 'O(n log n)', sc: 'O(log n)',    icon: '✂️', approach: 'Split problem into two halves, solve each recursively, then merge results.', hint: 'The merge step is usually where the key logic lives.' },
  'Union Find':               { tc: 'O(α(n))',    sc: 'O(n)',        icon: '🔗', approach: 'Use find() with path compression and union() with rank to manage connected components.', hint: 'Two nodes are connected if and only if they have the same root.' },
  'Trie':                     { tc: 'O(m)',       sc: 'O(26m)',      icon: '🌐', approach: 'Build a prefix tree where each node stores children for each character. Search/insert in O(m).', hint: 'm = length of the word being inserted/searched.' },
  'Dijkstra\'s':              { tc: 'O(E log V)', sc: 'O(V)',        icon: '🗺️', approach: 'Min-heap based shortest path. Always process the node with minimum current distance.', hint: 'Works on non-negative weighted graphs only.' },
  'Floyd\'s Algorithm':       { tc: 'O(n)',       sc: 'O(1)',        icon: '🔁', approach: 'Use slow (1 step) and fast (2 steps) pointers. They meet in the cycle if one exists.', hint: 'To find cycle start: reset one pointer to head, advance both by 1.' },
  'Slow-Fast Pointers':       { tc: 'O(n)',       sc: 'O(1)',        icon: '🏃', approach: 'Slow moves 1 step, fast moves 2 steps. When fast reaches end, slow is at the middle.', hint: 'Useful for finding middle, cycle detection, and palindrome checks.' },
  'Bit Manipulation':         { tc: 'O(1)',       sc: 'O(1)',        icon: '⚙️', approach: 'Use bitwise AND, OR, XOR, shifts. XOR of a number with itself is 0, XOR with 0 is itself.', hint: 'Common tricks: n & (n-1) clears lowest bit, n & -n isolates lowest bit.' },
  'Segment Tree':             { tc: 'O(log n)',   sc: 'O(4n)',       icon: '🏗️', approach: 'Build a tree for range queries. Each node stores aggregate of a segment. Update/query O(log n).', hint: 'Use 1-indexed array of size 4*n to build the segment tree.' },
  'Priority Queue':           { tc: 'O(n log k)', sc: 'O(k)',        icon: '⛰️', approach: 'Use a min or max heap to efficiently get the k-th largest/smallest. Insert in O(log k).', hint: 'Maintain a heap of exactly k elements for Top-K problems.' },
  'Expand Around Center':     { tc: 'O(n²)',      sc: 'O(1)',        icon: '🎯', approach: 'For each character as center, expand outward while characters match (odd/even length).', hint: 'Handle both odd (single char center) and even (two char center) cases.' },
  'KMP / String':             { tc: 'O(n+m)',     sc: 'O(m)',        icon: '🔤', approach: 'Build a failure function (LPS array) for the pattern, then use it to skip redundant comparisons.', hint: 'The LPS array tells you how far back to jump on a mismatch.' },
  'Sorting':                  { tc: 'O(n log n)', sc: 'O(1)',        icon: '📊', approach: 'Sort first to enable binary search, two pointers, or greedy strategies that require order.', hint: 'Sorting is often a preprocessing step, not the final answer.' },
  'Simulation':               { tc: 'O(n)',       sc: 'O(n)',        icon: '🎮', approach: 'Directly simulate the process as described in the problem. Track state at each step.', hint: 'Code exactly what the problem says — no clever tricks needed.' },
  'Tree DP / DFS':            { tc: 'O(n)',       sc: 'O(h)',        icon: '🌲', approach: 'Post-order DFS: process children first, return useful values up to the parent.', hint: 'Each node returns what its parent needs to make its own decision.' },
  'Array Manipulation':       { tc: 'O(n)',       sc: 'O(1)',        icon: '📦', approach: 'Manipulate the array in-place using indices, swaps, or auxiliary pointers.', hint: 'Try to achieve O(1) extra space by modifying in-place.' },
  'In-place Rotation':        { tc: 'O(n)',       sc: 'O(1)',        icon: '🔃', approach: 'Use transpose + reverse, or cyclic rotation to rotate a matrix or array in-place.', hint: 'For a 90° rotation: transpose (swap [i][j] with [j][i]), then reverse rows.' },
  'Boyer-Moore Voting':       { tc: 'O(n)',       sc: 'O(1)',        icon: '🗳️', approach: 'Maintain a candidate and count. Increment on match, decrement on mismatch. Reset when count = 0.', hint: 'The surviving candidate needs a second pass to verify it is actually the majority.' },
  'Custom Sort':              { tc: 'O(n log n)', sc: 'O(1)',        icon: '🔀', approach: 'Define a custom comparator based on problem criteria and sort using it.', hint: 'For descending: compare b vs a. For multi-key: compare key1 first, then key2.' },
  'Quick Select':             { tc: 'O(n) avg',   sc: 'O(1)',        icon: '⚡', approach: 'Partition like quicksort. If pivot index == k, done. Else recurse on relevant half.', hint: 'Average O(n) but worst case O(n²). Use randomized pivot to avoid worst case.' },
  'BST':                      { tc: 'O(h)',       sc: 'O(h)',        icon: '🌲', approach: 'Exploit BST property: left < root < right. In-order traversal gives sorted order.', hint: 'h = height. O(log n) for balanced BST, O(n) for skewed.' },
  'Dutch National Flag':      { tc: 'O(n)',       sc: 'O(1)',        icon: '🏳️', approach: 'Three-way partition with lo, mid, hi pointers. Swap to bucket elements in one pass.', hint: 'Loop ends when mid > hi. Elements [0, lo) < pivot, [lo, mid) = pivot, (hi, n) > pivot.' },
  'Reverse In-order':         { tc: 'O(n)',       sc: 'O(h)',        icon: '🔁', approach: 'Traverse BST in reverse in-order (right → root → left) to process in descending order.', hint: 'Useful for Greater Tree conversion: accumulate sum from largest to smallest.' },
  'Counting Sort':            { tc: 'O(n+k)',     sc: 'O(k)',        icon: '🔢', approach: 'Count frequency of each element, then reconstruct the sorted array from counts.', hint: 'k = range of values. Best when k is small relative to n.' },
  'Two Heaps':                { tc: 'O(log n)',   sc: 'O(n)',        icon: '⛰️', approach: 'Maintain a max-heap for lower half and min-heap for upper half. Median is the top(s).', hint: 'Balance so that size difference is at most 1.' },
  'Prim\'s / Kruskal\'s':     { tc: 'O(E log E)', sc: 'O(V)',       icon: '🗺️', approach: 'Kruskal: sort edges, add if it doesn\'t create cycle (Union-Find). Prim: grow MST greedily from a node.', hint: 'Both produce a Minimum Spanning Tree with total weight minimized.' },
  'Bellman-Ford / BFS':       { tc: 'O(VE)',      sc: 'O(V)',        icon: '🗺️', approach: 'Relax all edges V-1 times. Can detect negative weight cycles.', hint: 'Use when edge weights can be negative, unlike Dijkstra.' },
  'XOR':                      { tc: 'O(n)',       sc: 'O(1)',        icon: '⚡', approach: 'XOR all elements: duplicates cancel out (a ^ a = 0), leaving the unique element.', hint: 'XOR is commutative and associative. a ^ 0 = a, a ^ a = 0.' },
  'Prefix XOR':               { tc: 'O(n)',       sc: 'O(n)',        icon: '⚡', approach: 'Build prefix XOR array. Range XOR [l, r] = prefix[r] ^ prefix[l-1].', hint: 'Use HashMap to find subarrays with XOR equal to a target.' },
  'Stack':                    { tc: 'O(n)',       sc: 'O(n)',        icon: '📚', approach: 'Use a stack (LIFO) to track elements that haven\'t been matched or processed yet.', hint: 'Push on open items, pop on matching close items.' },
  'Queue':                    { tc: 'O(n)',       sc: 'O(n)',        icon: '🚶', approach: 'Use a queue (FIFO) for BFS, sliding window max, or buffering incoming requests.', hint: 'Consider Deque for max/min in a sliding window.' },
  'Recursion':                { tc: 'O(2^n)',     sc: 'O(n)',        icon: '🔄', approach: 'Solve base case, then recurse on smaller subproblems. Combine results on the way back.', hint: 'Draw the recursion tree to understand time complexity.' },
  'Linked List Manipulation': { tc: 'O(n)',       sc: 'O(1)',        icon: '🔗', approach: 'Use prev/curr/next pointers to rewire connections. Draw the before/after state.', hint: 'Always save next before overwriting the pointer.' },
  'Binary Search on Answer':  { tc: 'O(n log n)', sc: 'O(1)',        icon: '🔍', approach: 'Binary search on the answer space. Use a check() function to validate mid.', hint: 'If check(mid) is true but check(mid+1) is false, mid is the answer.' },
  'Merge Sort':               { tc: 'O(n log n)', sc: 'O(n)',        icon: '✂️', approach: 'Divide array in half, sort each half recursively, merge sorted halves.', hint: 'The merge step uses two pointers to produce a sorted result in O(n).' },
};

const getPatternInfo = (pattern) =>
  PATTERN_INFO[pattern] || { tc: 'O(n)', sc: 'O(n)', icon: '📌', approach: 'Analyze the problem structure and apply the appropriate algorithmic technique.', hint: 'Break the problem into smaller manageable subproblems.' };

// ── Code templates ───────────────────────────────────────────────────────────
const TEMPLATES = {
  javascript: (t, p) => `// ${t}
// Pattern: ${p}
// ──────────────────────────────────────────────

function solve() {
  // Write your solution here
  
}

solve();`,

  python: (t, p) => `# ${t}
# Pattern: ${p}
# ──────────────────────────────────────────────

def solve():
    # Write your solution here
    pass

solve()`,

  java: (t, p) => `// ${t}
// Pattern: ${p}
// ──────────────────────────────────────────────

import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Write your solution here
        
    }
}`,

  cpp: (t, p) => `// ${t}
// Pattern: ${p}
// ──────────────────────────────────────────────

#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your solution here
    
    return 0;
}
`
};

// ── Diff badge ───────────────────────────────────────────────────────────────
const DiffBadge = ({ d, size = 'sm' }) => {
  const cls = d === 'Easy' ? 'dsa2-easy' : d === 'Medium' ? 'dsa2-medium' : 'dsa2-hard';
  return <span className={`dsa2-diff ${cls} ${size === 'lg' ? 'dsa2-diff-lg' : ''}`}>{d}</span>;
};

// ── Status helpers ────────────────────────────────────────────────────────────
const STATUS_META = {
  accepted:      { color: '#2ea043', bg: 'rgba(46,160,67,0.12)',  border: 'rgba(46,160,67,0.3)',   icon: '✓', label: 'Accepted' },
  wrong_answer:  { color: '#ef4444', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.3)',   icon: '✗', label: 'Wrong Answer' },
  tle:           { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.3)',  icon: '⏱', label: 'Time Limit Exceeded' },
  compile_error: { color: '#ef4444', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.3)',   icon: '⚠', label: 'Compilation Error' },
  runtime_error: { color: '#ef4444', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.3)',   icon: '💥', label: 'Runtime Error' },
  pending:       { color: 'var(--dsa-text-muted)', bg: 'rgba(139,148,158,0.10)',border: 'rgba(139,148,158,0.3)', icon: '⏳', label: 'Processing' },
  finished:      { color: '#2ea043', bg: 'rgba(46,160,67,0.12)',  border: 'rgba(46,160,67,0.3)',   icon: '✓', label: 'Execution Complete' },
};

const StatusBadge = ({ kind }) => {
  const m = STATUS_META[kind] || STATUS_META.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
      padding: '0.25rem 0.75rem', borderRadius: '999px',
      background: m.bg, color: m.color, border: `1px solid ${m.border}`,
      fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.02em',
    }}>
      {m.icon} {m.label}
    </span>
  );
};

const InfoBox = ({ label, value, accent }) => (
  <div style={{ marginTop: '0.75rem' }}>
    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--dsa-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.35rem' }}>{label}</div>
    <pre style={{
      margin: 0, padding: '0.65rem 0.9rem', borderRadius: '8px',
      background: accent ? 'rgba(46,160,67,0.07)' : 'var(--dsa-bg-primary)',
      border: `1px solid ${accent ? 'rgba(46,160,67,0.25)' : 'var(--dsa-border)'}`,
      color: accent ? '#2ea043' : 'var(--dsa-text)',
      fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.5,
      overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
    }}>{value || '(empty)'}</pre>
  </div>
);

// ── Language auto-detection ──────────────────────────────────────────────────
const detectLanguage = (code) => {
  const t = code.slice(0, 2000); // only look at first 2k chars for speed
  if (/(#include|using namespace std|::|cout|cin|vector<|endl)/.test(t)) return 'cpp';
  if (/(import java\.|public class |System\.out\.print|public static void main)/.test(t)) return 'java';
  if (/^\s*(def |import |from |print\(|class \w+:)/m.test(t) && !t.includes(';')) return 'python';
  return 'javascript';
};

// ── Compiler Panel (right column) ────────────────────────────────────────────
const CompilerPanel = ({ question }) => {
  const info = getPatternInfo(question.pattern);
  const [lang, setLang]         = useState('javascript');
  const [code, setCode]         = useState(() => TEMPLATES.javascript(question.title, question.pattern));
  const [running, setRunning]   = useState(false);

  // per-testcase results from Judge0
  const [caseResults, setCaseResults] = useState([]); // [{ stdin, rawStdin, expectedOutput, result }]
  const [globalStatus, setGlobalStatus] = useState(null); // kind string
  const [globalError, setGlobalError]   = useState(''); // compile / server error text
  const [runTime, setRunTime]           = useState(null);
  const [runMemory, setRunMemory]       = useState(null);

  const [consoleTab, setConsoleTab]     = useState('testcase');
  const [activeCase, setActiveCase]     = useState(0);

  // raw testcase data from backend
  const [examples, setExamples]         = useState([]); // [{ stdin, rawStdin, expectedOutput }]
  const [customStdin, setCustomStdin]   = useState('');
  const [questionMeta, setQuestionMeta] = useState(null);
  const [snippets, setSnippets]         = useState({});

  const taRef = useRef(null);
  const langs = ['javascript', 'python', 'java', 'cpp'];
  const [detectedLang, setDetectedLang] = useState('javascript');

  const [consoleHeight, setConsoleHeight] = useState(250);
  const [isDragging, setIsDragging]       = useState(false);

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e) => {
      // Calculate height from bottom of viewport
      const newHeight = window.innerHeight - e.clientY;
      if (newHeight > 100 && newHeight < window.innerHeight * 0.8) {
        setConsoleHeight(newHeight);
      }
    };
    const onMouseUp = () => setIsDragging(false);
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  // ── fetch testcases whenever question / lang changes ─────────────────────
  useEffect(() => {
    setCode(snippets[lang] || TEMPLATES[lang](question.title, question.pattern));
    setCaseResults([]);
    setGlobalStatus(null);
    setGlobalError('');
    setExamples([]);
    setCustomStdin('');
    setActiveCase(0);
    setConsoleTab('testcase');

    let slug = null;
    if (question.link && question.link.includes('problems/')) {
      slug = question.link.split('problems/')[1].replace('/', '');
    }
    if (!slug) return;

    fetch(`http://localhost:5000/api/leetcode/${slug}`)
      .then(r => r.json())
      .then(d => {
        setQuestionMeta(d.metaData);
        if (d.codeSnippets) {
          const snipMap = {};
          d.codeSnippets.forEach(s => {
            if (s.langSlug === 'javascript') snipMap.javascript = s.code;
            if (s.langSlug === 'python' || s.langSlug === 'python3') snipMap.python = s.code;
            if (s.langSlug === 'java') snipMap.java = s.code;
            if (s.langSlug === 'cpp') snipMap.cpp = s.code;
          });
          setSnippets(snipMap);
          // Auto-apply snippet if we just loaded it for the active lang
          if (snipMap[lang]) setCode(snipMap[lang]);
        }

        if (d.examples && d.examples.length > 0) {
          setExamples(d.examples);
          setCustomStdin(d.examples[0]?.stdin || '');
        } else if (d.exampleTestcases) {
          // fallback: old format
          try {
            const meta = JSON.parse(d.metaData || '{}');
            const numP = meta.params?.length || 1;
            const paramNames = meta.params?.map(p => p.name) || ['input'];
            const lines = d.exampleTestcases.split('\n');
            const built = [];
            for (let i = 0; i < lines.length; i += numP) {
              if (!lines[i] && lines[i] !== '') continue;
              let stdinLabelled = '';
              const rawLines = [];
              for (let j = 0; j < numP; j++) {
                if (lines[i + j] !== undefined) {
                  stdinLabelled += `${paramNames[j]} =\n${lines[i + j]}\n`;
                  rawLines.push(lines[i + j]);
                }
              }
              if (stdinLabelled) built.push({ stdin: stdinLabelled.trim(), rawStdin: rawLines.join('\n'), expectedOutput: '' });
            }
            setExamples(built.slice(0, 3));
            if (built.length > 0) setCustomStdin(built[0].stdin);
          } catch (_) {
            setExamples([{ stdin: d.exampleTestcases, rawStdin: d.exampleTestcases, expectedOutput: '' }]);
            setCustomStdin(d.exampleTestcases);
          }
        }
      })
      .catch(console.error);
  }, [lang, question]);

  const lineNums = code.split('\n').map((_, i) => i + 1).join('\n');

  // ── detect language whenever code changes ────────────────────────────────
  useEffect(() => {
    const d = detectLanguage(code);
    setDetectedLang(d);
  }, [code]);

  const langMismatch = detectedLang !== lang;
  const LANG_LABEL = { javascript: 'JavaScript', python: 'Python', java: 'Java', cpp: 'C++' };

  // ── Smart editor key handler (brackets, indentation) ──────────────────────
  const handleKeyDown = (e) => {
    const ta = taRef.current;
    const s = ta.selectionStart;
    const en = ta.selectionEnd;
    const val = code;
    const before = val.substring(0, s);
    const after  = val.substring(en);

    // ── Tab: insert 2 spaces ──────────────────────────────────────────────
    if (e.key === 'Tab') {
      e.preventDefault();
      const next = before + '  ' + after;
      setCode(next);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 2; }, 0);
      return;
    }

    // ── Auto-close bracket pairs ──────────────────────────────────────────
    const PAIRS = { '{': '}', '(': ')', '[': ']', '"': '"', "'": "'" };
    const CLOSE_CHARS = new Set(['}', ')', ']', '"', "'"]);

    if (PAIRS[e.key]) {
      // If text is selected, wrap it
      if (s !== en) {
        e.preventDefault();
        const selected = val.substring(s, en);
        const next = before + e.key + selected + PAIRS[e.key] + after;
        setCode(next);
        setTimeout(() => { ta.selectionStart = s + 1; ta.selectionEnd = en + 1; }, 0);
        return;
      }
      // Don't double-close if next char is already the closing pair
      const nextChar = after[0];
      if (e.key === nextChar) {
        // Just skip over it
        e.preventDefault();
        setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 1; }, 0);
        return;
      }
      // Insert pair
      e.preventDefault();
      const next = before + e.key + PAIRS[e.key] + after;
      setCode(next);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 1; }, 0);
      return;
    }

    // ── Skip over closing bracket if already present ──────────────────────
    if (CLOSE_CHARS.has(e.key) && after[0] === e.key && e.key !== '"' && e.key !== "'") {
      e.preventDefault();
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 1; }, 0);
      return;
    }

    // ── Backspace: remove paired empty brackets ────────────────────────────
    if (e.key === 'Backspace' && s === en) {
      const charBefore = before[before.length - 1];
      const charAfter  = after[0];
      if (PAIRS[charBefore] === charAfter) {
        e.preventDefault();
        const next = before.slice(0, -1) + after.slice(1);
        setCode(next);
        setTimeout(() => { ta.selectionStart = ta.selectionEnd = s - 1; }, 0);
        return;
      }
    }

    // ── Enter: smart indentation ──────────────────────────────────────────
    if (e.key === 'Enter' && s === en) {
      e.preventDefault();
      // Get current line's leading whitespace
      const lineStart = before.lastIndexOf('\n') + 1;
      const currentLine = before.substring(lineStart);
      const indent = currentLine.match(/^(\s*)/)[1];
      const lastChar = before.trimEnd().slice(-1);
      const firstAfter = after.trimStart()[0];

      // Opening bracket → add extra indent + closing bracket on new line
      if (lastChar === '{' || lastChar === '(' || lastChar === '[') {
        const closing = PAIRS[lastChar];
        if (after.trimStart().startsWith(closing)) {
          // closing bracket is right after cursor — split into 3 lines
          e.preventDefault();
          const inner = '\n' + indent + '  \n' + indent + closing;
          const next = before + inner + after.trimStart().slice(1);
          setCode(next);
          const pos = s + indent.length + 3; // position inside the middle (empty) line
          setTimeout(() => { ta.selectionStart = ta.selectionEnd = pos; }, 0);
        } else {
          // No matching closing bracket right after — just increase indent
          const next = before + '\n' + indent + '  ' + after;
          setCode(next);
          setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + indent.length + 3; }, 0);
        }
      } else if (lastChar === ':' && lang === 'python') {
        // Python colon: indent
        const next = before + '\n' + indent + '    ' + after;
        setCode(next);
        setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + indent.length + 5; }, 0);
      } else {
        // Plain Enter: keep same indent
        const next = before + '\n' + indent + after;
        setCode(next);
        setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + indent.length + 1; }, 0);
      }
      return;
    }
  };


  // ── Run Code ─────────────────────────────────────────────────────────────
  const runCode = async () => {
    // Auto-fix language mismatch before running
    const effectiveLang = detectLanguage(code);
    if (effectiveLang !== lang) {
      setLang(effectiveLang);
    }

    setRunning(true);
    setConsoleTab('result');
    setCaseResults([]);
    setGlobalStatus(null);
    setGlobalError('');
    setRunTime(null);
    setRunMemory(null);

    try {
      // Decide which testcases to run
      const toRun = examples.length > 0
        ? examples
        : [{ stdin: customStdin, rawStdin: customStdin, expectedOutput: '' }];

      const results = [];
      // 'accepted' = Judge0 term for "ran fine"; we map it to 'finished' for display
      // Priority: finished(0) < wrong_answer(1) < tle(2) < runtime_error(3) < compile_error(4)
      const PRIORITY = { accepted: 0, finished: 0, wrong_answer: 1, tle: 2, runtime_error: 3, compile_error: 4 };
      let overallKind = 'finished';
      let totalTime = 0;
      let maxMemory = 0;

      for (let i = 0; i < toRun.length; i++) {
        const tc = toRun[i];
        const rawStdin = tc.rawStdin || tc.stdin || '';
        const expected = tc.expectedOutput || '';

        try {
          // ── Do NOT send expected_output to Judge0 ──────────────────────────
          // We do our own flexible client-side comparison so that practice code
          // with extra prints (e.g. "Majority Element: 2\nDone") isn't penalised.
          const response = await fetch('http://localhost:5000/api/compiler/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              language: effectiveLang,
              code,
              stdin: rawStdin,
              metaData: questionMeta,
            }),
          });
          if (!response.ok) throw new Error(`Server responded with ${response.status}`);
          const data = await response.json();

          // ── Client-side soft comparison ───────────────────────────────────
          // Normalize: trim whitespace, collapse multiple spaces
          const normalize = (s) => (s || '').trim().replace(/\s+/g, ' ');
          const yourOut  = normalize(data.stdout);
          const expOut   = normalize(expected);
          // softMatch: true if expected is available AND output contains it (or equals it)
          const softMatch = expOut && (yourOut === expOut || yourOut.includes(expOut));
          // If no expected output available, just check if code ran clean
          const ranClean = data.status?.kind !== 'compile_error' && data.status?.kind !== 'runtime_error' && data.status?.kind !== 'tle';

          results.push({ ...tc, data, softMatch, ranClean });

          let kind = data.status?.kind || 'runtime_error';
          
          // Escalate clean runs to Wrong Answer if outputs don't match
          if ((kind === 'accepted' || kind === 'finished') && expOut && !softMatch) {
            kind = 'wrong_answer';
            data.status = { ...data.status, kind: 'wrong_answer', label: 'Wrong Answer' };
          }
          if (kind === 'accepted') kind = 'finished';

          // Escalate overall kind based on priority
          if ((PRIORITY[kind] ?? 3) > (PRIORITY[overallKind] ?? 0)) {
            overallKind = kind;
          }

          if (data.time) totalTime += parseFloat(data.time) || 0;
          if (data.memory && data.memory > maxMemory) maxMemory = data.memory;

          // On compile error, no point running more cases
          if (kind === 'compile_error') break;
        } catch (err) {
          results.push({ ...tc, data: { status: { kind: 'runtime_error', label: 'Runtime Error' }, stdout: '', stderr: err.message, compile_output: '' }, softMatch: false, ranClean: false });
          overallKind = 'runtime_error';
          break;
        }
      }

      setCaseResults(results);
      setGlobalStatus(overallKind);
      if (totalTime > 0) setRunTime(totalTime.toFixed(3));
      if (maxMemory > 0) setRunMemory((maxMemory / 1024).toFixed(1));

    } catch (err) {
      setGlobalError('Failed to reach the execution server: ' + err.message);
      setGlobalStatus('runtime_error');
    } finally {
      setRunning(false);
    }
  };

  // ── active case for result display ────────────────────────────────────────
  const displayResult = caseResults[activeCase];
  const activeMeta    = STATUS_META[globalStatus] || STATUS_META.pending;

  return (
    <div className="dsa2-compiler" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="dsa2-compiler-bar" style={{ flexShrink: 0 }}>
        <div className="dsa2-lang-tabs">
          {langs.map(l => {
            const labelMap = { javascript: 'JS', python: 'PY', java: 'Java', cpp: 'C++' };
            const isDetected = detectedLang === l && langMismatch;
            return (
              <button
                key={l}
                className={`dsa2-lang-tab ${lang === l ? 'active' : ''}`}
                onClick={() => {
                  setLang(l);
                  setCode(snippets[l] || TEMPLATES[l](question.title, question.pattern));
                }}
                style={isDetected ? { position: 'relative' } : {}}
              >
                {labelMap[l]}
                {isDetected && (
                  <span title="Detected language" style={{
                    position: 'absolute', top: '-5px', right: '-5px',
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: '#f59e0b', border: '2px solid var(--dsa-bg-primary)',
                  }} />
                )}
              </button>
            );
          })}
        </div>
        <div className="dsa2-tc-sc">
          <span className="dsa2-tc">⏱ {info.tc}</span>
          <span className="dsa2-sc">🗂 {info.sc}</span>
        </div>
        <button className="dsa2-run-btn" onClick={runCode} disabled={running}>
          {running ? '⏳' : '▶'} {running ? 'Running…' : 'Run Code'}
        </button>
      </div>

      {/* ── Language mismatch warning ─────────────────────────────────────── */}
      {langMismatch && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '0.75rem', padding: '0.5rem 0.9rem', margin: '0.5rem 0',
          borderRadius: '8px', background: 'rgba(245,158,11,0.1)',
          border: '1px solid rgba(245,158,11,0.35)', fontSize: '0.8rem',
        }}>
          <span style={{ color: '#f59e0b' }}>
            ⚠ Detected <strong>{LANG_LABEL[detectedLang]}</strong> code but <strong>{LANG_LABEL[lang]}</strong> tab is selected.
            Running will auto-switch to <strong>{LANG_LABEL[detectedLang]}</strong>.
          </span>
          <button
            onClick={() => setLang(detectedLang)}
            style={{
              background: '#f59e0b', color: '#000', border: 'none', borderRadius: '6px',
              padding: '0.25rem 0.65rem', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Switch to {LANG_LABEL[detectedLang]}
          </button>
        </div>
      )}

      {/* ── Code Editor ──────────────────────────────────────────────────── */}
      <div className="dsa2-editor-area" style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
        <pre className="dsa2-line-nums" aria-hidden>{lineNums}</pre>
        <textarea
          ref={taRef}
          className="dsa2-textarea"
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      {/* ── Horizontal Drag Resizer ──────────────────────────────────────── */}
      <div 
        onMouseDown={() => setIsDragging(true)}
        style={{
          height: '6px',
          background: isDragging ? '#1f6feb' : 'var(--dsa-border)',
          cursor: 'row-resize',
          flexShrink: 0,
          transition: 'background 0.2s',
          zIndex: 10,
        }}
      />

      {/* ── Console ──────────────────────────────────────────────────────── */}
      <div className="dsa2-console" style={{ 
        height: `${consoleHeight}px`, flexShrink: 0, 
        display: 'flex', flexDirection: 'column', overflow: 'hidden', 
        padding: '0.75rem 1rem', background: 'var(--dsa-bg-primary)' 
      }}>
        {/* tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', flexShrink: 0 }}>
          {['testcase', 'result'].map(tab => (
            <button
              key={tab}
              onClick={() => setConsoleTab(tab)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600,
                padding: '0.4rem 0', fontSize: '0.85rem',
                color: consoleTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: consoleTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {tab === 'testcase' ? 'Testcase' : 'Test Result'}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
        {/* ── Testcase tab ─────────────────────────────────────────────── */}
        {consoleTab === 'testcase' && (
          <div>
            {examples.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                {examples.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setActiveCase(idx); setCustomStdin(examples[idx]?.stdin || ''); }}
                    style={{
                      padding: '0.35rem 0.9rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                      fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.2s',
                      background: activeCase === idx ? 'rgba(31,111,235,0.15)' : 'var(--dsa-bg-tertiary)',
                      color: activeCase === idx ? 'var(--primary)' : 'var(--text-muted)',
                    }}
                  >
                    Case {idx + 1}
                  </button>
                ))}
              </div>
            )}
            <textarea
              value={examples[activeCase]?.stdin || customStdin}
              onChange={e => setCustomStdin(e.target.value)}
              placeholder="Enter custom input (stdin)..."
              style={{
                width: '100%', minHeight: '110px', resize: 'vertical',
                background: 'var(--dsa-bg-primary)', color: 'var(--dsa-text)', border: '1px solid var(--dsa-border)',
                borderRadius: '8px', padding: '0.8rem', fontFamily: 'monospace', fontSize: '0.85rem',
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}

        {/* ── Result tab ───────────────────────────────────────────────── */}
        {consoleTab === 'result' && (
          <div>
            {/* Idle state */}
            {!globalStatus && !running && (
              <p style={{ color: 'var(--dsa-text-muted)', margin: 0 }}>Press ▶ Run Code to see results…</p>
            )}

            {/* Loading */}
            {running && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--dsa-text-muted)' }}>
                <span style={{ fontSize: '1.2rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                <span>Compiling and running your code…</span>
              </div>
            )}

            {/* Server / network error */}
            {!running && globalError && (
              <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>⚠ Server Error</div>
                <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.82rem' }}>{globalError}</pre>
              </div>
            )}

            {/* Results */}
            {!running && globalStatus && caseResults.length > 0 && (
              <div>
                {/* ── Overall status banner ── */}
                <div style={{
                  padding: '1rem 1.25rem', borderRadius: '12px',
                  background: activeMeta.bg, border: `1px solid ${activeMeta.border}`,
                  marginBottom: '1.25rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700, color: activeMeta.color }}>
                        {activeMeta.icon} {activeMeta.label}
                      </h3>
                      {(runTime || runMemory) && (
                        <div style={{ marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--dsa-text-muted)' }}>
                          {runTime && `Runtime: ${runTime}s`}{runTime && runMemory && '  ·  '}{runMemory && `Memory: ${runMemory} MB`}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--dsa-text-muted)' }}>
                      {caseResults.filter(r => r.ranClean).length} / {caseResults.length} cases ran successfully
                    </div>
                  </div>
                </div>

                {/* ── Case selector tabs ── */}
                {caseResults.length > 1 && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {caseResults.map((r, idx) => {
                      const k = r.data?.status?.kind || 'runtime_error';
                      const m = STATUS_META[k] || STATUS_META.runtime_error;
                      const isActive = activeCase === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveCase(idx)}
                          style={{
                            padding: '0.35rem 0.9rem', borderRadius: '8px', border: `1px solid ${isActive ? m.border : 'var(--dsa-border)'}`,
                            cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.2s',
                            background: isActive ? m.bg : 'var(--dsa-bg-tertiary)',
                            color: isActive ? m.color : 'var(--dsa-text-muted)',
                          }}
                        >
                          {m.icon} Case {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* ── Per-case detail card ── */}
                {displayResult && (() => {
                  const d = displayResult.data;
                  const kind = d?.status?.kind || 'runtime_error';
                  const m    = STATUS_META[kind] || STATUS_META.runtime_error;
                  const isCompileError = kind === 'compile_error';
                  const { softMatch, ranClean } = displayResult;

                  // For the per-case badge: show softMatch result if ran clean
                  const caseBadgeKind = isCompileError ? 'compile_error'
                    : kind === 'runtime_error' ? 'runtime_error'
                    : kind === 'tle' ? 'tle'
                    : 'finished';
                  const caseMeta = STATUS_META[caseBadgeKind];

                  return (
                    <div style={{
                      borderRadius: '12px', border: `1px solid ${caseMeta.border}`,
                      background: caseMeta.bg, padding: '1.1rem 1.25rem',
                    }}>
                      {/* Case header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <StatusBadge kind={caseBadgeKind} />
                        {d?.time && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--dsa-text-muted)' }}>{parseFloat(d.time) * 1000 | 0} ms</span>
                        )}
                      </div>

                      {/* Compile Error */}
                      {isCompileError && (
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--dsa-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.4rem' }}>Compilation Error</div>
                          <pre style={{
                            margin: 0, padding: '0.75rem 1rem', borderRadius: '8px',
                            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                            color: '#ef4444', fontFamily: 'monospace', fontSize: '0.82rem',
                            lineHeight: 1.6, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                          }}>
                            {d.compile_output || d.stderr || 'No output'}
                          </pre>
                        </div>
                      )}

                      {/* TLE */}
                      {kind === 'tle' && (
                        <div style={{ color: '#f59e0b', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                          ⏱ Your code exceeded the time limit. Check for infinite loops or inefficient algorithms.
                        </div>
                      )}

                      {/* Runtime error stderr */}
                      {kind === 'runtime_error' && d?.stderr && (
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--dsa-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.4rem' }}>Runtime Error</div>
                          <pre style={{
                            margin: 0, padding: '0.75rem 1rem', borderRadius: '8px',
                            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                            color: '#ef4444', fontFamily: 'monospace', fontSize: '0.82rem',
                            lineHeight: 1.6, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                          }}>
                            {d.stderr}
                          </pre>
                        </div>
                      )}

                      {/* Input / Output / Expected — shown as columns like LeetCode */}
                      {!isCompileError && (
                        <>
                          <div style={{
                            display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap',
                          }}>
                            {displayResult.stdin && (
                              <div style={{ flex: 1, minWidth: '120px' }}>
                                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--dsa-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.35rem' }}>Input</div>
                                <pre style={{
                                  margin: 0, padding: '0.65rem 0.9rem', borderRadius: '8px',
                                  background: 'var(--dsa-bg-primary)', border: '1px solid var(--dsa-border)',
                                  color: 'var(--dsa-text)', fontFamily: 'monospace', fontSize: '0.85rem',
                                  lineHeight: 1.5, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                                }}>{displayResult.stdin || '(empty)'}</pre>
                              </div>
                            )}
                            <div style={{ flex: 1, minWidth: '120px' }}>
                              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--dsa-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.35rem' }}>Your Output</div>
                              <pre style={{
                                margin: 0, padding: '0.65rem 0.9rem', borderRadius: '8px',
                                background: 'var(--dsa-bg-primary)', border: '1px solid var(--dsa-border)',
                                color: 'var(--dsa-text)', fontFamily: 'monospace', fontSize: '0.85rem',
                                lineHeight: 1.5, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                              }}>{d?.stdout?.trim() || '(no output)'}</pre>
                            </div>
                            {displayResult.expectedOutput && (
                              <div style={{ flex: 1, minWidth: '120px' }}>
                                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: softMatch ? '#2ea043' : 'var(--dsa-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.35rem' }}>
                                  {softMatch ? '✓ Expected Output' : 'Expected Output'}
                                </div>
                                <pre style={{
                                  margin: 0, padding: '0.65rem 0.9rem', borderRadius: '8px',
                                  background: softMatch ? 'rgba(46,160,67,0.07)' : 'var(--dsa-bg-primary)',
                                  border: `1px solid ${softMatch ? 'rgba(46,160,67,0.25)' : 'var(--dsa-border)'}`,
                                  color: softMatch ? '#2ea043' : 'var(--dsa-text)',
                                  fontFamily: 'monospace', fontSize: '0.85rem',
                                  lineHeight: 1.5, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                                }}>{displayResult.expectedOutput}</pre>
                              </div>
                            )}
                          </div>
                          {!softMatch && ranClean && displayResult.expectedOutput && (
                            <div style={{
                              marginTop: '0.75rem', padding: '0.65rem 0.9rem', borderRadius: '8px',
                              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
                              fontSize: '0.82rem', color: '#f59e0b',
                            }}>
                              💡 <strong>Your code ran successfully.</strong> Output format differs — that's fine for practice!
                              To get an exact match, print only the answer and read from stdin.
                            </div>
                          )}
                        </>
                      )}

                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

// ── Problem Panel (left column) ──────────────────────────────────────────────
const ProblemPanel = ({ question, solved, bookmarked, notes, onSolve, onBookmark, onNote }) => {
  const info = getPatternInfo(question.pattern);
  const [localNote, setLocalNote] = useState(notes || '');
  const topicColor = Object.values(DSA_TOPICS).find(t => t.questions.some(q => q.id === question.id))?.color || '#6366f1';

  const [fetchedDesc, setFetchedDesc] = useState(null);
  const [loadingDesc, setLoadingDesc] = useState(false);

  useEffect(() => {
    // If it's hardcoded in dsaData.js, use it
    if (question.description) {
      setFetchedDesc(question.description);
      return;
    }
    
    // Otherwise fetch dynamically via backend proxy
    let slug = null;
    if (question.link && question.link.includes('problems/')) {
      slug = question.link.split('problems/')[1].replace('/', '');
    }

    if (slug) {
      setLoadingDesc(true);
      setFetchedDesc(null);
      fetch(`http://localhost:5000/api/leetcode/${slug}`)
        .then(r => r.json())
        .then(d => {
          if (d.content) setFetchedDesc(d.content);
          else setFetchedDesc('<p>Problem description could not be loaded. Please refer to LeetCode.</p>');
        })
        .catch(() => setFetchedDesc('<p>Failed to load description. Please visit LeetCode.</p>'))
        .finally(() => setLoadingDesc(false));
    } else {
      setFetchedDesc('<p>No description available.</p>');
    }
  }, [question.id, question.description, question.link]);

  const handleSaveNote = () => onNote(question.id, localNote);

  return (
    <div className="dsa2-problem">
      {/* Header */}
      <div className="dsa2-prob-head" style={{ borderLeftColor: topicColor }}>
        <div className="dsa2-prob-num">{question.topic} · Q{question.no}</div>
        <h2 className="dsa2-prob-title">{question.title}</h2>
        <div className="dsa2-prob-badges">
          <DiffBadge d={question.difficulty} size="lg" />
          <span className="dsa2-prob-pattern" style={{ background: `${topicColor}18`, color: topicColor }}>
            {info.icon} {question.pattern}
          </span>
        </div>
        <div className="dsa2-prob-actions">
          <button className={`dsa2-solve-btn ${solved ? 'active' : ''}`} onClick={() => onSolve(question.id)}>
            {solved ? '✅ Solved' : '○ Mark Solved'}
          </button>
          <button className={`dsa2-bm-btn ${bookmarked ? 'active' : ''}`} onClick={() => onBookmark(question.id)}>
            {bookmarked ? '🔖' : '🔲'} Bookmark
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="dsa2-section dsa2-desc-section">
        <div className="dsa2-section-label">📖 Description</div>
        {loadingDesc ? (
          <div className="dsa2-desc-content"><p>Loading live problem description from LeetCode...</p></div>
        ) : (
          <div 
            className="dsa2-desc-content leetcode-content" 
            dangerouslySetInnerHTML={{ 
              __html: fetchedDesc || '<p>Problem description is being updated. Please refer to the LeetCode link for the full problem statement.</p>' 
            }} 
          />
        )}
      </div>

      {/* Approach */}
      <div className="dsa2-section">
        <div className="dsa2-section-label">📋 Approach</div>
        <p className="dsa2-approach">{info.approach}</p>
        <div className="dsa2-hint">
          <span>💡</span> {info.hint}
        </div>
      </div>

      {/* Complexity */}
      <div className="dsa2-section">
        <div className="dsa2-section-label">⏱ Complexity Analysis</div>
        <div className="dsa2-complexity-row">
          <div className="dsa2-complexity-card tc">
            <div className="dsa2-complexity-label">Time</div>
            <div className="dsa2-complexity-val">{info.tc}</div>
          </div>
          <div className="dsa2-complexity-card sc">
            <div className="dsa2-complexity-label">Space</div>
            <div className="dsa2-complexity-val">{info.sc}</div>
          </div>
        </div>
      </div>

      {/* Companies */}
      <div className="dsa2-section">
        <div className="dsa2-section-label">🏢 Asked By</div>
        <div className="dsa2-company-list">
          {question.companies.map(c => (
            <span key={c} className="dsa2-company">{c}</span>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="dsa2-section dsa2-notes-section">
        <div className="dsa2-section-label">📝 My Notes</div>
        <textarea
          className="dsa2-notes-ta"
          placeholder="Write your approach, key observations, time complexity…"
          value={localNote}
          onChange={e => setLocalNote(e.target.value)}
          onBlur={handleSaveNote}
          rows={4}
        />
        <button className="dsa2-save-btn" onClick={handleSaveNote}>💾 Save</button>
      </div>
      {/* ── External links (Moved here from Compiler) ────────────────── */}
      <div className="dsa2-ext-links" style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--dsa-border)' }}>
        {question.link && question.link !== '#' && (
          <a href={question.link} target="_blank" rel="noreferrer" className="dsa2-ext-btn lc">🔗 LeetCode</a>
        )}
        <a href={question.youtube} target="_blank" rel="noreferrer" className="dsa2-ext-btn yt">▶ YouTube</a>
        <span className="dsa2-note">💡 Powered by Judge0 CE</span>
      </div>
    </div>
  );
};

// ── Main DSACheatSheet ────────────────────────────────────────────────────────
const DSACheatSheet = ({ embedded }) => {
  // Persistence
  const [solved,     setSolved]     = useState(() => load('dsa_solved', {}));
  const [bookmarked, setBookmarked] = useState(() => load('dsa_bookmarked', {}));
  const [notes,      setNotes]      = useState(() => load('dsa_notes', {}));
  const [userProfile, setUserProfile] = useState(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isLightMode, setIsLightMode]   = useState(false);

  useEffect(() => {
    getProfile().then(res => setUserProfile(res.data)).catch(() => {});
  }, []);

  const hasAccess = (index) => {
    if (index <= 1) return true; // First two topics are free
    if (!userProfile) return false;
    if (userProfile.role === 'admin') return true;
    return userProfile.isPremium;
  };

  useEffect(() => save('dsa_solved', solved),     [solved]);
  useEffect(() => save('dsa_bookmarked', bookmarked), [bookmarked]);
  useEffect(() => save('dsa_notes', notes),       [notes]);

  const toggleSolved   = useCallback(id => {
    setSolved(p => {
      const isCurrentlySolved = !!p[id];
      if (!isCurrentlySolved) {
        // Find question difficulty to give proper XP
        const q = ALL_QUESTIONS.find(x => x.id === id);
        const xp = q ? (q.difficulty === 'Hard' ? 30 : q.difficulty === 'Medium' ? 20 : 10) : 15;
        toast.success(`+${xp} XP! Excellent work.`, { icon: '⭐' });
      }
      return { ...p, [id]: !isCurrentlySolved };
    });
  }, []);
  const toggleBookmark = useCallback(id => setBookmarked(p => ({ ...p, [id]: !p[id] })), []);
  const saveNote       = useCallback((id, n) => setNotes(p => ({ ...p, [id]: n })), []);

  // UI state
  const [activeTopic,  setActiveTopic]  = useState('Arrays');
  const [search,       setSearch]       = useState('');
  const [diffFilter,   setDiffFilter]   = useState('All');
  const [showBm,       setShowBm]       = useState(false);
  const [selectedQ,    setSelectedQ]    = useState(null);
  const searchRef = useRef(null);

  // Stats
  const totalQ   = ALL_QUESTIONS.length;
  const solvedQ  = useMemo(() => Object.values(solved).filter(Boolean).length, [solved]);
  const pct      = Math.round((solvedQ / totalQ) * 100);

  // Build question list based on current state
  const displayQuestions = useMemo(() => {
    let base;
    if (search.trim()) {
      // Global search across ALL topics
      base = ALL_QUESTIONS;
    } else if (showBm) {
      base = ALL_QUESTIONS.filter(q => bookmarked[q.id]);
    } else {
      base = DSA_TOPICS[activeTopic]?.questions || [];
    }

    return base.filter(q => {
      const s = search.trim().toLowerCase();
      const matchSearch = !s || q.title.toLowerCase().includes(s) || q.pattern.toLowerCase().includes(s) || q.topic.toLowerCase().includes(s);
      const matchDiff   = diffFilter === 'All' || q.difficulty === diffFilter;
      return matchSearch && matchDiff;
    });
  }, [search, diffFilter, showBm, activeTopic, bookmarked]);

  // Topic sidebar stats
  const topicStats = useMemo(() =>
    Object.entries(DSA_TOPICS).map(([name, data]) => ({
      name,
      icon: data.icon,
      color: data.color,
      total: data.questions.length,
      done: data.questions.filter(q => solved[q.id]).length,
    })),
  [solved]);

  const bookmarkCount = useMemo(() => Object.values(bookmarked).filter(Boolean).length, [bookmarked]);

  return (
    <div className={`dsa2 ${embedded ? 'dsa2-embedded' : ''}`} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* ── HERO (only when not embedded) ─────────────────────────────────── */}
      {!embedded && (
        <div className="dsa2-hero">
          <div className="dsa2-hero-inner container">
            <div>
              <span className="dsa2-hero-badge">💡 DSA Mastery · 400 Questions · 20 Topics</span>
              <h1 className="dsa2-hero-h1">Crack Any Coding Interview</h1>
              <p className="dsa2-hero-sub">Curated problems · Pattern-based approach · Built-in compiler</p>
            </div>
            <div className="dsa2-hero-stats">
              {[{v: solvedQ + '/' + totalQ, l:'Solved'}, {v: pct + '%', l:'Progress'}, {v: bookmarkCount, l:'Bookmarked'}, {v: '20', l: 'Topics'}].map(s => (
                <div key={s.l} className="dsa2-hero-stat">
                  <div className="dsa2-hero-stat-v">{s.v}</div>
                  <div className="dsa2-hero-stat-l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="dsa2-hero-bar">
            <div className="container">
              <div className="dsa2-hero-prog-row">
                <span>Overall Progress</span>
                <span>{pct}% · {totalQ - solvedQ} remaining</span>
              </div>
              <div className="dsa2-hero-prog-bg">
                <div className="dsa2-hero-prog-fill" style={{ width: pct + '%' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="dsa2-body" style={{ flex: 1, overflow: 'hidden' }}>
        {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
        <aside className="dsa2-sidebar" style={{ overflowY: 'auto', flexShrink: 0 }}>
          {embedded && (
            <div className="dsa2-emb-progress">
              <div className="dsa2-emb-prog-row">
                <span>DSA Progress</span>
                <span className="dsa2-emb-prog-score">{solvedQ}/{totalQ}</span>
              </div>
              <div className="dsa2-hero-prog-bg">
              </div>
            </div>
          )}

          <div className="dsa2-sidebar-section">TOPICS</div>
          {topicStats.map((ts, index) => {
            const isActive = !showBm && !search && activeTopic === ts.name;
            const p = Math.round((ts.done / ts.total) * 100);
            const locked = !hasAccess(index);
            return (
              <button
                key={ts.name}
                className={`dsa2-topic-btn ${isActive ? 'active' : ''} ${locked ? 'locked' : ''}`}
                style={isActive ? { borderLeftColor: ts.color, color: ts.color } : { opacity: locked ? 0.6 : 1 }}
                onClick={() => { 
                  if (locked) {
                    setIsPremiumModalOpen(true);
                    return;
                  }
                  setActiveTopic(ts.name); setShowBm(false); setSearch(''); setSelectedQ(null); 
                }}
              >
                <span className="dsa2-topic-ic">{locked ? <Lock size={16}/> : ts.icon}</span>
                <span className="dsa2-topic-nm" style={isActive ? { color: ts.color, fontWeight: 700 } : {}}>{ts.name}</span>
                <div className="dsa2-topic-right">
                  <span className="dsa2-topic-cnt">{ts.done}/{ts.total}</span>
                  <div className="dsa2-mini-bar"><div style={{ width: p + '%', background: ts.color }} /></div>
                </div>
              </button>
            );
          })}

          <div className="dsa2-sidebar-div" />
          <button className={`dsa2-quick-btn ${showBm ? 'active' : ''}`} onClick={() => { setShowBm(true); setSearch(''); setSelectedQ(null); }}>
            🔖 Bookmarks <span className="dsa2-quick-count">{bookmarkCount}</span>
          </button>
        </aside>

        {/* ── MAIN ────────────────────────────────────────────────────────── */}
        <main className="dsa2-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {/* ── Split view rendered as full-screen overlay via Portal ──── */}
          {selectedQ && createPortal(
            <>
              <style>{`
  .dsa-theme-dark {
    --dsa-bg-primary: #0d1117;
    --dsa-bg-secondary: #161b22;
    --dsa-bg-tertiary: #1e2329;
    --dsa-border: #30363d;
    --dsa-text: #e6edf3;
    --dsa-text-muted: #8b949e;
  }
  .dsa-theme-light {
    --dsa-bg-primary: #ffffff;
    --dsa-bg-secondary: #f8fafc;
    --dsa-bg-tertiary: #f1f5f9;
    --dsa-border: #e2e8f0;
    --dsa-text: #0f172a;
    --dsa-text-muted: #64748b;
  }
              `}</style>
              <div className={isLightMode ? 'dsa-theme-light' : 'dsa-theme-dark'} style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', flexDirection: 'column',
                background: 'var(--dsa-bg-primary)', overflow: 'hidden',
                fontFamily: 'Inter, sans-serif',
              }}>
              {/* ── Topbar ── */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0 1.25rem', height: '48px', flexShrink: 0,
                background: 'var(--dsa-bg-secondary)', borderBottom: '1px solid var(--dsa-border)',
              }}>
                <button
                  onClick={() => setSelectedQ(null)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    background: 'none', border: '1px solid var(--dsa-border)', color: 'var(--dsa-text-muted)',
                    padding: '0.3rem 0.8rem', borderRadius: '6px', cursor: 'pointer',
                    fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.target.style.color='var(--dsa-text)'; e.target.style.borderColor='var(--dsa-text-muted)'; }}
                  onMouseLeave={e => { e.target.style.color='var(--dsa-text-muted)'; e.target.style.borderColor='var(--dsa-border)'; }}
                >
                  ← Back
                </button>
                <span style={{ color: 'var(--dsa-text-muted)', fontSize: '0.8rem' }}>
                  {selectedQ.topic}
                </span>
                <span style={{ color: 'var(--dsa-border)' }}>/</span>
                <span style={{ color: 'var(--dsa-text)', fontSize: '0.82rem', fontWeight: 600 }}>
                  {selectedQ.no}. {selectedQ.title}
                </span>
                <DiffBadge d={selectedQ.difficulty} />
                <button
                  onClick={() => setIsLightMode(!isLightMode)}
                  style={{
                    marginLeft: 'auto',
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    background: 'none', border: '1px solid var(--dsa-border)', color: 'var(--dsa-text-muted)',
                    padding: '0.3rem 0.8rem', borderRadius: '6px', cursor: 'pointer',
                    fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.target.style.color='var(--dsa-text)'; e.target.style.borderColor='var(--dsa-text-muted)'; }}
                  onMouseLeave={e => { e.target.style.color='var(--dsa-text-muted)'; e.target.style.borderColor='var(--dsa-border)'; }}
                >
                  {isLightMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </button>

              </div>

              {/* ── Two-panel split ── */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                flex: 1, overflow: 'hidden', minHeight: 0,
              }}>
                {/* Left: Problem — scrolls independently */}
                <div style={{
                  overflowY: 'auto', borderRight: '1px solid var(--dsa-border)',
                  background: 'var(--dsa-bg-primary)',
                }}>
                  <ProblemPanel
                    question={selectedQ}
                    solved={!!solved[selectedQ.id]}
                    bookmarked={!!bookmarked[selectedQ.id]}
                    notes={notes[selectedQ.id] || ''}
                    onSolve={toggleSolved}
                    onBookmark={toggleBookmark}
                    onNote={saveNote}
                  />
                </div>
                {/* Right: Compiler — internally resizable */}
                <div style={{
                  overflow: 'hidden', background: 'var(--dsa-bg-primary)',
                  display: 'flex', flexDirection: 'column',
                }}>
                  <CompilerPanel question={selectedQ} />
                </div>
              </div>
            </div>
            </>,
            document.body
          )}

          {/* Filter bar */}
          <div className="dsa2-filters">
            <div className="dsa2-search-box" onClick={() => searchRef.current?.focus()}>
              <span>🔍</span>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search questions, patterns, topics…"
                value={search}
                onChange={e => { setSearch(e.target.value); setSelectedQ(null); }}
              />
              {search && <button onClick={() => setSearch('')}>✕</button>}
            </div>

            <div className="dsa2-diff-pills">
              {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                <button key={d} className={`dsa2-diff-pill ${diffFilter === d ? 'active' : ''} ${d !== 'All' ? d.toLowerCase() : ''}`} onClick={() => setDiffFilter(d)}>
                  {d}
                </button>
              ))}
            </div>

            <div className="dsa2-filter-meta">
              {search ? <span className="dsa2-global-badge">🌐 All topics</span> : null}
              <span className="dsa2-count">{displayQuestions.length} questions</span>
            </div>
          </div>

          {/* ── Content area (fills remaining height after filter bar) */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {/* ── Question list ─────────────────────────────────────────── */}
            <>

              {/* Topic heading */}
              {!search && !showBm && (
                <div className="dsa2-topic-head">
                  <span className="dsa2-topic-head-icon">{DSA_TOPICS[activeTopic]?.icon}</span>
                  <div>
                    <h2 className="dsa2-topic-head-title">{activeTopic}</h2>
                    <p className="dsa2-topic-head-sub">
                      {topicStats.find(t => t.name === activeTopic)?.done || 0} / {DSA_TOPICS[activeTopic]?.questions.length} solved
                    </p>
                  </div>
                </div>
              )}
              {showBm && <div className="dsa2-topic-head"><span className="dsa2-topic-head-icon">🔖</span><div><h2 className="dsa2-topic-head-title">Bookmarks</h2></div></div>}

              {displayQuestions.length === 0 ? (
                <div className="dsa2-empty">
                  <div className="dsa2-empty-ic">{showBm ? '🔖' : '🔎'}</div>
                  <h3>{showBm ? 'No bookmarks yet' : 'No questions found'}</h3>
                  <p>{showBm ? 'Click 🔲 on any question to bookmark it.' : 'Try changing search or difficulty.'}</p>
                  {!showBm && <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => { setSearch(''); setDiffFilter('All'); }}>Reset</button>}
                </div>
              ) : (
                <div className="dsa2-table-wrap">
                  <table className="dsa2-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Question</th>
                        <th>Difficulty</th>
                        <th>Pattern</th>
                        <th>Companies</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayQuestions.map(q => {
                        const isSolved = !!solved[q.id];
                        const isBm     = !!bookmarked[q.id];
                        const hasNote  = !!(notes[q.id]?.trim());
                        const topicIndex = Object.keys(DSA_TOPICS).indexOf(q.topic);
                        const isLocked = !hasAccess(topicIndex);
                        return (
                          <tr
                            key={q.id}
                            className={`dsa2-tr ${isSolved ? 'solved' : ''} ${isLocked ? 'locked-row' : ''}`}
                            style={{ opacity: isLocked ? 0.7 : 1, cursor: isLocked ? 'not-allowed' : 'pointer' }}
                            onClick={() => {
                              if (isLocked) {
                                setIsPremiumModalOpen(true);
                                return;
                              }
                              setSelectedQ(q);
                            }}
                          >
                            <td className="dsa2-num">{q.no}</td>
                            <td>
                              <div className="dsa2-title-cell">
                                {isSolved && <span className="dsa2-solved-dot" />}
                                <span className="dsa2-q-title">{q.title}</span>
                                <div className="dsa2-indicators">
                                  {hasNote && <span title="Has notes" style={{ fontSize: '0.7rem' }}>📝</span>}
                                  {isBm    && <span title="Bookmarked" style={{ fontSize: '0.7rem' }}>🔖</span>}
                                </div>
                              </div>
                              {search && <span className="dsa2-topic-label">{q.topic}</span>}
                            </td>
                            <td><DiffBadge d={q.difficulty} /></td>
                            <td><span className="dsa2-pat-tag">{q.pattern}</span></td>
                            <td>
                              <div className="dsa2-co-list">
                                {q.companies.slice(0, 2).map(c => <span key={c} className="dsa2-co">{c}</span>)}
                                {q.companies.length > 2 && <span className="dsa2-co-more">+{q.companies.length - 2}</span>}
                              </div>
                            </td>
                            <td onClick={e => e.stopPropagation()}>
                              <div className="dsa2-act">
                                <button
                                  className={`dsa2-act-btn ${isSolved ? 'green' : ''}`}
                                  onClick={() => toggleSolved(q.id)}
                                  title={isSolved ? 'Unmark' : 'Mark solved'}
                                >{isSolved ? '✅' : '○'}</button>
                                <button
                                  className={`dsa2-act-btn ${isBm ? 'blue' : ''}`}
                                  onClick={() => toggleBookmark(q.id)}
                                  title="Bookmark"
                                >{isBm ? '🔖' : '🔲'}</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          </div>{/* end content area */}
        </main>
      </div>
      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
        onSuccess={() => {
          setIsPremiumModalOpen(false);
          getProfile().then(res => setUserProfile(res.data)); // Refresh profile
          toast.success('Welcome to Premium! All topics are now unlocked.');
        }} 
      />
    </div>
  );
};

export default DSACheatSheet;
