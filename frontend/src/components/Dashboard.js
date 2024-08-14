// src/components/Dashboard.js
import React from 'react';
import { UserButton } from '@clerk/clerk-react';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <UserButton />
    </div>
  );
}

export default Dashboard;