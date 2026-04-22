/**
 * Rich per-platform intelligence for Claude prompts (problem generation).
 * Keys are lowercase to match API `platform` labels like "Codility" → toLowerCase() → "codility"
 * except hackerrank/hackerearth etc. (display names lowercased work).
 */

const PLATFORM_GUIDES = {
  codility: {
    scoringNotes: `Codility scores on two axes: correctness (did your solution pass all test cases including hidden edge cases) and performance (does your solution meet the time/space complexity the task implies). Both matter heavily. A brute-force O(n²) solution that passes all visible test cases will still score poorly if the hidden large-input tests time out. Always state your complexity. Edge cases are hidden — always guard against empty arrays, single elements, negative numbers, and max-value integers.`,
    promptInjection: `This is a Codility-style problem. The solution MUST:
- Handle all edge cases (empty input, single element, negatives, max int values) — these are hidden test cases
- Be optimised for time and space complexity — brute force will fail performance tests
- Include Big O analysis in the explanation
- Use C# idioms: prefer arrays over lists for performance, use Dictionary for O(1) lookups
- The starter code must be a method signature inside a Solution class, exactly as Codility presents it`,
    timeFormat: `Single method inside a class. No Main(). No Console output. Return the answer.`,
    exampleStructure: `public int Solution(int[] A) { }`,
  },

  hackerrank: {
    scoringNotes: `HackerRank gives partial credit — you score points for each test case your solution passes. This means a correct brute-force solution that passes 8/10 test cases is better than an optimised solution that crashes. Always submit something. Read the constraints section carefully — the input size tells you what complexity is acceptable (n=10^6 means you need O(n) or O(n log n), not O(n²)). Multiple submissions are allowed — best score counts.`,
    promptInjection: `This is a HackerRank-style problem. The solution MUST:
- Read input from Console.ReadLine() / stdin and write output to Console.WriteLine() / stdout
- Parse input carefully — HackerRank input is usually space-separated or newline-separated integers/strings
- Handle the exact input format described
- Include the full Main() method with input parsing and output printing
- Partial credit exists — handle easy cases correctly even if edge cases are hard
- State what the time complexity is and why it fits within the given constraints`,
    timeFormat: `Full program with Main(). Read stdin, write stdout. No return values.`,
    exampleStructure: `static void Main(string[] args) { 
  int n = int.Parse(Console.ReadLine());
  // parse, solve, print
  Console.WriteLine(result);
}`,
  },

  testdome: {
    scoringNotes: `TestDome tests practical .NET knowledge, not just algorithms. Questions are a mix of: code completion (fill in a method body), bug fixing (find and fix the error), output prediction (what does this code print), and full implementation. They probe LINQ heavily, async/await correctness, interface vs abstract class distinctions, EF Core query patterns, and unit testing with real test frameworks. Null reference exceptions and off-by-one errors are common traps. Idiomatic C# matters — a working but un-idiomatic solution scores lower than a clean one.`,
    promptInjection: `This is a TestDome-style problem targeting senior .NET/C# developers. The solution MUST:
- Use idiomatic, modern C# (.NET 8 features where appropriate)
- For LINQ questions: use method syntax (not query syntax), chain operations cleanly
- For async questions: always await properly, never use .Result or .Wait() (deadlock trap), use CancellationToken where appropriate
- For OOP questions: show understanding of when to use interface vs abstract class, favour composition
- For Unit Testing categories: include realistic tests using the framework implied by the category name (xUnit, NUnit, MSTest, or TUnit), with Arrange–Act–Assert, clear assertions, and edge cases (null, empty, boundaries)
- Handle nulls explicitly — use null-conditional operators (?.), null-coalescing (??), and guard clauses
- Include common traps: IEnumerable deferred execution, IQueryable vs IEnumerable for EF Core, async void dangers
- The explanation must call out WHY the idiomatic approach matters, not just what it does`,
    timeFormat: `Method body completion or full class implementation. Clean, readable, production-grade.`,
    exampleStructure: `// Complete the method:
public IEnumerable<T> Filter<T>(IEnumerable<T> items, Func<T, bool> predicate)
{
    // your implementation
}`,
  },

  leetcode: {
    scoringNotes: `LeetCode problems are used in FAANG-style live interviews and take-homes. In live interviews, your thinking process matters as much as the solution — interviewers want to hear you reason through the problem. State brute force first, then optimise. In take-homes, correctness and optimal complexity are expected. Always know your data structures cold: when to use HashMap vs TreeMap, Stack vs Queue, when a heap is appropriate. The problem constraints (1 <= n <= 10^5) tell you what complexity is acceptable.`,
    promptInjection: `This is a LeetCode-style problem in the style of FAANG technical interviews. The solution MUST:
- Start with a brute force approach in the explanation, then show the optimised solution
- Use the exact LeetCode method signature style (Solution class, specific method name)
- Include time and space complexity for BOTH the brute force and optimal solution
- The thinking process section must walk through: clarify inputs → brute force → identify bottleneck → optimise → verify with examples
- Highlight the key data structure insight (e.g. "use HashMap instead of nested loop to get O(n)")
- The senior tip must be the pattern name (e.g. "Two Pointers", "Sliding Window", "Monotonic Stack") so the developer can recognise it next time`,
    timeFormat: `Method inside Solution class. No I/O. Return the answer.`,
    exampleStructure: `public class Solution {
    public int[] TwoSum(int[] nums, int target) { }
}`,
  },

  codesignal: {
    scoringNotes: `CodeSignal GCA (General Coding Assessment) has 4 problems in 70 minutes. Problems increase in difficulty. Your score depends on correctness AND speed — solving problems faster gives bonus points. The strategy: burn through problems 1 and 2 as fast as possible (they are easy, 5-10 min each), use saved time on problems 3 and 4. Partial credit exists per test case. A clean, correct solution to 3 problems outscores a slow, buggy attempt at all 4. Companies receive a numeric score — the exact interpretation varies by company.`,
    promptInjection: `This is a CodeSignal-style problem (GCA format). The solution MUST:
- Be concise and fast to write — CodeSignal rewards speed
- Use compact but readable C# — LINQ one-liners are appropriate here
- Handle edge cases inline, not in separate methods (time pressure context)
- The starter code must be a single method — no boilerplate
- The time limit context: this should be solvable by a senior developer in under 15 minutes
- Include a "speed tip" in the senior tip field — what is the fastest path to a correct solution`,
    timeFormat: `Single method. No class boilerplate. Return the answer.`,
    exampleStructure: `int Solution(int[] a) { }`,
  },

  hackerearth: {
    scoringNotes: `HackerEarth is competitive-programming style. Problems are I/O heavy — you read from stdin and write to stdout, often processing multiple test cases in a loop. There is a strict time limit per test case (often 1-2 seconds). Wrong output = 0 points. Time limit exceeded = 0 points. The input format is precisely defined — misreading it wastes your entire attempt. Read the problem statement twice. Parse input exactly as described. Edge cases are brutal and intentional.`,
    promptInjection: `This is a HackerEarth-style problem as used in BBD Software's technical assessment.
The solution MUST:
- Read ALL input from Console.ReadLine() — parse exactly as the problem specifies
- Write ALL output to Console.WriteLine() or Console.Write()
- Handle multiple test cases in a loop when T test cases are specified
- Use StringBuilder for output when printing many lines (faster than repeated Console.WriteLine)
- Include the FULL Main() method with input parsing
- The starter code must show exactly how to read the input format
- Time complexity must be stated — O(n²) will TLE on large inputs
- The step-by-step must include a "stdin/stdout parsing" step as step 1

IMPORTANT for BBD assessment context:
- Candidates cannot copy/paste — they type code manually
- Therefore: keep solutions clean, no complex one-liners
- Favour readable variable names over brevity
- The solution should be something a developer can type from memory under pressure`,
    timeFormat: `Full program. Read T test cases from stdin. Write T answers to stdout.`,
    exampleStructure: `static void Main(string[] args) {
  int t = int.Parse(Console.ReadLine());
  var sb = new StringBuilder();
  while (t-- > 0) {
    // parse one test case, solve, append to sb
  }
  Console.Write(sb);
}`,
  },

  coderbyte: {
    scoringNotes: `Coderbyte is used by mid-size companies for initial screening. Problems are practical and business-oriented — less about exotic algorithms, more about working with strings, arrays, objects, and real-world logic. You often see: parse a string in a specific format, implement a business rule, filter/transform data. Solutions are reviewed by humans as well as automated tests. Clean, readable code matters. Variable names, structure, and comments are part of the impression.`,
    promptInjection: `This is a Coderbyte-style screening problem used by companies for candidate screening. The solution MUST:
- Be practical and business-oriented — avoid exotic algorithms
- Be extremely readable — human reviewers look at this code
- Use meaningful variable names (no single letters except loop counters)
- Include inline comments explaining the approach
- Handle common string/array edge cases: empty string, null, whitespace, case sensitivity
- The problem should feel like a real work task, not a puzzle
- Include a Main() with 2-3 concrete test cases that a reviewer would run`,
    timeFormat: `Complete program with Main() and test cases. Readable, commented code.`,
    exampleStructure: `static string Solution(string str) { }`,
  },

  codewars: {
    scoringNotes: `Codewars problems are called "kata" and are community-rated by difficulty (8 kyu = easiest, 1 kyu = hardest). Solutions are peer-reviewed — the community can see and comment on your solution. Elegant, functional solutions are valued. After solving, you see other solutions — this is where the learning happens. Focus on clean, idiomatic code. LINQ and functional patterns are often the most elegant approach in C#. Honour solutions (community-voted best) tend to be 1-3 lines of well-chained LINQ.`,
    promptInjection: `This is a Codewars-style kata problem. The solution MUST:
- Prioritise elegance and idiom over verbosity
- Use LINQ and functional patterns where they make the code cleaner
- The "full solution" should show BOTH a clean one-liner approach AND a readable expanded version
- The senior tip must explain the functional/LINQ insight that makes the elegant solution possible
- Include what a "honour solution" (community best) might look like
- The explanation should teach the functional thinking pattern, not just the steps`,
    timeFormat: `Single method. Return the answer. Aim for the most elegant expression.`,
    exampleStructure: `public static int Solution(int[] arr) { }`,
  },
};

