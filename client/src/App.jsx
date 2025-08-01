import React, { useState } from "react";
import Home from './Home';
import Travel from './Travel';
import RSVP from "./RSVP";
import StickyHeader from './StickyHeader';

import './App.css';
import './StickyHeader.css';
import Schedule from "./Schedule";

function App() {
  const [ pageShown, setPageShown ] = useState('home');

  // Handle navigation from the header
  const handleNavigation = (pageKey) => {
    setPageShown(pageKey);
  };

  return (
    <div className="app">
      <StickyHeader onNavigate={handleNavigation} />
      
      <main className="main-content">
        {pageShown === 'home' && <Home />}
        {pageShown === 'travel' && <Travel />}
        {pageShown === 'rsvp' && <RSVP />}
        {pageShown === 'schedule' && <Schedule />}
      </main>
    </div>
  );
}

export default App;
