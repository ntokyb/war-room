require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { initDb } = require("./config/db");
const problemRoutes = require("./routes/problemRoutes");
const screeningRoutes = require("./routes/screeningRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDb();

// Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", problemRoutes);
app.use("/api", screeningRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`War Room server running on http://localhost:${PORT}`);
});
