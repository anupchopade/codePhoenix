const { parse } = require("@babel/parser");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const { diffLines } = require("diff");

async function refactorJs(code) {
  try {
    const changes = [];

    // Parse the code into an AST
    const ast = parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript", "classProperties"],
    });

    // Transform the AST
    traverse(ast, {
      // Convert var to let/const
      VariableDeclaration(path) {
        if (path.node.kind === "var") {
          const oldCode = generate(path.node).code;
          path.node.kind = "const";
          const newCode = generate(path.node).code;
          changes.push({
            type: "VariableDeclaration",
            description: "Converted 'var' to 'const'",
            location: path.node.loc,
            oldCode,
            newCode,
          });
        }
      },
      // Convert function declarations to arrow functions
      FunctionDeclaration(path) {
        if (!path.node.generator && !path.node.async) {
          const oldCode = generate(path.node).code;
          const arrowFunction = t.arrowFunctionExpression(
            path.node.params,
            path.node.body
          );
          const variableDeclaration = t.variableDeclaration("const", [
            t.variableDeclarator(
              t.identifier(path.node.id.name),
              arrowFunction
            ),
          ]);
          path.replaceWith(variableDeclaration);
          const newCode = generate(variableDeclaration).code;
          changes.push({
            type: "FunctionDeclaration",
            description: "Converted function declaration to arrow function",
            location: path.node.loc,
            oldCode,
            newCode,
          });
        }
      },
      // Convert string concatenation to template literals
      BinaryExpression(path) {
        if (
          path.node.operator === "+" &&
          (t.isStringLiteral(path.node.left) ||
            t.isStringLiteral(path.node.right))
        ) {
          const oldCode = generate(path.node).code;

          // Collect all parts of the concatenation
          const parts = [];
          let current = path.node;
          while (t.isBinaryExpression(current) && current.operator === "+") {
            parts.unshift(current.right);
            current = current.left;
          }
          parts.unshift(current);

          // Create template elements and expressions
          const quasis = [];
          const expressions = [];
          let templateString = "";

          parts.forEach((part, index) => {
            if (t.isStringLiteral(part)) {
              templateString += part.value;
            } else {
              expressions.push(part);
              quasis.push(
                t.templateElement(
                  { raw: templateString, cooked: templateString },
                  false
                )
              );
              templateString = "";
            }
          });

          // Add the final quasi
          quasis.push(
            t.templateElement(
              { raw: templateString, cooked: templateString },
              true
            )
          );

          const template = t.templateLiteral(quasis, expressions);
          path.replaceWith(template);

          const newCode = generate(template).code;
          changes.push({
            type: "StringConcatenation",
            description: "Converted string concatenation to template literal",
            location: path.node.loc,
            oldCode,
            newCode,
          });
        }
      },
    });

    // Generate the modernized code
    const output = generate(ast, {}, code);
    const modernized = output.code;

    // Generate diff between original and modernized code
    const diffResult = diffLines(code, modernized);
    const diff = diffResult
      .map((part) => ({
        value: part.value.trim(),
        added: part.added || false,
        removed: part.removed || false,
      }))
      .filter((part) => part.value.length > 0);

    return {
      modernizedCode: modernized,
      changes: changes,
      diff: diff,
      refactoringDetails: {
        tool: "Babel",
        transformations: changes.length,
        transformationTypes: [...new Set(changes.map((c) => c.type))],
      },
    };
  } catch (error) {
    throw new Error(`Failed to refactor JavaScript: ${error.message}`);
  }
}

module.exports = { refactorJs };
