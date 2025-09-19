import React, { useState } from 'react';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import './App.css';
import './animations.css';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  return <Dashboard onBackToLanding={() => setShowLanding(true)} />;
};

export default App;
