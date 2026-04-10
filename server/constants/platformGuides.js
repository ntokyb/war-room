// Platform-specific prompt guides for authentic problem generation.
// Each guide tells Claude how to FORMAT and STYLE the problem
// to match what the candidate will actually see on each platform.

const PLATFORM_GUIDES = {
  Codility: `FORMAT RULES — CODILITY STYLE:
- Problem names use PascalCase concatenated words (e.g., "FrogJmp", "PermMissingElem", "MaxCounters", "BinaryGap")
- Solution is a SINGLE FUNCTION with a specific signature — never a full program
- Function receives arrays, integers, or strings as parameters and RETURNS a result (never prints)
- Include a "Task description" section with precise mathematical language
- Include "Write a function:" showing exact signature in the target language
- Include "that, given..." phrasing to describe inputs
- Provide 2-3 examples with concrete input→output
- List expected complexity at the end: "expected worst-case time complexity is O(N); expected worst-case space complexity is O(N)"
- Codility scores on CORRECTNESS (0-100%) and PERFORMANCE (0-100%) separately — mention this in platformNotes
- Edge cases Codility tests: empty arrays, single element, maximum N (100,000–1,000,000), all same values, already sorted, negative numbers
- Constraints use: N is an integer within the range [1..100,000], each element of array A is an integer within the range [−1,000..1,000]
- DO NOT include class wrappers — just a standalone function
- For the description field, use the EXACT Codility tone: clinical, precise, mathematical`,

  HackerRank: `FORMAT RULES — HACKERRANK STYLE:
- Problem has sections: "Problem", "Input Format", "Constraints", "Output Format", "Sample Input", "Sample Output", "Explanation"
- Input Format describes stdin line by line: "The first line contains an integer, n, the number of elements. The second line contains n space-separated integers."
- Output Format is explicit: "Print a single integer denoting the result"
- Constraints use mathematical notation: 1 ≤ n ≤ 10^5, 1 ≤ arr[i] ≤ 10^9
- Sample Input/Output shown in monospace blocks with exact values
- "Explanation" section walks through the sample case step by step
- Code reads from STDIN and writes to STDOUT — include boilerplate for parsing stdin in the target language
- Problem difficulty ramps: Easy has 1 constraint, Hard has multiple interacting constraints
- Include "Complete the function X below" phrasing
- HackerRank often has domain-specific framing (HR calls them "challenges")
- For SQL category: use the HackerRank SQL format with table schemas and expected output columns`,

  TestDome: `FORMAT RULES — TESTDOME STYLE:
- Problems are PRACTICAL, real-world scenarios — not algorithm puzzles
- Often provides STARTER CODE that the candidate must fix or complete (include this in the description)
- Frame as: "A company needs to..." or "The following code..." or "Implement a class that..."
- Tests framework/library knowledge: LINQ queries, async/await patterns, Entity Framework, dependency injection, interface implementation
- Include UNIT TEST expectations: "The following tests must pass:" with sample test cases
- Multiple sub-tasks within one problem: "Task 1: Fix the bug. Task 2: Optimize performance. Task 3: Handle edge case"
- Time limits shown: "Time limit: 15 minutes"
- Scoring: partial credit for partial solutions — mention which parts earn points
- TestDome problems often show a class with a bug or anti-pattern the candidate must identify and fix
- Include specific .NET/Angular/SQL version context where relevant
- DO NOT make it a generic algorithm problem — it must test PRACTICAL technology skills`,

  LeetCode: `FORMAT RULES — LEETCODE STYLE:
- Title format: "Problem Title" (no number needed, but style should feel numbered)
- Description starts with a clear problem statement, then examples
- Examples formatted as: "Example 1:\n  Input: nums = [2,7,11,15], target = 9\n  Output: [0,1]\n  Explanation: Because nums[0] + nums[1] == 9, we return [0, 1]."
- Show 2-3 examples, last one is usually an edge case
- Constraints section with bullet points: "• 2 ≤ nums.length ≤ 10^4\n• -10^9 ≤ nums[i] ≤ 10^9"
- "Follow-up:" section with optimization challenge: "Can you come up with an algorithm that is less than O(n²) time complexity?"
- Solution is a METHOD inside a class (class Solution) — LeetCode style
- For the solution, show the class Solution wrapper with the method
- LeetCode categorizes: Easy (green), Medium (orange), Hard (red)
- Include "Related Topics:" tag list in platformNotes (e.g., "Array, Hash Table, Two Pointers")
- Problems test ONE core concept but may require combining 2 techniques
- Description should be concise — LeetCode problems are shorter than HackerRank`,

  CodeSignal: `FORMAT RULES — CODESIGNAL STYLE:
- Problems called "tasks" grouped in "Arcade" sequences
- Arcade problems increase in difficulty within a topic
- Task descriptions are SHORT and clean — 2-3 sentences max for the core problem
- Input/Output clearly defined: "Given an array of integers, return..." style
- Guaranteed constraints section: "[input] integer n — Guaranteed constraints: 1 ≤ n ≤ 10^5"
- Each parameter has its own "[input]" block and its own "[output]" block
- Solution is a standalone FUNCTION (not a class, not stdin/stdout)
- CodeSignal emphasizes SPEED — scoring factors in time taken
- Edge cases are tricky but problems themselves are clean and elegant
- Arcade-style names are often fun/creative (e.g., "almostIncreasingSequence", "matrixElementsSum")
- Use camelCase for function and problem names
- Time limit per task is short (typically 4000ms)`,

  HackerEarth: `FORMAT RULES — HACKEREARTH STYLE:
- Competitive programming format with strict I/O
- Sections: "Problem", "Input", "Output", "Constraints", "Sample Input", "Sample Output", "Explanation"
- Input section: "First line contains T, number of test cases. For each test case, first line contains N..."
- MULTIPLE test cases in a single run is standard
- Constraints use: 1 ≤ T ≤ 100, 1 ≤ N ≤ 10^6
- Time Limit: 2 seconds, Memory Limit: 256 MB — include these
- Read ALL input, process ALL test cases, output ALL results
- Solution reads from stdin and writes to stdout
- Problems often have a STORY framing: "Chef has N dishes..." or "There are N soldiers..."
- Scoring: ACed (all test cases pass), Partial (some pass), WA/TLE/MLE
- Include note about large input: "Use fast I/O methods"
- Edge cases include: T=1 with max N, all elements equal, overflow edge cases`,

  Coderbyte: `FORMAT RULES — CODERBYTE STYLE:
- Problems are a MIX of algorithms AND practical tasks
- Title format: "Find Intersection", "Bracket Matcher", "Array Addition"
- Function receives a single parameter (often a string or array) and must RETURN a result
- Description style: "Have the function X(str) take the str parameter being passed and..."
- Coderbyte problems often involve: string manipulation, array math, basic data structures
- Include "Examples:" with Input→Output pairs
- Company screening format: problems appear in timed assessments sent by employers
- Some problems involve parsing specific formats (comma-sep strings, nested brackets)
- Solution is a standalone function — not a class
- Difficulty labeled: easy, medium, hard (Coderbyte uses lowercase)
- Include "Browse More Challenges" feel — problems are standalone, not in sequences
- Practical problems may involve: data transformation, config parsing, simple API-like logic`,

  Codewars: `FORMAT RULES — CODEWARS STYLE:
- Problems called "kata" — use this terminology throughout
- Difficulty ranked by "kyu": 8 kyu (easiest) → 1 kyu (hardest). Map: Easy=7-8 kyu, Medium=5-6 kyu, Hard=3-4 kyu
- Include the kyu rank in platformNotes: "This is a 6 kyu kata"
- Description is CREATIVE and well-written — Codewars kata have personality
- Often includes a story or context before the actual problem
- Examples shown clearly but format varies (kata authors have freedom)
- Solution is a standalone FUNCTION — Codewars uses functional style
- "KATA" descriptions often emphasize elegance: "Write a function that..." with preference for concise solutions
- Include "Tags:" in platformNotes (e.g., "Fundamentals, Arrays, Algorithms")
- Codewars community values: readable code, clever one-liners, functional approaches
- Test cases shown as assertions: Test.assertEquals(solution(input), expected)
- Many kata have follow-up versions: "Part 2" that extend the concept`,
};

function getPlatformGuide(platformName) {
  return PLATFORM_GUIDES[platformName] || "";
}

module.exports = { PLATFORM_GUIDES, getPlatformGuide };
