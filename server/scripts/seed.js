// Seed the War Room database with curated starter problems and screening questions.
// Run: node scripts/seed.js
// Safe to re-run — uses the model's save() which inserts new rows (does not duplicate due to different hashes not being a concern here;
// existing data is preserved).

const Problem = require("../models/Problem");
const Screening = require("../models/Screening");
// Ensure DB is initialized
require("../config/db");

// ─── STARTER PROBLEMS ────────────────────────────────────────

const PROBLEMS = [
  {
    platform: "LeetCode",
    language: "C#",
    category: "Two Pointers",
    difficulty: "Easy",
    data: {
      title: "Two Sum",
      difficulty: "Easy",
      platformNotes:
        "Related Topics: Array, Hash Table. This is LeetCode's most famous problem (#1). Interviewers expect instant recognition.",
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\nExample 1:\n  Input: nums = [2,7,11,15], target = 9\n  Output: [0,1]\n  Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n\nExample 2:\n  Input: nums = [3,2,4], target = 6\n  Output: [1,2]\n\nExample 3:\n  Input: nums = [3,3], target = 6\n  Output: [0,1]",
      constraints: [
        "2 ≤ nums.length ≤ 10^4",
        "-10^9 ≤ nums[i] ≤ 10^9",
        "-10^9 ≤ target ≤ 10^9",
        "Only one valid answer exists.",
      ],
      realWorldContext:
        "Finding matching pairs in datasets — payment reconciliation, order matching, duplicate detection.",
      ideSetup: [
        "Create a new C# console project or use LeetCode's online editor",
        "Define the Solution class with a TwoSum method",
        "Prepare test cases matching the examples above",
      ],
      thinkingProcess: [
        "What is the brute-force approach and why is it slow?",
        "Can I trade space for time using a lookup structure?",
        "What should I store in the hash map — the value or the index?",
        "Do I need to handle the case where the same element is used twice?",
      ],
      steps: [
        {
          step: 1,
          title: "Understand the brute force",
          explanation:
            "Two nested loops checking every pair — O(n²). Works but too slow for large inputs.",
          code: "// Brute force — O(n²)\nfor (int i = 0; i < nums.Length; i++)\n    for (int j = i + 1; j < nums.Length; j++)\n        if (nums[i] + nums[j] == target)\n            return new[] { i, j };",
        },
        {
          step: 2,
          title: "Use a dictionary for O(1) lookups",
          explanation:
            "As we iterate, store each number's index. For each number, check if (target - number) already exists in the dictionary.",
          code: "var map = new Dictionary<int, int>();\nforeach (var (num, i) in nums.Select((n, i) => (n, i)))\n{\n    int complement = target - num;\n    if (map.ContainsKey(complement))\n        return new[] { map[complement], i };\n    map[num] = i;\n}",
        },
        {
          step: 3,
          title: "Handle edge cases",
          explanation:
            "The problem guarantees one solution exists, so we don't need a not-found case. But we do need to make sure we don't match an element with itself — the dictionary-first approach handles this naturally since we check before inserting.",
          code: "// The order matters: check THEN insert\n// This prevents matching nums[i] with itself",
        },
        {
          step: 4,
          title: "Wire up and test",
          explanation:
            "Complete solution with the class wrapper LeetCode expects.",
          code: 'public class Solution {\n    public int[] TwoSum(int[] nums, int target) {\n        var map = new Dictionary<int, int>();\n        for (int i = 0; i < nums.Length; i++) {\n            int complement = target - nums[i];\n            if (map.ContainsKey(complement))\n                return new[] { map[complement], i };\n            map[nums[i]] = i;\n        }\n        throw new ArgumentException("No solution found");\n    }\n}',
        },
      ],
      fullSolution:
        'public class Solution {\n    public int[] TwoSum(int[] nums, int target) {\n        var map = new Dictionary<int, int>();\n        for (int i = 0; i < nums.Length; i++) {\n            int complement = target - nums[i];\n            if (map.ContainsKey(complement))\n                return new[] { map[complement], i };\n            map[nums[i]] = i;\n        }\n        throw new ArgumentException("No solution found");\n    }\n}',
      commonMistakes: [
        "Using two nested loops — works but O(n²), fails on large inputs",
        "Forgetting to check the complement BEFORE inserting the current number into the map (would match element with itself)",
        "Returning values instead of indices",
      ],
      complexity: {
        time: "O(n) — single pass through the array",
        space: "O(n) — dictionary stores up to n elements",
      },
      seniorTip:
        "This pattern — complement lookup in a hash map — appears everywhere. Master it once and you'll recognize it in dozens of problems.",
      hints: [
        "What data structure gives O(1) lookups?",
        "For each number, what value would you need to find to reach the target?",
        "Store numbers as you go — check if the complement already exists before adding the current number.",
      ],
    },
  },

  {
    platform: "Codility",
    language: "C#",
    category: "Arrays",
    difficulty: "Easy",
    data: {
      title: "CyclicRotation",
      difficulty: "Easy",
      platformNotes:
        "Codility Lesson 2. Scored on correctness (100%) only — no performance test for this task. Edge cases: empty array, single element, K > N.",
      description:
        "An array A consisting of N integers is given. Rotation of the array means that each element is shifted right by one index, and the last element is moved to the first position.\n\nWrite a function:\n\n  class Solution { public int[] solution(int[] A, int K); }\n\nthat, given an array A consisting of N integers and an integer K, returns the array A rotated K times.\n\nFor example, given A = [3, 8, 9, 7, 6] and K = 3, the function should return [9, 7, 6, 3, 8]. Three rotations were made:\n  [3, 8, 9, 7, 6] → [6, 3, 8, 9, 7]\n  [6, 3, 8, 9, 7] → [7, 6, 3, 8, 9]\n  [7, 6, 3, 8, 9] → [9, 7, 6, 3, 8]",
      constraints: [
        "N is an integer within the range [0..100]",
        "Each element of array A is an integer within the range [−1,000..1,000]",
        "K is an integer within the range [0..100]",
      ],
      realWorldContext:
        "Circular buffers in embedded systems, log rotation, round-robin scheduling.",
      ideSetup: [
        "Create a C# project with a Solution class",
        "Implement the solution method with int[] A, int K parameters",
        "Test with the provided example and edge cases (empty array, K=0, K>N)",
      ],
      thinkingProcess: [
        "What happens if K is larger than the array length?",
        "What if the array is empty or has one element?",
        "Can I do this in-place or do I need a new array?",
        "Is there a mathematical shortcut instead of rotating K times?",
      ],
      steps: [
        {
          step: 1,
          title: "Handle edge cases",
          explanation:
            "Empty array or K=0 means no rotation needed. Also, rotating N times returns the original — so use K % N.",
          code: "if (A.Length == 0 || K == 0) return A;\nint k = K % A.Length;\nif (k == 0) return A;",
        },
        {
          step: 2,
          title: "Calculate new positions",
          explanation:
            "Each element at index i moves to index (i + k) % N. Create a new array and place each element.",
          code: "int n = A.Length;\nint[] result = new int[n];\nfor (int i = 0; i < n; i++)\n    result[(i + k) % n] = A[i];",
        },
        {
          step: 3,
          title: "Alternative: Array slicing",
          explanation:
            "Split the array at position (N - k), swap the two halves.",
          code: "// Slice approach\nint splitAt = n - k;\nreturn A[splitAt..].Concat(A[..splitAt]).ToArray();",
        },
        {
          step: 4,
          title: "Wire up and test",
          explanation: "Complete solution matching Codility's expected format.",
          code: "class Solution {\n    public int[] solution(int[] A, int K) {\n        if (A.Length == 0 || K == 0) return A;\n        int k = K % A.Length;\n        if (k == 0) return A;\n        \n        int n = A.Length;\n        int[] result = new int[n];\n        for (int i = 0; i < n; i++)\n            result[(i + k) % n] = A[i];\n        return result;\n    }\n}",
        },
      ],
      fullSolution:
        "class Solution {\n    public int[] solution(int[] A, int K) {\n        if (A.Length == 0 || K == 0) return A;\n        int k = K % A.Length;\n        if (k == 0) return A;\n        \n        int n = A.Length;\n        int[] result = new int[n];\n        for (int i = 0; i < n; i++)\n            result[(i + k) % n] = A[i];\n        return result;\n    }\n}",
      commonMistakes: [
        "Not handling K > N — causes index out of bounds without the modulo",
        "Not handling empty arrays — A.Length == 0 would cause division by zero in K % A.Length",
        "Rotating one element at a time in a loop — works but unnecessarily slow",
      ],
      complexity: {
        time: "O(N) — single pass through the array",
        space: "O(N) — new array for the result",
      },
      seniorTip:
        "The modulo trick (K % N) appears in every circular/rotating problem. Internalize it — it's the first thing you should write.",
      hints: [
        "What operation handles wrap-around in circular structures?",
        "If K is 7 and N is 5, how many effective rotations happen?",
        "Place each element at (i + K) % N in a new array.",
      ],
    },
  },

  {
    platform: "LeetCode",
    language: "JavaScript",
    category: "Hash Maps",
    difficulty: "Medium",
    data: {
      title: "Group Anagrams",
      difficulty: "Medium",
      platformNotes:
        "Related Topics: Array, Hash Table, String, Sorting. Classic hash map grouping problem. Frequently asked at Google, Amazon, Facebook.",
      description:
        'Given an array of strings strs, group the anagrams together. You can return the answer in any order.\n\nAn anagram is a word formed by rearranging the letters of a different word, using all the original letters exactly once.\n\nExample 1:\n  Input: strs = ["eat","tea","tan","ate","nat","bat"]\n  Output: [["bat"],["nat","tan"],["ate","eat","tea"]]\n\nExample 2:\n  Input: strs = [""]\n  Output: [[""]]\n\nExample 3:\n  Input: strs = ["a"]\n  Output: [["a"]]',
      constraints: [
        "1 ≤ strs.length ≤ 10^4",
        "0 ≤ strs[i].length ≤ 100",
        "strs[i] consists of lowercase English letters",
      ],
      realWorldContext:
        "Text analysis, duplicate detection in search engines, spell-checker suggestions, plagiarism detection.",
      ideSetup: [
        "Open your JS environment or LeetCode editor",
        "Create the groupAnagrams function",
        "Test with all three examples, paying attention to the empty string case",
      ],
      thinkingProcess: [
        "How can I determine if two strings are anagrams?",
        "What should I use as the hash map key?",
        "Sorting each string gives a canonical form — is that efficient enough?",
        "Is there a way to create a key without sorting?",
      ],
      steps: [
        {
          step: 1,
          title: "Choose a key strategy",
          explanation:
            'Anagrams have the same letters. Sorting each string creates a canonical key: "eat" → "aet", "tea" → "aet". Same key = same group.',
          code: '// "eat" sorted → "aet"\n// "tea" sorted → "aet"\n// Same key → same anagram group',
        },
        {
          step: 2,
          title: "Build the map",
          explanation:
            "Use a Map where key = sorted string, value = array of original strings.",
          code: 'const map = new Map();\nfor (const str of strs) {\n  const key = str.split("").sort().join("");\n  if (!map.has(key)) map.set(key, []);\n  map.get(key).push(str);\n}',
        },
        {
          step: 3,
          title: "Return the groups",
          explanation: "The map values are our answer.",
          code: "return [...map.values()];",
        },
        {
          step: 4,
          title: "Wire up and test",
          explanation: "Full solution in LeetCode format.",
          code: 'var groupAnagrams = function(strs) {\n  const map = new Map();\n  for (const str of strs) {\n    const key = str.split("").sort().join("");\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(str);\n  }\n  return [...map.values()];\n};',
        },
      ],
      fullSolution:
        'var groupAnagrams = function(strs) {\n  const map = new Map();\n  for (const str of strs) {\n    const key = str.split("").sort().join("");\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(str);\n  }\n  return [...map.values()];\n};',
      commonMistakes: [
        "Using the string itself as a key instead of sorting it first",
        "Using an Object instead of Map — objects coerce keys to strings which works here but Map is cleaner",
        "Forgetting that empty strings are valid anagrams of each other",
      ],
      complexity: {
        time: "O(n · k log k) — n strings, each of length k is sorted",
        space: "O(n · k) — storing all strings in the map",
      },
      seniorTip:
        "For an O(n·k) solution, use character frequency as the key instead of sorting: count occurrences of each letter and use that as a string key.",
      hints: [
        "What do all anagrams share?",
        "If you rearranged the letters of each word into alphabetical order, what would happen?",
        "Use sorted strings as keys in a hash map to group anagrams together.",
      ],
    },
  },

  {
    platform: "TestDome",
    language: "C#",
    category: "LINQ",
    difficulty: "Medium",
    data: {
      title: "Product Filter Pipeline",
      difficulty: "Medium",
      platformNotes:
        "TestDome awards partial credit: Task 1 (basic filter) = 40%, Task 2 (sorting) = 30%, Task 3 (projection) = 30%. Time limit: 15 minutes.",
      description:
        "A company's inventory system needs a product filtering pipeline. Given the following Product class and starter code:\n\npublic class Product\n{\n    public int Id { get; set; }\n    public string Name { get; set; }\n    public string Category { get; set; }\n    public decimal Price { get; set; }\n    public bool InStock { get; set; }\n}\n\nImplement the ProductFilter class:\n\nTask 1: FilterByCategory — return in-stock products in the given category\nTask 2: GetTopExpensive — return the top N most expensive products, sorted by price descending\nTask 3: GetSummary — return an anonymous object for each category with { Category, Count, AveragePrice }",
      constraints: [
        "Products list will have 0 to 10,000 items",
        "Category names are case-sensitive",
        "Prices are positive decimals",
        "N for GetTopExpensive will be between 0 and list size",
      ],
      realWorldContext:
        "Every e-commerce backend has product filtering. This tests daily-use LINQ — not exotic edge cases.",
      ideSetup: [
        "Create a C# project with the Product class",
        "Create the ProductFilter class with three methods",
        "Write unit tests for each task — test empty lists and edge cases",
      ],
      thinkingProcess: [
        "Which LINQ methods do I need: Where, OrderBy, Take, Select, GroupBy?",
        "Should these return IEnumerable<T> or List<T>?",
        "How do I handle an empty product list?",
        "For the summary, how do I project into anonymous types?",
      ],
      steps: [
        {
          step: 1,
          title: "FilterByCategory",
          explanation:
            "Chain Where clauses for category match AND in-stock status.",
          code: "public static IEnumerable<Product> FilterByCategory(\n    IEnumerable<Product> products, string category)\n{\n    return products\n        .Where(p => p.Category == category && p.InStock);\n}",
        },
        {
          step: 2,
          title: "GetTopExpensive",
          explanation: "OrderByDescending on Price, then Take N.",
          code: "public static IEnumerable<Product> GetTopExpensive(\n    IEnumerable<Product> products, int n)\n{\n    return products\n        .OrderByDescending(p => p.Price)\n        .Take(n);\n}",
        },
        {
          step: 3,
          title: "GetSummary",
          explanation:
            "GroupBy category, then project each group into a summary object.",
          code: "public static IEnumerable<object> GetSummary(\n    IEnumerable<Product> products)\n{\n    return products\n        .GroupBy(p => p.Category)\n        .Select(g => new {\n            Category = g.Key,\n            Count = g.Count(),\n            AveragePrice = g.Average(p => p.Price)\n        });\n}",
        },
        {
          step: 4,
          title: "Wire up and test",
          explanation: "Full class matching TestDome's expected format.",
          code: "public class ProductFilter\n{\n    public static IEnumerable<Product> FilterByCategory(\n        IEnumerable<Product> products, string category)\n    {\n        return products.Where(p => p.Category == category && p.InStock);\n    }\n\n    public static IEnumerable<Product> GetTopExpensive(\n        IEnumerable<Product> products, int n)\n    {\n        return products.OrderByDescending(p => p.Price).Take(n);\n    }\n\n    public static IEnumerable<object> GetSummary(\n        IEnumerable<Product> products)\n    {\n        return products.GroupBy(p => p.Category)\n            .Select(g => new {\n                Category = g.Key,\n                Count = g.Count(),\n                AveragePrice = g.Average(p => p.Price)\n            });\n    }\n}",
        },
      ],
      fullSolution:
        "public class ProductFilter\n{\n    public static IEnumerable<Product> FilterByCategory(\n        IEnumerable<Product> products, string category)\n    {\n        return products.Where(p => p.Category == category && p.InStock);\n    }\n\n    public static IEnumerable<Product> GetTopExpensive(\n        IEnumerable<Product> products, int n)\n    {\n        return products.OrderByDescending(p => p.Price).Take(n);\n    }\n\n    public static IEnumerable<object> GetSummary(\n        IEnumerable<Product> products)\n    {\n        return products.GroupBy(p => p.Category)\n            .Select(g => new {\n                Category = g.Key,\n                Count = g.Count(),\n                AveragePrice = g.Average(p => p.Price)\n            });\n    }\n}",
      commonMistakes: [
        "Using ToList() inside the chain unnecessarily — breaks deferred execution and wastes memory",
        "Forgetting && p.InStock in FilterByCategory — would return out-of-stock items",
        "Using Average() on an empty group — throws exception, should handle gracefully",
      ],
      complexity: {
        time: "O(n) for filter, O(n log n) for sort, O(n) for grouping",
        space: "O(n) — LINQ creates new sequences but defers execution",
      },
      seniorTip:
        "In real code, return IEnumerable not List — let the caller decide when to materialize. This preserves deferred execution and composes with other LINQ.",
      hints: [
        "LINQ Where, OrderByDescending, and GroupBy are the three key methods here.",
        "For the summary, GroupBy gives you groups — each group has a Key (category) and elements to aggregate.",
        "Use Select to project each group into new { Category, Count, AveragePrice }.",
      ],
    },
  },

  {
    platform: "Codility",
    language: "JavaScript",
    category: "Prefix Sums",
    difficulty: "Medium",
    data: {
      title: "GenomicRangeQuery",
      difficulty: "Medium",
      platformNotes:
        "Codility Lesson 5 — Prefix Sums. Scored on correctness (100%) + performance (100%). O(N+M) expected. A common trap: naive approach gives O(N*M) which fails performance tests.",
      description:
        'A DNA sequence can be represented as a string consisting of the letters A, C, G and T, which correspond to the types of successive nucleotides. Each nucleotide has an impact factor: A=1, C=2, G=3, T=4.\n\nWrite a function:\n\n  function solution(S, P, Q)\n\nthat, given a non-empty string S consisting of N characters and two non-empty arrays P and Q consisting of M integers, returns an array consisting of M integers specifying the answers to the genomic range queries.\n\nResult array should contain the minimal impact factor of nucleotides contained in the part of the genomic sequence from position P[i] to Q[i] (inclusive).\n\nFor example, given S = "CAGCCTA", P = [2, 5, 0], Q = [4, 5, 6]:\n  Query 0: S[2..4] = "GCC" → minimal impact = 2 (C)\n  Query 1: S[5..5] = "T" → minimal impact = 4 (T)\n  Query 2: S[0..6] = "CAGCCTA" → minimal impact = 1 (A)\n  Answer: [2, 4, 1]',
      constraints: [
        "N is an integer within the range [1..100,000]",
        "M is an integer within the range [1..50,000]",
        "Each element of arrays P, Q is an integer within the range [0..N−1]",
        "P[i] ≤ Q[i]",
        "S consists only of upper-case English letters A, C, G, T",
      ],
      realWorldContext:
        "Bioinformatics DNA analysis, range queries in databases, segment statistics in time-series data.",
      ideSetup: [
        "Create a JavaScript file with the solution function",
        "Set up the example: S = 'CAGCCTA', P = [2,5,0], Q = [4,5,6]",
        "Verify output is [2, 4, 1]",
      ],
      thinkingProcess: [
        "The naive approach scans P[i] to Q[i] for each query — what's the time complexity?",
        "Can prefix sums help me answer range queries in O(1)?",
        "What should I build prefix sums for — impact factors or nucleotide occurrences?",
        "If I know how many A's exist before position i, can I determine if A appears in range [P, Q]?",
      ],
      steps: [
        {
          step: 1,
          title: "Build prefix occurrence arrays",
          explanation:
            "For each nucleotide (A, C, G, T), build a prefix sum counting occurrences up to each position. This lets us check if a nucleotide exists in any range in O(1).",
          code: "const n = S.length;\nconst prefix = { A: new Array(n+1).fill(0), C: new Array(n+1).fill(0), G: new Array(n+1).fill(0), T: new Array(n+1).fill(0) };\nfor (let i = 0; i < n; i++) {\n  prefix.A[i+1] = prefix.A[i] + (S[i] === 'A' ? 1 : 0);\n  prefix.C[i+1] = prefix.C[i] + (S[i] === 'C' ? 1 : 0);\n  prefix.G[i+1] = prefix.G[i] + (S[i] === 'G' ? 1 : 0);\n  prefix.T[i+1] = prefix.T[i] + (S[i] === 'T' ? 1 : 0);\n}",
        },
        {
          step: 2,
          title: "Answer queries using prefix differences",
          explanation:
            "For range [P, Q], check if A exists (prefix.A[Q+1] - prefix.A[P] > 0). If yes, minimum is 1. If not, check C (minimum 2), then G (3), else T (4).",
          code: "const result = [];\nfor (let i = 0; i < P.length; i++) {\n  const from = P[i], to = Q[i];\n  if (prefix.A[to+1] - prefix.A[from] > 0) result.push(1);\n  else if (prefix.C[to+1] - prefix.C[from] > 0) result.push(2);\n  else if (prefix.G[to+1] - prefix.G[from] > 0) result.push(3);\n  else result.push(4);\n}",
        },
        {
          step: 3,
          title: "Check correctness",
          explanation: "Walk through the example to verify.",
          code: "// S = 'CAGCCTA'\n// prefix.A = [0,0,1,1,1,1,1,2] — A appears at index 1 and 6\n// Query [2,4]: prefix.A[5]-prefix.A[2] = 1-1 = 0 (no A)\n//              prefix.C[5]-prefix.C[2] = 3-1 = 2 (C exists!) → answer: 2 ✓",
        },
        {
          step: 4,
          title: "Wire up and test",
          explanation:
            "Complete solution matching Codility's function signature.",
          code: "function solution(S, P, Q) {\n  const n = S.length;\n  const pA = new Array(n+1).fill(0);\n  const pC = new Array(n+1).fill(0);\n  const pG = new Array(n+1).fill(0);\n  \n  for (let i = 0; i < n; i++) {\n    pA[i+1] = pA[i] + (S[i] === 'A' ? 1 : 0);\n    pC[i+1] = pC[i] + (S[i] === 'C' ? 1 : 0);\n    pG[i+1] = pG[i] + (S[i] === 'G' ? 1 : 0);\n  }\n  \n  const result = [];\n  for (let i = 0; i < P.length; i++) {\n    const f = P[i], t = Q[i];\n    if (pA[t+1] - pA[f] > 0) result.push(1);\n    else if (pC[t+1] - pC[f] > 0) result.push(2);\n    else if (pG[t+1] - pG[f] > 0) result.push(3);\n    else result.push(4);\n  }\n  return result;\n}",
        },
      ],
      fullSolution:
        "function solution(S, P, Q) {\n  const n = S.length;\n  const pA = new Array(n+1).fill(0);\n  const pC = new Array(n+1).fill(0);\n  const pG = new Array(n+1).fill(0);\n  \n  for (let i = 0; i < n; i++) {\n    pA[i+1] = pA[i] + (S[i] === 'A' ? 1 : 0);\n    pC[i+1] = pC[i] + (S[i] === 'C' ? 1 : 0);\n    pG[i+1] = pG[i] + (S[i] === 'G' ? 1 : 0);\n  }\n  \n  const result = [];\n  for (let i = 0; i < P.length; i++) {\n    const f = P[i], t = Q[i];\n    if (pA[t+1] - pA[f] > 0) result.push(1);\n    else if (pC[t+1] - pC[f] > 0) result.push(2);\n    else if (pG[t+1] - pG[f] > 0) result.push(3);\n    else result.push(4);\n  }\n  return result;\n}",
      commonMistakes: [
        "Scanning each range character by character — O(N*M), fails Codility performance tests",
        "Off-by-one error in prefix sums — remember prefix[i] counts up to but not including position i",
        "Only building a prefix sum for impact factors instead of per-nucleotide — can't determine which nucleotide has the minimum",
      ],
      complexity: {
        time: "O(N + M) — one pass to build prefixes, one pass to answer queries",
        space: "O(N) — three prefix arrays of length N+1",
      },
      seniorTip:
        "Prefix sums are underrated. Any time you have range queries on static data — counts, sums, existence checks — prefix sums give you O(1) per query after O(N) preprocessing.",
      hints: [
        "You need to answer range queries fast. What preprocessing technique works for range queries?",
        "Build prefix sums not for one thing, but for each nucleotide separately.",
        "Check nucleotides in order of impact (A=1, C=2, G=3) — the first one that exists in the range is your answer.",
      ],
    },
  },

  {
    platform: "HackerRank",
    language: "C#",
    category: "Implementation",
    difficulty: "Easy",
    data: {
      title: "Staircase",
      difficulty: "Easy",
      platformNotes:
        "HackerRank Warmup challenge. Tests basic loop control and string formatting. Common in 30 Days of Code.",
      description:
        "Consider a staircase of size n:\n\n       #\n      ##\n     ###\n    ####\n\nObserve that its base and height are both equal to n, and the image is drawn using # symbols and spaces. The last line is not preceded by any spaces.\n\nInput Format:\nA single integer, n, denoting the size of the staircase.\n\nConstraints:\n0 < n ≤ 100\n\nOutput Format:\nPrint a staircase of size n using # symbols and spaces.\n\nNote: The last line must have 0 spaces.\n\nSample Input:\n6\n\nSample Output:\n     #\n    ##\n   ###\n  ####\n #####\n######\n\nExplanation:\nThe staircase is right-aligned, composed of # symbols and spaces, and has a height and width of n = 6.",
      constraints: ["0 < n ≤ 100"],
      realWorldContext:
        "Text formatting, CLI output alignment, report generation with dynamic widths.",
      ideSetup: [
        "Create a C# console application",
        "Read n from stdin using Console.ReadLine()",
        "Print n lines, each right-aligned with # symbols",
      ],
      thinkingProcess: [
        "How many spaces and how many # symbols per line?",
        "Line i has (n - i) spaces and i hashes — or is it the other way?",
        "Should I build strings or use PadLeft?",
        "Am I printing or returning? (HackerRank wants stdout)",
      ],
      steps: [
        {
          step: 1,
          title: "Identify the pattern",
          explanation:
            "Line i (1-indexed): (n - i) spaces followed by i hash symbols.",
          code: "// n = 4:\n// Line 1:    #  → 3 spaces, 1 hash\n// Line 2:   ##  → 2 spaces, 2 hashes\n// Line 3:  ###  → 1 space,  3 hashes\n// Line 4: ####  → 0 spaces, 4 hashes",
        },
        {
          step: 2,
          title: "Build with string constructors",
          explanation:
            "Use new string(' ', count) and new string('#', count) for clean construction.",
          code: "for (int i = 1; i <= n; i++)\n{\n    string spaces = new string(' ', n - i);\n    string hashes = new string('#', i);\n    Console.WriteLine(spaces + hashes);\n}",
        },
        {
          step: 3,
          title: "Alternative: PadLeft",
          explanation: "Even shorter — PadLeft adds leading characters.",
          code: "for (int i = 1; i <= n; i++)\n    Console.WriteLine(new string('#', i).PadLeft(n));",
        },
        {
          step: 4,
          title: "Wire up and test",
          explanation: "Full solution with stdin reading for HackerRank.",
          code: "using System;\n\nclass Solution {\n    static void Main(string[] args) {\n        int n = Convert.ToInt32(Console.ReadLine().Trim());\n        for (int i = 1; i <= n; i++)\n            Console.WriteLine(new string('#', i).PadLeft(n));\n    }\n}",
        },
      ],
      fullSolution:
        "using System;\n\nclass Solution {\n    static void Main(string[] args) {\n        int n = Convert.ToInt32(Console.ReadLine().Trim());\n        for (int i = 1; i <= n; i++)\n            Console.WriteLine(new string('#', i).PadLeft(n));\n    }\n}",
      commonMistakes: [
        "Using spaces after the # symbols — HackerRank checkers are strict about trailing spaces",
        "Forgetting the .Trim() on ReadLine — some inputs have trailing whitespace",
        "Starting loop at 0 instead of 1 — gives an empty first line",
      ],
      complexity: {
        time: "O(n²) — n lines, each up to n characters",
        space: "O(n) — one string of length n at a time",
      },
      seniorTip:
        "PadLeft/PadRight are your best friends for text alignment. In real code, use them for CLI tables, log formatting, and report generation.",
      hints: [
        "Each line has a fixed total width of n characters.",
        "Left-side characters are spaces, right-side characters are #.",
        "Check out C#'s PadLeft method.",
      ],
    },
  },

  {
    platform: "Codewars",
    language: "JavaScript",
    category: "Fundamentals",
    difficulty: "Easy",
    data: {
      title: "Disemvowel Trolls",
      difficulty: "Easy",
      platformNotes:
        "This is a 7 kyu kata. Tags: Fundamentals, Strings, Regex. A popular beginner kata with 100k+ completions. Tests basic string manipulation.",
      description:
        "Trolls are attacking your comment section!\n\nA common way to deal with this situation is to remove all of the vowels from the trolls' comments, neutralising the threat.\n\nYour task is to write a function that takes a string and returns a new string with all vowels removed.\n\nFor example, the string \"This website is for losers LOL!\" would become \"Ths wbst s fr lsrs LL!\".\n\nNote: For this kata, y is not considered a vowel.\n\nTest.assertEquals(disemvowel('This website is for losers LOL!'), 'Ths wbst s fr lsrs LL!');\nTest.assertEquals(disemvowel('No vowels'), 'N vwls');\nTest.assertEquals(disemvowel('aeiou'), '');",
      constraints: [
        "Input will be a valid string",
        "Handle both uppercase and lowercase vowels (a, e, i, o, u)",
        "y is NOT a vowel",
        "Non-letter characters should be preserved",
      ],
      realWorldContext:
        "Content moderation, text sanitization, basic NLP preprocessing, custom text filters.",
      ideSetup: [
        "Create a disemvowel function in your JS file",
        "Run the three test assertions above",
        "Try edge cases: empty string, all vowels, no vowels",
      ],
      thinkingProcess: [
        "What characters count as vowels? (a, e, i, o, u — both cases)",
        "Replace or filter — which is simpler?",
        "Can regex handle this in one line?",
        "What about the empty string case?",
      ],
      steps: [
        {
          step: 1,
          title: "Regex approach (cleanest)",
          explanation:
            "Use a regex character class [aeiou] with the global (g) and case-insensitive (i) flags. Replace all matches with empty string.",
          code: "function disemvowel(str) {\n  return str.replace(/[aeiou]/gi, '');\n}",
        },
        {
          step: 2,
          title: "Filter approach (functional)",
          explanation:
            "Split into characters, filter out vowels, join back. More verbose but shows functional thinking.",
          code: "function disemvowel(str) {\n  return str.split('').filter(c => !'aeiouAEIOU'.includes(c)).join('');\n}",
        },
        {
          step: 3,
          title: "Loop approach (explicit)",
          explanation: "Build the result character by character.",
          code: "function disemvowel(str) {\n  const vowels = 'aeiouAEIOU';\n  let result = '';\n  for (const c of str) {\n    if (!vowels.includes(c)) result += c;\n  }\n  return result;\n}",
        },
        {
          step: 4,
          title: "Wire up and test",
          explanation: "The regex version is the most idiomatic JavaScript.",
          code: "function disemvowel(str) {\n  return str.replace(/[aeiou]/gi, '');\n}\n\n// Tests\nconsole.log(disemvowel('This website is for losers LOL!')); // 'Ths wbst s fr lsrs LL!'\nconsole.log(disemvowel('No vowels')); // 'N vwls'\nconsole.log(disemvowel('aeiou')); // ''",
        },
      ],
      fullSolution:
        "function disemvowel(str) {\n  return str.replace(/[aeiou]/gi, '');\n}",
      commonMistakes: [
        "Forgetting the 'i' flag — would miss uppercase vowels",
        "Forgetting the 'g' flag — would only remove the first vowel",
        "Including 'y' as a vowel — the kata explicitly excludes it",
      ],
      complexity: {
        time: "O(n) — single pass through the string",
        space: "O(n) — new string created",
      },
      seniorTip:
        "Regex is the right tool for character-class operations. Learn the flags: g (global), i (case-insensitive), m (multiline). They solve 80% of string manipulation tasks in one line.",
      hints: [
        "You need to remove specific characters from a string. What JS method removes matches?",
        "Regular expressions can match multiple characters at once with character classes [...].",
        "Don't forget: vowels can be uppercase too. There's a regex flag for that.",
      ],
    },
  },

  {
    platform: "CodeSignal",
    language: "JavaScript",
    category: "Arrays",
    difficulty: "Easy",
    data: {
      title: "firstDuplicate",
      difficulty: "Easy",
      platformNotes:
        "CodeSignal Arcade — Intro challenge. Guaranteed constraints: 1 ≤ a.length ≤ 10^5, 1 ≤ a[i] ≤ a.length. This constraint is key to the O(1) space solution.",
      description:
        "Given an array a that contains only numbers in the range from 1 to a.length, find the first duplicate number for which the second occurrence has the minimal index. In other words, if there are more than 1 duplicated numbers, return the number for which the second occurrence has a smaller index than the second occurrence of the other number. If there are no such elements, return -1.\n\n[input] array.integer a\n  Guaranteed constraints:\n  1 ≤ a.length ≤ 10^5,\n  1 ≤ a[i] ≤ a.length.\n\n[output] integer\n  The element in a that occurs in the array more than once and has the minimal index for its second occurrence. If there are no such elements, return -1.",
      constraints: ["1 ≤ a.length ≤ 10^5", "1 ≤ a[i] ≤ a.length"],
      realWorldContext:
        "Detecting duplicate entries in data imports, finding the first repeated log entry, collision detection.",
      ideSetup: [
        "Create the firstDuplicate function",
        "Test: firstDuplicate([2, 1, 3, 5, 3, 2]) → 3 (not 2, because 3's second occurrence is at index 4, before 2's at index 5)",
        "Test: firstDuplicate([1, 2, 3]) → -1",
      ],
      thinkingProcess: [
        "The naive approach uses a Set — what's the time/space complexity?",
        "The constraint says a[i] ≤ a.length — can I use the array itself as a hash map?",
        "If I negate elements at index a[i]-1, a negative value means I've seen it before.",
        "Is modifying the input array acceptable?",
      ],
      steps: [
        {
          step: 1,
          title: "Set-based approach (O(n) space)",
          explanation:
            "Track seen numbers in a Set. First duplicate is the first element already in the Set.",
          code: "function firstDuplicate(a) {\n  const seen = new Set();\n  for (const num of a) {\n    if (seen.has(num)) return num;\n    seen.add(num);\n  }\n  return -1;\n}",
        },
        {
          step: 2,
          title: "O(1) space trick using negation",
          explanation:
            "Since values are in [1, N], use the value as an index. Mark visited by negating a[val-1]. If it's already negative, we found a duplicate.",
          code: "function firstDuplicate(a) {\n  for (let i = 0; i < a.length; i++) {\n    const idx = Math.abs(a[i]) - 1;\n    if (a[idx] < 0) return Math.abs(a[i]);\n    a[idx] = -a[idx];\n  }\n  return -1;\n}",
        },
        {
          step: 3,
          title: "Verify with example",
          explanation:
            "Walk through [2, 1, 3, 5, 3, 2] to confirm correctness.",
          code: "// a = [2, 1, 3, 5, 3, 2]\n// i=0: val=2, check a[1]=1 (positive), negate → a=[2,-1,3,5,3,2]\n// i=1: val=1, check a[0]=2 (positive), negate → a=[-2,-1,3,5,3,2]\n// i=2: val=3, check a[2]=3 (positive), negate → a=[-2,-1,-3,5,3,2]\n// i=3: val=5, check a[4]=3 (positive), negate → a=[-2,-1,-3,5,-3,2]\n// i=4: val=3, check a[2]=-3 (NEGATIVE!) → return 3 ✓",
        },
        {
          step: 4,
          title: "Wire up and test",
          explanation:
            "Both solutions work; the O(1) space version impresses interviewers.",
          code: "function firstDuplicate(a) {\n  for (let i = 0; i < a.length; i++) {\n    const idx = Math.abs(a[i]) - 1;\n    if (a[idx] < 0) return Math.abs(a[i]);\n    a[idx] = -a[idx];\n  }\n  return -1;\n}",
        },
      ],
      fullSolution:
        "function firstDuplicate(a) {\n  for (let i = 0; i < a.length; i++) {\n    const idx = Math.abs(a[i]) - 1;\n    if (a[idx] < 0) return Math.abs(a[i]);\n    a[idx] = -a[idx];\n  }\n  return -1;\n}",
      commonMistakes: [
        "Returning the LAST duplicate instead of the first — iterate forward and return immediately on first hit",
        "Using indexOf in a loop — O(n²), too slow for 10^5 elements",
        "Forgetting Math.abs when reading values — after negation, a[i] can be negative",
      ],
      complexity: {
        time: "O(n) — single pass",
        space:
          "O(1) — modifies input array in place (or O(n) with Set approach)",
      },
      seniorTip:
        "When values are bounded by array length, you can always use the array itself as a hash map via index manipulation. This pattern gives O(1) space for free.",
      hints: [
        "Keep track of which numbers you've seen. What data structure is ideal for 'have I seen this?'",
        "The values are between 1 and N (array length). Can you use the array itself to mark visited elements?",
        "Negate the element at index (value - 1). If you find a negative value, you've seen that number before.",
      ],
    },
  },

  {
    platform: "LeetCode",
    language: "C#",
    category: "Binary Search",
    difficulty: "Medium",
    data: {
      title: "Search in Rotated Sorted Array",
      difficulty: "Medium",
      platformNotes:
        "Related Topics: Array, Binary Search. LeetCode #33. Asked frequently at Amazon, Microsoft, Facebook. Follow-up: What if duplicates are allowed?",
      description:
        "There is an integer array nums sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 ≤ k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed).\n\nGiven the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.\n\nYou must write an algorithm with O(log n) runtime complexity.\n\nExample 1:\n  Input: nums = [4,5,6,7,0,1,2], target = 0\n  Output: 4\n\nExample 2:\n  Input: nums = [4,5,6,7,0,1,2], target = 3\n  Output: -1\n\nExample 3:\n  Input: nums = [1], target = 0\n  Output: -1",
      constraints: [
        "1 ≤ nums.length ≤ 5000",
        "-10^4 ≤ nums[i] ≤ 10^4",
        "All values of nums are unique",
        "nums is an ascending array that is possibly rotated",
        "-10^4 ≤ target ≤ 10^4",
      ],
      realWorldContext:
        "Binary search in rotated data — circular buffers, log files that wrap around, time-series data with date rollover.",
      ideSetup: [
        "Create the Solution class with Search method",
        "Set up the three test cases above",
        "Debug with breakpoints to visualize the binary search narrowing",
      ],
      thinkingProcess: [
        "Standard binary search needs a sorted array. How does rotation affect this?",
        "At any mid point, one half is guaranteed to be sorted. Which one?",
        "How do I decide which half to search — check if target falls within the sorted half?",
        "What are the edge cases: single element, not rotated, target is the pivot?",
      ],
      steps: [
        {
          step: 1,
          title: "Identify the sorted half",
          explanation:
            "In a rotated sorted array, when you pick mid, either the left half [left..mid] or right half [mid..right] is sorted. Compare nums[left] with nums[mid] to determine which.",
          code: "// If nums[left] <= nums[mid], left half is sorted\n// Otherwise, right half is sorted",
        },
        {
          step: 2,
          title: "Decide which half to search",
          explanation:
            "If the left half is sorted AND target falls within [left..mid], search left. Otherwise search right. Same logic flipped for sorted right half.",
          code: "if (nums[left] <= nums[mid]) {\n    // Left is sorted\n    if (target >= nums[left] && target < nums[mid])\n        right = mid - 1;  // target in sorted left\n    else\n        left = mid + 1;   // target in unsorted right\n} else {\n    // Right is sorted\n    if (target > nums[mid] && target <= nums[right])\n        left = mid + 1;   // target in sorted right\n    else\n        right = mid - 1;  // target in unsorted left\n}",
        },
        {
          step: 3,
          title: "Handle the found case",
          explanation: "If nums[mid] == target, return mid.",
          code: "if (nums[mid] == target) return mid;",
        },
        {
          step: 4,
          title: "Wire up and test",
          explanation: "Full solution with LeetCode's class Solution wrapper.",
          code: "public class Solution {\n    public int Search(int[] nums, int target) {\n        int left = 0, right = nums.Length - 1;\n        \n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            \n            if (nums[mid] == target) return mid;\n            \n            if (nums[left] <= nums[mid]) {\n                if (target >= nums[left] && target < nums[mid])\n                    right = mid - 1;\n                else\n                    left = mid + 1;\n            } else {\n                if (target > nums[mid] && target <= nums[right])\n                    left = mid + 1;\n                else\n                    right = mid - 1;\n            }\n        }\n        \n        return -1;\n    }\n}",
        },
      ],
      fullSolution:
        "public class Solution {\n    public int Search(int[] nums, int target) {\n        int left = 0, right = nums.Length - 1;\n        \n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            \n            if (nums[mid] == target) return mid;\n            \n            if (nums[left] <= nums[mid]) {\n                if (target >= nums[left] && target < nums[mid])\n                    right = mid - 1;\n                else\n                    left = mid + 1;\n            } else {\n                if (target > nums[mid] && target <= nums[right])\n                    left = mid + 1;\n                else\n                    right = mid - 1;\n            }\n        }\n        \n        return -1;\n    }\n}",
      commonMistakes: [
        "Using (left + right) / 2 for mid — can overflow. Use left + (right - left) / 2 instead.",
        "Getting the boundary conditions wrong: >= vs > matters. Draw it out.",
        "Forgetting that the array might not be rotated at all (already sorted) — the algorithm handles this naturally.",
      ],
      complexity: {
        time: "O(log n) — binary search halves the search space each iteration",
        space: "O(1) — only uses a few variables",
      },
      seniorTip:
        "The key insight: in a rotated sorted array, at least one half is ALWAYS sorted. This is what makes modified binary search possible. This pattern extends to finding minimums, duplicates, and rotation counts.",
      hints: [
        "Binary search still works, but you need to figure out which half is sorted.",
        "Compare nums[left] with nums[mid] — if left ≤ mid, the left half is sorted.",
        "Check if target falls within the sorted half's range. If yes, search there. If no, search the other half.",
      ],
    },
  },
];

