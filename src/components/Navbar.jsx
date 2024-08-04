import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';
import { FaEarthAmericas } from "react-icons/fa6";

export default function Navbar() {
    const { user } = useContext(AuthContext);
    const items = [{
        name: "Home",
        link: "/"
    }, {
        name: "Explore",
        link: "/explore"
    }, {
        name: "Trips",
        link: "/trips"
    }, {
        name: user ? "Account" : "Sign in",
        link: user ? "/account" : "/signin"
    }];

    return (
        <nav className="navbar">
            <h2 style={{fontFamily: "Helvetica"}}><FaEarthAmericas />TripGPT</h2>
            <ul>
                {items.map((x, index) => {
                    return (
                        <li key={index} className="navbar-items">
                            <Link to={x.link}>{x.name}</Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    );
}