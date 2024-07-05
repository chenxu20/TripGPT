import React from 'react'
import Calculator from './Calculator'
import MyTrips from './MyTrips'
import { ItineraryContextProvider } from '../context/ItineraryContext'
import { ItineraryUI } from './itinerary-planner/ItineraryUI'

export default function Trips() {
    return (
        <div>
            <ItineraryContextProvider>
                <div>
                    <h1>My Trips</h1>
                    <ItineraryUI />
                </div>
            </ItineraryContextProvider>
            <br />
            <hr />
            <MyTrips />
            <Calculator />
        </div>
    )
}