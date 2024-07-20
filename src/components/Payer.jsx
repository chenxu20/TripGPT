import React from "react"
import "./Payer.css"

export default function Payer(props) {
    return (
        <div>
            <button className={`payer-name ${props.isPayer ? "payer" : ""}`} onClick={props.updatePayer}>{props.name}
                <input type="checkbox" checked={props.isPayer}></input>
            </button>
        </div>
    )
}