/**
 * Maps API platform label (e.g. "Codility", "LeetCode") to guide key.
 */
function resolvePlatformKey(platformLabel) {
  if (!platformLabel) return null;
  const normalized = String(platformLabel).trim().toLowerCase();
  if (PLATFORM_GUIDES[normalized]) return normalized;
  const compact = normalized.replace(/[^a-z0-9]/g, "");
  const alias = {
    hackerrank: "hackerrank",
    leetcode: "leetcode",
    testdome: "testdome",
    codesignal: "codesignal",
    hackerearth: "hackerearth",
    coderbyte: "coderbyte",
    codewars: "codewars",
    codility: "codility",
  };
  return alias[compact] || null;
}

function getPlatformGuideEntry(platformLabel) {
  const key = resolvePlatformKey(platformLabel);
  if (!key) return {};
  return PLATFORM_GUIDES[key] || {};
}

/** @deprecated Use getPlatformGuideEntry + structured fields; kept for any legacy requires */
function getPlatformGuide(platformName) {
  const g = getPlatformGuideEntry(platformName);
  if (!g.promptInjection) return "";
  return [
    g.scoringNotes && `SCORING:\n${g.scoringNotes}`,
    g.promptInjection && `REQUIREMENTS:\n${g.promptInjection}`,
    g.timeFormat && `FORMAT:\n${g.timeFormat}`,
    g.exampleStructure && `EXAMPLE:\n${g.exampleStructure}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

module.exports = {
  PLATFORM_GUIDES,
  resolvePlatformKey,
  getPlatformGuideEntry,
  getPlatformGuide,
};
