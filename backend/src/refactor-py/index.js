const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");
const { diffLines } = require("diff");

async function refactorPython(code) {
  // Create a temporary directory for our files
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "py-refactor-"));
  const inputFile = path.join(tempDir, "input.py");
  const outputFile = path.join(tempDir, "output.py");

  try {
    // Write the input code to a temporary file
    await fs.writeFile(inputFile, code, "utf8");

    // Run 2to3 on the file
    const changes = await new Promise((resolve, reject) => {
      const command =
        process.platform === "win32"
          ? `python -m lib2to3 -w "${inputFile}" 2>&1`
          : `2to3 -w "${inputFile}" 2>&1`;

      exec(command, (error, stdout, stderr) => {
        // 2to3 outputs its changes to stderr
        const output = stderr || stdout;
        if (error && !output.includes("RefactoringTool: Writing")) {
          reject(new Error(`2to3 failed: ${output || error.message}`));
        } else {
          // Parse the changes from 2to3 output
          const changesList = output
            .split("\n")
            .filter(
              (line) =>
                line.includes("RefactoringTool:") && !line.includes("Writing")
            )
            .map((line) => line.replace("RefactoringTool: ", ""))
            .filter(Boolean);
          resolve(changesList);
        }
      });
    });

    // Read the modernized code
    const modernized = await fs.readFile(inputFile, "utf8");

    // Generate diff between original and modernized code
    const diffResult = diffLines(code, modernized);
    const diff = diffResult
      .map((part) => ({
        value: part.value.trim(),
        added: part.added || false,
        removed: part.removed || false,
      }))
      .filter((part) => part.value.length > 0);

    // Clean up
    await fs.rm(tempDir, { recursive: true, force: true });

    return {
      modernizedCode: modernized,
      changes: changes,
      diff: diff,
      refactoringDetails: {
        tool: "2to3",
        pythonVersion: "3.x",
        transformations: changes.length,
      },
    };
  } catch (error) {
    // Clean up on error
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error("Failed to clean up temporary files:", cleanupError);
    }
    throw new Error(`Failed to refactor Python: ${error.message}`);
  }
}

module.exports = { refactorPython };
