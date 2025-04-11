  import React from 'react';
  import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
  import './App.css';
  import BoardGamesList from './components/BoardGamesList';
  import GameDetails from './components/GameDetailsView';
  import AdminPanel from './components/AdminPanel';

  function App() {
      return (
          <BrowserRouter>
              <div className="App">
                  <header className="App-header">
                      BoardMate
                      <div className="nav-links">
                          <Link to="/" className="nav-link">Home</Link>
                          <Link to="/admin" className="nav-link">Admin</Link>
                      </div>
                  </header>
                  <Routes>
                      <Route path="/" element={<BoardGamesList />} />
                      <Route path="/gameDetails" element={<GameDetails />} />
                      <Route path="/admin" element={<AdminPanel />} />
                  </Routes>
              </div>
          </BrowserRouter>
      );
  }

  export default App;

