import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import BoardGamesList from './components/BoardGamesList';
import GameDetails from './components/GameDetailsView';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <header className="App-header">BoardMate</header>
                <Routes>
                    <Route path="/" element={<BoardGamesList />} />
                    <Route path="/gameDetails" element={<GameDetails />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;