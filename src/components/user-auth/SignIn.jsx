import React, { useState } from 'react';
import "./style.css";
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import { getErrorMsg } from './ui';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const { googleUserSignIn, userSignIn } = UserAuth();
    const navigate = useNavigate("");

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await userSignIn(email, password);
            if (remember) {
                localStorage.setItem("rememberMe", email);
            } else {
                localStorage.removeItem("rememberMe");
            }
            navigate("/account");
        } catch (err) {
            console.log(err);
            setError(getErrorMsg(err));
        }
    }

    const handleGoogleSignIn = async (e) => {
        try {
            await googleUserSignIn();
            navigate("/account");
        } catch (err) {
            setError(getErrorMsg(err));
        }
    }

    const toggleRemember = () => setRemember(!remember);
    const toggleShowPassword = () => setShowPassword(!showPassword);

    return (
        <div className='wrapper'>
            <h1>Sign In</h1>
            <button onClick={handleGoogleSignIn} className="form-button google-signin-button">Sign in with Google</button>
            <div className='divider'>or</div>
            <form onSubmit={handleSignIn}>
                <input
                    className="input-field"
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <div className="password-field">
                    <input
                        className="input-field"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        placeholder="Password"
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button onClick={toggleShowPassword} className="password-icon" type="button">{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                </div>
                {error && <span className="error-msg">{error}</span>}
                <div className="text-field">
                    <label id="remember-me">
                        <input type="checkbox" checked={remember} onChange={toggleRemember} />
                        Remember me
                    </label>
                    <Link to="/forgot-password" id="forgot-link">Forgot password?</Link>
                </div>
                <button type="submit" className='form-button submit-button'>Sign In</button>
            </form>
            <hr width="100%" />
            <p>Don't have an account? Sign up <Link to="/signup">here</Link>.</p>
        </div>
    );
}