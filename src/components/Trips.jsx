import React from 'react'
import Calculator from './Calculator'
import MyTrips from './MyTrips'
import AddCalculator from './AddCalculator'
import { ItineraryContextProvider } from '../context/ItineraryContext'
import { ItineraryList } from './itinerary-planner/ItineraryList'
import { Route, Routes } from 'react-router-dom'
import { ItineraryDetail } from './itinerary-planner/ItineraryDetail'
import "./Trips.css"

export default function Trips() {
    return (
        <ItineraryContextProvider>
            <div className="trips-wrapper">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <h1>Trips</h1>
                                <ItineraryList />
                                <hr />
                                <AddCalculator />
                            </>
                        }
                    />
                    <Route
                        path="/:id"
                        element={
                            <>
                                <ItineraryDetail />
                            </>
                        }
                    />
                    <Route
                        path="/calculator/:userId"
                        element={
                            <>
                                <Calculator />
                            </>
                        }
                    />
                </Routes>
            </div>
        </ItineraryContextProvider>
    )
}
