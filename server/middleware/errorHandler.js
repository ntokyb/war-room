function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  if (status >= 500) console.error("Error:", err.message, err.stack || "");
  else console.error("Error:", err.message);

  const message =
    status === 500 ? "Internal server error" : err.message || "Request error";

  const body = { error: message };
  if (err.code) body.code = err.code;
  res.status(status).json(body);
}

module.exports = errorHandler;
