const babel = require('@babel/core');
const Queue = require('bull');

// Redis configuration
const redisConfig = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD
  }
};

// Create refactor queue
const refactorQueue = new Queue('js-refactor-queue', redisConfig);

// Configure queue processing
refactorQueue.process(10, async (job) => {
  const { code } = job.data;
  try {
    const refactoredCode = await transformCode(code);
    return { success: true, code: refactoredCode };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

const formatCode = (code) => {
  const lines = code.split('\n');
  let indent = 0;
  const formattedLines = lines.map(line => {
    line = line.trim();
    if (line.includes('}')) indent -= 2;
    const formatted = ' '.repeat(indent) + line;
    if (line.includes('{')) indent += 2;
    return formatted;
  });
  return formattedLines.join('\n');
};

// Code transformation function
const transformCode = async (code) => {
  try {
    // First pass: Basic ES6 transformations using Babel
    const refactored = babel.transformSync(code, {
      presets: [
        ['@babel/preset-env', {
          targets: { node: 'current' },
          modules: false,
          loose: true
        }]
      ],
      plugins: [
        '@babel/plugin-transform-block-scoping',
        '@babel/plugin-transform-template-literals',
        '@babel/plugin-transform-arrow-functions',
        '@babel/plugin-transform-shorthand-properties',
        '@babel/plugin-transform-parameters'
      ],
      comments: false,
      retainLines: true,
      sourceMaps: false,
      generatorOpts: {
        retainLines: true,
        comments: false,
        compact: false,
        minified: false,
        quotes: 'single'
      }
    });
    
    let transformedCode = refactored.code
      .replace('"use strict";\n\n', '')
      .replace(/\n\n+/g, '\n')
      .trim();

    // Second pass: Additional ES6 transformations using regex
    
    // Convert var to const
    transformedCode = transformedCode
      .replace(/var\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=/g, 'const $1 =');

    // Convert string concatenation to template literals (improved version)
    transformedCode = transformedCode
      .replace(/(['"])(.*?)\1\s*\+\s*([a-zA-Z_$][0-9a-zA-Z_$]*(?:\.[a-zA-Z_$][0-9a-zA-Z_$]*)*)\s*(?:\+\s*(['"])(.*?)\4)?/g, 
        (match, q1, str1, expr, q2, str2) => {
          if (str2) {
            return `\`${str1}\${${expr}}${str2}\``;
          }
          return `\`${str1}\${${expr}}\``;
        });

    // Convert object method syntax (improved version)
    transformedCode = transformedCode
      .replace(/(\w+):\s*function\s*\(/g, '$1(')
      .replace(/{\s*return\s+([^;]+);\s*}/g, '{ return $1; }');

    // Convert standalone functions to arrow functions (when appropriate)
    transformedCode = transformedCode
      .replace(/function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(([^)]*)\)\s*{\s*return\s+([^;]+);\s*}/g,
        (match, name, params, body) => {
          // Don't convert methods that use 'this'
          if (body.includes('this')) {
            return match;
          }
          return `const ${name} = (${params}) => ${body}`;
        });

    // Handle rest parameters
    transformedCode = transformedCode
      .replace(/\(([^)]*)\)\s*{([^}]*)arguments\.length\s*>\s*1\s*\?\s*arguments\[1\]\s*:\s*{([^}]*)}/g,
        (match, params, before, after) => {
          const newParams = params.trim() ? `${params}, ...rest` : '...rest';
          return `(${newParams}) {${before}rest${after}}`;
        });

    // Apply proper formatting
    transformedCode = formatCode(transformedCode);

    return transformedCode;
  } catch (error) {
    throw new Error(`Refactoring failed: ${error.message}`);
  }
};

// Main refactoring function that will be exported
const refactorJs = async (code) => {
  try {
    const job = await refactorQueue.add({ code });
    const result = await job.finished();
    
    if (result.success) {
      return result.code;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    throw new Error(`JS Refactoring failed: ${error.message}`);
  }
};

module.exports = {
  refactorJs,
  refactorQueue
};
