import React from 'react'
import Calculator from './Calculator'
import MyTrips from './MyTrips'
import AddCalculator from './AddCalculator'

export default function Trips() {
    return (
        <div>
            <h1>My Trips</h1>
            <MyTrips />
            <AddCalculator />
        </div>
    )
}