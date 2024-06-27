import React from "react"
//import "./AutoAddExpense.css"

export default function ManualAddExpense(props) {
    const [expense, setExpense] = React.useState()

    function individualExpense(event) {
        setExpense(event.target.value)
    }

    function updateParent() {
        props.updateAmount(expense)
    }

    const manualInput = 
        <>
            <span>$</span>
            <input placeholder="Enter amount" className="individual-expense" onChange={individualExpense} />
            <button onClick={updateParent}>Confirm</button>
        </>
    return (
        <div
            className="display-expense"
        >
            <div className="expense-content" onClick={props.onClick} style={{
                backgroundColor: props.toggle ? 'red' : 'black',
                color: props.toggle ? 'black' : 'white',
            }}>{props.name}</div>
            {props.toggle && manualInput}
        </div>
    )
}