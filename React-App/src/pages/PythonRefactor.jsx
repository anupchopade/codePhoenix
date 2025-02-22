import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Refactor.css';

function PythonRefactor() {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');

  const handleInputChange = (e) => {
    setInputCode(e.target.value);
    // Simple example transformation
    const sampleOutput = `# Modernized Python
def modern_function(params):
    """
    Modern Python implementation
    """
    # Modernized code will appear here
    return params`;
    setOutputCode(sampleOutput);
  };

  return (
    <div className="refactor-container">
      <Link to="/" className="back-button">
        <span className="gradient-text">←</span> Back to Home
      </Link>
      
      <h1 className="refactor-title">
        Python <span className="gradient-text">Refactoring</span>
      </h1>
      
      <div className="code-container">
        <div className="code-section input-section gradient-border">
          <div className="section-header">
            <h2>Original Code</h2>
            <div className="window-controls">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <textarea
            className="code-input"
            value={inputCode}
            onChange={handleInputChange}
            placeholder="Paste your Python code here..."
          />
        </div>
        
        <div className="code-section output-section gradient-border">
          <div className="section-header">
            <h2>Modernized Code</h2>
            <div className="window-controls">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <pre className="code-output">
            <code>{outputCode}</code>
          </pre>
        </div>
      </div>

      <div className="action-buttons">
        <button className="primary-button">Copy Modernized Code</button>
        <button className="secondary-button">Reset</button>
      </div>
    </div>
  );
}

export default PythonRefactor; 