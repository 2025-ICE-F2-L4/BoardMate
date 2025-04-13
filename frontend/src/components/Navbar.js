import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div className="navbar">
            <div className="logo-container">
                <img src="/img/boardmate.png" alt="BoardMate" className="logo-image" />

            </div>
            <div className="nav-buttons-container">
                <button className="nav-button" onClick={() => handleNavigate('/')}>Home</button>
                <button className="nav-button" onClick={() => handleNavigate('/admin')}>Admin</button>
                <button className="nav-button" onClick={() => handleNavigate('/login')}>Login</button>
            </div>
        </div>
    );
};

export default Navbar;
