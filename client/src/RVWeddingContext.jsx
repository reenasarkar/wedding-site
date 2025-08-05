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

// Provider component
export const RVWeddingProvider = ({ children }) => {
  const [pageShown, setPageShown] = useState('home');

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