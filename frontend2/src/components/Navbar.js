import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        const isLoggedIn = localStorage.getItem('user');
        if (isLoggedIn) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    return (
        <div className="navbar">
            <button className="nav-button" onClick={handleHomeClick}>
                Home
            </button>
            <button className="profile-button" onClick={handleProfileClick}>
                Profile
            </button>
        </div>
    );
};

export default Navbar;
