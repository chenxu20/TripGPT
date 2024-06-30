import React from "react"

export default function InboundDetails(props) {
    return (
        <div className="inbound-details-input">
            <h3>Inbound Flight Details</h3>
            <label>Flight Date: <input name="date" onChange={props.handleChange} type="date"></input></label>
            <br />
            <label>Flight Number: <input name="flightNumber" onChange={props.handleChange} required></input></label>
            <br />
            <label>Flight Timing: <br />
                <label>Start: <input name="start" onChange={props.handleChange} type="time" required></input></label>
                <label>End: <input name="end" onChange={props.handleChange} type="time" required></input></label>
            </label>
        </div>
    )
}