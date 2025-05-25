import React, { useState } from 'react';
import '../styles/components/Login.css';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!username || !password || !age || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: username,
                    password: password,
                    age: parseInt(age, 10)
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }
            setSuccessMessage('Account created successfully!');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const ageOptions = Array.from({ length: 100 }, (_, i) => i + 1);

    return (
        <div className="login-card">
            <h1 className="login-heading">Create your account</h1>

            {error && <div className="login-error">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

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
                    <select 
                        value={age} 
                        onChange={(e) => setAge(e.target.value)}
                        required
                        className="age-select"
                    >
                        <option value="" disabled>Select your age</option>
                        {ageOptions.map(age => (
                            <option key={age} value={age}>{age}</option>
                        ))}
                    </select>
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

                <div className="input-group">
                    <input 
                        type="password" 
                        placeholder="Confirm Password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required 
                    />
                </div>

                <button 
                    type="submit" 
                    className="signin-button"
                    disabled={isLoading || successMessage}
                >
                    {isLoading ? 'Creating Account...' : successMessage ? 'Redirecting...' : 'Sign Up'}
                </button>
            </form>

            <div className="signup-prompt">
                Already have an account? <a href="/login">Log In</a>
            </div>
        </div>
    );
};

export default Signup;
