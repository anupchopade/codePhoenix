import { useState, useEffect } from 'react';
import '../styles/Hero.css';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

function Hero() {
  const [tiltStyle, setTiltStyle] = useState({});
  const [tiltStyleModern, setTiltStyleModern] = useState({});
  const [titleRef, titleVisible] = useScrollAnimation(0.1);
  const [contentRef, contentVisible] = useScrollAnimation(0.2);
  const [codeRef, codeVisible] = useScrollAnimation(0.3);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (codeVisible) {
      // Start both animations immediately
      setIsTyping(true);
    }
  }, [codeVisible]);

  const oldCode = [
    "// Old JavaScript",
    "var calculateSum = function(arr) {",
    "    var sum = 0;",
    "    for(var i = 0; i < arr.length; i++) {",
    "        sum += arr[i];",
    "    }",
    "    return sum;",
    "}"
  ];

  const modernCode = [
    "// Modern JavaScript",
    "const calculateSum = (arr) => {",
    "    return arr.reduce((sum, num) =>",
    "        sum + num, 0);",
    "}"
  ];

  const handleMouseMove = (e, isModern) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate percentage position
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    // Calculate tilt angles (reversed for natural feel)
    const rotateY = ((xPercent - 50) / 50) * 10; // Max 10 degrees
    const rotateX = -((yPercent - 50) / 50) * 10; // Max 10 degrees

    const style = {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
      transition: 'none',
      boxShadow: `${rotateY/2}px ${-rotateX/2}px 30px rgba(112, 0, 255, 0.15)`
    };

    if (isModern) {
      setTiltStyleModern(style);
    } else {
      setTiltStyle(style);
    }
  };

  const handleMouseLeave = (isModern) => {
    const style = {
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'all 0.5s ease',
      boxShadow: 'none'
    };

    if (isModern) {
      setTiltStyleModern(style);
    } else {
      setTiltStyle(style);
    }
  };

  const navigateToRefactor = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
      // Add a class to highlight refactoring cards
      document.querySelectorAll('.feature-card').forEach(card => {
        if (card.querySelector('h3').textContent.includes('Refactoring')) {
          card.classList.add('highlight');
        } else {
          card.classList.remove('highlight');
        }
      });
    }
  };

  const navigateToCorrector = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
      // Add a class to highlight corrector cards
      document.querySelectorAll('.feature-card').forEach(card => {
        const title = card.querySelector('h3').textContent;
        if (title.includes('Corrector')) {
          card.classList.add('highlight');
        } else {
          card.classList.remove('highlight');
        }
      });
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <div 
          ref={titleRef} 
          className={`project-title fade-in-up ${titleVisible ? 'visible' : ''}`}
        >
          <span className="gradient-text">Code</span> Phoenix
        </div>
        <div 
          ref={contentRef}
          className={`content-wrapper fade-in-up ${contentVisible ? 'visible' : ''}`}
          style={{ transitionDelay: '0.2s' }}
        >
          <h1 className="hero-title">
            <span className="gradient-text">Modernize</span> Your Code
          </h1>
          <p className="hero-subtitle">
            Transform legacy code into modern, efficient syntax with our intelligent refactoring tools
          </p>
          <div className="hero-buttons">
            <button className="feature-button refactor" onClick={navigateToRefactor}>
              <span className="button-icon">🔄</span>
              <span className="button-text">
                <span className="button-title">Code Refactoring</span>
                <span className="button-desc">Modernize your JavaScript code</span>
              </span>
            </button>
            <button className="feature-button corrector" onClick={navigateToCorrector}>
              <span className="button-icon">✨</span>
              <span className="button-text">
                <span className="button-title">Code Corrector</span>
                <span className="button-desc">Fix syntax and style issues</span>
              </span>
            </button>
          </div>
          {/* <div className="secondary-action">
            <button className="secondary-button" onClick={handleGetStarted}>
              Learn More
            </button>
          </div> */}
        </div>
      </div>
      <div 
        ref={codeRef}
        className={`hero-image fade-in-up ${codeVisible ? 'visible' : ''}`}
        style={{ transitionDelay: '0.4s' }}
      >
        <div className="code-preview">
          <div 
            className="gradient-border code-window"
            onMouseMove={(e) => handleMouseMove(e, false)}
            onMouseLeave={() => handleMouseLeave(false)}
            style={tiltStyle}
          >
            <div className="code-content">
              <div className="window-controls">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <pre>
                <code>
                  {oldCode.map((line, index) => (
                    <span 
                      key={index}
                      className={`code-line ${isTyping ? 'animate' : ''} ${
                        index === oldCode.length - 1 ? 'last-line' : ''
                      }`}
                    >
                      {line}
                      {'\n'}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          </div>
          
          <div 
            className="gradient-border code-window modern"
            onMouseMove={(e) => handleMouseMove(e, true)}
            onMouseLeave={() => handleMouseLeave(true)}
            style={tiltStyleModern}
          >
            <div className="code-content">
              <div className="window-controls">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <pre>
                <code>
                  {modernCode.map((line, index) => (
                    <span 
                      key={index}
                      className={`code-line ${isTyping ? 'animate' : ''} ${
                        index === modernCode.length - 1 ? 'last-line' : ''
                      }`}
                    >
                      {line}
                      {'\n'}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero; 