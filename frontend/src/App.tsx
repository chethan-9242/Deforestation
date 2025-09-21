import React, { useState } from 'react';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import PWAInstall from './components/PWAInstall';
import './App.css';
import './animations.css';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);

  return (
    <>
      {showLanding ? (
        <LandingPage onGetStarted={() => setShowLanding(false)} />
      ) : (
        <Dashboard onBackToLanding={() => setShowLanding(true)} />
      )}
      <PWAInstall />
    </>
  );
};

export default App;
