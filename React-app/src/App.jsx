import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Hero from './components/Hero';
import Features from './components/Features';
import Steps from './components/Steps';
import JavaScriptRefactor from './pages/JavaScriptRefactor';
import PythonRefactor from './pages/PythonRefactor';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Steps />
              <Features />
            </>
          } />
          <Route path="/javascript" element={<JavaScriptRefactor />} />
          <Route path="/python" element={<PythonRefactor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
