import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Hero.css';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

function Hero() {
  const navigate = useNavigate();
  const [tiltStyle, setTiltStyle] = useState({});
  const [tiltStyleModern, setTiltStyleModern] = useState({});
  const [titleRef, titleVisible] = useScrollAnimation(0.1);
  const [contentRef, contentVisible] = useScrollAnimation(0.2);
  const [codeRef, codeVisible] = useScrollAnimation(0.3);
  const [isTypingOld, setIsTypingOld] = useState(false);
  const [isTypingModern, setIsTypingModern] = useState(false);

  useEffect(() => {
    if (codeVisible) {
      // Start typing old code immediately
      setIsTypingOld(true);
      
      // Start typing modern code right after old code finishes (2.8 seconds)
      setTimeout(() => {
        setIsTypingModern(true);
      }, 2800); // Matches exactly when the last line of old code finishes
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

  const handleGetStarted = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
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
            <button className="primary-button" onClick={handleGetStarted}>Start Refactoring</button>
            <button className="secondary-button">Learn More</button>
          </div>
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
                      className={`code-line ${isTypingOld ? 'animate' : ''} ${
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
                      className={`code-line ${isTypingModern ? 'animate' : ''} ${
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