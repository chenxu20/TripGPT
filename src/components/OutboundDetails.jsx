import React from "react"

export default function OutboundDetails(props) {
    return (
        <div className="outbound-details-input">
            <h3>Outbound Flight Details</h3>
            <label>Flight Date: <input name="date" onChange={props.handleChange} type="date"></input></label>
            <br />
            <label>Flight Number: <input name="flightNumber" onChange={props.handleChange} required></input></label>
            <br />
            <label>Flight Timing: <br />
                <label>Start: <input name="start" type="time" onChange={props.handleChange} required></input></label>
                <label>End: <input name="end" type="time" onChange={props.handleChange} required></input></label>
            </label>
        </div>
    )
}