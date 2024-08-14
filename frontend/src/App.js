import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AvatarCreation from './components/AvatarCreation';
import Playground from './components/Playground';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/create-avatar" element={<AvatarCreation />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;