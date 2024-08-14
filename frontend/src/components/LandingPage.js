// src/components/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to Our App</h1>
      <SignInButton mode="modal">
        <button onClick={() => navigate('/dashboard')}>Sign In</button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button onClick={() => navigate('/dashboard')}>Sign Up</button>
      </SignUpButton>
    </div>
  );
}

export default LandingPage;