import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './styles/global.css';
import BoardGamesList from './components/BoardGamesList';
import GameDetails from './components/GameDetailsView';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Navbar from './components/Navbar';

function AppWrapper() {
    const location = useLocation();
    const isAlt = location.pathname === "/login" || location.pathname === "/profile";
    
    const [, forceUpdate] = React.useState({});
    
    useEffect(() => {
        forceUpdate({});
    }, [location.pathname]);

    return (
        <div className={`App ${isAlt ? "alt-background" : "main-background"}`}>
            <Navbar key={localStorage.getItem('userId') || 'guest'} />
            <Routes>
                <Route path="/" element={<BoardGamesList />} />
                <Route path="/gameDetails" element={<GameDetails />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppWrapper />
        </BrowserRouter>
    );
}
