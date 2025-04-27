import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/Navbar.css';
import boardmateLogo from '../img/boardmate.png';
import { Link } from 'react-router-dom';


const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setIsLoggedIn(!!userId);
    }, []);

    const handleNavigate = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <div className="navbar">
            <div className="logo-container">
                <img src={boardmateLogo} alt="BoardMate" className="logo-image" />
            </div>
            <div className="nav-buttons-container">
                <button className="nav-button" onClick={() => handleNavigate('/')}>Home</button>
                <button className="nav-button" onClick={() => handleNavigate('/admin')}>Admin</button>

                {isLoggedIn ? (
                    <>
                        <Link to="/profile" className="nav-button">Profile</Link>
                        <button onClick={handleLogout} className="nav-button">Logout</button>
                    </>
                ) : (
                    <Link to="/login" className="nav-button">Login</Link>
                )}


            </div>
        </div>
    );
};

export default Navbar;
