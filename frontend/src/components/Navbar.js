import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    const handleProfileClick = () => {
        const isLoggedIn = localStorage.getItem('user');
        navigate(isLoggedIn ? '/profile' : '/login');
    };

    return (
        <div className="navbar">
            <button className="nav-button" onClick={() => handleNavigate('/')}>Home</button>
            <button className="nav-button" onClick={() => handleNavigate('/admin')}>Admin</button>
            <button className="nav-button" onClick={() => handleNavigate('/login')}>Login</button>
            <button className="profile-button" onClick={handleProfileClick}>Profile</button>
        </div>
    );
};

export default Navbar;
