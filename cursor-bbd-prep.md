Add a BBD-specific preparation mode to War Room that mirrors the HackerEarth assessment format exactly.

BBD uses HackerEarth for their technical assessment:
- 90 minutes total
- 2 sections: intro warm-up + coding problems
- Cannot copy/paste into code stubs (must type)
- Cannot switch tabs more than 30 times
- Cannot pause once started
- Language must be changed to C# at the start
- Must submit after each question

---

## PART 1 — Add HackerEarth to platforms list

In `client/src/constants/platforms.ts`, add HackerEarth if not already present with these exact details:

```typescript
{
  id: "hackerearth",
  name: "HackerEarth",
  color: "#2196f3",
  icon: "◭",
  tagline: "Competitive-style. I/O heavy. Edge cases are brutal.",
  timeLimit: 45,
  focus: "Read stdin, write stdout. Multiple test cases. Wrong output = 0 points. TLE = 0 points.",
  categories: [
    "Arrays",
    "Strings", 
    "Sorting",
    "Searching",
    "Implementation",
    "Data Structures",
    "Dynamic Programming",
    "Graphs"
  ]
}
```

---

## PART 2 — Add BBD Mock Mode

Create `client/src/components/BBDMockSession.tsx` — a specialised timed assessment that mirrors the exact BBD HackerEarth format.

### What it does:
- Shows a pre-assessment checklist before starting
- Runs a 90-minute countdown timer (not count-up)
- Generates 4 problems: 1 warm-up (Easy) + 3 real problems (Mixed)
- Problems are HackerEarth style — stdin/stdout format
- Warns when 30 minutes remain (yellow)
- Warns when 10 minutes remain (red, flashing)
- Shows a "Submit" button per problem — tracks which are submitted
- End screen shows summary: submitted, time taken, what to review

### Component structure:

```typescript
type BBDPhase = 'checklist' | 'active' | 'review';

interface BBDProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  constraints: string[];
  starterCode: string;
  fullSolution: string;
  explanation: string;
  hints: string[];
  submitted: boolean;
  timeSpentSeconds: number;
}

interface BBDSessionState {
  phase: BBDPhase;
  problems: BBDProblem[];
  currentProblemIndex: number;
  totalTimeSeconds: number; // 90 * 60 = 5400
  timeRemainingSeconds: number;
  loading: boolean;
  error: string | null;
}
```

### Checklist screen (shown before starting):
Display this exact checklist with checkboxes. User must check all before START is enabled:

```
□ I have set aside 90 uninterrupted minutes
□ I am using incognito/private browser window  
□ All other tabs and windows are closed
□ My internet connection is stable
□ I have changed the language to C# (reminder)
□ I understand I cannot pause once started
□ I understand I cannot copy/paste — I will type my code
□ I will click Submit after each question
```

Also show:
- A language reminder banner: "⚠ Remember: Change language to C# immediately when the real test starts. Do it before reading any question."
- Start button only enabled when ALL checkboxes are checked

### Active session screen:
- Large countdown timer top right — red when < 10 min, orange when < 30 min
- Problem tabs: [Warm-up] [Problem 2] [Problem 3] [Problem 4]
- Each problem shows: title, difficulty badge, description, constraints
- Starter code block (display only — reminder that in real test they type, not paste)
- "MARK AS SUBMITTED" button per problem — once clicked, shows green ✓
- Progress bar showing time elapsed vs 90 min total

### Problems to generate:
On session start, make 4 separate API calls to generate:

Problem 1 (warm-up):
```
Platform: HackerEarth, Language: C#, Category: Implementation, Difficulty: Easy
```

Problem 2:
```
Platform: HackerEarth, Language: C#, Category: Arrays, Difficulty: Easy  
```

Problem 3:
```
Platform: HackerEarth, Language: C#, Category: Strings, Difficulty: Medium
```

Problem 4:
```
Platform: HackerEarth, Language: C#, Category: Sorting, Difficulty: Medium
```

Generate all 4 in parallel using Promise.all via the existing generateProblem service.

### Review screen (shown when time expires OR user clicks "End Session"):
Show for each problem:
- Title + difficulty
- Whether it was submitted ✓ or not ✗
- Time the user spent on it (if they navigated between problems, track time per problem)
- Full solution revealed
- Explanation
- Key insight

Also show overall summary:
```
Session complete
Total time: XX:XX
Problems submitted: X / 4
Recommendation: [based on results]
```

Recommendations logic:
- 4/4 submitted → "Strong session. You're ready for BBD."
- 3/4 submitted → "Good. Review the one you missed before the real test."
- 2/4 submitted → "Focus tonight on [category of the ones missed]."
- 0-1/4 submitted → "Do another session. Focus on Easy problems first."

---

## PART 3 — Add BBD entry point in the app

In `client/src/App.tsx`:
- Add screen state: `'bbd'`
- Render `<BBDMockSession onNavigate={setScreen} />` when screen === 'bbd'

In `client/src/components/Header.tsx`:
- Add "BBD PREP" nav item — shown in blue (#2196f3) to stand out
- Active when screen === 'bbd'

---

## PART 4 — Add BBD tips to PrepGuide

In `client/src/pages/PrepGuide.tsx`, add a new section after the platform breakdown:

### "Assessment-Specific Guides" section

**BBD (HackerEarth) — What to expect:**
```
Format: 90 minutes, 2 sections, 3-4 coding problems
Platform: HackerEarth Recruit
Language: Must change to C# manually at the start — do this first
Copy/paste: DISABLED — you must type all code
Tab switching: Limited to 30 — stay in the window
Submission: Click Submit after EACH question, not at the end

Problem style: stdin/stdout
  int n = int.Parse(Console.ReadLine());
  var results = new StringBuilder();
  // process
  Console.Write(results);

Time strategy:
  0-15 min → Section 1 warm-up — finish fast, bank time
  15-70 min → Problems 2 and 3 — your main score
  70-85 min → Problem 4 — partial credit counts
  85-90 min → Review and submit anything unsubmitted

The #1 mistake: Not clicking Submit. 
  A perfect solution that isn't submitted = 0 points.
  Submit something for every problem, even if incomplete.
```

---

## PART 5 — Update platformGuides.js on server

In `server/constants/platformGuides.js`, update the hackerearth entry's promptInjection to include:

```javascript
hackerearth: {
  // ... existing fields ...
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
}
```

---

## STYLING
- BBD PREP nav item: color #2196f3 (blue, distinct from green practice items)
- Checklist screen: dark card, each checkbox item with clear spacing
- Timer: large font (32px+), transitions red when critical
- Problem tabs: horizontal tabs, active tab highlighted in platform color
- Submit button: prominent green, transforms to grey with ✓ when clicked
- Review screen: clear pass/fail per problem, solution in code block

## RULES
- Server stays CommonJS
- Client stays TypeScript  
- No new dependencies
- Use existing generateProblem service from api.ts
- Inline styles to match existing codebase
- Timer must use setInterval + cleanup in useEffect return

