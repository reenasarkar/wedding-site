import React, { useState, useEffect } from "react";
import Home from './Home';
import Travel from './Travel';
import RSVP from "./RSVP";
import StickyHeader from './StickyHeader';

import './App.css';
import './StickyHeader.css';
import Schedule from "./Schedule";
import FAQ from "./FAQ";
import AboutUs from "./AboutUs";

function App() {
  const [ pageShown, setPageShown ] = useState('home');

  // Handle navigation from the header
  const handleNavigation = (pageKey) => {
    setPageShown(pageKey);
    // Scroll to top when navigating to a new page
    window.scrollTo(0, 0);
  };

  // Auto-scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageShown]);  

  return (
    <div className="app">
      <StickyHeader onNavigate={handleNavigation} />
      
      <main className="main-content">
        {pageShown === 'home' && <Home />}
        {pageShown === 'travel' && <Travel />}
        {pageShown === 'rsvp' && <RSVP />}
        {pageShown === 'schedule' && <Schedule />}
        {pageShown === 'faq' && <FAQ />}
        {pageShown === 'about-us' && <AboutUs />}
      </main>
      </div>
    );
}

export default App;
