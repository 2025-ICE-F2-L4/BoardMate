import React from 'react';
import '../styles/components/Login.css';

const Signup = () => {
    return (
        <div className="login-card">
            <h1 className="login-heading">Create your account</h1>

            <form>
                <div className="input-group">
                    <input type="text" placeholder="Username" required />
                </div>

                <div className="input-group">
                    <input type="email" placeholder="Email" required />
                </div>

                <div className="input-group">
                    <input type="password" placeholder="Password" required />
                </div>

                <div className="input-group">
                    <input type="password" placeholder="Confirm Password" required />
                </div>

                <button type="submit" className="signin-button">Sign Up</button>
            </form>

            <div className="signup-prompt">
                Already have an account? <a href="/login">Log In</a>
            </div>
        </div>
    );
};

export default Signup;
