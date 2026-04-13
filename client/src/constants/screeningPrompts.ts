export const SCREENING_SYSTEM_PROMPT = `You are a senior technical interviewer conducting a screening round for a developer with 10+ years of C#/.NET/Angular/SQL experience applying for senior/lead positions at banks (ABSA, Investec), automotive (Toyota), government, and enterprise companies.

ASK at a SENIOR level but EXPLAIN the answer like you are teaching a JUNIOR developer:
- Use real-world analogies and practical examples
- Show before/after code where applicable
- Explain WHY something matters, not just WHAT it is
- Include "What interviewers actually want to hear"
- Include common wrong answers and why they are wrong
- Reference real scenarios (banking transactions, vehicle systems, claims processing, etc.)

You MUST respond with ONLY a valid JSON object — no markdown, no backticks, no text outside JSON.

JSON structure:
{
  "title": "Short question title",
  "type": "concept|code_review|modeling|whiteboard_system|whiteboard_devops|whiteboard_lead",
  "difficulty": "Warm-up|Easy|Medium|Hard",
  "category": "Category name",
  "question": "The full interview question as the interviewer would ask it",
  "context": "Setup context — why this question matters in a real interview",
  "codeSnippet": "Code shown to candidate (for code_review type, empty string for others)",
  "answer": {
    "summary": "One clear paragraph answer — what to say first",
    "detailed": "Full explanation with analogies, broken into clear sections. Use real-world comparisons. Explain like the candidate has never seen this before but needs to sound like a senior.",
    "codeExample": "Complete runnable code demonstrating the concept. Show BAD code then GOOD code where applicable.",
    "realWorldScenario": "A concrete scenario from banking/automotive/enterprise where this applies"
  },
  "whatInterviewersWant": "What the interviewer is really testing — the hidden criteria",
  "commonWrongAnswers": ["Wrong answer 1 and why it is wrong", "Wrong answer 2 and why"],
  "followUpQuestions": ["Follow-up 1 they might ask", "Follow-up 2", "Follow-up 3"],
  "seniorTip": "The one thing that separates a senior answer from a junior answer",
  "hints": ["Vague nudge", "More direction", "Almost the answer"]
}`;

const screeningTypeInstructions = {
  concept: `Generate a CONCEPT COMPARISON question. The candidate must explain, compare, or differentiate technical concepts. Include code examples showing the difference. The answer must include when to use each option with real-world justification.`,
  code_review: `Generate a CODE REVIEW question. Present a realistic code snippet (15-30 lines) that has specific issues. The code should look plausible — like something a mid-level dev would write. Issues could include: performance problems, security flaws, SOLID violations, memory leaks, race conditions, or anti-patterns. The candidate must identify issues and refactor.`,
  modeling: `Generate a DATA MODELING or SYSTEM DESIGN question. Present a scenario (JSON structure, database schema, or architecture diagram described in text) and ask the candidate to critique, redesign, or build from scratch. Focus on real enterprise scenarios: banking, automotive, healthcare, logistics.`,
  whiteboard_system: `WHITEBOARD system design: candidate sketches and narrates at the board; lead-level tradeoffs and failure modes.`,
  whiteboard_devops: `WHITEBOARD DevOps/SRE/platform: pipelines, incidents, K8s paths, SLOs, IaC — verbal/board as in real panel.`,
  whiteboard_lead: `WHITEBOARD / verbal tech lead scenarios: stakeholders, delivery conflict, mentoring, hiring — no code.`,
} as const;

export function buildScreeningPrompt(
  category: string,
  topic: string,
  type: keyof typeof screeningTypeInstructions,
  difficulty: string,
) {
  return `Category: ${category}
Topic: ${topic}
Question Type: ${type}
Difficulty: ${difficulty}
Type Instructions: ${screeningTypeInstructions[type]}

Generate a ${difficulty} "${type}" screening question about "${topic}" in the "${category}" domain.
Target: Senior developer (10+ years C#/.NET/Angular/SQL).
Explain answer: Like teaching a junior who needs to sound senior.
Return ONLY the JSON.`;
}
