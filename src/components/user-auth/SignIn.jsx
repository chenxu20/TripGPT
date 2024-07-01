import React, { useState } from 'react';
import "./style.css";
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';

export const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { googleUserSignIn, userSignIn } = UserAuth();
    const navigate = useNavigate("");

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await userSignIn(email, password);
            navigate("/account");
        } catch (error) {
            setError(error.message);
        }
    }

    const handleGoogleSignIn = async (e) => {
        try {
            await googleUserSignIn();
            navigate("/account");
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className='wrapper'>
            <h1>Sign In</h1>
            <form onSubmit={handleSignIn}>
                <input 
                    type="email"
                    value={email}
                    placeholder="Email" 
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input 
                    type="password"
                    value={password}
                    placeholder="Password" 
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                {error && <p className="error-msg">{error}</p>}
                <button type="submit" className='submit-button'>Sign In</button>
            </form>
            <p>Don't have an account? Sign up <Link to="/signup">here</Link>.</p>
        </div>
    );
}