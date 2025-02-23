import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-content">
        <div className="nav-left">
          <Link to="/" className="logo-container">
            <span className="logo-emoji">🔥</span>
            <span className="gradient-text logo-text">CodePhoenix</span>
          </Link>
        </div>
        
        <div className="nav-center">
          <Link to="/" className="nav-link">Home</Link>
          {isHomePage ? (
            <a href="#features" className="nav-link">Features</a>
          ) : (
            <Link to="/#features" className="nav-link">Features</Link>
          )}
          <Link to="/about" className="nav-link">About</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 