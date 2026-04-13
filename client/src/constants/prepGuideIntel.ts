/**
 * Prep Guide UI copy (tactic + watch-out). Scoring paragraphs mirror server PLATFORM_GUIDES.scoringNotes.
 */

export type PrepCardIntel = {
  scoringHow: string;
  yourTactic: string;
  watchOutFor: string;
};

export const PREP_PLATFORM_INTEL: Record<string, PrepCardIntel> = {
  codility: {
    scoringHow: `Codility scores on two axes: correctness (did your solution pass all test cases including hidden edge cases) and performance (does your solution meet the time/space complexity the task implies). Both matter heavily. A brute-force O(n²) solution that passes all visible test cases will still score poorly if the hidden large-input tests time out. Always state your complexity. Edge cases are hidden — always guard against empty arrays, single elements, negative numbers, and max-value integers.`,
    yourTactic: `Get a correct solution first, then optimise with stated Big O before you rely on hidden performance tests.`,
    watchOutFor: `Assuming visible tests imply performance — large N will TLE on the wrong complexity.`,
  },
  hackerrank: {
    scoringHow: `HackerRank gives partial credit — you score points for each test case your solution passes. This means a correct brute-force solution that passes 8/10 test cases is better than an optimised solution that crashes. Always submit something. Read the constraints section carefully — the input size tells you what complexity is acceptable (n=10^6 means you need O(n) or O(n log n), not O(n²)). Multiple submissions are allowed — best score counts.`,
    yourTactic: `Bank points early on easy cases and constraints-sized tests, then harden edge cases and complexity.`,
    watchOutFor: `Mis-parsing stdin/stdout format — one wrong split can zero the whole problem.`,
  },
  testdome: {
    scoringHow: `TestDome tests practical .NET knowledge, not just algorithms. Questions are a mix of: code completion (fill in a method body), bug fixing (find and fix the error), output prediction (what does this code print), and full implementation. They probe LINQ heavily, async/await correctness, interface vs abstract class distinctions, and EF Core query patterns. Null reference exceptions and off-by-one errors are common traps. Idiomatic C# matters — a working but un-idiomatic solution scores lower than a clean one.`,
    yourTactic: `Read the signature and tests first, then answer with idiomatic C# (LINQ method syntax, proper async, null guards).`,
    watchOutFor: `Deferred IEnumerable execution and IQueryable vs IEnumerable mistakes in EF-style questions.`,
  },
  leetcode: {
    scoringHow: `LeetCode problems are used in FAANG-style live interviews and take-homes. In live interviews, your thinking process matters as much as the solution — interviewers want to hear you reason through the problem. State brute force first, then optimise. In take-homes, correctness and optimal complexity are expected. Always know your data structures cold: when to use HashMap vs TreeMap, Stack vs Queue, when a heap is appropriate. The problem constraints (1 <= n <= 10^5) tell you what complexity is acceptable.`,
    yourTactic: `Narrate brute force → bottleneck → optimal structure, and tie complexity to the stated constraints.`,
    watchOutFor: `Jumping to the optimal solution without explaining tradeoffs — hurts you in live panels.`,
  },
  codesignal: {
    scoringHow: `CodeSignal GCA (General Coding Assessment) has 4 problems in 70 minutes. Problems increase in difficulty. Your score depends on correctness AND speed — solving problems faster gives bonus points. The strategy: burn through problems 1 and 2 as fast as possible (they are easy, 5-10 min each), use saved time on problems 3 and 4. Partial credit exists per test case. A clean, correct solution to 3 problems outscores a slow, buggy attempt at all 4. Companies receive a numeric score — the exact interpretation varies by company.`,
    yourTactic: `Blitz the early tasks for time bank, then invest in partial credit on the hardest task instead of a blank submission.`,
    watchOutFor: `Over-engineering early tasks and arriving at #4 with no time to score.`,
  },
  hackerearth: {
    scoringHow: `HackerEarth is competitive-programming style. Problems are I/O heavy — you read from stdin and write to stdout, often processing multiple test cases in a loop. There is a strict time limit per test case (often 1-2 seconds). Wrong output = 0 points. Time limit exceeded = 0 points. The input format is precisely defined — misreading it wastes your entire attempt. Read the problem statement twice. Parse input exactly as described. Edge cases are brutal and intentional.`,
    yourTactic: `Lock the I/O pattern first (T cases, line layout), then choose complexity that fits N and time limit.`,
    watchOutFor: `Extra whitespace/newlines in output and slow per-line printing on large T.`,
  },
  coderbyte: {
    scoringHow: `Coderbyte is used by mid-size companies for initial screening. Problems are practical and business-oriented — less about exotic algorithms, more about working with strings, arrays, objects, and real-world logic. You often see: parse a string in a specific format, implement a business rule, filter/transform data. Solutions are reviewed by humans as well as automated tests. Clean, readable code matters. Variable names, structure, and comments are part of the impression.`,
    yourTactic: `Prioritise readable, well-named code with obvious edge-case handling over clever one-liners.`,
    watchOutFor: `Null, empty, whitespace, and case sensitivity — reviewers notice sloppy edge handling.`,
  },
  codewars: {
    scoringHow: `Codewars problems are called "kata" and are community-rated by difficulty (8 kyu = easiest, 1 kyu = hardest). Solutions are peer-reviewed — the community can see and comment on your solution. Elegant, functional solutions are valued. After solving, you see other solutions — this is where the learning happens. Focus on clean, idiomatic code. LINQ and functional patterns are often the most elegant approach in C#. Honour solutions (community-voted best) tend to be 1-3 lines of well-chained LINQ.`,
    yourTactic: `Solve clearly first, then refactor toward idiomatic LINQ and compare with community solutions after.`,
    watchOutFor: `Clever golf that sacrifices readability — hurts learning and review scores.`,
  },
};
