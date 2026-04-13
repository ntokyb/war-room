/**
 * Extract and parse JSON from Claude (often wrapped in fences or extra prose).
 */

function stripFences(text) {
  return String(text)
    .replace(/```json\s*/gi, "")
    .replace(/```/g, "")
    .trim();
}

/**
 * First top-level JSON object by brace matching (respects strings).
 * @param {string} text
 * @returns {string | null}
 */
function extractJsonObject(text) {
  const start = text.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (c === "\\" && inString) {
      escape = true;
      continue;
    }
    if (c === '"' && !escape) inString = !inString;
    if (!inString) {
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) return text.slice(start, i + 1);
      }
    }
  }
  return null;
}

function validationError(message) {
  const err = new Error(message);
  err.status = 422;
  err.code = "INVALID_RESPONSE";
  return err;
}

function validateProblem(p) {
  const missing = [];
  if (typeof p.title !== "string" || !p.title.trim()) missing.push("title");
  if (typeof p.description !== "string" || !p.description.trim()) {
    missing.push("description");
  }
  if (typeof p.difficulty !== "string" || !p.difficulty.trim()) {
    missing.push("difficulty");
  }
  if (!Array.isArray(p.steps)) missing.push("steps");
  if (missing.length) {
    throw validationError(
      `Invalid problem payload: missing or invalid ${missing.join(", ")}`,
    );
  }
}

function validateScreening(q) {
  const missing = [];
  if (typeof q.title !== "string" || !q.title.trim()) missing.push("title");
  if (typeof q.question !== "string" || !q.question.trim()) {
    missing.push("question");
  }
  if (!q.answer || typeof q.answer !== "object") missing.push("answer");
  else {
    if (typeof q.answer.summary !== "string") missing.push("answer.summary");
    if (typeof q.answer.detailed !== "string") {
      missing.push("answer.detailed");
    }
  }
  if (missing.length) {
    throw validationError(
      `Invalid screening payload: missing or invalid ${missing.join(", ")}`,
    );
  }
}

/**
 * @param {string} rawText
 * @param {"problem" | "screening"} kind
 * @returns {object}
 */
function parseClaudeJson(rawText, kind) {
  const cleaned = stripFences(rawText);
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const extracted = extractJsonObject(cleaned);
    if (!extracted) {
      throw validationError(
        "Model response was not valid JSON — try generating again.",
      );
    }
    try {
      parsed = JSON.parse(extracted);
    } catch {
      throw validationError(
        "Could not parse a JSON object from the model response.",
      );
    }
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw validationError("Model returned JSON that is not an object.");
  }

  if (kind === "problem") validateProblem(parsed);
  else if (kind === "screening") validateScreening(parsed);
  else throw new Error(`Unknown parse kind: ${kind}`);

  return parsed;
}

module.exports = {
  parseClaudeJson,
  stripFences,
  extractJsonObject,
};