// ─── STARTER SCREENING QUESTIONS ──────────────────────────────

const SCREENINGS = [
  {
    category: "C# / .NET",
    topic: "Dependency Injection",
    type: "concept",
    difficulty: "Medium",
    data: {
      title: "Dependency Injection Lifetimes",
      type: "concept",
      difficulty: "Medium",
      category: "C# / .NET",
      question:
        "In ASP.NET Core's built-in dependency injection container, explain the difference between Transient, Scoped, and Singleton lifetimes. When would you use each one, and what happens if you inject a Scoped service into a Singleton?",
      context:
        "Every ASP.NET Core application uses DI. Getting lifetimes wrong causes subtle bugs — memory leaks, stale data, or unexpected sharing between requests. This is one of the top-5 .NET interview questions.",
      codeSnippet: "",
      answer: {
        summary:
          "Transient creates a new instance every time it's requested. Scoped creates one instance per HTTP request. Singleton creates one instance for the entire application lifetime. Injecting Scoped into Singleton causes the Scoped service to behave as a Singleton (captive dependency) — it never gets disposed, leading to stale data and potential memory leaks.",
        detailed:
          "Think of it like coffee orders at a restaurant:\n\n• TRANSIENT = every time someone asks for coffee, brew a fresh cup. Different person at the same table? Fresh cup. Same person asks twice? Fresh cup. Use for: lightweight, stateless services like validators or formatters.\n\n• SCOPED = one pot of coffee per table (per request). Everyone at that table shares the same pot. Different table = different pot. Use for: DbContext (EF Core), Unit of Work, anything that should be shared within a single HTTP request but isolated between requests.\n\n• SINGLETON = one coffee machine for the entire restaurant. Every table, every customer, forever. Use for: configuration, caching, HttpClient factories, logging.\n\nThe CAPTIVE DEPENDENCY trap:\nIf a Singleton service depends on a Scoped service, the Scoped service gets 'captured' — it lives as long as the Singleton (forever). This means:\n1. The Scoped service never gets disposed between requests\n2. All requests share the same instance\n3. DbContext held this way will have stale tracked entities\n4. ASP.NET Core will throw an InvalidOperationException in Development mode to warn you",
        codeExample:
          "// Registration in Program.cs\nbuilder.Services.AddTransient<IEmailSender, EmailSender>();     // Fresh each time\nbuilder.Services.AddScoped<IOrderRepository, OrderRepository>(); // Per request\nbuilder.Services.AddSingleton<ICacheService, RedisCacheService>(); // App lifetime\n\n// BAD — Captive dependency!\npublic class CacheService : ICacheService  // Singleton\n{\n    private readonly IOrderRepository _repo;  // Scoped — now trapped!\n    public CacheService(IOrderRepository repo) { _repo = repo; }\n}\n\n// GOOD — Use IServiceScopeFactory to create scopes manually\npublic class CacheService : ICacheService\n{\n    private readonly IServiceScopeFactory _scopeFactory;\n    public CacheService(IServiceScopeFactory scopeFactory) {\n        _scopeFactory = scopeFactory;\n    }\n    \n    public async Task<Order> GetOrder(int id) {\n        using var scope = _scopeFactory.CreateScope();\n        var repo = scope.ServiceProvider.GetRequiredService<IOrderRepository>();\n        return await repo.GetByIdAsync(id);\n    }\n}",
        realWorldScenario:
          "At a bank, the transaction processing service is a Singleton (one instance handling all requests). It needs to query the database, but DbContext is Scoped. If you inject DbContext directly into the Singleton, all transactions will share the same DbContext — tracked entities pile up, change tracking gets confused, and eventually a customer's transfer amount shows up on someone else's statement. The fix: use IServiceScopeFactory to create a fresh scope (and fresh DbContext) for each operation.",
      },
      whatInterviewersWant:
        "They want to hear: (1) you know all three lifetimes cold, (2) you understand the captive dependency problem, (3) you know the fix (IServiceScopeFactory), and (4) you can explain WHY DbContext is Scoped. Bonus: mention that ValidateScopes is enabled in Development to catch these issues early.",
      commonWrongAnswers: [
        "'Transient creates a new instance per request' — Wrong, that's Scoped. Transient is per INJECTION, not per request.",
        "'Singleton is bad because it's shared' — Not inherently bad. Caching, configuration, and HttpClientFactory are correctly Singleton.",
      ],
      followUpQuestions: [
        "How would you implement a background service that needs database access?",
        "What is IServiceScopeFactory and when would you use it?",
        "How does EF Core's DbContext pooling interact with DI lifetimes?",
      ],
      seniorTip:
        "The mark of a senior: knowing that the REAL danger isn't using the wrong lifetime — it's the captive dependency. Always think about what happens when a longer-lived service holds a shorter-lived one.",
      hints: [
        "Think about how long each instance lives — per call, per request, or per application.",
        "What happens to a short-lived service when it gets trapped inside a long-lived one?",
        "ASP.NET Core has a built-in protection mechanism for this in Development mode.",
      ],
    },
  },

  {
    category: "Entity Framework",
    topic: "Lazy vs Eager Loading",
    type: "concept",
    difficulty: "Easy",
    data: {
      title: "Loading Strategies: Lazy vs Eager vs Explicit",
      type: "concept",
      difficulty: "Easy",
      category: "Entity Framework",
      question:
        "Explain the difference between Lazy Loading, Eager Loading, and Explicit Loading in Entity Framework Core. What is the N+1 query problem and how does each loading strategy relate to it?",
      context:
        "This is one of the first EF Core questions in any .NET interview. Getting loading strategies wrong causes performance disasters in production — the N+1 problem is the #1 EF Core performance killer.",
      codeSnippet: "",
      answer: {
        summary:
          "Lazy Loading loads related data on first access (implicit, can cause N+1). Eager Loading uses .Include() to load related data in ONE query upfront. Explicit Loading uses .Entry().Collection().Load() to load related data on demand but intentionally. The N+1 problem occurs when you load N parent entities, then each triggers a separate query for its children — 1 + N queries instead of 1.",
        detailed:
          "Imagine a library database with Authors and their Books:\n\nLAZY LOADING:\n- You fetch 10 authors. No books loaded yet.\n- You access author.Books → EF silently fires a query\n- For each of the 10 authors, accessing .Books fires a separate query\n- Total: 1 query for authors + 10 queries for books = 11 queries (N+1 problem!)\n- Lazy loading requires: UseLazyLoadingProxies() and virtual navigation properties\n\nEAGER LOADING:\n- You fetch 10 authors WITH their books in ONE query using .Include()\n- var authors = db.Authors.Include(a => a.Books).ToList();\n- SQL uses a JOIN — everything comes back in one round trip\n- Best for: when you KNOW you'll need the related data\n\nEXPLICIT LOADING:\n- You fetch authors first, then DELIBERATELY load books for specific authors\n- db.Entry(author).Collection(a => a.Books).Load();\n- You control exactly when and which related data loads\n- Best for: conditional loading (only load books if author is active)\n\nThe N+1 problem:\n- 'N+1' means 1 query for the parent + N queries for children\n- It's invisible in development (fast with 10 records) but kills production (slow with 10,000)",
        codeExample:
          "// ❌ Lazy Loading — N+1 problem\nvar authors = db.Authors.ToList(); // 1 query\nforeach (var author in authors)\n{\n    Console.WriteLine(author.Books.Count); // N queries! (one per author)\n}\n\n// ✅ Eager Loading — 1 query total\nvar authors = db.Authors\n    .Include(a => a.Books)\n    .ToList();\nforeach (var author in authors)\n{\n    Console.WriteLine(author.Books.Count); // No extra queries\n}\n\n// ✅ Explicit Loading — controlled, intentional\nvar author = db.Authors.First();\ndb.Entry(author)\n  .Collection(a => a.Books)\n  .Load(); // Deliberately loads books for THIS author only\n\n// ✅ Filtered Include (EF Core 5+)\nvar authors = db.Authors\n    .Include(a => a.Books.Where(b => b.Year > 2020))\n    .ToList();",
        realWorldScenario:
          "A banking portal shows a list of customers with their recent transactions. Without eager loading, clicking 'View All Customers' fires 1 query for customers + 500 queries for transactions. The page takes 12 seconds to load. Adding .Include(c => c.Transactions.Take(5)) drops it to a single query with a JOIN — page loads in 200ms.",
      },
      whatInterviewersWant:
        "They're testing: (1) do you know all three strategies, (2) can you explain N+1 with a real example, (3) do you know that Eager Loading is the default recommendation, and (4) can you identify N+1 in existing code? Bonus: mention AsSplitQuery() for complex includes.",
      commonWrongAnswers: [
        "'Lazy loading is always bad' — Not always. It's fine for small datasets or when you rarely access navigation properties. The problem is when it's used unknowingly in loops.",
        "'Just always use Include' — Over-including wastes memory. If you load Authors.Include(Books).Include(Reviews).Include(Publishers) but only display author names, you're loading unnecessary data.",
      ],
      followUpQuestions: [
        "How would you detect N+1 queries in an existing application?",
        "What is AsSplitQuery and when would you use it?",
        "How does projection (Select) relate to loading strategies?",
      ],
      seniorTip:
        "The senior move: often you don't need any loading strategy — use Select() to project only the columns you need. This avoids loading entire entities and is usually faster than Include().",
      hints: [
        "Think about WHEN related data gets loaded — automatically, upfront, or on-demand.",
        "Count the SQL queries. If you see 1 + N queries, you've found the problem.",
        "Which LINQ method tells EF Core to load related data in the same query?",
      ],
    },
  },

  {
    category: "SQL Server",
    topic: "Indexing Strategies",
    type: "concept",
    difficulty: "Medium",
    data: {
      title: "Clustered vs Non-Clustered Indexes",
      type: "concept",
      difficulty: "Medium",
      category: "SQL Server",
      question:
        "Explain the difference between clustered and non-clustered indexes in SQL Server. How does a clustered index affect data storage? When would you choose a non-clustered index over a clustered one, and what is a covering index?",
      context:
        "Indexing is the single most impactful performance optimization in SQL. This question tests whether you understand HOW indexes work, not just how to CREATE them.",
      codeSnippet: "",
      answer: {
        summary:
          "A clustered index determines the physical order of data in the table — the table IS the index. There's only one per table. A non-clustered index is a separate structure with pointers back to the data rows. A covering index is a non-clustered index that includes ALL columns needed by a query, so the query never needs to look up the actual table row.",
        detailed:
          "Think of it like a phone book vs sticky notes:\n\nCLUSTERED INDEX:\n- The phone book IS sorted by last name. The data is physically organized in that order.\n- You can only sort a phone book ONE way — so you can only have ONE clustered index per table.\n- By default, SQL Server creates a clustered index on the primary key.\n- If you search by last name, it's blazing fast (binary search on sorted data).\n- If you INSERT a row, SQL Server may need to physically reorganize pages to maintain order.\n\nNON-CLUSTERED INDEX:\n- Like a sticky note index: 'AccountType: Savings → pages 3, 17, 42, 89'\n- It's a SEPARATE structure that points back to the actual data rows.\n- You can have up to 999 non-clustered indexes per table.\n- Each index takes up additional storage space.\n- Lookups: find the key in the index → follow the pointer (bookmark lookup) → read the row.\n\nCOVERING INDEX:\n- A non-clustered index that INCLUDES all columns the query needs.\n- The query is 'covered' — no need for the expensive bookmark lookup.\n- Created with INCLUDE clause: CREATE INDEX ... ON Orders(CustomerId) INCLUDE (OrderDate, Total)\n- The included columns are stored in the leaf level of the index but NOT in the search tree.",
        codeExample:
          "-- Clustered index (usually on PK, created automatically)\nCREATE CLUSTERED INDEX IX_Orders_OrderId ON Orders(OrderId);\n-- Only ONE per table. Data is physically sorted by OrderId.\n\n-- Non-clustered index\nCREATE NONCLUSTERED INDEX IX_Orders_CustomerId ON Orders(CustomerId);\n-- Separate structure. Fast lookup by CustomerId, then bookmark lookup for other columns.\n\n-- Covering index (non-clustered with INCLUDE)\nCREATE NONCLUSTERED INDEX IX_Orders_CustomerId_Covering\nON Orders(CustomerId)\nINCLUDE (OrderDate, TotalAmount, Status);\n-- This query is now fully covered — no bookmark lookup:\n-- SELECT OrderDate, TotalAmount, Status FROM Orders WHERE CustomerId = 123;\n\n-- Check if an index is being used\nSET STATISTICS IO ON;\nSELECT * FROM Orders WHERE CustomerId = 123;\n-- Look for 'logical reads' — fewer = better",
        realWorldScenario:
          "A bank's transaction table has 50 million rows. The daily report queries: SELECT TransactionDate, Amount, Description FROM Transactions WHERE AccountId = @id AND TransactionDate > @date. Without an index, this scans all 50M rows (30 seconds). A non-clustered index on AccountId cuts it to 2 seconds but still does bookmark lookups. A covering index on (AccountId, TransactionDate) INCLUDE (Amount, Description) eliminates the lookups entirely — 50ms.",
      },
      whatInterviewersWant:
        "They want: (1) physical vs logical organization understanding, (2) one clustered per table rule, (3) bookmark lookup concept, (4) when to use covering indexes. Senior bonus: mention index fragmentation and maintenance, or filtered indexes.",
      commonWrongAnswers: [
        "'Non-clustered indexes are always slower' — Wrong. A covering non-clustered index can be faster than a clustered index scan for specific queries.",
        "'More indexes = better performance' — Wrong. Each index slows down INSERT/UPDATE/DELETE and consumes storage. Index wisely.",
      ],
      followUpQuestions: [
        "What is index fragmentation and how do you fix it?",
        "When would you use a filtered index?",
        "How do you decide which columns to include in a covering index?",
      ],
      seniorTip:
        "The senior insight: the best index strategy isn't about adding indexes — it's about understanding your query patterns. Use sys.dm_db_index_usage_stats to find unused indexes that are slowing down writes, and sys.dm_db_missing_index_suggestions for indexes the optimizer wishes existed.",
      hints: [
        "One of these controls how the actual data is physically stored on disk.",
        "Imagine a textbook: the table of contents is like one type of index, while the actual page order is like another.",
        "What happens when an index contains ALL the columns a query needs?",
      ],
    },
  },

  {
    category: "Angular",
    topic: "Change Detection",
    type: "concept",
    difficulty: "Medium",
    data: {
      title: "Angular Change Detection Strategies",
      type: "concept",
      difficulty: "Medium",
      category: "Angular",
      question:
        "Explain how Angular's change detection works. What is the difference between Default and OnPush change detection strategies? When and why would you use OnPush, and what are the gotchas?",
      context:
        "Change detection is the core of Angular's rendering performance. In enterprise apps with complex component trees, understanding this is the difference between a snappy UI and a sluggish one.",
      codeSnippet: "",
      answer: {
        summary:
          "Angular's default change detection checks EVERY component in the tree after any async event (click, HTTP response, timer). OnPush tells Angular to only re-check a component when its @Input references change, an event originates from the component, or you manually trigger detection. OnPush dramatically reduces the number of checks in large apps.",
        detailed:
          "Think of it like home security cameras:\n\nDEFAULT STRATEGY:\n- Every camera records 24/7, regardless of whether anything is happening.\n- Any movement anywhere (a mouse click, an HTTP response, even a setTimeout) → every single camera re-records.\n- Simple and foolproof, but wasteful in a mansion with 200 cameras.\n\nOnPush STRATEGY:\n- Cameras only record when: (1) someone rings THEIR doorbell (@Input change), (2) someone inside the room does something (event), or (3) you manually press record (markForCheck/detectChanges).\n- Dramatically fewer recordings, but you must understand the triggers.\n\nHOW IT WORKS under the hood:\n1. Zone.js patches all async APIs (setTimeout, Promise, addEventListener)\n2. After any async event, Angular runs change detection from the root\n3. Default: checks every component's bindings top-to-bottom\n4. OnPush: skips components whose inputs haven't changed (by reference!)\n\nThe REFERENCE TRAP:\n- OnPush compares @Input by REFERENCE, not deep equality\n- Mutating an object (obj.name = 'new') does NOT trigger change detection\n- You must create a NEW object: this.obj = { ...this.obj, name: 'new' }\n- This is why OnPush pairs naturally with immutable data patterns",
        codeExample:
          "// Default (checks on every cycle)\n@Component({\n  selector: 'app-user-list',\n  template: `<div *ngFor=\"let user of users\">{{user.name}}</div>`\n})\nexport class UserListComponent {\n  @Input() users: User[];\n}\n\n// OnPush (only checks when users reference changes)\n@Component({\n  selector: 'app-user-list',\n  template: `<div *ngFor=\"let user of users\">{{user.name}}</div>`,\n  changeDetection: ChangeDetectionStrategy.OnPush\n})\nexport class UserListComponent {\n  @Input() users: User[];\n}\n\n// Parent — WRONG (mutation, OnPush won't detect)\nthis.users.push(newUser); // Same reference!\n\n// Parent — CORRECT (new array, OnPush detects)\nthis.users = [...this.users, newUser]; // New reference!\n\n// Manual trigger when needed\nconstructor(private cdr: ChangeDetectorRef) {}\nngOnInit() {\n  this.someService.data$.subscribe(data => {\n    this.data = data;\n    this.cdr.markForCheck(); // Tell Angular to check this component\n  });\n}",
        realWorldScenario:
          "A vehicle tracking dashboard shows 200 vehicles on a map. With Default change detection, every GPS update (every second) triggers re-checking ALL 200 vehicle components. With OnPush, only the component whose vehicle data actually changed gets re-checked. CPU usage drops from 60% to 8%.",
      },
      whatInterviewersWant:
        "They want: (1) understanding of Zone.js's role, (2) Default vs OnPush mechanics, (3) the reference vs mutation gotcha, (4) knowing when to use markForCheck vs detectChanges. Bonus: mention Angular Signals as the future of reactivity.",
      commonWrongAnswers: [
        "'OnPush means change detection doesn't run' — Wrong, it runs but SKIPS components whose inputs haven't changed by reference.",
        "'Always use OnPush everywhere' — Not always. For simple apps or forms with heavy two-way binding, Default is simpler and works fine.",
      ],
      followUpQuestions: [
        "What is the difference between markForCheck() and detectChanges()?",
        "How does the async pipe interact with OnPush?",
        "What are Angular Signals and how do they change the change detection story?",
      ],
      seniorTip:
        "The real senior move: use OnPush + async pipe + Observables. The async pipe automatically calls markForCheck() when new values arrive, so you almost never need to inject ChangeDetectorRef manually.",
      hints: [
        "Angular checks the entire component tree after every async event by default.",
        "OnPush compares inputs by reference, not by value. Object mutation won't trigger updates.",
        "There's a way to manually trigger change detection when OnPush skips your component.",
      ],
    },
  },

  {
    category: "Design Patterns",
    topic: "Repository Pattern",
    type: "concept",
    difficulty: "Easy",
    data: {
      title: "Repository Pattern with Unit of Work",
      type: "concept",
      difficulty: "Easy",
      category: "Design Patterns",
      question:
        "What is the Repository pattern and why is it used? How does it pair with the Unit of Work pattern? Some developers argue that EF Core's DbContext already IS a Repository + Unit of Work — do you agree?",
      context:
        "This is one of the most debated patterns in the .NET world. Interviewers want to see nuanced thinking, not just textbook definitions.",
      codeSnippet: "",
      answer: {
        summary:
          "The Repository pattern abstracts data access behind a collection-like interface. Unit of Work tracks changes across multiple repositories and commits them as a single transaction. EF Core's DbContext already implements both patterns — DbSet<T> is a repository and SaveChanges() is the unit of work. Adding a custom repository on top is debated: it adds abstraction and testability but also complexity.",
        detailed:
          "Think of it like a shopping experience:\n\nREPOSITORY = a store shelf. You browse items (query), pick items (get by ID), put items on the shelf (add), remove items (delete). You don't care about the warehouse behind the shelf — that's the repository's job.\n\nUNIT OF WORK = your shopping cart + checkout. You add items from different shelves (repositories), but nothing is finalized until you hit 'Pay' (SaveChanges). If payment fails, NOTHING leaves any shelf (transaction rollback).\n\nThe DEBATE:\n\nFOR custom repositories:\n- Testability: easy to mock IRepository<T> in unit tests\n- Abstraction: can swap EF Core for Dapper or MongoDB later\n- Encapsulation: complex queries live in the repository, not scattered in controllers\n- Domain language: OrderRepository.GetPendingOrders() reads better than db.Orders.Where(...)\n\nAGAINST custom repositories (the 'DbContext IS the repository' camp):\n- DbSet<T> already has Add, Remove, Find \n- DbContext already tracks changes (Unit of Work)\n- Generic repositories (Repository<T>) are just thin wrappers that add no value\n- 'Swapping the ORM' almost never happens in practice\n- Leaky abstractions: IQueryable<T> leaks EF Core behavior through the repository",
        codeExample:
          "// Simple repository interface\npublic interface IOrderRepository\n{\n    Task<Order> GetByIdAsync(int id);\n    Task<IEnumerable<Order>> GetPendingOrdersAsync();\n    void Add(Order order);\n    void Remove(Order order);\n}\n\n// Unit of Work\npublic interface IUnitOfWork\n{\n    IOrderRepository Orders { get; }\n    IProductRepository Products { get; }\n    Task<int> SaveChangesAsync();\n}\n\n// Implementation with EF Core\npublic class OrderRepository : IOrderRepository\n{\n    private readonly AppDbContext _db;\n    public OrderRepository(AppDbContext db) { _db = db; }\n    \n    public async Task<Order> GetByIdAsync(int id)\n        => await _db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);\n    \n    public async Task<IEnumerable<Order>> GetPendingOrdersAsync()\n        => await _db.Orders.Where(o => o.Status == OrderStatus.Pending).ToListAsync();\n    \n    public void Add(Order order) => _db.Orders.Add(order);\n    public void Remove(Order order) => _db.Orders.Remove(order);\n}\n\n// Usage in a service\npublic class OrderService\n{\n    private readonly IUnitOfWork _uow;\n    \n    public async Task PlaceOrder(Order order)\n    {\n        _uow.Orders.Add(order);\n        // Can also modify Products, etc.\n        await _uow.SaveChangesAsync(); // One transaction\n    }\n}",
        realWorldScenario:
          "An insurance company's claims system has 15 controllers all writing raw EF Core queries. When they need to add audit logging to every database write, they'd have to modify all 15 controllers. With repositories, they add the audit logic in one place — the repository's Add/Update methods. When they switch from SQL Server to Cosmos DB for one module, only that repository implementation changes.",
      },
      whatInterviewersWant:
        "They want nuance, not a textbook answer. Show you understand BOTH sides of the debate. The best answer: 'It depends on the project size and team. For small apps, DbContext directly is fine. For large enterprise apps, repositories provide encapsulation and testability that justify the extra abstraction.'",
      commonWrongAnswers: [
        "'You should always use the repository pattern' — Not for simple CRUD apps. It adds complexity without benefit.",
        "'Generic Repository<T> is the best approach' — Generic repos (Repository<T>) often become leaky abstractions. Specific repositories (IOrderRepository) with domain methods are more valuable.",
      ],
      followUpQuestions: [
        "Would you expose IQueryable<T> from a repository? Why or why not?",
        "How does the Repository pattern relate to CQRS?",
        "How would you implement soft deletes across all repositories?",
      ],
      seniorTip:
        "The senior answer to 'repository or no repository' is: use repositories when you have complex domain logic that needs encapsulation. Use DbContext directly when you're building simple CRUD. The anti-pattern is using a Generic Repository<T> that just wraps DbSet<T> — that adds code without adding value.",
      hints: [
        "Think about what abstraction a repository provides — it looks like a collection of domain objects.",
        "Unit of Work is about grouping multiple changes into a single transaction.",
        "Consider: does EF Core's DbContext already give you these capabilities?",
      ],
    },
  },

  {
    category: "C# / .NET",
    topic: "Async/Await Patterns",
    type: "code_review",
    difficulty: "Hard",
    data: {
      title: "Async Anti-Patterns Code Review",
      type: "code_review",
      difficulty: "Hard",
      category: "C# / .NET",
      question:
        "Review the following code and identify ALL the issues. Explain why each is a problem and provide the corrected version.",
      context:
        "Async/await is deceptively easy to use but full of traps. This code review tests whether you can spot real-world async anti-patterns that cause deadlocks, performance issues, and incorrect behavior.",
      codeSnippet:
        'public class OrderService\n{\n    private readonly HttpClient _client = new HttpClient();\n    \n    public List<Order> GetOrders()\n    {\n        var result = GetOrdersAsync().Result;\n        return result;\n    }\n    \n    public async void ProcessOrder(Order order)\n    {\n        await _client.PostAsJsonAsync("/api/orders", order);\n        Console.WriteLine("Order processed");\n    }\n    \n    public async Task<List<Order>> GetAllOrdersAsync()\n    {\n        var orders = new List<Order>();\n        var customerIds = await GetCustomerIdsAsync();\n        \n        foreach (var id in customerIds)\n        {\n            var customerOrders = await _client.GetFromJsonAsync<List<Order>>($"/api/orders/{id}");\n            orders.AddRange(customerOrders);\n        }\n        \n        return orders;\n    }\n}',
      answer: {
        summary:
          "There are 5 major issues: (1) HttpClient created directly instead of via IHttpClientFactory, (2) .Result blocking call causing potential deadlock, (3) async void instead of async Task, (4) sequential await in a loop instead of parallel execution, (5) no exception handling or null checks.",
        detailed:
          "Let's go through each issue:\n\nISSUE 1 — new HttpClient()\nHttpClient implements IDisposable but should NOT be created per-request. It causes socket exhaustion (TIME_WAIT state). Each instance holds onto the underlying socket even after disposal. Under load, you'll run out of sockets and get SocketException.\n\nISSUE 2 — .Result (sync over async)\nCalling .Result on a Task blocks the calling thread AND can cause a deadlock in ASP.NET. The async method tries to resume on the captured SynchronizationContext, but that context is blocked by .Result. Classic deadlock.\n\nISSUE 3 — async void\nasync void methods are fire-and-forget. Exceptions thrown inside them crash the process (unobserved exception). The caller has no way to await completion or catch errors. Only valid use: event handlers.\n\nISSUE 4 — Sequential awaits in a loop\nEach iteration waits for the HTTP call to complete before starting the next one. If you have 100 customers and each call takes 200ms, that's 20 seconds. These calls are independent — they should run in parallel.\n\nISSUE 5 — No null checks\nGetFromJsonAsync can return null if deserialization fails. AddRange(null) throws ArgumentNullException.",
        codeExample:
          'public class OrderService\n{\n    private readonly HttpClient _client;\n    \n    // FIX 1: Inject HttpClient via IHttpClientFactory\n    public OrderService(HttpClient client)\n    {\n        _client = client;\n    }\n    \n    // FIX 2: Make it async all the way (no .Result)\n    public async Task<List<Order>> GetOrdersAsync()\n    {\n        return await GetOrdersInternalAsync();\n    }\n    \n    // FIX 3: async Task instead of async void\n    public async Task ProcessOrderAsync(Order order)\n    {\n        await _client.PostAsJsonAsync("/api/orders", order);\n        Console.WriteLine("Order processed");\n    }\n    \n    // FIX 4: Parallel execution with Task.WhenAll\n    // FIX 5: Null checks\n    public async Task<List<Order>> GetAllOrdersAsync()\n    {\n        var customerIds = await GetCustomerIdsAsync();\n        \n        var tasks = customerIds.Select(id =>\n            _client.GetFromJsonAsync<List<Order>>($"/api/orders/{id}"));\n        \n        var results = await Task.WhenAll(tasks);\n        \n        return results\n            .Where(r => r != null)\n            .SelectMany(r => r!)\n            .ToList();\n    }\n}\n\n// Registration in Program.cs\nbuilder.Services.AddHttpClient<OrderService>(client =>\n    client.BaseAddress = new Uri("https://api.example.com"));',
        realWorldScenario:
          "A government claims system had exactly this code. During peak hours (month-end batch processing), the sync-over-async deadlock froze the entire web server. Socket exhaustion from new HttpClient() caused cascading failures across microservices. The sequential loop made batch processing take 4 hours instead of 12 minutes. All three bugs were in production for 6 months before diagnosis.",
      },
      whatInterviewersWant:
        "They want you to find ALL the issues, not just the obvious one. Junior devs spot the .Result issue. Mid-level devs spot async void too. Senior devs catch the HttpClient lifecycle, the sequential loop, and suggest Task.WhenAll. Principal-level devs mention socket exhaustion by name.",
      commonWrongAnswers: [
        "'Just add .ConfigureAwait(false)' — This doesn't fix the fundamental .Result deadlock. It's a bandaid. The fix is async all the way down.",
        "'HttpClient should be in a using block' — No! Disposing HttpClient doesn't immediately release the socket. Use IHttpClientFactory instead.",
      ],
      followUpQuestions: [
        "What is IHttpClientFactory and why does it solve the socket exhaustion problem?",
        "When IS it acceptable to use .Result or .GetAwaiter().GetResult()?",
        "How would you limit concurrency in the Task.WhenAll approach?",
      ],
      seniorTip:
        "The hallmark of async mastery: never use .Result or .Wait() in ASP.NET. If you think you need it, restructure to be async all the way down. The only exception: Main() in console apps or constructors where you truly cannot make the caller async.",
      hints: [
        "Look at how HttpClient is created. What happens under load?",
        "What happens when you call .Result on a Task in ASP.NET?",
        "async void has a very specific problem with exceptions. What is it?",
      ],
    },
  },
];

