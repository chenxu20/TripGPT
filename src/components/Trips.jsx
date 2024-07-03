import React from 'react'
import Calculator from './Calculator'
import MyTrips from './MyTrips'

export default function Trips() {
    return (
        <div>
            <h1>My Trips</h1>
            <MyTrips />
            <br />
            <hr />
            <Calculator />
        </div>
    )
}