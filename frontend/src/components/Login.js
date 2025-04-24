import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const queryParams = new URLSearchParams({
                user: username,
                password: password
            }).toString();

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login?${queryParams}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            localStorage.setItem('userId', data.id);
            
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-heading">Hello there,<br />welcome back</h1>
                
                {error && <div className="login-error">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="forgot-password">
                        <a href="#">Forgot your Password?</a>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="signin-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                
                <div className="signup-prompt">
                    New here? <a href="/signup">Sign Up instead</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
