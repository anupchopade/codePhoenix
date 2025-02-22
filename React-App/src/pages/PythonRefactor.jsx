import { useState } from "react";
import { Link } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import "../styles/Refactor.css";

const PythonRefactor = () => {
  const [originalCode, setOriginalCode] = useState(
    "# Enter your Python 2.x code here\nprint 'Hello, World!'\nraw_input('Enter your name: ')"
  );
  const [modernizedCode, setModernizedCode] = useState("");
  const [refactorDetails, setRefactorDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefactor = async () => {
    if (!originalCode.trim()) {
      toast.error("Please enter some code to refactor");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/modernize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: originalCode,
          language: "python",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to refactor code");
      }

      setModernizedCode(data.modernized);
      setRefactorDetails({
        changes: data.changes,
        diff: data.diff,
        details: data.refactoringDetails,
      });
      toast.success("Code refactored successfully!");
    } catch (error) {
      toast.error(error.message);
      console.error("Refactoring error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(modernizedCode);
    toast.success("Code copied to clipboard!");
  };

  const handleReset = () => {
    setOriginalCode(
      "# Enter your Python 2.x code here\nprint 'Hello, World!'\nraw_input('Enter your name: ')"
    );
    setModernizedCode("");
    setRefactorDetails(null);
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
            <h2>Original Code (Python 2.x)</h2>
            <div className="window-controls">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="code-editor-wrapper">
            <CodeMirror
              value={originalCode}
              height="100%"
              theme={dracula}
              extensions={[python()]}
              onChange={(value) => setOriginalCode(value)}
              className="code-editor"
            />
          </div>
        </div>

        <div className="code-section output-section gradient-border">
          <div className="section-header">
            <h2>Modernized Code (Python 3.x)</h2>
            <div className="window-controls">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="code-editor-wrapper">
            <CodeMirror
              value={modernizedCode}
              height="100%"
              theme={dracula}
              extensions={[python()]}
              editable={false}
              className="code-editor"
            />
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className={`primary-button ${isLoading ? "loading" : ""}`}
          onClick={handleRefactor}
          disabled={isLoading}
        >
          {isLoading ? "Modernizing..." : "Modernize Code"}
        </button>
        <div className="secondary-buttons">
          <Tooltip title="Copy Modernized Code">
            <IconButton
              onClick={handleCopy}
              disabled={!modernizedCode}
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

      {refactorDetails && (
        <div className="details-section gradient-border">
          <h2>Refactoring Details</h2>

          <div className="details-group">
            <h3>Changes Made:</h3>
            <ul className="changes-list">
              {refactorDetails.changes.map((change, index) => (
                <li key={index}>{change}</li>
              ))}
            </ul>
          </div>

          <div className="details-group">
            <h3>Diff View:</h3>
            <div className="diff-view">
              {refactorDetails.diff.map((part, index) => (
                <div
                  key={index}
                  className={`diff-line ${
                    part.added ? "added" : part.removed ? "removed" : ""
                  }`}
                >
                  {(part.added ? "+ " : part.removed ? "- " : "  ") +
                    part.value}
                </div>
              ))}
            </div>
          </div>

          <div className="details-group">
            <h3>Tool Information:</h3>
            <div className="tool-info">
              <p>Tool: {refactorDetails.details.tool}</p>
              <p>Python Version: {refactorDetails.details.pythonVersion}</p>
              <p>
                Total Transformations: {refactorDetails.details.transformations}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PythonRefactor;
