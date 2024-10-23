import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <img src="/images/icon-512.png" alt="App Logo" className="w-32 h-32" />
    </div>
  );
};

export default SplashScreen;
