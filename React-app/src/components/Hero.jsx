import React, { useState } from 'react';
import '../styles/Hero.css';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Hero = () => {
  const [tiltStyle, setTiltStyle] = useState({});
  const [tiltStyleModern, setTiltStyleModern] = useState({});
  const [titleRef, titleVisible] = useScrollAnimation(0.1);
  const [contentRef, contentVisible] = useScrollAnimation(0.2);
  const [codeRef, codeVisible] = useScrollAnimation(0.3);

  const handleMouseMove = (e, isModern) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((centerX - x) / centerX) * 10;

    const style = {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`,
      transition: 'transform 0.1s ease'
    };

    if (isModern) {
      setTiltStyleModern(style);
    } else {
      setTiltStyle(style);
    }
  };

  const handleMouseLeave = (isModern) => {
    const style = {
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
      transition: 'transform 0.5s ease'
    };

    if (isModern) {
      setTiltStyleModern(style);
    } else {
      setTiltStyle(style);
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
            <button className="primary-button">Get Started</button>
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
                  {`// Old JavaScript
var calculateSum = function(arr) {
    var sum = 0;
    for(var i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}`}
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
                  {`// Modern JavaScript
const calculateSum = (arr) => {
    return arr.reduce((sum, num) => 
        sum + num, 0);
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 