// ──────────────────────────────────────────────────────────────────────────────
// DSA Cheat Sheet Data — 20 Topics × 20 Questions = 400 Questions
// ──────────────────────────────────────────────────────────────────────────────

const lc = (slug) => `https://leetcode.com/problems/${slug}/`;
const yt = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q + ' leetcode solution')}`;

const q = (no, topic, title, difficulty, pattern, slug, companies, description = null) => ({
  id: `${topic.toLowerCase().replace(/\s+/g,'_')}_${no}`,
  no, topic, title, difficulty, pattern,
  link: slug ? lc(slug) : '#',
  youtube: yt(title),
  companies,
  solved: false,
  bookmarked: false,
  notes: '',
  description,
});

// ── ARRAYS ───────────────────────────────────────────────────────────────────
const ARRAYS = [
  q(1,'Arrays','Two Sum','Easy','Hashing','two-sum',['Amazon','Google','Microsoft'],
`<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
<p>You may assume that each input would have <strong><em>exactly</em> one solution</strong>, and you may not use the same element twice.</p>
<p>You can return the answer in any order.</p>

<p><strong>Example 1:</strong></p>
<pre><strong>Input:</strong> nums = [2,7,11,15], target = 9
<strong>Output:</strong> [0,1]
<strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].</pre>

<p><strong>Example 2:</strong></p>
<pre><strong>Input:</strong> nums = [3,2,4], target = 6
<strong>Output:</strong> [1,2]</pre>

<p><strong>Constraints:</strong></p>
<ul>
  <li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
  <li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
  <li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>
  <li><strong>Only one valid answer exists.</strong></li>
</ul>`),
  q(2,'Arrays','Reverse Integer','Medium','Math','reverse-integer',['Amazon','Bloomberg','Goldman Sachs'],
`<p>Given a signed 32-bit integer <code>x</code>, return <code>x</code> with its digits reversed. If reversing <code>x</code> causes the value to go outside the signed 32-bit integer range <code>[-2<sup>31</sup>, 2<sup>31</sup> - 1]</code>, then return <code>0</code>.</p>
<p><strong>Assume the environment does not allow you to store 64-bit integers (signed or unsigned).</strong></p>

<p><strong>Example 1:</strong></p>
<pre><strong>Input:</strong> x = 123
<strong>Output:</strong> 321</pre>

<p><strong>Example 2:</strong></p>
<pre><strong>Input:</strong> x = -123
<strong>Output:</strong> -321</pre>

<p><strong>Example 3:</strong></p>
<pre><strong>Input:</strong> x = 120
<strong>Output:</strong> 21</pre>

<p><strong>Constraints:</strong></p>
<ul>
  <li><code>-2<sup>31</sup> &lt;= x &lt;= 2<sup>31</sup> - 1</code></li>
</ul>`),
  q(3,'Arrays','Contains Duplicate','Easy','Hashing','contains-duplicate',['Google','Adobe','Palantir']),
  q(4,'Arrays','Product of Array Except Self','Medium','Prefix Sum','product-of-array-except-self',['Amazon','Facebook','Microsoft']),
  q(5,'Arrays','Maximum Subarray','Medium',"Kadane's Algorithm",'maximum-subarray',['Amazon','LinkedIn','Google']),
  q(6,'Arrays','Maximum Product Subarray','Medium','Dynamic Programming','maximum-product-subarray',['Amazon','Microsoft','Google']),
  q(7,'Arrays','Move Zeroes','Easy','Two Pointers','move-zeroes',['Facebook','Apple','Bloomberg']),
  q(8,'Arrays','Merge Sorted Array','Easy','Two Pointers','merge-sorted-array',['Facebook','Microsoft','Amazon']),
  q(9,'Arrays','Remove Duplicates from Sorted Array','Easy','Two Pointers','remove-duplicates-from-sorted-array',['Microsoft','Google','Adobe']),
  q(10,'Arrays','Rotate Array','Medium','Array Manipulation','rotate-array',['Microsoft','Amazon','Bloomberg']),
  q(11,'Arrays','Missing Number','Easy','Bit Manipulation','missing-number',['Amazon','Google','Microsoft']),
  q(12,'Arrays','Majority Element','Easy','Boyer-Moore Voting','majority-element',['Google','Adobe','Amazon']),
  q(13,'Arrays','Find Pivot Index','Easy','Prefix Sum','find-pivot-index',['Amazon','Google','Adobe']),
  q(14,'Arrays','Third Maximum Number','Easy','Sorting','third-maximum-number',['Amazon','Microsoft']),
  q(15,'Arrays','Set Matrix Zeroes','Medium','Array Manipulation','set-matrix-zeroes',['Microsoft','Amazon','Google']),
  q(16,'Arrays','Spiral Matrix','Medium','Simulation','spiral-matrix',['Microsoft','Amazon','Adobe']),
  q(17,'Arrays','Rotate Image','Medium','In-place Rotation','rotate-image',['Amazon','Microsoft','Apple']),
  q(18,'Arrays','Merge Intervals','Medium','Sorting','merge-intervals',['Google','Facebook','Twitter']),
  q(19,'Arrays','Insert Interval','Medium','Binary Search','insert-interval',['Google','LinkedIn','Facebook']),
  q(20,'Arrays','Meeting Rooms','Easy','Sorting','meeting-rooms',['Facebook','Google','Snapchat']),
  q(21,'Arrays','Best Time to Buy and Sell Stock','Easy','Sliding Window','best-time-to-buy-and-sell-stock',['Amazon','Facebook','Bloomberg'],
`<p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i<sup>th</sup></code> day.</p>
<p>You want to maximize your profit by choosing a <strong>single day</strong> to buy one stock and choosing a <strong>different day in the future</strong> to sell that stock.</p>
<p>Return <em>the maximum profit you can achieve from this transaction</em>. If you cannot achieve any profit, return <code>0</code>.</p>

<p><strong>Example 1:</strong></p>
<pre><strong>Input:</strong> prices = [7,1,5,3,6,4]
<strong>Output:</strong> 5
<strong>Explanation:</strong> Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.</pre>

<p><strong>Example 2:</strong></p>
<pre><strong>Input:</strong> prices = [7,6,4,3,1]
<strong>Output:</strong> 0
<strong>Explanation:</strong> No transactions are done and the max profit = 0.</pre>

<p><strong>Constraints:</strong></p>
<ul>
  <li><code>1 &lt;= prices.length &lt;= 10<sup>5</sup></code></li>
  <li><code>0 &lt;= prices[i] &lt;= 10<sup>4</sup></code></li>
</ul>`),
  q(22,'Arrays','Subarray Sum Equals K','Medium','Prefix Sum + Hashing','subarray-sum-equals-k',['Amazon','Facebook','Google'],
`<p>Given an array of integers <code>nums</code> and an integer <code>k</code>, return <em>the total number of subarrays whose sum equals to</em> <code>k</code>.</p>
<p>A subarray is a contiguous <strong>non-empty</strong> sequence of elements within an array.</p>

<p><strong>Example 1:</strong></p>
<pre><strong>Input:</strong> nums = [1,1,1], k = 2
<strong>Output:</strong> 2</pre>

<p><strong>Example 2:</strong></p>
<pre><strong>Input:</strong> nums = [1,2,3], k = 3
<strong>Output:</strong> 2</pre>

<p><strong>Constraints:</strong></p>
<ul>
  <li><code>1 &lt;= nums.length &lt;= 2 * 10<sup>4</sup></code></li>
  <li><code>-1000 &lt;= nums[i] &lt;= 1000</code></li>
  <li><code>-10<sup>7</sup> &lt;= k &lt;= 10<sup>7</sup></code></li>
</ul>`),
  q(23,'Arrays','Maximum Sum Circular Subarray','Medium',"Kadane's Algorithm",'maximum-sum-circular-subarray',['Amazon','Google','Microsoft'],
`<p>Given a <strong>circular integer array</strong> <code>nums</code> of length <code>n</code>, return <em>the maximum possible sum of a non-empty subarray of</em> <code>nums</code>.</p>
<p>A circular array means the end of the array connects to the beginning of the array.</p>

<p><strong>Example 1:</strong></p>
<pre><strong>Input:</strong> nums = [1,-2,3,-2]
<strong>Output:</strong> 3</pre>

<p><strong>Example 2:</strong></p>
<pre><strong>Input:</strong> nums = [5,-3,5]
<strong>Output:</strong> 10</pre>

<p><strong>Constraints:</strong></p>
<ul>
  <li><code>n == nums.length</code></li>
  <li><code>1 &lt;= n &lt;= 3 * 10<sup>4</sup></code></li>
  <li><code>-3 * 10<sup>4</sup> &lt;= nums[i] &lt;= 3 * 10<sup>4</sup></code></li>
</ul>`),
  q(24,'Arrays','Find All Duplicates in an Array','Medium','Index Marking','find-all-duplicates-in-an-array',['Amazon','Adobe','Bloomberg'],
`<p>Given an integer array <code>nums</code> of length <code>n</code> where all the integers of <code>nums</code> are in the range <code>[1, n]</code> and each integer appears <strong>once</strong> or <strong>twice</strong>, return <em>an array of all the integers that appears <strong>twice</strong></em>.</p>

<p><strong>Example 1:</strong></p>
<pre><strong>Input:</strong> nums = [4,3,2,7,8,2,3,1]
<strong>Output:</strong> [2,3]</pre>

<p><strong>Example 2:</strong></p>
<pre><strong>Input:</strong> nums = [1,1,2]
<strong>Output:</strong> [1]</pre>

