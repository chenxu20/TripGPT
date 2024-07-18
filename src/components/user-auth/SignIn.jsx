import React, { useState, useEffect } from 'react';
import "./style.css";
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import { getErrorMsg } from './ui';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const SignIn = () => {
    const [email, setEmail] = useState(localStorage.getItem("rememberMe") || "");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(Boolean(localStorage.getItem("rememberMe")));
    const { googleUserSignIn, userSignIn, error, setError, loading, setLoading } = UserAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setError("");
    }, [setError]);

    const handleSignIn = async e => {
        e.preventDefault();
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await googleUserSignIn();
            navigate("/account");
        } catch (err) {
            setError(getErrorMsg(err));
        } finally {
            setLoading(false);
        }
    };

    const toggleRemember = () => setRemember(!remember);
    const toggleShowPassword = () => setShowPassword(!showPassword);

    return (
        <div className='wrapper'>
            <h1>Sign In</h1>
            <fieldset disabled={loading} className={`fieldset ${loading ? 'fieldset-disabled' : ''}`}>
                <button onClick={handleGoogleSignIn} className="form-button">
                    {loading ? "Signing in..." : "Sign in with Google"}
                </button>
                <div className='divider'>or</div>
                <form onSubmit={handleSignIn} id="user-sign-in-form">
                    <input
                        className="input-field"
                        type="email"
                        id="sign-in-email"
                        value={email}
                        placeholder="Email"
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <div className="password-field">
                        <input
                            className="input-field"
                            type={showPassword ? "text" : "password"}
                            id="sign-in-password"
                            value={password}
                            placeholder="Password"
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <button onClick={toggleShowPassword} className="password-icon" type="button">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <div className="text-field">
                        <label id="remember-me">
                            <input type="checkbox" name="remember-me-checkbox" checked={remember} onChange={toggleRemember} />
                            Remember me
                        </label>
                        <Link to="/forgot-password" id="forgot-link">Forgot password?</Link>
                    </div>
                    {error && <span className="error-msg">{error}</span>}
                    <button type="submit" className="form-button">
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
                <hr width="100%" />
                <p>Don't have an account? Sign up <Link to="/signup">here</Link>.</p>
            </fieldset>
        </div>
    );
};