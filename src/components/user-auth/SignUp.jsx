import React, { useState } from 'react'
import "./style.css"
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';

export const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const { userSignUp } = UserAuth();
    const navigate = useNavigate("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            if(password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
            await userSignUp(email, password, name);
            alert("Your account has been created successfully.");
            navigate("/account");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className='wrapper'>
            <h1>Sign Up</h1>
            <form onSubmit={handleSignUp}>
                <input 
                    type="name"
                    value={name}
                    placeholder="Name" 
                    onChange={e => setName(e.target.value)}
                    required
                />
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
                <input 
                    type="password" 
                    value={confirmPassword}
                    placeholder="Confirm password" 
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                />
                {error && <p className="error-msg">{error}</p>}
                <button type="submit" className='submit-button'>Sign Up</button>
            </form>
            <p>Already a registered user? Sign in <Link to="/signin">here</Link>.</p>
        </div>
    );
}