import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../styles/About.css';

const About = () => {
  const [titleRef, titleVisible] = useScrollAnimation(0.1);
  const [contentRef, contentVisible] = useScrollAnimation(0.2);
  const [featuresRef, featuresVisible] = useScrollAnimation(0.3);

  const features = [
    {
      title: "JavaScript Refactoring",
      description: "Transform legacy ES5 JavaScript code into modern ES6+ syntax. Automatically convert to arrow functions, template literals, destructuring, and modern array methods.",
      icon: "⚡"
    },
    {
      title: "Python Refactoring",
      description: "Modernize Python 2.x code to Python 3.x standards. Update syntax, string handling, and implement modern Python features and best practices.",
      icon: "🐍"
    },
    {
      title: "Code Correction",
      description: "Intelligent syntax error detection and correction for both JavaScript and Python. Implements style guide recommendations and identifies potential runtime issues.",
      icon: "✨"
    },
    {
      title: "Real-time Processing",
      description: "Instant code analysis and transformation with live preview. See your modernized code as you type with immediate feedback.",
      icon: "⚙️"
    }
  ];

  return (
    <div className="about-container">
      <div 
        ref={titleRef}
        className={`about-header fade-in-up ${titleVisible ? 'visible' : ''}`}
      >
        <h1>About <span className="gradient-text">CodePhoenix</span></h1>
        <p className="subtitle">Transforming Legacy Code into Modern Excellence</p>
      </div>

      <div 
        ref={contentRef}
        className={`about-content fade-in-up ${contentVisible ? 'visible' : ''}`}
      >
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            CodePhoenix is dedicated to helping developers modernize their codebase effortlessly. 
            Just as the phoenix rises from its ashes, we help old code transform into modern, 
            efficient, and maintainable solutions. Our platform combines intelligent code analysis 
            with modern best practices to deliver superior code quality.
          </p>
        </div>

        <div className="about-section">
          <h2>Why CodePhoenix?</h2>
          <p>
            In today's rapidly evolving development landscape, maintaining modern codebases is crucial. 
            CodePhoenix provides automated solutions for updating legacy code, ensuring better 
            performance, readability, and compatibility with current standards. Whether you're 
            working with JavaScript or Python, our tools help you stay current with minimal effort.
          </p>
        </div>

        <div 
          ref={featuresRef}
          className={`features-grid fade-in-up ${featuresVisible ? 'visible' : ''}`}
        >
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className="feature-content">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="about-section">
          <h2>Technology</h2>
          <p>
            Built with cutting-edge web technologies including React, Node.js, and advanced code 
            parsing algorithms. Our platform provides real-time code analysis, intelligent syntax 
            transformation, and automated error correction, all wrapped in a beautiful, 
            user-friendly interface.
          </p>
        </div>

        <div className="about-section">
          <h2>Get Started</h2>
          <p>
            Ready to modernize your codebase? Choose between our JavaScript or Python refactoring 
            tools, or use our code corrector to fix syntax and style issues. Experience the power 
            of automated code transformation with CodePhoenix.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About; 