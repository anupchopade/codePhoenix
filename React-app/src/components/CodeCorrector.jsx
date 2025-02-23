import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { dracula } from "@uiw/codemirror-theme-dracula";
import "../styles/CodeCorrector.css";

// Add dummy code examples
const dummyCode = {
  javascript: `// Example code with style and syntax issues
var x=1
let y =2;
const z= 3

function hello(name){
return"Hello "+name
}

if(x==y){
console.log('Equal')
}`,
  python: `# Example code with style and syntax issues
def calculate_sum( a,b ):
 return a+b

x=1
y =2
z= 3

if x==y:
print('Equal')

def hello( name ):
 return 'Hello '+name`,
};

const CodeCorrector = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [language, setLanguage] = useState(
    location.state?.language || "javascript"
  );
  const [loading, setLoading] = useState(false);
  const [corrections, setCorrections] = useState(null);

  useEffect(() => {
    // Update language when state changes
    if (location.state?.language) {
      setLanguage(location.state.language);
    }
  }, [location.state]);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    // Update URL state
    navigate("/code-corrector", {
      state: { language: newLanguage },
      replace: true,
    });
    // Reset form
    setInputCode("");
    setOutputCode("");
    setCorrections(null);
  };

  const handleCorrect = async () => {
    if (!inputCode.trim()) {
      toast.error("Please enter some code to correct");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/correct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: inputCode,
          language: language,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to correct code");
      }

      setOutputCode(data.corrected);
      setCorrections({
        syntaxFixed: data.corrections?.syntaxFixed || false,
        styleFixed: data.corrections?.styleFixed || false,
        issues: data.issues || [],
        potentialRuntimeIssues: data.corrections?.potentialRuntimeIssues || [],
        changes: data.changes || [],
      });
      toast.success("Code corrected successfully!");
    } catch (error) {
      toast.error(error.message);
      console.error("Correction error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode);
    toast.success("Code copied to clipboard!");
  };

  const handleReset = () => {
    setInputCode(dummyCode[language]);
    setOutputCode("");
    setCorrections(null);
  };

  // Set initial dummy code when language changes
  React.useEffect(() => {
    setInputCode(dummyCode[language]);
    setOutputCode("");
    setCorrections(null);
  }, [language]);

  return (
    <div className="code-corrector-container">
      <Link to="/" className="back-button">
        <span>←</span> Back to Home
      </Link>

      <h1 className="corrector-title">
        {language === "javascript" ? "JavaScript" : "Python"}{" "}
        <span className="gradient-text">Corrector</span>
      </h1>

      <div className="language-selector">
        <button
          className={`language-btn ${
            language === "javascript" ? "active" : ""
          }`}
          onClick={() => handleLanguageChange("javascript")}
        >
          JavaScript
        </button>
        <button
          className={`language-btn ${language === "python" ? "active" : ""}`}
          onClick={() => handleLanguageChange("python")}
        >
          Python
        </button>
      </div>

      <div className="code-container">
        <div className="code-section input-section">
          <div className="section-header">
            <h2>Input Code</h2>
            <div className="window-controls">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="code-editor-wrapper">
            <CodeMirror
              value={inputCode}
              height="100%"
              theme={dracula}
              extensions={[
                language === "javascript"
                  ? javascript({ jsx: true })
                  : python(),
              ]}
              onChange={(value) => setInputCode(value)}
              className="code-editor"
            />
          </div>
        </div>

        <div className="code-section output-section">
          <div className="section-header">
            <h2>Corrected Code</h2>
            <div className="window-controls">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="code-editor-wrapper">
            <CodeMirror
              value={outputCode}
              height="100%"
              theme={dracula}
              extensions={[
                language === "javascript"
                  ? javascript({ jsx: true })
                  : python(),
              ]}
              editable={false}
              className="code-editor"
            />
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className={`primary-button ${loading ? "loading" : ""}`}
          onClick={handleCorrect}
          disabled={loading}
        >
          {loading ? "Correcting..." : "Correct Code"}
        </button>
        <div className="secondary-buttons">
          <Tooltip title="Copy Corrected Code">
            <IconButton
              onClick={handleCopy}
              disabled={!outputCode}
              className="icon-button"
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset">
            <IconButton onClick={handleReset} className="icon-button">
              <RestartAltIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {corrections && (
        <div className="corrections-summary">
          <h3>Corrections Summary</h3>
          <div className="corrections-grid">
            <div className="correction-item">
              <span className="correction-label">Syntax Fixes</span>
              <span
                className={`correction-value ${
                  corrections.syntaxFixed ? "active" : ""
                }`}
              >
                {corrections.syntaxFixed ? "Applied" : "None needed"}
              </span>
            </div>
            <div className="correction-item">
              <span className="correction-label">Style Improvements</span>
              <span
                className={`correction-value ${
                  corrections.styleFixed ? "active" : ""
                }`}
              >
                {corrections.styleFixed ? "Applied" : "None needed"}
              </span>
            </div>

            {/* Detailed Issues Section */}
            {corrections.issues && corrections.issues.length > 0 && (
              <div className="correction-item full-width">
                <span className="correction-label">All Issues Found</span>
                <div className="issues-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Line</th>
                        <th>Column</th>
                        <th>Severity</th>
                        <th>Rule</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {corrections.issues.map((issue, index) => (
                        <tr
                          key={index}
                          className={`severity-${issue.severity}`}
                        >
                          <td>{issue.line}</td>
                          <td>{issue.column}</td>
                          <td>{issue.severity === 2 ? "Error" : "Warning"}</td>
                          <td>{issue.ruleId}</td>
                          <td>{issue.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Runtime Issues Section */}
            {corrections.potentialRuntimeIssues?.length > 0 && (
              <div className="correction-item warnings full-width">
                <span className="correction-label">
                  Potential Runtime Issues
                </span>
                <div className="runtime-issues">
                  {corrections.potentialRuntimeIssues.map((issue, index) => (
                    <div key={index} className="runtime-issue">
                      <div className="issue-header">
                        <span className="issue-location">
                          Line {issue.line}, Column {issue.column}
                        </span>
                        <span className="issue-rule">{issue.ruleId}</span>
                      </div>
                      <p className="issue-message">{issue.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Code Diff Section */}
            {corrections.changes && corrections.changes.length > 0 && (
              <div className="correction-item full-width">
                <span className="correction-label">Changes Made</span>
                <div className="code-diff">
                  <div className="diff-content">
                    <div className="diff-view">
                      {corrections.changes.map((change, index) => (
                        <div key={index} className="diff-line">
                          {/* Original Line */}
                          <div className={`line-content ${change.type}`}>
                            <div className="line-number">
                              {change.lineNumber}
                            </div>
                            <div className="line-gutter">
                              {change.type === "removed" && (
                                <span className="change-indicator">-</span>
                              )}
                              {change.type === "added" && (
                                <span className="change-indicator">+</span>
                              )}
                              {change.type === "modified" && (
                                <span className="change-indicator">•</span>
                              )}
                            </div>
                            <pre className="line-code">
                              <code>
                                {change.fullContext?.original?.indent > 0 && (
                                  <span className="indent">
                                    {" ".repeat(
                                      change.fullContext.original.indent
                                    )}
                                  </span>
                                )}
                                {change.content}
                              </code>
                            </pre>
                          </div>

                          {/* Show corrected version for modified lines */}
                          {change.type === "modified" && (
                            <div className="line-content new">
                              <div className="line-number">
                                {change.newLineNumber}
                              </div>
                              <div className="line-gutter">
                                <span className="change-indicator">→</span>
                              </div>
                              <pre className="line-code">
                                <code>
                                  {change.fullContext?.corrected?.indent >
                                    0 && (
                                    <span className="indent">
                                      {" ".repeat(
                                        change.fullContext.corrected.indent
                                      )}
                                    </span>
                                  )}
                                  {change.newContent}
                                </code>
                              </pre>
                            </div>
                          )}

                          {/* Change Description */}
                          {(change.changeTypes?.length > 0 ||
                            change.description) && (
                            <div className="change-details">
                              <div className="change-description">
                                {change.changeTypes?.map((type, i) => (
                                  <span key={i} className="change-type-tag">
                                    {type}
                                  </span>
                                )) || (
                                  <span className="change-type-tag">
                                    {change.description}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Changes Statistics */}
                <div className="changes-summary">
                  <h4>Summary of Changes</h4>
                  <div className="changes-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total Changes:</span>
                      <span className="stat-value">
                        {corrections.changes.length}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Lines Modified:</span>
                      <span className="stat-value">
                        {
                          corrections.changes.filter(
                            (c) => c.type === "modified"
                          ).length
                        }
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Lines Added:</span>
                      <span className="stat-value">
                        {
                          corrections.changes.filter((c) => c.type === "added")
                            .length
                        }
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Lines Removed:</span>
                      <span className="stat-value">
                        {
                          corrections.changes.filter(
                            (c) => c.type === "removed"
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeCorrector;
