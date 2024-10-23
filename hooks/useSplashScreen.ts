import { useState, useEffect } from 'react';

export function useSplashScreen() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const hasLoadedBefore = localStorage.getItem('hasLoadedBefore');
    if (!hasLoadedBefore) {
      localStorage.setItem('hasLoadedBefore', 'true');
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000); // Adjust this time as needed
      return () => clearTimeout(timer);
    } else {
      setShowSplash(false);
    }
  }, []);

  return showSplash;
}
