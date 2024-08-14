// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';

// You'll need to set up your environment variables
const clerkPubKey = "pk_test_Z29vZC1ibG93ZmlzaC0yNi5jbGVyay5hY2NvdW50cy5kZXYk";

if (!clerkPubKey) {
  throw new Error("Missing Publishable Key");
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);