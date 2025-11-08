import React, { useRef } from 'react';
import './App.css';
import Header from './components/Header';
import TinderCards from './components/TinderCards';
import SwipeButtons from './components/SwipeButtons';
import Profile from './pages/Profile';
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const tinderCardsRef = useRef(null);

  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <>
              <TinderCards ref={tinderCardsRef} />
              <SwipeButtons tinderCardsRef={tinderCardsRef} />
            </>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;