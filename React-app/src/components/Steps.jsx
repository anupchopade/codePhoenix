
import '../styles/Steps.css';

const Steps = () => {
  const steps = [
    {
      id: 1,
      title: 'Choose Language',
      description: 'Select the programming language of your legacy code - JavaScript or Python',
      icon: '🎯'
    },
    {
      id: 2,
      title: 'Paste Your Code',
      description: 'Input your old code into our smart editor with syntax highlighting',
      icon: '📝'
    },
    {
      id: 3,
      title: 'Select Options',
      description: 'Choose the modernization features you want to apply to your code',
      icon: '⚙️'
    },
    {
      id: 4,
      title: 'Get Modern Code',
      description: 'Receive your refactored code with detailed explanations of the changes',
      icon: '✨'
    }
  ];

  return (
    <section className="steps">
      <h2 className="steps-title">
        How It <span className="gradient-text">Works</span>
      </h2>
      <div className="steps-container">
        {steps.map((step) => (
          <div key={step.id} className="step-card">
            <div className="step-number">{step.id}</div>
            <div className="step-icon">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
        <div className="steps-connection"></div>
      </div>
    </section>
  );
};

export default Steps; 