import React from "react"
import "./DisplayTrip.css"
import { db } from "../config/firebase"
import { doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore"

export default function DisplayTrip(props) {
    function deleteTrip() {
        const tripDocRef = doc(db, "trip-details", props.data.id)
        deleteDoc(tripDocRef)
            .then(() => {
                alert("Trip successfully deleted!")
            })
            .catch((err) => alert(`Error removing document: ${err}`))
    }

    return (
        <>
            <div className="trip-section">
                <div>
                    <p><strong>Date:</strong> {props.data.outboundDetails.date}</p>
                    <p><strong>Flight Number:</strong> {props.data.outboundDetails.flightNumber}</p>
                    <p><strong>Start Time:</strong> {props.data.outboundDetails.start}</p>
                    <p><strong>End Time:</strong> {props.data.outboundDetails.end}</p>
                </div>
                <div>
                    <p><strong>Date:</strong> {props.data.inboundDetails.date}</p>
                    <p><strong>Flight Number:</strong> {props.data.inboundDetails.flightNumber}</p>
                    <p><strong>Start Time:</strong> {props.data.inboundDetails.start}</p>
                    <p><strong>End Time:</strong> {props.data.inboundDetails.end}</p>
                </div>
                <div>
                    <p><strong>Accommodations:</strong> {props.data.tripDetails.accommodations}</p>
                </div>
            </div>
            <button onClick={deleteTrip} className="delete-trip-btn">Delete Trip</button>
            <hr />
        </>
    )
}