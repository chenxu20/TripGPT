import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getErrorMsg } from './ui';
import "./style.css";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { forgotPassword, loading, setLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await forgotPassword(email);
            alert("Check your email inbox for a link to reset your password.");
            navigate("/signin");
        } catch (error) {
            setErrorMessage(getErrorMsg(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='wrapper'>
            <h1>Forgot Password</h1>
            <fieldset disabled={loading} className={`fieldset ${loading ? 'fieldset-disabled' : ''}`}>
                <form onSubmit={handleResetPassword} id="forgot-password-form">
                    <input
                        className="input-field"
                        type="email"
                        id="forgot-password-email"
                        value={email}
                        placeholder="Email"
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    {errorMessage && <span className="error-msg">{errorMessage}</span>}
                    <button type="submit" className="form-button">Reset Password</button>
                </form>
                <hr width="100%" />
                <p><Link to="/signin">Back to Sign In</Link></p>
            </fieldset>
        </div>
    );
};