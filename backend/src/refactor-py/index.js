const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");

async function refactorPython(code) {
  // Create a temporary directory for our files
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "py-refactor-"));
  const inputFile = path.join(tempDir, "input.py");
  const outputFile = path.join(tempDir, "output.py");

  try {
    // Write the input code to a temporary file
    await fs.writeFile(inputFile, code, "utf8");

    // Run 2to3 on the file
    await new Promise((resolve, reject) => {
      const command =
        process.platform === "win32"
          ? `python -m lib2to3 -w "${inputFile}"`
          : `2to3 -w "${inputFile}"`;

      exec(command, (error, stdout, stderr) => {
        if (error && !stderr.includes("RefactoringTool: Writing")) {
          reject(new Error(`2to3 failed: ${stderr || error.message}`));
        } else {
          resolve(stdout);
        }
      });
    });

    // Read the modernized code
    const modernized = await fs.readFile(inputFile, "utf8");

    // Clean up
    await fs.rm(tempDir, { recursive: true, force: true });

    return modernized;
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
