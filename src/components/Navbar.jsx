import React from 'react'
import { Link } from 'react-router-dom'

const items = [{
    name: "Home",
    link: "/"
}, {
    name: "Explore",
    link: "/explore"
}, {
    name: "My Trips",
    link: "/trips"
}, {
    name: "Sign in",
    link: "/signin"
}];

export default function Navbar() {
    return (
        <nav className="navbar">
            <h2>TripGPT</h2>
            <ul>
                {items.map((x, index) => {
                    return (
                        <li key={index} className="navbar-contents">
                            <Link to={x.link}>{x.name}</Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    );
}