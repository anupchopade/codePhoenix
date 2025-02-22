const ESLint = require('eslint').ESLint;
const prettier = require('prettier');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

async function correctJavaScript(code) {
  try {
    const eslint = new ESLint({
      useEslintrc: false,
      fix: true,
      overrideConfig: {
        env: {
          browser: true,
          node: true,
          es6: true
        },
        parserOptions: {
          ecmaVersion: 2021,
          sourceType: 'module'
        },
        rules: {
          'semi': ['error', 'always'],
          'no-unused-vars': 'warn',
          'no-undef': 'error',
          'eqeqeq': ['error', 'always'],
          'prefer-const': 'error',
          'space-infix-ops': 'error',
          'space-before-blocks': 'error',
          'keyword-spacing': 'error'
        }
      }
    });

    const results = await eslint.lintText(code);
    const result = results[0];

    const formattedCode = await prettier.format(result.output || code, {
      parser: 'babel',
      semi: true,
      singleQuote: true,
      trailingComma: 'es5',
      bracketSpacing: true,
      printWidth: 80,
    });

    const issues = result.messages.map(msg => ({
      line: msg.line,
      column: msg.column,
      severity: msg.severity,
      message: msg.message,
      ruleId: msg.ruleId
    }));

    const syntaxIssues = issues.filter(issue => 
      ['semi', 'space-before-blocks', 'keyword-spacing'].includes(issue.ruleId)
    );
    const styleIssues = issues.filter(issue => 
      ['prefer-const', 'space-infix-ops'].includes(issue.ruleId)
    );
    const logicIssues = issues.filter(issue => 
      ['eqeqeq', 'no-unused-vars', 'no-undef'].includes(issue.ruleId)
    );

    return {
      original: code,
      corrected: formattedCode,
      issues: issues,
      corrections: {
        syntaxFixed: syntaxIssues.length > 0,
        styleFixed: styleIssues.length > 0,
        potentialRuntimeIssues: logicIssues
      }
    };
  } catch (error) {
    return {
      original: code,
      error: error.message
    };
  }
}

async function correctPython(code) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'py-correct-'));
  const inputFile = path.join(tempDir, 'input.py');

  try {
    // Write input code to temporary file
    await fs.writeFile(inputFile, code, 'utf8');

    // Run autopep8 for code style fixes
    const styleFixResult = await new Promise((resolve, reject) => {
      const command = `autopep8 --aggressive --aggressive --in-place "${inputFile}" 2>&1`;
      exec(command, async (error, stdout, stderr) => {
        if (error && !stderr.includes('No issues found')) {
          reject(new Error(`autopep8 failed: ${stderr || error.message}`));
        }
        resolve(await fs.readFile(inputFile, 'utf8'));
      });
    });

    // Run pyflakes for error detection
    const issues = await new Promise((resolve, reject) => {
      exec(`pyflakes "${inputFile}" 2>&1`, (error, stdout, stderr) => {
        const issues = (stderr || stdout).split('\n')
          .filter(Boolean)
          .map(issue => {
            const match = issue.match(/input.py:(\d+):(\d+):\s(.+)/);
            return match ? {
              line: parseInt(match[1]),
              column: parseInt(match[2]),
              severity: 2,
              message: match[3],
              ruleId: 'pyflakes-error'
            } : {
              line: 1,
              column: 1,
              severity: 2,
              message: issue,
              ruleId: 'pyflakes-error'
            };
          });
        resolve(issues);
      });
    });

    // Clean up temporary files
    await fs.rm(tempDir, { recursive: true, force: true });

    return {
      original: code,
      corrected: styleFixResult,
      issues,
      corrections: {
        syntaxFixed: true,
        styleFixed: true,
        potentialRuntimeIssues: issues
      }
    };
  } catch (error) {
    // Clean up on error
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error('Failed to clean up temporary files:', cleanupError);
    }
    return {
      original: code,
      error: error.message
    };
  }
}

module.exports = { correctJavaScript, correctPython }; 