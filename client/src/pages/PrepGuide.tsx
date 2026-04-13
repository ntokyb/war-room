import type { CSSProperties } from "react";
import { PLATFORMS } from "../constants/platforms";
import { PREP_PLATFORM_INTEL } from "../constants/prepGuideIntel";

const sectionTitleStyle: CSSProperties = {
  fontSize: "11px",
  letterSpacing: "3px",
  color: "#00ff88",
  borderBottom: "1px solid #1e2e28",
  paddingBottom: "10px",
  marginBottom: "20px",
  marginTop: "36px",
};

const codeBlockStyle: CSSProperties = {
  background: "#050508",
  color: "#a8d8a8",
  border: "1px solid #1a1a2e",
  borderRadius: "6px",
  padding: "16px",
  fontSize: "12px",
  lineHeight: 1.7,
  whiteSpace: "pre-wrap",
  overflowX: "auto",
  marginBottom: "16px",
};

const CHEAT_BLOCKS: { title: string; code: string }[] = [
  {
    title: "LINQ chain (Where → GroupBy → Select → OrderBy → ToList)",
    code: `var result = list
    .Where(x => x.Active)
    .GroupBy(x => x.Category)
    .Select(g => new { Category = g.Key, Count = g.Count() })
    .OrderByDescending(x => x.Count)
    .ToList();`,
  },
  {
    title: "async/await (correct) vs .Result trap",
    code: `public async Task<string> GetDataAsync()
{
    // Never on a sync context you care about — deadlock risk:
    // var bad = GetAsync().Result;

    var result = await GetAsync().ConfigureAwait(false);
    return result;
}`,
  },
  {
    title: "IEnumerable vs IQueryable",
    code: `// IEnumerable<T> — LINQ runs in memory (already materialised or enumerable in-process)
IEnumerable<Order> local = orders.Where(o => o.Total > 100);

// IQueryable<T> — expression tree; EF Core translates to SQL when enumerated
IQueryable<Order> query = db.Orders.Where(o => o.Total > 100);`,
  },
  {
    title: "Null handling: ?.  ??  guard clauses",
    code: `var value = list?.FirstOrDefault()?.Name ?? "default";

if (arr == null || arr.Length == 0)
    return 0;`,
  },
  {
    title: "Dictionary — O(1) lookup by key",
    code: `var freq = new Dictionary<string, int>();
foreach (var w in words)
    freq[w] = freq.TryGetValue(w, out var c) ? c + 1 : 1;`,
  },
  {
    title: "HashSet — duplicate detection / membership",
    code: `var seen = new HashSet<int>();
foreach (var x in nums)
{
    if (!seen.Add(x))
        return true; // duplicate
}`,
  },
  {
    title: "Queue (BFS) / Stack (DFS)",
    code: `// BFS
var q = new Queue<int>();
q.Enqueue(start);

// DFS
var s = new Stack<int>();
s.Push(start);`,
  },
  {
    title: "StringBuilder — heavy output",
    code: `var sb = new StringBuilder();
for (var i = 0; i < n; i++)
    sb.AppendLine(results[i].ToString());
Console.Write(sb.ToString());`,
  },
];

const SENIOR_BEHAVIOURS: { title: string; body: string }[] = [
  {
    title: "Clarify before coding",
    body: "Ask about edge cases, constraints, empty input, duplicates, and exact return expectations — interviewers expect seniors to reduce ambiguity.",
  },
  {
    title: "State approach out loud",
    body: "Lead with brute force complexity, then explain the bottleneck and the data structure or insight that improves it.",
  },
  {
    title: "Edge cases first",
    body: "Null, empty, single element, negatives, overflow — guard or comment before the main algorithm.",
  },
  {
    title: "Name variables properly",
    body: "Use currentMax not cm, leftPointer not l — your code is read under time pressure.",
  },
  {
    title: "State complexity at the end",
    body: "Give time and space in plain English and tie them to the loop and extra structures you used.",
  },
];

