const { parse } = require("@babel/parser");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");

async function refactorJs(code) {
  try {
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
          path.node.kind = "const";
        }
      },
      // Convert function declarations to arrow functions where appropriate
      FunctionDeclaration(path) {
        if (!path.node.generator && !path.node.async) {
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
        }
      },
    });

    // Generate the modernized code
    const output = generate(ast, {}, code);
    return output.code;
  } catch (error) {
    throw new Error(`Failed to refactor JavaScript: ${error.message}`);
  }
}

module.exports = { refactorJs };
