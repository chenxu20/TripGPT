import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getErrorMsg } from './ui';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "./style.css";
import { Alert, AlertMessage } from '../AlertMessage';

export const SignIn = () => {
    const [email, setEmail] = useState(localStorage.getItem("rememberMe") || "");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(Boolean(localStorage.getItem("rememberMe")));
    const [errorMessage, setErrorMessage] = useState("");
    const { googleUserSignIn, userSignIn, loading, setLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (location.state && location.state.alert) {
            setAlert(location.state.alert);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state]);

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
            navigate("/account", { replace: true, state: { alert: new Alert("You have signed in successfully.", 5000, "success") } });
        } catch (err) {
            setErrorMessage(getErrorMsg(err));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await googleUserSignIn();
            navigate("/account", { replace: true, state: { alert: new Alert("You have signed in successfully.", 5000, "success") } });
        } catch (err) {
            setErrorMessage(getErrorMsg(err));
        } finally {
            setLoading(false);
        }
    };

    const toggleRemember = () => setRemember(!remember);
    const toggleShowPassword = () => setShowPassword(!showPassword);

    return (
        <>
            <AlertMessage alert={alert} setAlert={setAlert} />
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
                        {errorMessage && <span className="error-msg">{errorMessage}</span>}
                        <button type="submit" className="form-button">
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                    <hr width="100%" />
                    <p>Don't have an account? Sign up <Link to="/signup">here</Link>.</p>
                </fieldset>
            </div>
        </>
    );
};