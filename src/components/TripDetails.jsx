import React from "react"

export default function TripDetails(props) {
    return (
        <div className="trip-details-input">
            <h3>Trip Details</h3>
            <label>Accomodations: <input name="accomodations" onChange={props.handleChange} required></input></label>
            <br />
        </div>
    )
}