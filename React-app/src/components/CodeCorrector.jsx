import React, { useState } from 'react';
import { toast } from 'react-toastify';
import '../styles/CodeCorrector.css';

const CodeCorrector = () => {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [corrections, setCorrections] = useState(null);

  const handleCorrect = async () => {
    if (!inputCode.trim()) {
      toast.error('Please enter some code to correct');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/correct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: inputCode,
          language: language,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to correct code');
      }

      setOutputCode(data.corrected);
      setCorrections(data.corrections);
      toast.success('Code corrected successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="code-corrector-container">
      <h1 className="corrector-title">
        Code <span className="gradient-text">Corrector</span>
      </h1>
      
      <div className="language-selector">
        <button
          className={`language-btn ${language === 'javascript' ? 'active' : ''}`}
          onClick={() => setLanguage('javascript')}
        >
          JavaScript
        </button>
        <button
          className={`language-btn ${language === 'python' ? 'active' : ''}`}
          onClick={() => setLanguage('python')}
        >
          Python
        </button>
      </div>

      <div className="code-container">
        <div className="code-section">
          <div className="section-header">
            <h2>Input Code</h2>
            <div className="window-controls">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="code-editor-wrapper">
            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder={`Enter your ${language} code here...`}
              className="code-editor"
              spellCheck="false"
            />
          </div>
        </div>

        <div className="code-section">
          <div className="section-header">
            <h2>Corrected Code</h2>
            <div className="window-controls">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="code-editor-wrapper">
            <textarea
              value={outputCode}
              readOnly
              placeholder="Your corrected code will appear here..."
              className="code-editor"
              spellCheck="false"
            />
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className={`primary-button ${loading ? 'loading' : ''}`}
          onClick={handleCorrect}
          disabled={loading}
        >
          {loading ? 'Correcting...' : 'Correct Code'}
        </button>
      </div>

      {corrections && (
        <div className="corrections-summary">
          <h3>Corrections Summary</h3>
          <div className="corrections-grid">
            <div className="correction-item">
              <span className="correction-label">Syntax Fixes</span>
              <span className={`correction-value ${corrections.syntaxFixed ? 'active' : ''}`}>
                {corrections.syntaxFixed ? 'Applied' : 'None needed'}
              </span>
            </div>
            <div className="correction-item">
              <span className="correction-label">Style Improvements</span>
              <span className={`correction-value ${corrections.styleFixed ? 'active' : ''}`}>
                {corrections.styleFixed ? 'Applied' : 'None needed'}
              </span>
            </div>
            {corrections.potentialRuntimeIssues?.length > 0 && (
              <div className="correction-item warnings">
                <span className="correction-label">Potential Issues</span>
                <ul className="issues-list">
                  {corrections.potentialRuntimeIssues.map((issue, index) => (
                    <li key={index}>
                      Line {issue.line}: {issue.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeCorrector; 