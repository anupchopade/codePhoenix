const ESLint = require("eslint").ESLint;
const prettier = require("prettier");
const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");

async function correctJavaScript(code) {
  if (!code || typeof code !== "string") {
    return {
      original: code || "",
      error: "Invalid input: code must be a non-empty string",
    };
  }

  try {
    const eslint = new ESLint({
      useEslintrc: false,
      fix: true,
      overrideConfig: {
        env: {
          browser: true,
          node: true,
          es6: true,
        },
        parserOptions: {
          ecmaVersion: 2021,
          sourceType: "module",
        },
        rules: {
          semi: ["error", "always"],
          "no-unused-vars": "warn",
          "no-undef": "error",
          eqeqeq: ["error", "always"],
          "prefer-const": "error",
          "space-infix-ops": "error",
          "space-before-blocks": "error",
          "keyword-spacing": "error",
        },
      },
    });

    const results = await eslint.lintText(code);
    const result = results[0];

    if (!result) {
      throw new Error("ESLint failed to process the code");
    }

    const formattedCode = await prettier.format(result.output || code, {
      parser: "babel",
      semi: true,
      singleQuote: true,
      trailingComma: "es5",
      bracketSpacing: true,
      printWidth: 80,
    });

    const issues = (result.messages || []).map((msg) => ({
      line: msg.line || 1,
      column: msg.column || 1,
      severity: msg.severity || 1,
      message: msg.message || "Unknown issue",
      ruleId: msg.ruleId || "unknown",
    }));

    // Generate detailed changes by comparing original and corrected code
    const changes = [];
    const originalLines = (code || "").split("\n");
    const correctedLines = (formattedCode || "").split("\n");

    let lineNumber = 1;
    for (
      let i = 0;
      i < Math.max(originalLines.length, correctedLines.length);
      i++
    ) {
      const originalLine = originalLines[i] || "";
      const correctedLine = correctedLines[i] || "";
      const trimmedOriginal = originalLine.trim();
      const trimmedCorrected = correctedLine.trim();

      if (trimmedOriginal !== trimmedCorrected) {
        if (!trimmedOriginal && trimmedCorrected) {
          changes.push({
            type: "added",
            lineNumber: lineNumber,
            content: trimmedCorrected,
            description: "Added missing line",
          });
        } else if (trimmedOriginal && !trimmedCorrected) {
          changes.push({
            type: "removed",
            lineNumber: lineNumber,
            content: trimmedOriginal,
            description: "Removed unnecessary line",
          });
        } else {
          const changeDetails = generateChangeDescription(
            trimmedOriginal,
            trimmedCorrected
          );
          changes.push({
            type: "modified",
            lineNumber: lineNumber,
            content: trimmedOriginal,
            newLineNumber: lineNumber,
            newContent: trimmedCorrected,
            description: changeDetails.description,
            changeTypes: changeDetails.changeTypes,
            fullContext: {
              original: {
                line: originalLine,
                indent: originalLine.length - trimmedOriginal.length,
                content: trimmedOriginal,
              },
              corrected: {
                line: correctedLine,
                indent: correctedLine.length - trimmedCorrected.length,
                content: trimmedCorrected,
              },
            },
          });
        }
      }
      lineNumber++;
    }

    const syntaxIssues = issues.filter((issue) =>
      ["semi", "space-before-blocks", "keyword-spacing"].includes(issue.ruleId)
    );
    const styleIssues = issues.filter((issue) =>
      ["prefer-const", "space-infix-ops"].includes(issue.ruleId)
    );
    const logicIssues = issues.filter((issue) =>
      ["eqeqeq", "no-unused-vars", "no-undef"].includes(issue.ruleId)
    );

    return {
      original: code,
      corrected: formattedCode,
      issues: issues,
      changes: changes,
      corrections: {
        syntaxFixed: syntaxIssues.length > 0,
        styleFixed: styleIssues.length > 0,
        potentialRuntimeIssues: logicIssues,
      },
    };
  } catch (error) {
    console.error("JavaScript correction error:", error);
    return {
      original: code || "",
      error: error.message || "Failed to correct JavaScript code",
    };
  }
}

