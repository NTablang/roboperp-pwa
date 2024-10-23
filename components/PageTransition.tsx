import React from 'react';
import { useNavigation } from './NavigationContext';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isTransitioning } = useNavigation();

  return (
    <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      {children}
    </div>
  );
};

export default PageTransition;