<p><strong>Constraints:</strong></p>
<ul>
  <li><code>n == nums.length</code></li>
  <li><code>1 &lt;= n &lt;= 10<sup>5</sup></code></li>
  <li><code>1 &lt;= nums[i] &lt;= n</code></li>
</ul>`),
  q(25,'Arrays','Range Sum Query - Immutable','Easy','Prefix Sum','range-sum-query-immutable',['Amazon','Google','Microsoft'],
`<p>Given an integer array <code>nums</code>, handle multiple queries of the following type:</p>
<p>Calculate the <strong>sum</strong> of the elements of <code>nums</code> between indices <code>left</code> and <code>right</code> <strong>inclusive</strong> where <code>left &lt;= right</code>.</p>
<p>Implement the <code>NumArray</code> class with <code>sumRange(left, right)</code> that returns the sum in O(1).</p>

<p><strong>Example 1:</strong></p>
<pre><strong>Input:</strong> ["NumArray","sumRange","sumRange","sumRange"]
[[[-2,0,3,-5,2,-1]],[0,2],[2,5],[0,5]]
<strong>Output:</strong> [null,1,-1,-3]</pre>

<p><strong>Constraints:</strong></p>
<ul>
  <li><code>1 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
  <li><code>-10<sup>5</sup> &lt;= nums[i] &lt;= 10<sup>5</sup></code></li>
  <li><code>0 &lt;= left &lt;= right &lt; nums.length</code></li>
</ul>`),
  q(26,'Arrays','Pascal\'s Triangle','Easy','Array Construction','pascals-triangle',['Apple','Amazon','Microsoft'],
`<p>Given an integer <code>numRows</code>, return the first <code>numRows</code> of <strong>Pascal\'s triangle</strong>.</p>
<p>In Pascal\'s triangle, each number is the sum of the two numbers directly above it.</p>

<p><strong>Example 1:</strong></p>
<pre><strong>Input:</strong> numRows = 5
<strong>Output:</strong> [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]</pre>

<p><strong>Constraints:</strong></p>
<ul>
  <li><code>1 &lt;= numRows &lt;= 30</code></li>
</ul>`),
  q(27,'Arrays','Sort Colors (Dutch National Flag)','Medium','Three Pointers','sort-colors',['Amazon','Microsoft','Facebook'],
`<p>Given an array <code>nums</code> with <code>n</code> objects colored red, white, or blue, sort them <strong>in-place</strong> so that objects of the same color are adjacent, with the colors in the order red, white, and blue.</p>
<p>We will use the integers <code>0</code>, <code>1</code>, and <code>2</code> to represent the color red, white, and blue, respectively.</p>

<p><strong>Example 1:</strong></p>
<pre><strong>Input:</strong> nums = [2,0,2,1,1,0]
<strong>Output:</strong> [0,0,1,1,2,2]</pre>

<p><strong>Example 2:</strong></p>
<pre><strong>Input:</strong> nums = [2,0,1]
<strong>Output:</strong> [0,1,2]</pre>

<p><strong>Constraints:</strong></p>
<ul>
  <li><code>n == nums.length</code></li>
  <li><code>1 &lt;= n &lt;= 300</code></li>
  <li><code>nums[i]</code> is either <code>0</code>, <code>1</code>, or <code>2</code>.</li>
</ul>`),
  q(28,'Arrays','Find the Duplicate Number','Medium','Floyd\'s Cycle Detection','find-the-duplicate-number',['Amazon','Google','Microsoft'],
`<p>Given an array of integers <code>nums</code> containing <code>n + 1</code> integers where each integer is in the range <code>[1, n]</code> inclusive, there is only <strong>one repeated number</strong> in <code>nums</code>. Return this repeated number.</p>
<p>You must solve the problem <strong>without</strong> modifying the array <code>nums</code> and uses only constant extra space.</p>

<p><strong>Example 1:</strong></p>
<pre><strong>Input:</strong> nums = [1,3,4,2,2]
<strong>Output:</strong> 2</pre>

<p><strong>Example 2:</strong></p>
<pre><strong>Input:</strong> nums = [3,1,3,4,2]
<strong>Output:</strong> 3</pre>

<p><strong>Constraints:</strong></p>
<ul>
  <li><code>1 &lt;= n &lt;= 10<sup>5</sup></code></li>
  <li><code>nums.length == n + 1</code></li>
  <li><code>1 &lt;= nums[i] &lt;= n</code></li>
</ul>`),
  q(29,'Arrays','Count of Smaller Numbers After Self','Hard','Merge Sort / BIT','count-of-smaller-numbers-after-self',['Google','Amazon','Palantir'],
`<p>Given an integer array <code>nums</code>, return <em>an integer array</em> <code>counts</code> where <code>counts[i]</code> is the number of smaller elements to the right of <code>nums[i]</code>.</p>

<p><strong>Example 1:</strong></p>
<pre><strong>Input:</strong> nums = [5,2,6,1]
<strong>Output:</strong> [2,1,1,0]
<strong>Explanation:</strong>
To the right of 5 there are 2 smaller elements (2 and 1).
To the right of 2 there is only 1 smaller element (1).
To the right of 6 there is 1 smaller element (1).
To the right of 1 there is 0 smaller element.</pre>

<p><strong>Constraints:</strong></p>
<ul>
  <li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
  <li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>
</ul>`),
  q(30,'Arrays','First Missing Positive','Hard','Index Mapping','first-missing-positive',['Amazon','Microsoft','Bloomberg'],
`<p>Given an unsorted integer array <code>nums</code>, return the <em>smallest missing positive integer</em>.</p>
<p>You must implement an algorithm that runs in <code>O(n)</code> time and uses <code>O(1)</code> auxiliary space.</p>

<p><strong>Example 1:</strong></p>
<pre><strong>Input:</strong> nums = [1,2,0]
<strong>Output:</strong> 3</pre>

<p><strong>Example 2:</strong></p>
<pre><strong>Input:</strong> nums = [3,4,-1,1]
<strong>Output:</strong> 2</pre>

<p><strong>Example 3:</strong></p>
<pre><strong>Input:</strong> nums = [7,8,9,11,12]
<strong>Output:</strong> 1</pre>

<p><strong>Constraints:</strong></p>
<ul>
  <li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
  <li><code>-2<sup>31</sup> &lt;= nums[i] &lt;= 2<sup>31</sup> - 1</code></li>
