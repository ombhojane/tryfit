import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="overlay"></div>
      <div className="content">
        <h1 className="title">Enhanced Fashion Simulator</h1>
        <p className="subtitle">
          Experience shopping like never before! Create your avatar, explore virtual stores, and get instant feedback from a vibrant community.
        </p>
        <div className="buttons">
          <SignInButton mode="modal">
            <button className="btn sign-in-btn" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="btn sign-up-btn" onClick={() => navigate('/dashboard')}>
              Get Started
            </button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;