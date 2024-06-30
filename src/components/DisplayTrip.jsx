import React from "react"
import "./DisplayTrip.css"

export default function DisplayTrip(props) {
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
                    <p><strong>Accommodations:</strong> {props.data.tripDetails.accomodations}</p>
                </div>
            </div>
            <hr />
        </>
    )
}