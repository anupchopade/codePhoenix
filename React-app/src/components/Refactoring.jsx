import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import BackToTop from './BackToTop';
import '../styles/Refactoring.css';

const Refactoring = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [language, setLanguage] = useState(location.state?.language || 'javascript');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.language) {
      setLanguage(location.state.language);
    }
  }, [location.state]);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    navigate('/refactoring', { state: { language: newLanguage }, replace: true });
    setInputCode('');
    setOutputCode('');
  };

  const handleRefactor = async () => {
    if (!inputCode.trim()) {
      toast.error('Please enter some code to refactor');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/refactor', {
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
        throw new Error(data.error || 'Failed to refactor code');
      }

      setOutputCode(data.refactored);
      toast.success('Code refactored successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="refactoring-container">
      <BackToTop />
      <Link to="/" className="back-button">
        <span>←</span> Back to Home
      </Link>

      <h1 className="refactoring-title">
        {language === 'javascript' ? 'JavaScript' : 'Python'} <span className="gradient-text">Refactoring</span>
      </h1>
      
      <div className="language-selector">
        <button
          className={`language-btn ${language === 'javascript' ? 'active' : ''}`}
          onClick={() => handleLanguageChange('javascript')}
        >
          JavaScript
        </button>
        <button
          className={`language-btn ${language === 'python' ? 'active' : ''}`}
          onClick={() => handleLanguageChange('python')}
        >
          Python
        </button>
      </div>

      <div className="code-container">
        <div className="code-section">
          <div className="section-header">
            <h2>Original Code</h2>
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
            <h2>Refactored Code</h2>
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
              placeholder="Your refactored code will appear here..."
              className="code-editor"
              spellCheck="false"
            />
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className={`primary-button ${loading ? 'loading' : ''}`}
          onClick={handleRefactor}
          disabled={loading}
        >
          {loading ? 'Refactoring...' : 'Refactor Code'}
        </button>
      </div>
    </div>
  );
};

export default Refactoring; 