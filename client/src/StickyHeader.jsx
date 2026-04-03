import React, { useState } from 'react';
import { useRVWedding } from './RVWeddingContext';
import './StickyHeader.css';

export default function StickyHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { handleNavigation } = useRVWedding();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (pageKey) => {
    handleNavigation(pageKey);
    setIsMenuOpen(false);
  };

  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'travel', label: 'Travel & Stay' },
    { key: 'schedule', label: 'Event Schedule' },
    { key: 'rsvp', label: 'RSVP' },
    { key: 'faq', label: 'FAQ' },
    { key: 'gifts', label: 'Gifts' },
    { key: 'logistics', label: 'Meal & Transportation' },
    { key: 'about-us', label: 'About Us' },
  ];

  return (
    <header className="sticky-header">
      <div className="header-content">
        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.key} className="nav-item">
                <button 
                  className="nav-link"
                  onClick={() => handleNavClick(item.key)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-button ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>

        </button>
      </div>

      {/* Mobile Navigation */}
      <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-list">
          {navItems.map((item) => (
            <li key={item.key} className="mobile-nav-item">
              <button 
                className="mobile-nav-link"
                onClick={() => handleNavClick(item.key)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
} 