// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import LandingPage from '../src/components/LandingPage';
import Dashboard from './components/Dashboard';
import AvatarCreation from './components/AvatarCreation';
import Playground from './components/Playground';

function App() {
    console.log("App component is rendering");

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <>
                <SignedIn>
                  <Dashboard />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route path="/create-avatar" element={<AvatarCreation />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;