// ─── SEED EXECUTION ───────────────────────────────────────────

function seed() {
  let problemCount = 0;
  let screeningCount = 0;

  console.log("Seeding problems...");
  for (const p of PROBLEMS) {
    try {
      const id = Problem.save(
        p.platform,
        p.language,
        p.category,
        p.difficulty,
        p.data,
        p.data.title,
      );
      console.log(
        `  ✓ Problem #${id}: "${p.data.title}" (${p.platform}/${p.language}/${p.difficulty})`,
      );
      problemCount++;
    } catch (err) {
      console.error(`  ✕ Failed: "${p.data.title}" — ${err.message}`);
    }
  }

  console.log("\nSeeding screening questions...");
  for (const s of SCREENINGS) {
    try {
      const id = Screening.save(
        s.category,
        s.topic,
        s.type,
        s.difficulty,
        s.data,
        s.data.title,
      );
      console.log(
        `  ✓ Screening #${id}: "${s.data.title}" (${s.category}/${s.topic}/${s.difficulty})`,
      );
      screeningCount++;
    } catch (err) {
      console.error(`  ✕ Failed: "${s.data.title}" — ${err.message}`);
    }
  }

  console.log(
    `\nDone! Seeded ${problemCount} problems + ${screeningCount} screening questions.`,
  );
}

seed();