const DRILL_ROWS: { night: string; platform: string; category: string; difficulty: string }[] = [
  { night: "Mon", platform: "TestDome", category: "LINQ", difficulty: "Easy ×3" },
  { night: "Tue", platform: "TestDome", category: "Async/Await", difficulty: "Easy ×2, Med ×1" },
  { night: "Wed", platform: "Codility", category: "Arrays", difficulty: "Easy ×2, Med ×2" },
  { night: "Thu", platform: "HackerRank", category: "Strings + Sorting", difficulty: "Mixed" },
  { night: "Fri", platform: "CodeSignal", category: "Arcade", difficulty: "4 problems timed" },
  { night: "Sat/Sun", platform: "LeetCode", category: "Two Pointers + HashMaps", difficulty: "Med ×3" },
];

type PrepGuideProps = {
  onNavigate: (screen: string) => void;
};

export default function PrepGuide({ onNavigate }: PrepGuideProps) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        background: "#080810",
        color: "#e0e0f0",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        paddingBottom: "48px",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "24px 20px" }}>
        <button
          type="button"
          onClick={() => onNavigate("platform")}
          style={{
            background: "transparent",
            border: "1px solid #2a2a3e",
            color: "#666",
            borderRadius: "6px",
            padding: "8px 14px",
            cursor: "pointer",
            fontSize: "11px",
            letterSpacing: "2px",
            marginBottom: "24px",
          }}
        >
          ← BACK TO PRACTICE
        </button>

        <h1
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#00ff88",
            letterSpacing: "4px",
            margin: "0 0 8px 0",
          }}
        >
          PREP GUIDE
        </h1>
        <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#666", lineHeight: 1.8 }}>
          Read this before drilling. Platform cards mirror how each vendor actually scores. The
          schedule is a nightly ramp; adjust to your calendar.
        </p>

        {/* A — Platform breakdown */}
        <h2 style={{ ...sectionTitleStyle, marginTop: "28px" }}>PLATFORM BREAKDOWN</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "14px",
          }}
        >
          {PLATFORMS.map((p) => {
            const intel = PREP_PLATFORM_INTEL[p.id];
            return (
              <article
                key={p.id}
                style={{
                  background: "#0d0d16",
                  border: "1px solid #1e1e30",
                  borderLeft: `4px solid ${p.color}`,
                  borderRadius: "8px",
                  padding: "18px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "22px", color: p.color }}>{p.icon}</span>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: p.color }}>{p.name}</span>
                </div>
                <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#555", marginBottom: "6px" }}>
                  HOW IT SCORES
                </div>
                <p style={{ fontSize: "12px", color: "#aaa", lineHeight: 1.75, margin: "0 0 14px 0" }}>
                  {intel?.scoringHow}
                </p>
                <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#555", marginBottom: "6px" }}>
                  YOUR TACTIC
                </div>
                <p style={{ fontSize: "12px", color: "#00cfff", lineHeight: 1.7, margin: "0 0 14px 0" }}>
                  {intel?.yourTactic}
                </p>
                <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#555", marginBottom: "6px" }}>
                  WATCH OUT FOR
                </div>
                <p style={{ fontSize: "12px", color: "#ff9f00", lineHeight: 1.7, margin: 0 }}>
                  {intel?.watchOutFor}
                </p>
              </article>
            );
          })}
        </div>

        {/* B — 3-week ramp */}
        <h2 style={sectionTitleStyle}>3-WEEK RAMP SCHEDULE</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
            alignItems: "stretch",
          }}
        >
          {[
            {
              title: "WEEK 1 — MECHANICS UNDER PRESSURE",
              body: (
                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#aaa", lineHeight: 1.9 }}>
                  <li>
                    <strong style={{ color: "#e0e0f0" }}>Day 1–2:</strong> Arrays &amp; Strings — two pointers,
                    sliding window, HashMap lookups
                  </li>
                  <li>
                    <strong style={{ color: "#e0e0f0" }}>Day 3–4:</strong> Sorting &amp; Searching — custom
                    comparers, binary search from scratch
                  </li>
                  <li>
                    <strong style={{ color: "#e0e0f0" }}>Day 5–7:</strong> Collections &amp; LINQ —
                    Dictionary, HashSet, Queue, Stack + full LINQ chain practice
                  </li>
                </ul>
              ),
            },
            {
              title: "WEEK 2 — PATTERNS",
              body: (
                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#aaa", lineHeight: 1.9 }}>
                  <li>
                    <strong style={{ color: "#e0e0f0" }}>Day 8–9:</strong> Recursion &amp; Backtracking —
                    memoisation, permutations, tree traversal
                  </li>
                  <li>
                    <strong style={{ color: "#e0e0f0" }}>Day 10–11:</strong> Trees &amp; Graphs — BFS, DFS,
                    adjacency list, cycle detection
                  </li>
                  <li>
                    <strong style={{ color: "#e0e0f0" }}>Day 12–13:</strong> Dynamic Programming — top-down
                    memoisation first, then bottom-up
                  </li>
                  <li>
                    <strong style={{ color: "#e0e0f0" }}>Day 14:</strong> SQL — JOINs, GROUP BY, HAVING, window
                    functions, CTEs
                  </li>
                </ul>
              ),
            },
            {
              title: "WEEK 3 — PLATFORM SIMULATION (TIMED)",
              body: (
                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#aaa", lineHeight: 1.9 }}>
                  <li>
                    <strong style={{ color: "#e0e0f0" }}>Monday:</strong> Codility sim — 30 min, 2 problems
                  </li>
                  <li>
                    <strong style={{ color: "#e0e0f0" }}>Tuesday:</strong> TestDome .NET sim — 35 min
                  </li>
                  <li>
                    <strong style={{ color: "#e0e0f0" }}>Wednesday:</strong> HackerRank sim — 45 min
                  </li>
                  <li>
                    <strong style={{ color: "#e0e0f0" }}>Thursday:</strong> CodeSignal GCA sim — 70 min, 4
                    problems
                  </li>
                  <li>
                    <strong style={{ color: "#e0e0f0" }}>Friday:</strong> LeetCode — 1 medium, strictly timed
                  </li>
                </ul>
              ),
            },
          ].map((w) => (
            <div
              key={w.title}
              style={{
                flex: "1 1 280px",
                background: "#0d0d16",
                border: "1px solid #1e1e30",
                borderRadius: "8px",
                padding: "18px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "2px",
                  color: "#00ff88",
                  marginBottom: "12px",
                }}
              >
                {w.title}
              </div>
              {w.body}
            </div>
          ))}
        </div>

        {/* C — C# cheat sheet */}
        <h2 style={sectionTitleStyle}>C# PATTERNS CHEAT SHEET</h2>
        {CHEAT_BLOCKS.map((block) => (
          <div key={block.title}>
            <div style={{ fontSize: "11px", color: "#888", marginBottom: "8px" }}>{block.title}</div>
            <pre style={codeBlockStyle}>{block.code}</pre>
          </div>
        ))}

        {/* D — Senior behaviours */}
        <h2 style={sectionTitleStyle}>SENIOR BEHAVIOURS CHECKLIST</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {SENIOR_BEHAVIOURS.map((item) => (
            <div
              key={item.title}
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "flex-start",
                background: "#0d0d16",
                border: "1px solid #1e1e30",
                borderRadius: "8px",
                padding: "14px 16px",
              }}
            >
              <span style={{ color: "#00ff88", fontSize: "16px", flexShrink: 0 }}>✓</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#e0e0f0", marginBottom: "6px" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "12px", color: "#777", lineHeight: 1.75 }}>{item.body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* E — Tonight's drill plan */}
        <h2 style={sectionTitleStyle}>TONIGHT&apos;S DRILL PLAN (WAR ROOM)</h2>
        <div
          style={{
            border: "1px solid #1e1e30",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ background: "#111118", color: "#00ff88", textAlign: "left" }}>
                <th style={{ padding: "12px 14px", borderBottom: "1px solid #1e1e30" }}>NIGHT</th>
                <th style={{ padding: "12px 14px", borderBottom: "1px solid #1e1e30" }}>PLATFORM</th>
                <th style={{ padding: "12px 14px", borderBottom: "1px solid #1e1e30" }}>CATEGORY</th>
                <th style={{ padding: "12px 14px", borderBottom: "1px solid #1e1e30" }}>DIFFICULTY</th>
              </tr>
            </thead>
            <tbody>
              {DRILL_ROWS.map((row, i) => (
                <tr
                  key={row.night + row.platform}
                  style={{ background: i % 2 === 0 ? "#0f0f18" : "#111118", color: "#ccc" }}
                >
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #1a1a28" }}>{row.night}</td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #1a1a28" }}>{row.platform}</td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #1a1a28" }}>{row.category}</td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #1a1a28" }}>{row.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
