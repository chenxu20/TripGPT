import React from 'react'
import Calculator from './Calculator'
import MyTrips from './MyTrips'
import { ItineraryContextProvider } from '../context/ItineraryContext'
import { ItineraryList } from './itinerary-planner/ItineraryList'
import { Route, Routes } from 'react-router-dom'
import { ItineraryDetail } from './itinerary-planner/ItineraryDetail'

export default function Trips() {
    return (
        <ItineraryContextProvider>
            <div>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div>
                                <h1>My Trips</h1>
                                <ItineraryList />
                                <br />
                                <hr />
                                <MyTrips />
                                <Calculator />
                            </div>
                        }
                    />
                    <Route path="/:id" element={<ItineraryDetail />} />
                </Routes>
            </div>
        </ItineraryContextProvider>
    )
}