async function correctPython(code) {
  if (!code || typeof code !== "string") {
    return {
      original: code || "",
      error: "Invalid input: code must be a non-empty string",
    };
  }

  let tempDir = null;
  try {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "py-correct-"));
    const inputFile = path.join(tempDir, "input.py");

    // Write input code to temporary file
    await fs.writeFile(inputFile, code, "utf8");

    // Run autopep8 for code style fixes
    const styleFixResult = await new Promise((resolve, reject) => {
      const command = `autopep8 --aggressive --aggressive --in-place "${inputFile}" 2>&1`;
      exec(command, async (error, stdout, stderr) => {
        if (error && !stderr?.includes("No issues found")) {
          reject(new Error(`autopep8 failed: ${stderr || error.message}`));
        }
        try {
          const result = await fs.readFile(inputFile, "utf8");
          resolve(result || code);
        } catch (readError) {
          reject(readError);
        }
      });
    });

    // Run pyflakes for error detection
    const issues = await new Promise((resolve, reject) => {
      exec(`pyflakes "${inputFile}" 2>&1`, (error, stdout, stderr) => {
        const issues = (stderr || stdout || "")
          .split("\n")
          .filter(Boolean)
          .map((issue) => {
            const match = issue.match(/input.py:(\d+):(\d+):\s(.+)/);
            return match
              ? {
                  line: parseInt(match[1]) || 1,
                  column: parseInt(match[2]) || 1,
                  severity: 2,
                  message: match[3] || issue,
                  ruleId: "pyflakes-error",
                }
              : {
                  line: 1,
                  column: 1,
                  severity: 2,
                  message: issue,
                  ruleId: "pyflakes-error",
                };
          });
        resolve(issues);
      });
    });

    // Generate detailed changes
    const changes = [];
    const originalLines = (code || "").split("\n");
    const correctedLines = (styleFixResult || "").split("\n");

    let lineNumber = 1;
    for (
      let i = 0;
      i < Math.max(originalLines.length, correctedLines.length);
      i++
    ) {
      const originalLine = originalLines[i] || "";
      const correctedLine = correctedLines[i] || "";
      const trimmedOriginal = originalLine.trim();
      const trimmedCorrected = correctedLine.trim();

      if (trimmedOriginal !== trimmedCorrected) {
        if (!trimmedOriginal && trimmedCorrected) {
          changes.push({
            type: "added",
            lineNumber: lineNumber,
            content: trimmedCorrected,
            description: "Added missing line",
          });
        } else if (trimmedOriginal && !trimmedCorrected) {
          changes.push({
            type: "removed",
            lineNumber: lineNumber,
            content: trimmedOriginal,
            description: "Removed unnecessary line",
          });
        } else {
          const changeDetails = generateChangeDescription(
            trimmedOriginal,
            trimmedCorrected
          );
          changes.push({
            type: "modified",
            lineNumber: lineNumber,
            content: trimmedOriginal,
            newLineNumber: lineNumber,
            newContent: trimmedCorrected,
            description: changeDetails.description,
            changeTypes: changeDetails.changeTypes,
            fullContext: {
              original: {
                line: originalLine,
                indent: originalLine.length - trimmedOriginal.length,
                content: trimmedOriginal,
              },
              corrected: {
                line: correctedLine,
                indent: correctedLine.length - trimmedCorrected.length,
                content: trimmedCorrected,
              },
            },
          });
        }
      }
      lineNumber++;
    }

    return {
      original: code,
      corrected: styleFixResult,
      issues,
      changes,
      corrections: {
        syntaxFixed: true,
        styleFixed: true,
        potentialRuntimeIssues: issues,
      },
    };
  } catch (error) {
    console.error("Python correction error:", error);
    return {
      original: code || "",
      error: error.message || "Failed to correct Python code",
    };
  } finally {
    // Clean up temporary files
    if (tempDir) {
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error("Failed to clean up temporary files:", cleanupError);
      }
    }
  }
}

function generateChangeDescription(originalLine, correctedLine) {
  if (!originalLine || !correctedLine) {
    return {
      description: "Changed line content",
      changeTypes: [],
    };
  }

  const changes = [];

  // Check for semicolon changes
  if (!originalLine.includes(";") && correctedLine.includes(";")) {
    changes.push("Added missing semicolon");
  }

  // Check for spacing changes around operators
  const operators = ["=", "+", "-", "*", "/", "%", "==", "===", "!=", "!=="];
  for (const op of operators) {
    if (originalLine.includes(op)) {
      const hasSpaceBefore = originalLine.includes(` ${op}`);
      const hasSpaceAfter = originalLine.includes(`${op} `);
      const correctedHasSpaces = correctedLine.includes(` ${op} `);

      if (!hasSpaceBefore || !hasSpaceAfter) {
        if (correctedHasSpaces) {
          changes.push(`Fixed spacing around '${op}' operator`);
        }
      }
    }
  }

  // Check for var to const/let conversion
  if (
    originalLine.startsWith("var ") &&
    (correctedLine.startsWith("const ") || correctedLine.startsWith("let "))
  ) {
    changes.push(`Changed 'var' to '${correctedLine.split(" ")[0]}'`);
  }

  // Check for indentation changes
  const originalIndent = originalLine.length - originalLine.trimLeft().length;
  const correctedIndent =
    correctedLine.length - correctedLine.trimLeft().length;
  if (originalIndent !== correctedIndent) {
    const diff = Math.abs(correctedIndent - originalIndent);
    const direction =
      correctedIndent > originalIndent ? "increased" : "decreased";
    changes.push(`${direction} indentation by ${diff} spaces`);
  }

  // Check for string concatenation to template literal
  if (originalLine.includes("+") && correctedLine.includes("${")) {
    changes.push("Converted string concatenation to template literal");
  }

  // Check for parentheses spacing
  if (
    (originalLine.includes("(") || originalLine.includes(")")) &&
    (correctedLine.match(/\(\s/) || correctedLine.match(/\s\)/))
  ) {
    changes.push("Fixed function call/parentheses spacing");
  }

  // Check for bracket spacing
  if (
    (originalLine.includes("{") || originalLine.includes("}")) &&
    (correctedLine.match(/{\s/) || correctedLine.match(/\s}/))
  ) {
    changes.push("Fixed curly bracket spacing");
  }

  // Check for trailing/leading spaces
  if (
    originalLine.trim() !== originalLine &&
    correctedLine.trim() === correctedLine
  ) {
    changes.push("Removed unnecessary whitespace");
  }

  return {
    description:
      changes.length > 0 ? changes.join(", ") : "Modified line content",
    changeTypes: changes,
  };
}

module.exports = { correctJavaScript, correctPython };
