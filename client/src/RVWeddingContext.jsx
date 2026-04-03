import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const RVWeddingContext = createContext();

// Custom hook to use the context
export const useRVWedding = () => {
  const context = useContext(RVWeddingContext);
  if (!context) {
    throw new Error('useRVWedding must be used within an RVWeddingProvider');
  }
  return context;
};

// Valid page keys for hash routing
const validPages = ['home', 'travel', 'schedule', 'rsvp', 'faq', 'gifts', 'logistics', 'about-us'];

function getPageFromHash() {
  const hash = window.location.hash.replace('#', '');
  return validPages.includes(hash) ? hash : 'home';
}

// Provider component
export const RVWeddingProvider = ({ children }) => {
  const [pageShown, setPageShown] = useState(getPageFromHash);
  const skipHashChange = React.useRef(false);

  // Handle navigation from the header
  const handleNavigation = (pageKey) => {
    skipHashChange.current = true;
    setPageShown(pageKey);
    window.location.hash = pageKey;
    window.scrollTo(0, 0);
  };

  // Sync state when browser back/forward buttons are used
  useEffect(() => {
    const onHashChange = () => {
      if (skipHashChange.current) {
        skipHashChange.current = false;
        return;
      }
      setPageShown(getPageFromHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Auto-scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageShown]);

  const value = {
    pageShown,
    setPageShown,
    handleNavigation
  };

  return (
    <RVWeddingContext.Provider value={value}>
      {children}
    </RVWeddingContext.Provider>
  );
}; 