import React from "react"

export default function TripDetails(props) {
    return (
        <div className="trip-details-input">
            <h3>Trip Details</h3>
            <label>Accommodations: <input name="accommodations" onChange={props.handleChange} required></input></label>
            <br />
        </div>
    )
}