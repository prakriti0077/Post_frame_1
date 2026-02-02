import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';

function App() {
  // Simple counter state to trigger refreshes
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <AuthProvider>
      <Router>
        {/* Pass the refresh handler to Navbar */}
        <Navbar refreshFeed={handleRefresh} />
        <Routes>
          {/* Pass the trigger to Feed */}
          <Route path="/" element={<Feed refreshTrigger={refreshTrigger} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;