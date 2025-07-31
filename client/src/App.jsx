import React, { useState } from "react";
import Home from './Home';
import Travel from './Travel';

import './App.css';
import './Sidebar.css';
import RSVP from "./RSVP";
 
function App() {
  const [ pageShown, setPageShown ] = useState('home');

  const navLinks = [
    { label: 'Home', key: 'home' },
    { label: 'Travel & Stay', key: 'travel'  },
    { label: 'Event Schedule', key: 'schedule'  },
    { label: 'RSVP', key: 'rsvp'  },
    { label: 'About One & Only', key: 'about'  },
  ]

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Menu</h2>
        </div>
        <div className="sidebar-divider"/>
        <nav>
          <ul className='nav-list'>
            {navLinks.map((item) => (
              <li key={item.key} className='nav-item'>
                <a
                  className='nav-link'
                  onClick={() => setPageShown(item.key)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <footer className="sidebar-footer">
          © 2026 Reena Sarkar
        </footer>
      </div>
      
      {pageShown === 'home' && <Home />}
      {pageShown === 'travel' && <Travel />}
      {pageShown === 'rsvp' && <RSVP />}
    </div>
  );
}

export default App;
