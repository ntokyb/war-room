const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const middlewarePath = path.join(__dirname, "..", "middleware", "requireApiKey.js");

function loadRequireApiKey() {
  delete require.cache[require.resolve(middlewarePath)];
  return require(middlewarePath);
}

test("requireApiKey: no-op when WAR_ROOM_API_KEY unset", () => {
  delete process.env.WAR_ROOM_API_KEY;
  const requireApiKey = loadRequireApiKey();
  let nextRan = false;
  const req = { headers: {} };
  const res = {
    status() {
      assert.fail("should not set status");
    },
  };
  requireApiKey(req, res, () => {
    nextRan = true;
  });
  assert.equal(nextRan, true);
});

test("requireApiKey: 401 when key set and header missing", () => {
  process.env.WAR_ROOM_API_KEY = "secret-test-key";
  const requireApiKey = loadRequireApiKey();
  const req = { headers: {} };
  let statusCode;
  const res = {
    status(c) {
      statusCode = c;
      return { json() {} };
    },
  };
  requireApiKey(req, res, () => assert.fail("next should not run"));
  assert.equal(statusCode, 401);
  delete process.env.WAR_ROOM_API_KEY;
});

test("requireApiKey: next when Bearer matches", () => {
  process.env.WAR_ROOM_API_KEY = "abc123";
  const requireApiKey = loadRequireApiKey();
  let nextRan = false;
  const req = { headers: { authorization: "Bearer abc123" } };
  const res = {};
  requireApiKey(req, res, () => {
    nextRan = true;
  });
  assert.equal(nextRan, true);
  delete process.env.WAR_ROOM_API_KEY;
});
