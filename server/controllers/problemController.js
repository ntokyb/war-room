const Problem = require("../models/Problem");

const SYSTEM_PROMPT = `You are a senior engineer and technical interview coach. You generate authentic coding practice problems that precisely mirror real assessments on specific platforms. You MUST respond with ONLY a valid JSON object — no markdown, no backticks, no text outside JSON.

JSON structure:
{
  "title": "Problem title",
  "difficulty": "Easy|Medium|Hard",
  "platformNotes": "How this platform scores this type of problem",
  "description": "Full problem statement with examples and sample input/output",
  "constraints": ["constraint 1", "constraint 2"],
  "realWorldContext": "Where a real dev would encounter this",
  "ideSetup": ["Step 1", "Step 2", "Step 3"],
  "thinkingProcess": ["Question 1", "Question 2", "Question 3", "Question 4"],
  "steps": [
    { "step": 1, "title": "Step title", "explanation": "Why we do this", "code": "// code" },
    { "step": 2, "title": "Step title", "explanation": "...", "code": "// code" },
    { "step": 3, "title": "Step title", "explanation": "...", "code": "// code" },
    { "step": 4, "title": "Wire up and test", "explanation": "...", "code": "// full runnable code" }
  ],
  "fullSolution": "// Complete solution with comments",
  "commonMistakes": ["Mistake 1", "Mistake 2"],
  "complexity": { "time": "O(?) — plain English", "space": "O(?) — plain English" },
  "seniorTip": "One golden insight",
  "hints": ["Vague nudge", "More specific", "Almost gives it away"]
}`;

function buildUserPrompt(
  platform,
  platformFocus,
  language,
  category,
  difficulty,
) {
  return `Platform: ${platform}
Language: ${language}
Category: ${category}
Difficulty: ${difficulty}
Platform context: ${platformFocus}

Generate a ${difficulty} ${category} problem in ${language} that authentically mirrors what appears on ${platform}. Return ONLY the JSON.`;
}

async function generate(req, res, next) {
  try {
    const {
      platform,
      platformFocus,
      language,
      category,
      difficulty,
      forceNew,
    } = req.body;

    if (!platform || !language || !category || !difficulty) {
      const err = new Error(
        "Missing required fields: platform, language, category, difficulty",
      );
      err.status = 400;
      throw err;
    }

    // Cache-first: check if we already have a problem for this combo
    if (!forceNew) {
      const cached = Problem.findCached(
        platform,
        language,
        category,
        difficulty,
      );
      if (cached) {
        console.log(
          `Cache HIT: ${platform}/${language}/${category}/${difficulty}`,
        );
        return res.json({
          problem: JSON.parse(cached.response_json),
          cached: true,
          id: cached.id,
        });
      }
    }

    console.log(
      `Cache MISS: ${platform}/${language}/${category}/${difficulty} — calling Claude`,
    );

    // Call Claude API
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
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: buildUserPrompt(
              platform,
              platformFocus || "",
              language,
              category,
              difficulty,
            ),
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
    const problem = JSON.parse(cleaned);

    // Save to cache
    const id = Problem.save(
      platform,
      language,
      category,
      difficulty,
      problem,
      problem.title,
    );
    console.log(`Saved problem #${id}: "${problem.title}"`);

    res.json({ problem, cached: false, id });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const { platform, language, category, difficulty, limit, offset } =
      req.query;
    const result = Problem.findAll({
      platform,
      language,
      category,
      difficulty,
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      const err = new Error("Invalid problem ID");
      err.status = 400;
      throw err;
    }

    const row = Problem.findById(id);
    if (!row) {
      const err = new Error("Problem not found");
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
