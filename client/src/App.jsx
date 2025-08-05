import React from "react";
import Home from './Home';
import Travel from './Travel';
import RSVP from "./RSVP";
import StickyHeader from './StickyHeader';
import { RVWeddingProvider, useRVWedding } from './RVWeddingContext';

import './App.css';
import './StickyHeader.css';
import Schedule from "./Schedule";
import FAQ from "./FAQ";
import AboutUs from "./AboutUs";

function AppContent() {
  const { pageShown, handleNavigation } = useRVWedding();

  return (
    <div className="app">
      <StickyHeader />
      
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

function App() {
  return (
    <RVWeddingProvider>
      <AppContent />
    </RVWeddingProvider>
  );
}

export default App;
