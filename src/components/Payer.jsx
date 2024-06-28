import React from "react"

export default function Payer(props) {
    return (
        <div onClick={props.updatePayer} style={{
            backgroundColor: props.isPayer ? 'red' : 'black',
            color: props.isPayer ? 'black' : 'white',
        }}>
            {props.name}
        </div>
    )
}