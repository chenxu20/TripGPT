import React, { useState } from 'react'
import "./style.css"
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import { getErrorMsg } from './ui';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { userSignUp } = UserAuth();
    const navigate = useNavigate("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        const sanitizedDisplayName = name.replace(/[^a-zA-Z0-9_\- ]/g, '');
        try {
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
            await userSignUp(email, password, sanitizedDisplayName);
            alert("Your account has been created successfully.");
            navigate("/account");
        } catch (err) {
            console.log(err);
            setError(getErrorMsg(err));
        }
    }

    const handleNameChange = e => {
        const sanitizedName = e.target.value.replace(/[^a-zA-Z0-9_\- ]/g, '');
        if (sanitizedName.length <= 50) {
            setName(sanitizedName);
        } else {
            setError("Name exceeds 50 characters.");
        }
    };

    const toggleShowPassword = () => setShowPassword(!showPassword);

    return (
        <div className='wrapper'>
            <h1>Sign Up</h1>
            <form onSubmit={handleSignUp}>
                <input
                    className="input-field"
                    type="text"
                    value={name}
                    placeholder="Name"
                    onChange={handleNameChange}
                    required
                />
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
                    <button onClick={toggleShowPassword} className="password-icon" type="button">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <div className="password-field">
                    <input
                        className="input-field"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        placeholder="Confirm password"
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button onClick={toggleShowPassword} className="password-icon" type="button">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                {error && <span className="error-msg">{error}</span>}
                <button type="submit" className='form-button submit-button'>Sign Up</button>
            </form>
            <hr width="100%" />
            <p>Already a registered user? Sign in <Link to="/signin">here</Link>.</p>
        </div>
    );
}