const test = require("node:test");
const assert = require("node:assert/strict");
const {
  parseClaudeJson,
  extractJsonObject,
} = require("../utils/parseClaudeJson");

test("parseClaudeJson: plain object", () => {
  const p = parseClaudeJson(
    JSON.stringify({
      title: "T",
      description: "D",
      difficulty: "Easy",
      steps: [],
    }),
    "problem",
  );
  assert.equal(p.title, "T");
});

test("parseClaudeJson: strips fences", () => {
  const raw = '```json\n{"title":"A","description":"B","difficulty":"Hard","steps":[]}\n```';
  const p = parseClaudeJson(raw, "problem");
  assert.equal(p.title, "A");
});

test("parseClaudeJson: extracts object from prose", () => {
  const raw = 'Here you go:\n{"title":"X","description":"Y","difficulty":"Medium","steps":[]}\nThanks';
  const p = parseClaudeJson(raw, "problem");
  assert.equal(p.title, "X");
});

test("parseClaudeJson: screening shape", () => {
  const q = parseClaudeJson(
    JSON.stringify({
      title: "Q",
      question: "Why?",
      answer: { summary: "S", detailed: "D" },
    }),
    "screening",
  );
  assert.equal(q.question, "Why?");
});

test("parseClaudeJson: throws 422 for invalid problem", () => {
  assert.throws(
    () => parseClaudeJson("{}", "problem"),
    (err) => err.status === 422,
  );
});

test("extractJsonObject: braces inside string value", () => {
  const text = 'start {"a": "{}", "b": 1} end';
  const extracted = extractJsonObject(text);
  assert.ok(extracted);
  assert.deepEqual(JSON.parse(extracted), { a: "{}", b: 1 });
});
