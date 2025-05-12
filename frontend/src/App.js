import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './styles/global.css';
import BoardGamesList from './components/Home';
import GameDetails from './components/GameDetailsView';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Search from './components/Search';


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
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<Search />} />

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
