import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getErrorMsg } from './ui';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Alert } from '../AlertMessage';
import "./style.css";

export const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { userSignUp, loading, setLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSignUp = async e => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        const sanitizedDisplayName = name.replace(/[^a-zA-Z0-9_\- ]/g, '');
        try {
            if (password !== confirmPassword) {
                throw new Error("Passwords do not match.");
            }
            await userSignUp(email, password, sanitizedDisplayName);
            navigate("/account", { replace: true, state: { alert: new Alert("You have signed up successfully.", 5000, "success") } });
        } catch (err) {
            setErrorMessage(getErrorMsg(err));
        } finally {
            setLoading(false);
        }
    };

    const handleNameChange = e => {
        const sanitizedName = e.target.value.replace(/[^a-zA-Z0-9_\- ]/g, '');
        if (sanitizedName.length <= 50) {
            setName(sanitizedName);
        } else {
            setErrorMessage("Name exceeds 50 characters.");
        }
    };

    const toggleShowPassword = () => setShowPassword(!showPassword);

    return (
        <div className='wrapper'>
            <h1>Sign Up</h1>
            <fieldset disabled={loading} className={`auth-fieldset ${loading ? 'auth-fieldset-disabled' : ''}`}>
                <form onSubmit={handleSignUp} id="user-sign-up-form">
                    <input
                        className="input-field"
                        type="text"
                        id="sign-up-name"
                        value={name}
                        placeholder="Name"
                        onChange={handleNameChange}
                        required
                    />
                    <input
                        className="input-field"
                        type="email"
                        id="sign-up-email"
                        value={email}
                        placeholder="Email"
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <div className="password-field">
                        <input
                            className="input-field"
                            type={showPassword ? "text" : "password"}
                            id="sign-up-password"
                            value={password}
                            placeholder="Password"
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <button onClick={toggleShowPassword} className="password-icon" type="button">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <div className="password-field">
                        <input
                            className="input-field"
                            type={showPassword ? "text" : "password"}
                            id="sign-up-password-confirm"
                            value={confirmPassword}
                            placeholder="Confirm password"
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button onClick={toggleShowPassword} className="password-icon" type="button">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errorMessage && <span className="error-msg">{errorMessage}</span>}
                    <button type="submit" className="form-button">
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>
                <hr width="100%" />
                <p>Already a registered user? Sign in <Link to="/signin">here</Link>.</p>
            </fieldset>
        </div>
    );
};