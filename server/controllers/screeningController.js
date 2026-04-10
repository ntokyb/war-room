const Screening = require("../models/Screening");

const SCREENING_SYSTEM_PROMPT = `You are a senior technical interviewer conducting a screening round for a developer with 10+ years of C#/.NET/Angular/SQL experience applying for senior/lead positions at banks (ABSA, Investec), automotive (Toyota), government, and enterprise companies.

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
  "type": "concept|code_review|modeling",
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

function buildScreeningPrompt(category, topic, type, difficulty) {
  const typeInstructions = {
    concept: `Generate a CONCEPT COMPARISON question. The candidate must explain, compare, or differentiate technical concepts. Include code examples showing the difference. The answer must include when to use each option with real-world justification.`,
    code_review: `Generate a CODE REVIEW question. Present a realistic code snippet (15-30 lines) that has specific issues. The code should look plausible — like something a mid-level dev would write. Issues could include: performance problems, security flaws, SOLID violations, memory leaks, race conditions, or anti-patterns. The candidate must identify issues and refactor.`,
    modeling: `Generate a DATA MODELING or SYSTEM DESIGN question. Present a scenario (JSON structure, database schema, or architecture diagram described in text) and ask the candidate to critique, redesign, or build from scratch. Focus on real enterprise scenarios: banking, automotive, healthcare, logistics.`,
  };

  return `Category: ${category}
Topic: ${topic}
Question Type: ${type}
Difficulty: ${difficulty}
Type Instructions: ${typeInstructions[type] || typeInstructions.concept}

Generate a ${difficulty} "${type}" screening question about "${topic}" in the "${category}" domain.
Target: Senior developer (10+ years C#/.NET/Angular/SQL).
Explain answer: Like teaching a junior who needs to sound senior.
Return ONLY the JSON.`;
}

async function generate(req, res, next) {
  try {
    const { category, topic, type, difficulty, forceNew } = req.body;

    if (!category || !topic || !type || !difficulty) {
      const err = new Error(
        "Missing required fields: category, topic, type, difficulty",
      );
      err.status = 400;
      throw err;
    }

    // Cache-first
    if (!forceNew) {
      const cached = Screening.findCached(category, topic, type, difficulty);
      if (cached) {
        console.log(
          `Screening cache HIT: ${category}/${topic}/${type}/${difficulty}`,
        );
        return res.json({
          question: JSON.parse(cached.response_json),
          cached: true,
          id: cached.id,
        });
      }
    }

    console.log(
      `Screening cache MISS: ${category}/${topic}/${type}/${difficulty} — calling Claude`,
    );

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      const err = new Error("ANTHROPIC_API_KEY not configured");
      err.status = 500;
      throw err;
    }

    const fetch = (await import("node-fetch")).default;
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: SCREENING_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: buildScreeningPrompt(category, topic, type, difficulty),
          },
        ],
      }),
    });

    if (!claudeRes.ok) {
      const body = await claudeRes.text();
      console.error("Claude API error:", claudeRes.status, body);
      const err = new Error(`Claude API returned ${claudeRes.status}`);
      err.status = 502;
      throw err;
    }

    const claudeData = await claudeRes.json();
    const text =
      claudeData.content?.find((b) => b.type === "text")?.text ??
      claudeData.content?.[0]?.text ??
      "";

    const cleaned = text.replace(/```json|```/g, "").trim();
    const question = JSON.parse(cleaned);

    const id = Screening.save(
      category,
      topic,
      type,
      difficulty,
      question,
      question.title,
    );
    console.log(`Saved screening #${id}: "${question.title}"`);

    res.json({ question, cached: false, id });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const { category, type, difficulty, limit, offset } = req.query;
    const result = Screening.findAll({
      category,
      type,
      difficulty,
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0,
    });

    const questions = result.rows.map((r) => ({
      ...r,
      response_json: JSON.parse(r.response_json),
    }));

    res.json({ questions, total: result.total });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      const err = new Error("Invalid screening ID");
      err.status = 400;
      throw err;
    }

    const row = Screening.findById(id);
    if (!row) {
      const err = new Error("Screening question not found");
      err.status = 404;
      throw err;
    }

    res.json({
      ...row,
      response_json: JSON.parse(row.response_json),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { generate, list, getById };
