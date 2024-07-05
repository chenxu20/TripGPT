import React, { useState } from 'react';
import "./style.css";
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import { getErrorMsg } from './ui';

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const { forgotPassword } = UserAuth();
    const navigate = useNavigate("");

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            alert("Check your email inbox for a link to reset your password.");
            navigate("/signin");
        } catch (err) {
            setError(getErrorMsg(err));
        }
    }

    return (
        <div className='wrapper'>
            <h1>Forgot Password</h1>
            <form onSubmit={handleResetPassword}>
                <input
                    className="input-field"
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                {error && <span className="error-msg">{error}</span>}
                <button type="submit" className='form-button reset-button'>Reset Password</button>
            </form>
            <hr width="100%" />
            <p><Link to="/signin">Back to Sign In</Link></p>
        </div>
    )
}