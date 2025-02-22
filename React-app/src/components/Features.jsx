import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Features.css';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Features = () => {
  const navigate = useNavigate();
  const [titleRef, titleVisible] = useScrollAnimation(0.1);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  const features = [
    {
      id: 1,
      title: 'JavaScript Refactoring',
      description: 'Convert ES5 to modern ES6+ syntax, including arrow functions, destructuring, and modern array methods',
      icon: '⚡',
      color: '#FFD700',
      path: '/javascript'
    },
    {
      id: 2,
      title: 'Python Modernization',
      description: 'Update Python 2.x code to Python 3.x, implementing modern best practices and syntax improvements',
      icon: '🐍',
      color: '#4B8BBE',
      path: '/python'
    }
  ];

  return (
    <section id="features" className="features">
      <h2 
        ref={titleRef}
        className={`features-title fade-in-up ${titleVisible ? 'visible' : ''}`}
      >
        Choose Your <span className="gradient-text">Transformation</span>
      </h2>
      <div className="features-grid">
        {features.map((feature, index) => {
          const [ref, isVisible] = useScrollAnimation(0.1);
          return (
            <div 
              key={feature.id}
              ref={ref}
              className={`gradient-border feature-card fade-in-up ${isVisible ? 'visible' : ''}`}
              style={{
                '--accent-color': feature.color,
                transitionDelay: `${0.2 + index * 0.1}s`
              }}
              onMouseMove={handleMouseMove}
              onClick={() => navigate(feature.path)}
            >
              <div className="feature-content">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <button className="feature-button">
                  <span>Start Refactoring</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features; 