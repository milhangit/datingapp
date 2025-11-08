import React, { useRef } from 'react';
import './App.css';
import Header from './components/Header';
import TinderCards from './components/TinderCards';
import SwipeButtons from './components/SwipeButtons';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import { UserProvider } from './context/UserContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const tinderCardsRef = useRef(null);

  return (
    <UserProvider>
      <div className="App">
        <Router>
          <Header />
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/chat/:userId" element={<Chat />} />
            <Route path="/" element={
              <>
                <TinderCards ref={tinderCardsRef} />
                <SwipeButtons tinderCardsRef={tinderCardsRef} />
              </>
            } />
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
}

export default App;