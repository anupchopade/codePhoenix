const express = require("express");
const cors = require("cors");
const { refactorJs } = require("./refactor-js/index.js");
const { refactorPython } = require("./refactor-py/index.js");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Code modernization endpoint
app.post("/api/modernize", async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({
      error: "Missing required fields: code and language are required",
    });
  }

  try {
    let result;
    if (language === "javascript") {
      result = await refactorJs(code);
    } else if (language === "python") {
      result = await refactorPython(code);
    } else {
      return res.status(400).json({
        error:
          "Unsupported language. Supported languages are: javascript, python",
      });
    }

    res.json({
      original: code,
      modernized: result.modernizedCode,
      changes: result.changes,
      diff: result.diff,
      refactoringDetails: result.refactoringDetails,
    });
  } catch (error) {
    console.error("Modernization error:", error);
    res.status(500).json({
      error: "Failed to modernize code",
      details: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something broke!",
    details: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