</ul>`),
];

// ── STRINGS ──────────────────────────────────────────────────────────────────
const STRINGS = [
  q(1,'Strings','Valid Anagram','Easy','Hashing','valid-anagram',['Amazon','Google','Facebook']),
  q(2,'Strings','Valid Palindrome','Easy','Two Pointers','valid-palindrome',['Facebook','Microsoft','Apple']),
  q(3,'Strings','Longest Common Prefix','Easy','String','longest-common-prefix',['Google','Amazon','Adobe']),
  q(4,'Strings','Reverse String','Easy','Two Pointers','reverse-string',['Google','Apple','Amazon']),
  q(5,'Strings','Reverse Words in a String','Medium','String','reverse-words-in-a-string',['Microsoft','Amazon','Apple']),
  q(6,'Strings','String Compression','Medium','Two Pointers','string-compression',['Google','Facebook','Twitter']),
  q(7,'Strings','Implement strStr()','Easy','KMP / String','find-the-index-of-the-first-occurrence-in-a-string',['Amazon','Microsoft','Bloomberg']),
  q(8,'Strings','Group Anagrams','Medium','Hashing','group-anagrams',['Amazon','Facebook','Google']),
  q(9,'Strings','Longest Palindromic Substring','Medium','Expand Around Center','longest-palindromic-substring',['Amazon','Microsoft','Apple']),
  q(10,'Strings','Count and Say','Medium','Simulation','count-and-say',['Amazon','Facebook','Google']),
  q(11,'Strings','Isomorphic Strings','Easy','Hashing','isomorphic-strings',['Google','Amazon']),
  q(12,'Strings','Roman to Integer','Easy','String','roman-to-integer',['Amazon','Uber','Microsoft']),
  q(13,'Strings','Integer to Roman','Medium','Greedy','integer-to-roman',['Amazon','Facebook']),
  q(14,'Strings','Longest Substring Without Repeating Characters','Medium','Sliding Window','longest-substring-without-repeating-characters',['Amazon','Google','Bloomberg']),
  q(15,'Strings','Minimum Window Substring','Hard','Sliding Window','minimum-window-substring',['Amazon','Facebook','Google']),
  q(16,'Strings','Encode and Decode Strings','Medium','String','encode-and-decode-strings',['Google','Facebook']),
  q(17,'Strings','Zigzag Conversion','Medium','Simulation','zigzag-conversion',['Amazon','Bloomberg']),
  q(18,'Strings','Compare Version Numbers','Medium','String','compare-version-numbers',['Amazon','Uber','IXL']),
  q(19,'Strings','Valid Parentheses','Easy','Stack','valid-parentheses',['Amazon','Google','Bloomberg']),
  q(20,'Strings','Repeated Substring Pattern','Easy','KMP / String','repeated-substring-pattern',['Amazon','Google']),
  q(21,'Strings','Palindromic Substrings','Medium','Expand Around Center','palindromic-substrings',['Facebook','Amazon','Google']),
  q(22,'Strings','Find All Anagrams in a String','Medium','Sliding Window','find-all-anagrams-in-a-string',['Amazon','Google','Bloomberg']),
  q(23,'Strings','Permutation in String','Medium','Sliding Window','permutation-in-string',['Amazon','Google','Microsoft']),
  q(24,'Strings','Longest Repeating Character Replacement','Medium','Sliding Window','longest-repeating-character-replacement',['Google','Amazon','Uber']),
  q(25,'Strings','Decode String','Medium','Stack','decode-string',['Google','Amazon','Bloomberg']),
  q(26,'Strings','Minimum Add to Make Parentheses Valid','Medium','Stack','minimum-add-to-make-parentheses-valid',['Facebook','Google','Amazon']),
  q(27,'Strings','Sort Characters By Frequency','Medium','Hashing / Sorting','sort-characters-by-frequency',['Amazon','Google','Microsoft']),
  q(28,'Strings','String to Integer (atoi)','Medium','Simulation','string-to-integer-atoi',['Amazon','Microsoft','Bloomberg']),
  q(29,'Strings','Multiply Strings','Medium','Math / String','multiply-strings',['Facebook','Microsoft','Google']),
  q(30,'Strings','Edit Distance','Hard','Dynamic Programming','edit-distance',['Google','Amazon','Microsoft']),
];

// ── LINKED LIST ──────────────────────────────────────────────────────────────
const LINKED_LIST = [
  q(1,'Linked List','Reverse Linked List','Easy','Iteration / Recursion','reverse-linked-list',['Amazon','Facebook','Microsoft']),
  q(2,'Linked List','Middle of the Linked List','Easy','Slow-Fast Pointers','middle-of-the-linked-list',['Amazon','Google','Apple']),
  q(3,'Linked List','Linked List Cycle','Easy','Floyd\'s Algorithm','linked-list-cycle',['Amazon','Microsoft','Bloomberg']),
  q(4,'Linked List','Linked List Cycle II','Medium','Floyd\'s Algorithm','linked-list-cycle-ii',['Amazon','Microsoft','Google']),
  q(5,'Linked List','Merge Two Sorted Lists','Easy','Two Pointers','merge-two-sorted-lists',['Amazon','Apple','Microsoft']),
  q(6,'Linked List','Remove Nth Node From End','Medium','Slow-Fast Pointers','remove-nth-node-from-end-of-list',['Amazon','Microsoft','Facebook']),
  q(7,'Linked List','Palindrome Linked List','Easy','Slow-Fast Pointers','palindrome-linked-list',['Amazon','Google','Facebook']),
  q(8,'Linked List','Intersection of Two Linked Lists','Easy','Two Pointers','intersection-of-two-linked-lists',['Amazon','Microsoft','Bloomberg']),
  q(9,'Linked List','Delete the Middle Node of a Linked List','Medium','Slow-Fast Pointers','delete-the-middle-node-of-a-linked-list',['Google','Amazon']),
  q(10,'Linked List','Rotate List','Medium','Linked List Manipulation','rotate-list',['Microsoft','Amazon','Bloomberg']),
  q(11,'Linked List','Reorder List','Medium','Slow-Fast + Reverse','reorder-list',['Amazon','Google','Facebook']),
  q(12,'Linked List','Reverse Nodes in k-Group','Hard','Recursion','reverse-nodes-in-k-group',['Amazon','Microsoft','Facebook']),
  q(13,'Linked List','Add Two Numbers','Medium','Linked List Manipulation','add-two-numbers',['Amazon','Microsoft','Bloomberg']),
  q(14,'Linked List','Copy List with Random Pointer','Medium','Hashing','copy-list-with-random-pointer',['Amazon','Microsoft','Google']),
  q(15,'Linked List','Flatten a Multilevel Doubly Linked List','Medium','DFS','flatten-a-multilevel-doubly-linked-list',['Microsoft','Amazon']),
  q(16,'Linked List','Sort List','Medium','Merge Sort','sort-list',['Amazon','Microsoft','Google']),
  q(17,'Linked List','Partition List','Medium','Two Pointers','partition-list',['Google','Amazon']),
  q(18,'Linked List','Swap Nodes in Pairs','Medium','Recursion','swap-nodes-in-pairs',['Amazon','Google','Bloomberg']),
  q(19,'Linked List','Odd Even Linked List','Medium','Linked List Manipulation','odd-even-linked-list',['Microsoft','Amazon']),
  q(20,'Linked List','Merge k Sorted Lists','Hard','Priority Queue','merge-k-sorted-lists',['Amazon','Facebook','Google']),
];

// ── STACK ────────────────────────────────────────────────────────────────────
const STACK = [
  q(1,'Stack','Valid Parentheses','Easy','Stack','valid-parentheses',['Amazon','Google','Bloomberg']),
  q(2,'Stack','Min Stack','Medium','Stack','min-stack',['Amazon','Google','Bloomberg']),
  q(3,'Stack','Next Greater Element I','Easy','Monotonic Stack','next-greater-element-i',['Amazon','Google']),
  q(4,'Stack','Daily Temperatures','Medium','Monotonic Stack','daily-temperatures',['Amazon','Google','Yahoo']),
  q(5,'Stack','Largest Rectangle in Histogram','Hard','Monotonic Stack','largest-rectangle-in-histogram',['Amazon','Microsoft','Facebook']),
  q(6,'Stack','Trapping Rain Water','Hard','Monotonic Stack','trapping-rain-water',['Amazon','Google','Microsoft']),
  q(7,'Stack','Stock Span Problem','Medium','Monotonic Stack','online-stock-span',['Amazon','Goldman Sachs']),
  q(8,'Stack','Asteroid Collision','Medium','Stack','asteroid-collision',['Amazon','Bloomberg']),
  q(9,'Stack','Decode String','Medium','Stack','decode-string',['Google','Amazon','Bloomberg']),
  q(10,'Stack','Evaluate Reverse Polish Notation','Medium','Stack','evaluate-reverse-polish-notation',['Amazon','LinkedIn']),
  q(11,'Stack','Basic Calculator','Hard','Stack','basic-calculator',['Google','Facebook']),
  q(12,'Stack','Simplify Path','Medium','Stack','simplify-path',['Facebook','Google','Amazon']),
  q(13,'Stack','Remove K Digits','Medium','Greedy + Stack','remove-k-digits',['Google','Snapchat']),
  q(14,'Stack','Online Stock Span','Medium','Monotonic Stack','online-stock-span',['Amazon','Goldman Sachs']),
  q(15,'Stack','Car Fleet','Medium','Monotonic Stack','car-fleet',['Amazon','Google']),
  q(16,'Stack','Backspace String Compare','Easy','Stack / Two Pointers','backspace-string-compare',['Google','Facebook','Amazon']),
  q(17,'Stack','Celebrity Problem','Medium','Stack','find-the-celebrity',['Facebook','Microsoft']),
  q(18,'Stack','Maximal Rectangle','Hard','Monotonic Stack','maximal-rectangle',['Amazon','Google']),
  q(19,'Stack','Next Smaller Element','Medium','Monotonic Stack','',['Amazon','Flipkart']),
  q(20,'Stack','Sum of Subarray Minimums','Medium','Monotonic Stack','sum-of-subarray-minimums',['Google','Amazon']),
];

// ── QUEUE ────────────────────────────────────────────────────────────────────
const QUEUE = [
  q(1,'Queue','Implement Queue using Stacks','Easy','Queue','implement-queue-using-stacks',['Amazon','Microsoft']),
  q(2,'Queue','Design Circular Queue','Medium','Queue','design-circular-queue',['Amazon','Google']),
  q(3,'Queue','Moving Average from Data Stream','Easy','Sliding Window + Queue','moving-average-from-data-stream',['Google','Amazon']),
  q(4,'Queue','Number of Recent Calls','Easy','Queue','number-of-recent-calls',['Google']),
  q(5,'Queue','First Unique Character in a String','Easy','Queue / Hashing','first-unique-character-in-a-string',['Amazon','Microsoft','Bloomberg']),
  q(6,'Queue','Rotting Oranges','Medium','BFS','rotting-oranges',['Amazon','Google','DoorDash']),
  q(7,'Queue','Sliding Window Maximum','Hard','Deque','sliding-window-maximum',['Amazon','Google','Booking.com']),
  q(8,'Queue','Binary Tree Level Order Traversal','Medium','BFS','binary-tree-level-order-traversal',['Amazon','Facebook','Microsoft']),
  q(9,'Queue','Binary Tree Zigzag Level Order Traversal','Medium','BFS','binary-tree-zigzag-level-order-traversal',['Amazon','Microsoft','Bloomberg']),
  q(10,'Queue','Time Needed to Buy Tickets','Easy','Queue','time-needed-to-buy-tickets',['Amazon']),
  q(11,'Queue','Task Scheduler','Medium','Greedy + Queue','task-scheduler',['Facebook','Amazon','Google']),
  q(12,'Queue','Dota2 Senate','Medium','Greedy + Queue','dota2-senate',['Google']),
  q(13,'Queue','Snakes and Ladders','Medium','BFS','snakes-and-ladders',['Google','Amazon']),
  q(14,'Queue','Shortest Path in Binary Matrix','Medium','BFS','shortest-path-in-binary-matrix',['Google','Facebook','Amazon']),
  q(15,'Queue','Open the Lock','Medium','BFS','open-the-lock',['Google','Amazon']),
  q(16,'Queue','Word Ladder','Hard','BFS','word-ladder',['Amazon','LinkedIn','Facebook']),
  q(17,'Queue','Course Schedule','Medium','Topological Sort','course-schedule',['Amazon','Google','Flipkart']),
  q(18,'Queue','Topological Sort','Medium','BFS / DFS','course-schedule-ii',['Amazon','Google','Microsoft']),
  q(19,'Queue','Flood Fill','Easy','BFS / DFS','flood-fill',['Amazon','Microsoft']),
  q(20,'Queue','Number of Islands','Medium','BFS / DFS','number-of-islands',['Amazon','Google','Microsoft']),
];

// ── BINARY SEARCH ─────────────────────────────────────────────────────────────
const BINARY_SEARCH = [
  q(1,'Binary Search','Binary Search','Easy','Binary Search','binary-search',['Amazon','Google','Microsoft']),
  q(2,'Binary Search','Search Insert Position','Easy','Binary Search','search-insert-position',['Amazon','Microsoft']),
  q(3,'Binary Search','First Bad Version','Easy','Binary Search','first-bad-version',['Facebook','Google']),
  q(4,'Binary Search','Guess Number Higher or Lower','Easy','Binary Search','guess-number-higher-or-lower',['Google']),
  q(5,'Binary Search','Sqrt(x)','Easy','Binary Search','sqrtx',['Apple','Amazon','Bloomberg']),
  q(6,'Binary Search','Search in Rotated Sorted Array','Medium','Binary Search','search-in-rotated-sorted-array',['Amazon','Microsoft','Facebook']),
  q(7,'Binary Search','Find Minimum in Rotated Sorted Array','Medium','Binary Search','find-minimum-in-rotated-sorted-array',['Amazon','Microsoft','Google']),
  q(8,'Binary Search','Find Peak Element','Medium','Binary Search','find-peak-element',['Google','Facebook','Microsoft']),
  q(9,'Binary Search','Find First and Last Position of Element','Medium','Binary Search','find-first-and-last-position-of-element-in-sorted-array',['Facebook','Google','Amazon']),
  q(10,'Binary Search','Search a 2D Matrix','Medium','Binary Search','search-a-2d-matrix',['Amazon','Microsoft','Apple']),
  q(11,'Binary Search','Koko Eating Bananas','Medium','Binary Search on Answer','koko-eating-bananas',['Facebook','Amazon']),
  q(12,'Binary Search','Capacity To Ship Packages','Medium','Binary Search on Answer','capacity-to-ship-packages-within-d-days',['Amazon','Google']),
  q(13,'Binary Search','Aggressive Cows','Medium','Binary Search on Answer','',['Codechef','Amazon','Flipkart']),
  q(14,'Binary Search','Allocate Minimum Pages','Medium','Binary Search on Answer','',['Amazon','Google','Flipkart']),
  q(15,'Binary Search','Painter\'s Partition','Hard','Binary Search on Answer','',['Amazon','Flipkart']),
  q(16,'Binary Search','Split Array Largest Sum','Hard','Binary Search on Answer','split-array-largest-sum',['Facebook','Google','Amazon']),
  q(17,'Binary Search','Median of Two Sorted Arrays','Hard','Binary Search','median-of-two-sorted-arrays',['Google','Amazon','Microsoft']),
  q(18,'Binary Search','Single Element in a Sorted Array','Medium','Binary Search','single-element-in-a-sorted-array',['Amazon','Google','Facebook']),
  q(19,'Binary Search','Minimum Days to Make Bouquets','Medium','Binary Search on Answer','minimum-number-of-days-to-make-m-bouquets',['Amazon','Google']),
  q(20,'Binary Search','Magnetic Force Between Two Balls','Medium','Binary Search on Answer','magnetic-force-between-two-balls',['Google','Amazon']),
];

// ── TWO POINTERS ──────────────────────────────────────────────────────────────
const TWO_POINTERS = [
  q(1,'Two Pointers','Two Sum II - Input Array Is Sorted','Medium','Two Pointers','two-sum-ii-input-array-is-sorted',['Amazon','Google','Facebook']),
  q(2,'Two Pointers','Valid Palindrome','Easy','Two Pointers','valid-palindrome',['Facebook','Microsoft']),
  q(3,'Two Pointers','Container With Most Water','Medium','Two Pointers','container-with-most-water',['Amazon','Google','Bloomberg']),
  q(4,'Two Pointers','3Sum','Medium','Two Pointers','3sum',['Amazon','Facebook','Google']),
  q(5,'Two Pointers','4Sum','Medium','Two Pointers','4sum',['Amazon','Adobe']),
  q(6,'Two Pointers','Remove Duplicates from Sorted Array','Easy','Two Pointers','remove-duplicates-from-sorted-array',['Google','Microsoft']),
  q(7,'Two Pointers','Move Zeroes','Easy','Two Pointers','move-zeroes',['Facebook','Apple']),
  q(8,'Two Pointers','Sort Colors','Medium','Dutch National Flag','sort-colors',['Amazon','Microsoft','Facebook']),
  q(9,'Two Pointers','Trapping Rain Water','Hard','Two Pointers','trapping-rain-water',['Amazon','Google','Microsoft']),
  q(10,'Two Pointers','Merge Sorted Array','Easy','Two Pointers','merge-sorted-array',['Facebook','Microsoft']),
  q(11,'Two Pointers','Squares of a Sorted Array','Easy','Two Pointers','squares-of-a-sorted-array',['Google','Amazon','Bloomberg']),
  q(12,'Two Pointers','Reverse Vowels of a String','Easy','Two Pointers','reverse-vowels-of-a-string',['Google']),
  q(13,'Two Pointers','Backspace String Compare','Easy','Two Pointers','backspace-string-compare',['Google','Facebook']),
  q(14,'Two Pointers','Boats to Save People','Medium','Greedy + Two Pointers','boats-to-save-people',['Amazon','Google']),
  q(15,'Two Pointers','Pair Sum Closest to Target','Medium','Two Pointers','',['Amazon','Flipkart']),
  q(16,'Two Pointers','Dutch National Flag','Medium','Three Pointers','sort-colors',['Amazon','Microsoft']),
  q(17,'Two Pointers','Partition Labels','Medium','Greedy','partition-labels',['Amazon','Facebook']),
  q(18,'Two Pointers','Max Consecutive Ones III','Medium','Sliding Window + Two Pointers','max-consecutive-ones-iii',['Google','Amazon']),
  q(19,'Two Pointers','Long Pressed Name','Easy','Two Pointers','long-pressed-name',['Amazon']),
  q(20,'Two Pointers','Shortest Unsorted Continuous Subarray','Medium','Two Pointers','shortest-unsorted-continuous-subarray',['Amazon','Google','Facebook']),
];

// ── SLIDING WINDOW ───────────────────────────────────────────────────────────
const SLIDING_WINDOW = [
  q(1,'Sliding Window','Maximum Sum Subarray of Size K','Easy','Sliding Window','',[  'Amazon','Google']),
  q(2,'Sliding Window','Longest Substring Without Repeating Characters','Medium','Sliding Window','longest-substring-without-repeating-characters',['Amazon','Google','Bloomberg']),
  q(3,'Sliding Window','Minimum Window Substring','Hard','Sliding Window','minimum-window-substring',['Amazon','Facebook','Google']),
  q(4,'Sliding Window','Fruit Into Baskets','Medium','Sliding Window','fruit-into-baskets',['Amazon','Google']),
  q(5,'Sliding Window','Permutation in String','Medium','Sliding Window + Hashing','permutation-in-string',['Amazon','Google','Microsoft']),
  q(6,'Sliding Window','Sliding Window Maximum','Hard','Deque + Sliding Window','sliding-window-maximum',['Amazon','Google']),
  q(7,'Sliding Window','Longest Subarray with Ones After Replacement','Medium','Sliding Window','max-consecutive-ones-iii',['Google','Amazon']),
  q(8,'Sliding Window','Max Consecutive Ones III','Medium','Sliding Window','max-consecutive-ones-iii',['Google','Amazon']),
  q(9,'Sliding Window','Longest Repeating Character Replacement','Medium','Sliding Window','longest-repeating-character-replacement',['Google','Amazon']),
  q(10,'Sliding Window','Grumpy Bookstore Owner','Medium','Sliding Window','grumpy-bookstore-owner',['Amazon']),
  q(11,'Sliding Window','Find All Anagrams in a String','Medium','Sliding Window + Hashing','find-all-anagrams-in-a-string',['Amazon','Google','Bloomberg']),
  q(12,'Sliding Window','Minimum Size Subarray Sum','Medium','Sliding Window','minimum-size-subarray-sum',['Amazon','Google']),
  q(13,'Sliding Window','Number of Substrings Containing All Three Characters','Medium','Sliding Window','number-of-substrings-containing-all-three-characters',['Google']),
  q(14,'Sliding Window','Binary Subarrays With Sum','Medium','Sliding Window + Prefix','binary-subarrays-with-sum',['Google','Amazon']),
  q(15,'Sliding Window','Subarray Product Less Than K','Medium','Sliding Window','subarray-product-less-than-k',['Amazon']),
  q(16,'Sliding Window','Maximum Average Subarray I','Easy','Sliding Window','maximum-average-subarray-i',['Google','Amazon']),
  q(17,'Sliding Window','Minimum Swaps to Group All 1s','Medium','Sliding Window','minimum-swaps-to-group-all-1s-together-ii',['Amazon']),
  q(18,'Sliding Window','Longest Turbulent Subarray','Medium','Sliding Window','longest-turbulent-subarray',['Google']),
  q(19,'Sliding Window','Max Points You Can Obtain From Cards','Medium','Sliding Window','maximum-points-you-can-obtain-from-cards',['Google','Amazon']),
  q(20,'Sliding Window','Minimum Window Subsequence','Hard','Sliding Window','minimum-window-subsequence',['Google','Facebook']),
];

// ── SORTING ──────────────────────────────────────────────────────────────────
const SORTING = [
  q(1,'Sorting','Bubble Sort','Easy','Comparison Sort','',[  'Amazon','Microsoft']),
  q(2,'Sorting','Selection Sort','Easy','Comparison Sort','',[  'Amazon','Microsoft']),
  q(3,'Sorting','Insertion Sort','Easy','Comparison Sort','',[  'Amazon','Microsoft']),
  q(4,'Sorting','Merge Sort','Medium','Divide & Conquer','',[  'Amazon','Google','Facebook']),
  q(5,'Sorting','Quick Sort','Medium','Divide & Conquer','',[  'Amazon','Google','Microsoft']),
  q(6,'Sorting','Counting Sort','Easy','Non-Comparison Sort','',[  'Google','Amazon']),
  q(7,'Sorting','Radix Sort','Medium','Non-Comparison Sort','',[  'Google','Amazon']),
  q(8,'Sorting','Bucket Sort','Medium','Non-Comparison Sort','',[  'Google','Amazon']),
  q(9,'Sorting','Sort Colors','Medium','Dutch National Flag','sort-colors',['Amazon','Microsoft','Facebook']),
  q(10,'Sorting','Merge Intervals','Medium','Sorting','merge-intervals',['Google','Facebook','Twitter']),
  q(11,'Sorting','Largest Number','Medium','Custom Sort','largest-number',['Amazon','Microsoft','Bloomberg']),
  q(12,'Sorting','Relative Sort Array','Easy','Counting Sort','relative-sort-array',['Google','Amazon']),
  q(13,'Sorting','Kth Largest Element in an Array','Medium','Quick Select','kth-largest-element-in-an-array',['Facebook','Amazon','Google']),
  q(14,'Sorting','Sort Characters By Frequency','Medium','Counting Sort','sort-characters-by-frequency',['Amazon','Google']),
  q(15,'Sorting','Top K Frequent Elements','Medium','Bucket Sort','top-k-frequent-elements',['Amazon','Facebook','Google']),
  q(16,'Sorting','Sort List','Medium','Merge Sort','sort-list',['Amazon','Microsoft','Google']),
  q(17,'Sorting','Meeting Rooms II','Medium','Sorting + Heap','meeting-rooms-ii',['Facebook','Google','Amazon']),
  q(18,'Sorting','Reorganize String','Medium','Greedy + Sorting','reorganize-string',['Google','Amazon']),
  q(19,'Sorting','Minimum Swaps to Sort','Medium','Sorting + Indexing','',[  'Amazon','Flipkart']),
  q(20,'Sorting','Merge K Sorted Arrays','Hard','Priority Queue','merge-k-sorted-lists',['Amazon','Google','Facebook']),
];

// ── RECURSION & BACKTRACKING ──────────────────────────────────────────────────
const RECURSION = [
  q(1,'Recursion & Backtracking','Subsets','Medium','Backtracking','subsets',['Amazon','Facebook','Google']),
  q(2,'Recursion & Backtracking','Subsets II','Medium','Backtracking','subsets-ii',['Amazon','Facebook']),
  q(3,'Recursion & Backtracking','Permutations','Medium','Backtracking','permutations',['Amazon','Microsoft','LinkedIn']),
  q(4,'Recursion & Backtracking','Permutations II','Medium','Backtracking','permutations-ii',['Amazon','Microsoft']),
  q(5,'Recursion & Backtracking','Combination Sum','Medium','Backtracking','combination-sum',['Amazon','Google','Bloomberg']),
  q(6,'Recursion & Backtracking','Combination Sum II','Medium','Backtracking','combination-sum-ii',['Amazon','Google']),
  q(7,'Recursion & Backtracking','Word Search','Medium','DFS + Backtracking','word-search',['Amazon','Microsoft','Facebook']),
  q(8,'Recursion & Backtracking','N-Queens','Hard','Backtracking','n-queens',['Amazon','Google','Microsoft']),
  q(9,'Recursion & Backtracking','Sudoku Solver','Hard','Backtracking','sudoku-solver',['Amazon','Microsoft','Snapchat']),
  q(10,'Recursion & Backtracking','Letter Combinations of a Phone Number','Medium','Backtracking','letter-combinations-of-a-phone-number',['Amazon','Google','Facebook']),
  q(11,'Recursion & Backtracking','Palindrome Partitioning','Medium','Backtracking + DP','palindrome-partitioning',['Amazon','Microsoft']),
  q(12,'Recursion & Backtracking','Generate Parentheses','Medium','Backtracking','generate-parentheses',['Amazon','Google','Microsoft']),
  q(13,'Recursion & Backtracking','Restore IP Addresses','Medium','Backtracking','restore-ip-addresses',['Amazon','Microsoft']),
  q(14,'Recursion & Backtracking','Path Sum II','Medium','DFS + Backtracking','path-sum-ii',['Amazon','Google','Facebook']),
  q(15,'Recursion & Backtracking','Combinations','Medium','Backtracking','combinations',['Amazon','Google']),
  q(16,'Recursion & Backtracking','Beautiful Arrangement','Medium','Backtracking','beautiful-arrangement',['Google']),
  q(17,'Recursion & Backtracking','Partition to K Equal Sum Subsets','Medium','Backtracking','partition-to-k-equal-sum-subsets',['Google','Amazon']),
  q(18,'Recursion & Backtracking','Expression Add Operators','Hard','Backtracking','expression-add-operators',['Google','Facebook','Microsoft']),
  q(19,'Recursion & Backtracking','Remove Invalid Parentheses','Hard','BFS + Backtracking','remove-invalid-parentheses',['Facebook','Google']),
  q(20,'Recursion & Backtracking','Word Break II','Hard','Backtracking + DP','word-break-ii',['Amazon','Google','Facebook']),
];

// ── TREES ────────────────────────────────────────────────────────────────────
const TREES = [
  q(1,'Trees','Binary Tree Inorder Traversal','Easy','DFS','binary-tree-inorder-traversal',['Amazon','Microsoft','Apple']),
  q(2,'Trees','Binary Tree Preorder Traversal','Easy','DFS','binary-tree-preorder-traversal',['Amazon','Microsoft']),
  q(3,'Trees','Binary Tree Postorder Traversal','Easy','DFS','binary-tree-postorder-traversal',['Amazon','Google']),
  q(4,'Trees','Binary Tree Level Order Traversal','Medium','BFS','binary-tree-level-order-traversal',['Amazon','Facebook','Microsoft']),
  q(5,'Trees','Maximum Depth of Binary Tree','Easy','DFS','maximum-depth-of-binary-tree',['Amazon','Google','LinkedIn']),
  q(6,'Trees','Minimum Depth of Binary Tree','Easy','BFS','minimum-depth-of-binary-tree',['Amazon']),
  q(7,'Trees','Diameter of Binary Tree','Easy','DFS','diameter-of-binary-tree',['Amazon','Google','Facebook']),
  q(8,'Trees','Balanced Binary Tree','Easy','DFS','balanced-binary-tree',['Amazon','Bloomberg']),
  q(9,'Trees','Symmetric Tree','Easy','DFS / BFS','symmetric-tree',['Amazon','Microsoft','Bloomberg']),
  q(10,'Trees','Path Sum','Easy','DFS','path-sum',['Amazon','Microsoft']),
  q(11,'Trees','Lowest Common Ancestor of a Binary Tree','Medium','DFS','lowest-common-ancestor-of-a-binary-tree',['Amazon','Facebook','Google']),
  q(12,'Trees','Invert Binary Tree','Easy','DFS / BFS','invert-binary-tree',['Google','Apple','Amazon']),
  q(13,'Trees','Merge Two Binary Trees','Easy','DFS','merge-two-binary-trees',['Amazon','Bloomberg']),
  q(14,'Trees','Count Good Nodes in Binary Tree','Medium','DFS','count-good-nodes-in-binary-tree',['Facebook']),
  q(15,'Trees','Sum of Left Leaves','Easy','DFS','sum-of-left-leaves',['Google','Amazon']),
  q(16,'Trees','Construct Binary Tree from Preorder and Inorder','Medium','DFS','construct-binary-tree-from-preorder-and-inorder-traversal',['Amazon','Google','Microsoft']),
  q(17,'Trees','Binary Tree Zigzag Level Order Traversal','Medium','BFS','binary-tree-zigzag-level-order-traversal',['Amazon','Microsoft','Bloomberg']),
  q(18,'Trees','Binary Tree Right Side View','Medium','BFS','binary-tree-right-side-view',['Facebook','Amazon']),
  q(19,'Trees','Flatten Binary Tree to Linked List','Medium','DFS','flatten-binary-tree-to-linked-list',['Microsoft','Amazon']),
  q(20,'Trees','Binary Tree Maximum Path Sum','Hard','DFS','binary-tree-maximum-path-sum',['Amazon','Facebook','Google']),
];

// ── BINARY SEARCH TREES ───────────────────────────────────────────────────────
const BST = [
  q(1,'Binary Search Trees','Search in a Binary Search Tree','Easy','BST','search-in-a-binary-search-tree',['Amazon','Microsoft']),
  q(2,'Binary Search Trees','Insert into a Binary Search Tree','Medium','BST','insert-into-a-binary-search-tree',['Amazon','Microsoft']),
  q(3,'Binary Search Trees','Delete Node in a BST','Medium','BST','delete-node-in-a-bst',['Amazon','Microsoft']),
  q(4,'Binary Search Trees','Validate Binary Search Tree','Medium','DFS','validate-binary-search-tree',['Amazon','Microsoft','Google']),
  q(5,'Binary Search Trees','Kth Smallest Element in a BST','Medium','DFS / In-order','kth-smallest-element-in-a-bst',['Amazon','Google','Bloomberg']),
  q(6,'Binary Search Trees','Lowest Common Ancestor of a BST','Medium','BST','lowest-common-ancestor-of-a-binary-search-tree',['Amazon','Facebook','Microsoft']),
  q(7,'Binary Search Trees','Convert Sorted Array to BST','Easy','Divide & Conquer','convert-sorted-array-to-binary-search-tree',['Amazon','Google']),
  q(8,'Binary Search Trees','Recover Binary Search Tree','Medium','DFS + Morris','recover-binary-search-tree',['Amazon','Microsoft']),
  q(9,'Binary Search Trees','Unique Binary Search Trees','Medium','DP / Catalan','unique-binary-search-trees',['Amazon','Google']),
  q(10,'Binary Search Trees','Unique Binary Search Trees II','Medium','DP / Recursion','unique-binary-search-trees-ii',['Amazon','Google']),
  q(11,'Binary Search Trees','Inorder Successor in BST','Medium','BST','inorder-successor-in-bst',['Facebook','Amazon']),
  q(12,'Binary Search Trees','Range Sum of BST','Easy','DFS','range-sum-of-bst',['Amazon']),
  q(13,'Binary Search Trees','Balance a Binary Search Tree','Medium','DFS','balance-a-binary-search-tree',['Amazon']),
  q(14,'Binary Search Trees','Find Mode in Binary Search Tree','Easy','DFS','find-mode-in-binary-search-tree',['Google']),
  q(15,'Binary Search Trees','Two Sum IV - Input is a BST','Easy','DFS + Hashing','two-sum-iv-input-is-a-bst',['Google','Amazon']),
  q(16,'Binary Search Trees','Trim a Binary Search Tree','Medium','DFS','trim-a-binary-search-tree',['Amazon']),
  q(17,'Binary Search Trees','Minimum Absolute Difference in BST','Easy','DFS','minimum-absolute-difference-in-bst',['Google']),
  q(18,'Binary Search Trees','Convert BST to Greater Tree','Medium','Reverse In-order','convert-bst-to-greater-tree',['Amazon']),
  q(19,'Binary Search Trees','Binary Search Tree Iterator','Medium','Stack / In-order','binary-search-tree-iterator',['Facebook','Google','Microsoft']),
  q(20,'Binary Search Trees','Largest BST Subtree','Medium','DFS','largest-bst-subtree',['Amazon','Flipkart']),
];

// ── HEAPS / PRIORITY QUEUE ────────────────────────────────────────────────────
const HEAPS = [
  q(1,'Heaps / Priority Queue','Kth Largest Element in an Array','Medium','Quick Select / Heap','kth-largest-element-in-an-array',['Facebook','Amazon','Google']),
  q(2,'Heaps / Priority Queue','Kth Smallest Element in a Matrix','Medium','Binary Search / Heap','kth-smallest-element-in-a-matrix',['Google','Uber']),
  q(3,'Heaps / Priority Queue','Top K Frequent Elements','Medium','Bucket Sort / Heap','top-k-frequent-elements',['Amazon','Facebook','Google']),
  q(4,'Heaps / Priority Queue','K Closest Points to Origin','Medium','Heap','k-closest-points-to-origin',['Amazon','Facebook','DoorDash']),
  q(5,'Heaps / Priority Queue','Find Median from Data Stream','Hard','Two Heaps','find-median-from-data-stream',['Amazon','Google','Microsoft']),
  q(6,'Heaps / Priority Queue','Merge k Sorted Lists','Hard','Priority Queue','merge-k-sorted-lists',['Amazon','Facebook','Google']),
  q(7,'Heaps / Priority Queue','Task Scheduler','Medium','Greedy + Heap','task-scheduler',['Facebook','Amazon','Google']),
  q(8,'Heaps / Priority Queue','Reorganize String','Medium','Greedy + Heap','reorganize-string',['Google','Amazon']),
  q(9,'Heaps / Priority Queue','Sort Characters by Frequency','Medium','Counting / Heap','sort-characters-by-frequency',['Amazon','Google']),
  q(10,'Heaps / Priority Queue','Last Stone Weight','Easy','Max Heap','last-stone-weight',['Amazon']),
  q(11,'Heaps / Priority Queue','Minimum Cost to Connect Sticks','Medium','Min Heap','minimum-cost-to-connect-sticks',['Amazon']),
  q(12,'Heaps / Priority Queue','Find K Pairs with Smallest Sums','Medium','Min Heap','find-k-pairs-with-smallest-sums',['Google','Amazon']),
  q(13,'Heaps / Priority Queue','Sliding Window Maximum','Hard','Deque / Heap','sliding-window-maximum',['Amazon','Google']),
  q(14,'Heaps / Priority Queue','Kth Largest Element in a Stream','Easy','Min Heap','kth-largest-element-in-a-stream',['Amazon','Google']),
  q(15,'Heaps / Priority Queue','Ugly Number II','Medium','Min Heap','ugly-number-ii',['Google','Amazon']),
  q(16,'Heaps / Priority Queue','Super Ugly Number','Medium','Min Heap','super-ugly-number',['Google']),
  q(17,'Heaps / Priority Queue','Jump Game VI','Medium','DP + Deque','jump-game-vi',['Google']),
  q(18,'Heaps / Priority Queue','IPO','Hard','Two Heaps','ipo',['Amazon','Google']),
  q(19,'Heaps / Priority Queue','Minimum Number of Refueling Stops','Hard','Greedy + Heap','minimum-number-of-refueling-stops',['Amazon']),
  q(20,'Heaps / Priority Queue','Meeting Rooms II','Medium','Min Heap','meeting-rooms-ii',['Facebook','Google','Amazon']),
];

// ── GRAPHS ───────────────────────────────────────────────────────────────────
const GRAPHS = [
  q(1,'Graphs','Number of Islands','Medium','DFS / BFS','number-of-islands',['Amazon','Google','Microsoft']),
  q(2,'Graphs','Clone Graph','Medium','BFS / DFS','clone-graph',['Facebook','Amazon','Google']),
  q(3,'Graphs','Course Schedule','Medium','Topological Sort','course-schedule',['Amazon','Google','Flipkart']),
  q(4,'Graphs','Course Schedule II','Medium','Topological Sort','course-schedule-ii',['Amazon','Google']),
  q(5,'Graphs','Pacific Atlantic Water Flow','Medium','DFS / BFS','pacific-atlantic-water-flow',['Google','Amazon']),
  q(6,'Graphs','Number of Connected Components','Medium','Union Find / DFS','number-of-connected-components-in-an-undirected-graph',['Amazon','LinkedIn']),
  q(7,'Graphs','Graph Valid Tree','Medium','Union Find / DFS','graph-valid-tree',['Google','LinkedIn']),
  q(8,'Graphs','Rotting Oranges','Medium','BFS','rotting-oranges',['Amazon','Google','DoorDash']),
  q(9,'Graphs','Walls and Gates','Medium','BFS','walls-and-gates',['Facebook','Google']),
  q(10,'Graphs','Shortest Path in Binary Matrix','Medium','BFS','shortest-path-in-binary-matrix',['Google','Facebook','Amazon']),
  q(11,'Graphs','Word Ladder','Hard','BFS','word-ladder',['Amazon','LinkedIn','Facebook']),
  q(12,'Graphs','Alien Dictionary','Hard','Topological Sort','alien-dictionary',['Facebook','Google','Microsoft']),
  q(13,'Graphs','Redundant Connection','Medium','Union Find','redundant-connection',['Amazon','Google']),
  q(14,'Graphs','Accounts Merge','Medium','Union Find / DFS','accounts-merge',['Amazon','Facebook','Google']),
  q(15,'Graphs','Min Cost to Connect All Points','Medium','Prim\'s / Kruskal\'s','min-cost-to-connect-all-points',['Google','Amazon']),
  q(16,'Graphs','Network Delay Time','Medium','Dijkstra\'s','network-delay-time',['Amazon','Google']),
  q(17,'Graphs','Cheapest Flights Within K Stops','Medium','Bellman-Ford / BFS','find-the-city-that-is-not-reachable-after-k-stops',['Amazon','Google']),
  q(18,'Graphs','Swim in Rising Water','Hard','Dijkstra\'s / Binary Search','swim-in-rising-water',['Google']),
  q(19,'Graphs','Max Area of Island','Medium','DFS','max-area-of-island',['Amazon','Google']),
  q(20,'Graphs','Keys and Rooms','Medium','DFS / BFS','keys-and-rooms',['Amazon']),
];

// ── DYNAMIC PROGRAMMING ───────────────────────────────────────────────────────
const DP = [
  q(1,'Dynamic Programming','Climbing Stairs','Easy','DP / Fibonacci','climbing-stairs',['Amazon','Google','Apple']),
  q(2,'Dynamic Programming','House Robber','Medium','DP','house-robber',['Amazon','Google','Airbnb']),
  q(3,'Dynamic Programming','House Robber II','Medium','DP','house-robber-ii',['Amazon','Google']),
  q(4,'Dynamic Programming','Coin Change','Medium','DP','coin-change',['Amazon','Google','Microsoft']),
  q(5,'Dynamic Programming','Coin Change II','Medium','DP','coin-change-ii',['Amazon','Google']),
  q(6,'Dynamic Programming','Longest Increasing Subsequence','Medium','DP / Binary Search','longest-increasing-subsequence',['Amazon','Microsoft','Google']),
  q(7,'Dynamic Programming','Longest Common Subsequence','Medium','DP','longest-common-subsequence',['Amazon','Google','Microsoft']),
  q(8,'Dynamic Programming','Edit Distance','Hard','DP','edit-distance',['Amazon','Google','Microsoft']),
  q(9,'Dynamic Programming','0/1 Knapsack','Medium','DP','',[  'Amazon','Flipkart','Google']),
  q(10,'Dynamic Programming','Partition Equal Subset Sum','Medium','DP','partition-equal-subset-sum',['Amazon','Facebook']),
  q(11,'Dynamic Programming','Target Sum','Medium','DP / Backtracking','target-sum',['Facebook','Amazon','Google']),
  q(12,'Dynamic Programming','Unique Paths','Medium','DP','unique-paths',['Amazon','Google','Microsoft']),
  q(13,'Dynamic Programming','Minimum Path Sum','Medium','DP','minimum-path-sum',['Amazon','Google']),
  q(14,'Dynamic Programming','Decode Ways','Medium','DP','decode-ways',['Facebook','Amazon','Microsoft']),
  q(15,'Dynamic Programming','Jump Game','Medium','Greedy / DP','jump-game',['Amazon','Google','Microsoft']),
  q(16,'Dynamic Programming','Jump Game II','Medium','Greedy / DP','jump-game-ii',['Amazon','Google']),
  q(17,'Dynamic Programming','Maximum Product Subarray','Medium','DP','maximum-product-subarray',['Amazon','Microsoft','Google']),
  q(18,'Dynamic Programming','Word Break','Medium','DP','word-break',['Amazon','Facebook','Google']),
  q(19,'Dynamic Programming','Burst Balloons','Hard','DP (Interval)','burst-balloons',['Google','Amazon']),
  q(20,'Dynamic Programming','Palindromic Substrings','Medium','DP / Expand Around Center','palindromic-substrings',['Facebook','Amazon','Google']),
];


const GREEDY = [
  q(1,'Greedy','Jump Game','Medium','Greedy','jump-game',['Amazon','Google','Microsoft']),
  q(2,'Greedy','Jump Game II','Medium','Greedy','jump-game-ii',['Amazon','Google']),
  q(3,'Greedy','Gas Station','Medium','Greedy','gas-station',['Amazon','Google']),
  q(4,'Greedy','Task Scheduler','Medium','Greedy + Heap','task-scheduler',['Facebook','Amazon','Google']),
  q(5,'Greedy','Assign Cookies','Easy','Greedy','assign-cookies',['Amazon']),
  q(6,'Greedy','Non-overlapping Intervals','Medium','Greedy','non-overlapping-intervals',['Google','Amazon','Facebook']),
  q(7,'Greedy','Minimum Number of Arrows to Burst Balloons','Medium','Greedy','minimum-number-of-arrows-to-burst-balloons',['Amazon','Google','Facebook']),
  q(8,'Greedy','Queue Reconstruction by Height','Medium','Greedy','queue-reconstruction-by-height',['Amazon','Google']),
  q(9,'Greedy','Lemonade Change','Easy','Greedy','lemonade-change',['Amazon']),
  q(10,'Greedy','Best Time to Buy and Sell Stock II','Medium','Greedy','best-time-to-buy-and-sell-stock-ii',['Amazon','Bloomberg']),
  q(11,'Greedy','Partition Labels','Medium','Greedy','partition-labels',['Amazon','Facebook']),
  q(12,'Greedy','Two City Scheduling','Medium','Greedy','two-city-scheduling',['Amazon']),
  q(13,'Greedy','Boats to Save People','Medium','Greedy + Two Pointers','boats-to-save-people',['Amazon','Google']),
  q(14,'Greedy','Car Pooling','Medium','Greedy','car-pooling',['Google','Lyft']),
  q(15,'Greedy','Candy','Hard','Greedy','candy',['Amazon','Google']),
  q(16,'Greedy','Wiggle Subsequence','Medium','Greedy / DP','wiggle-subsequence',['Google']),
  q(17,'Greedy','Maximize Sum After K Negations','Easy','Greedy','maximize-sum-of-array-after-k-negations',['Amazon']),
  q(18,'Greedy','Maximum Units on a Truck','Easy','Greedy','maximum-units-on-a-truck',['Amazon']),
  q(19,'Greedy','Minimum Cost to Move Chips to The Same Position','Easy','Greedy','minimum-cost-to-move-chips-to-the-same-position',['Google']),
  q(20,'Greedy','Meeting Rooms II','Medium','Greedy + Heap','meeting-rooms-ii',['Facebook','Google','Amazon']),
];

// ── BIT MANIPULATION ──────────────────────────────────────────────────────────
const BIT_MANIPULATION = [
  q(1,'Bit Manipulation','Single Number','Easy','XOR','single-number',['Amazon','Google','Apple']),
  q(2,'Bit Manipulation','Missing Number','Easy','XOR / Math','missing-number',['Amazon','Google','Microsoft']),
  q(3,'Bit Manipulation','Reverse Bits','Easy','Bit Manipulation','reverse-bits',['Apple','Amazon']),
  q(4,'Bit Manipulation','Number of 1 Bits','Easy','Bit Manipulation','number-of-1-bits',['Apple','Amazon','Microsoft']),
  q(5,'Bit Manipulation','Counting Bits','Easy','DP + Bits','counting-bits',['Facebook','Google','Amazon']),
  q(6,'Bit Manipulation','Power of Two','Easy','Bit Manipulation','power-of-two',['Amazon','Google']),
  q(7,'Bit Manipulation','Sum of Two Integers','Medium','Bit Manipulation','sum-of-two-integers',['Facebook','Amazon']),
  q(8,'Bit Manipulation','XOR Queries of a Subarray','Medium','Prefix XOR','xor-queries-of-a-subarray',['Google']),
  q(9,'Bit Manipulation','Maximum XOR of Two Numbers in an Array','Medium','Trie / Bit Manipulation','maximum-xor-of-two-numbers-in-an-array',['Google','Amazon']),
  q(10,'Bit Manipulation','Single Number II','Medium','Bit Manipulation','single-number-ii',['Amazon','Google']),
  q(11,'Bit Manipulation','Single Number III','Medium','Bit Manipulation','single-number-iii',['Amazon']),
  q(12,'Bit Manipulation','Bitwise AND of Numbers Range','Medium','Bit Manipulation','bitwise-and-of-numbers-range',['Microsoft','Amazon']),
  q(13,'Bit Manipulation','Total Hamming Distance','Medium','Bit Manipulation','total-hamming-distance',['Google']),
  q(14,'Bit Manipulation','Binary Watch','Easy','Bit Manipulation','binary-watch',['Google']),
  q(15,'Bit Manipulation','Maximum Product of Word Lengths','Medium','Bit Mask','maximum-product-of-word-lengths',['Google']),
  q(16,'Bit Manipulation','UTF-8 Validation','Medium','Bit Manipulation','utf-8-validation',['Facebook']),
  q(17,'Bit Manipulation','Repeated DNA Sequences','Medium','Bit Mask / Hashing','repeated-dna-sequences',['LinkedIn','Amazon']),
  q(18,'Bit Manipulation','Gray Code','Medium','Bit Manipulation','gray-code',['Amazon']),
  q(19,'Bit Manipulation','Decode XOR-ed Permutation','Medium','Bit Manipulation','decode-xored-permutation',['Amazon']),
  q(20,'Bit Manipulation','Minimum Bit Flips to Convert Number','Easy','Bit Manipulation','minimum-bit-flips-to-convert-number',['Google']),
];

// ── TRIE ─────────────────────────────────────────────────────────────────────
const TRIE = [
  q(1,'Trie','Implement Trie (Prefix Tree)','Medium','Trie','implement-trie-prefix-tree',['Amazon','Google','Microsoft']),
  q(2,'Trie','Word Search II','Hard','Trie + Backtracking','word-search-ii',['Amazon','Facebook','Airbnb']),
  q(3,'Trie','Design Add and Search Words Data Structure','Medium','Trie','design-add-and-search-words-data-structure',['Facebook','Google']),
  q(4,'Trie','Replace Words','Medium','Trie','replace-words',['Uber','Google']),
  q(5,'Trie','Longest Word in Dictionary','Medium','Trie','longest-word-in-dictionary',['Google','Amazon']),
  q(6,'Trie','Implement Magic Dictionary','Medium','Trie','implement-magic-dictionary',['Uber']),
  q(7,'Trie','Map Sum Pairs','Medium','Trie','map-sum-pairs',['Google']),
  q(8,'Trie','Concatenated Words','Hard','Trie + DP','concatenated-words',['Google','Amazon']),
  q(9,'Trie','Palindrome Pairs','Hard','Trie','palindrome-pairs',['Google','Airbnb']),
  q(10,'Trie','Index Pairs of a String','Easy','Trie','index-pairs-of-a-string',['Amazon']),
  q(11,'Trie','Camelcase Matching','Medium','Trie / String','camelcase-matching',['Google']),
  q(12,'Trie','Stream of Characters','Hard','Trie','stream-of-characters',['Google']),
  q(13,'Trie','Maximum XOR of Two Numbers (Trie)','Medium','Trie','maximum-xor-of-two-numbers-in-an-array',['Google','Amazon']),
  q(14,'Trie','Search Suggestions System','Medium','Trie','search-suggestions-system',['Amazon']),
  q(15,'Trie','Short Encoding of Words','Medium','Trie','short-encoding-of-words',['Amazon']),
  q(16,'Trie','Count Words With a Given Prefix','Easy','Trie','counting-words-with-a-given-prefix',['Amazon']),
  q(17,'Trie','Number of Distinct Substrings','Medium','Trie / Suffix Array','',[  'Google','Amazon']),
  q(18,'Trie','Word Squares','Hard','Trie','word-squares',['Google']),
  q(19,'Trie','Longest Common Prefix (Trie)','Easy','Trie','longest-common-prefix',['Amazon','Google']),
  q(20,'Trie','Design Search Autocomplete System','Hard','Trie','design-search-autocomplete-system',['Google','Amazon','Microsoft']),
];

// ── UNION FIND ────────────────────────────────────────────────────────────────
const UNION_FIND = [
  q(1,'Union Find','Number of Connected Components','Medium','Union Find','number-of-connected-components-in-an-undirected-graph',['Amazon','LinkedIn']),
  q(2,'Union Find','Redundant Connection','Medium','Union Find','redundant-connection',['Amazon','Google']),
  q(3,'Union Find','Accounts Merge','Medium','Union Find','accounts-merge',['Amazon','Facebook','Google']),
  q(4,'Union Find','Number of Islands (Union Find)','Medium','Union Find','number-of-islands',['Amazon','Google','Microsoft']),
  q(5,'Union Find','Friend Circles','Medium','Union Find','number-of-provinces',['Bloomberg','Amazon']),
  q(6,'Union Find','Satisfiability of Equality Equations','Medium','Union Find','satisfiability-of-equality-equations',['Amazon','Google']),
  q(7,'Union Find','Smallest String With Swaps','Medium','Union Find','smallest-string-with-swaps',['Amazon']),
  q(8,'Union Find','Remove Max Number of Edges','Hard','Union Find','remove-max-number-of-edges-to-keep-graph-fully-traversable',['Amazon','Google']),
  q(9,'Union Find','Optimize Water Distribution','Hard','Union Find','optimize-water-distribution-in-a-village',['Amazon']),
  q(10,'Union Find','Most Stones Removed with Same Row or Column','Medium','Union Find','most-stones-removed-with-same-row-or-column',['Google','Facebook']),
  q(11,'Union Find','Graph Valid Tree','Medium','Union Find','graph-valid-tree',['Google','LinkedIn']),
  q(12,'Union Find','Checking Existence of Edge Length Limited Paths','Hard','Union Find','checking-existence-of-edge-length-limited-paths',['Google']),
  q(13,'Union Find','Number of Operations to Make Network Connected','Medium','Union Find','number-of-operations-to-make-network-connected',['Amazon']),
  q(14,'Union Find','Minimize Malware Spread','Hard','Union Find','minimize-malware-spread',['Google']),
  q(15,'Union Find','Swim in Rising Water (Union Find)','Hard','Union Find','swim-in-rising-water',['Google']),
  q(16,'Union Find','Making a Large Island','Hard','Union Find','making-a-large-island',['Google']),
  q(17,'Union Find','Sentence Similarity II','Medium','Union Find','sentence-similarity-ii',['Google']),
  q(18,'Union Find','Evaluate Division (Union Find)','Medium','Union Find','evaluate-division',['Google','Amazon']),
  q(19,'Union Find','Regions Cut By Slashes','Medium','Union Find','regions-cut-by-slashes',['Google']),
  q(20,'Union Find','Find Critical and Pseudo-Critical Edges','Hard','Union Find + Kruskal','find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree',['Google']),
];

// ── SEGMENT TREE ──────────────────────────────────────────────────────────────
const SEGMENT_TREE = [
  q(1,'Segment Tree','Range Sum Query - Mutable','Medium','Segment Tree','range-sum-query-mutable',['Amazon','Google','Microsoft']),
  q(2,'Segment Tree','Range Minimum Query','Medium','Segment Tree','',[  'Amazon','Google']),
  q(3,'Segment Tree','Count of Range Sum','Hard','Segment Tree / BIT','count-of-range-sum',['Google']),
  q(4,'Segment Tree','Rectangle Area II','Hard','Segment Tree','rectangle-area-ii',['Google']),
  q(5,'Segment Tree','Falling Squares','Hard','Segment Tree','falling-squares',['Google']),
  q(6,'Segment Tree','Number of Longest Increasing Subsequence','Medium','Segment Tree / DP','number-of-longest-increasing-subsequence',['Google','Amazon']),
  q(7,'Segment Tree','My Calendar I','Medium','Segment Tree / Binary Search','my-calendar-i',['Google']),
  q(8,'Segment Tree','My Calendar II','Medium','Segment Tree','my-calendar-ii',['Google']),
  q(9,'Segment Tree','My Calendar III','Hard','Segment Tree','my-calendar-iii',['Google']),
  q(10,'Segment Tree','Range Sum Query 2D - Mutable','Hard','2D Segment Tree / BIT','range-sum-query-2d-mutable',['Google','Amazon']),
  q(11,'Segment Tree','Count of Smaller Numbers After Self','Hard','Segment Tree / BIT / Merge Sort','count-of-smaller-numbers-after-self',['Google','Amazon']),
  q(12,'Segment Tree','Reverse Pairs','Hard','Segment Tree / Merge Sort','reverse-pairs',['Google']),
  q(13,'Segment Tree','Maximum Sum of 3 Non-Overlapping Subarrays','Hard','DP','maximum-sum-of-3-non-overlapping-subarrays',['Google']),
  q(14,'Segment Tree','Max Sum of Rectangle No Larger Than K','Hard','Segment Tree + Binary Search','max-sum-of-rectangle-no-larger-than-k',['Google']),
  q(15,'Segment Tree','Interval List Intersections','Medium','Two Pointers','interval-list-intersections',['Google','Facebook']),
  q(16,'Segment Tree','Find Right Interval','Medium','Binary Search','find-right-interval',['Google']),
  q(17,'Segment Tree','Largest Rectangle in Histogram (Seg Tree)','Hard','Segment Tree / Stack','largest-rectangle-in-histogram',['Amazon','Google']),
  q(18,'Segment Tree','Minimum Interval to Include Each Query','Hard','Segment Tree + Sorting','minimum-interval-to-include-each-query',['Google']),
  q(19,'Segment Tree','Number of Visible People in a Queue','Hard','Monotonic Stack','number-of-visible-people-in-a-queue',['Google']),
  q(20,'Segment Tree','Sum of Distances in Tree','Hard','Tree DP / DFS','sum-of-distances-in-tree',['Google','Amazon']),
];

// ── TOPIC REGISTRY ────────────────────────────────────────────────────────────
export const DSA_TOPICS = {
  'Arrays':                 { icon: '📦', color: '#6366f1', colorBg: 'rgba(99,102,241,0.1)',   questions: ARRAYS },
  'Strings':                { icon: '🔤', color: '#10b981', colorBg: 'rgba(16,185,129,0.1)',   questions: STRINGS },
  'Linked List':            { icon: '🔗', color: '#f59e0b', colorBg: 'rgba(245,158,11,0.1)',   questions: LINKED_LIST },
  'Stack':                  { icon: '📚', color: '#ef4444', colorBg: 'rgba(239,68,68,0.1)',    questions: STACK },
  'Queue':                  { icon: '🚶', color: '#8b5cf6', colorBg: 'rgba(139,92,246,0.1)',   questions: QUEUE },
  'Binary Search':          { icon: '🔍', color: '#0ea5e9', colorBg: 'rgba(14,165,233,0.1)',   questions: BINARY_SEARCH },
  'Two Pointers':           { icon: '👆', color: '#ec4899', colorBg: 'rgba(236,72,153,0.1)',   questions: TWO_POINTERS },
  'Sliding Window':         { icon: '🪟', color: '#14b8a6', colorBg: 'rgba(20,184,166,0.1)',   questions: SLIDING_WINDOW },
  'Sorting':                { icon: '📊', color: '#f97316', colorBg: 'rgba(249,115,22,0.1)',   questions: SORTING },
  'Recursion & Backtracking':{ icon: '🔄', color: '#a855f7', colorBg: 'rgba(168,85,247,0.1)', questions: RECURSION },
  'Trees':                  { icon: '🌳', color: '#22c55e', colorBg: 'rgba(34,197,94,0.1)',   questions: TREES },
  'Binary Search Trees':    { icon: '🌲', color: '#16a34a', colorBg: 'rgba(22,163,74,0.1)',   questions: BST },
  'Heaps / Priority Queue': { icon: '⛰️',  color: '#ca8a04', colorBg: 'rgba(202,138,4,0.1)',   questions: HEAPS },
  'Graphs':                 { icon: '🕸️',  color: '#dc2626', colorBg: 'rgba(220,38,38,0.1)',   questions: GRAPHS },
  'Dynamic Programming':    { icon: '💎', color: '#2563eb', colorBg: 'rgba(37,99,235,0.1)',   questions: DP },
  'Greedy':                 { icon: '🤑', color: '#d97706', colorBg: 'rgba(217,119,6,0.1)',   questions: GREEDY },
  'Bit Manipulation':       { icon: '⚙️',  color: '#6b7280', colorBg: 'rgba(107,114,128,0.1)', questions: BIT_MANIPULATION },
  'Trie':                   { icon: '🌐', color: '#7c3aed', colorBg: 'rgba(124,58,237,0.1)',  questions: TRIE },
  'Union Find':             { icon: '🔗', color: '#0891b2', colorBg: 'rgba(8,145,178,0.1)',   questions: UNION_FIND },
  'Segment Tree':           { icon: '🏗️',  color: '#be185d', colorBg: 'rgba(190,24,93,0.1)',  questions: SEGMENT_TREE },
};

// Flat list of all questions
export const ALL_QUESTIONS = Object.values(DSA_TOPICS).flatMap(t => t.questions);

// All unique patterns
export const ALL_PATTERNS = ['All', ...new Set(ALL_QUESTIONS.map(q => q.pattern))].sort();

// All unique companies
export const ALL_COMPANIES = [...new Set(ALL_QUESTIONS.flatMap(q => q.companies))].sort();
