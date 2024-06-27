import React from "react"
import "./AutoAddExpense.css"

export default function AutoAddExpense(props) {
    const individualExpense = <span className="expense-content">${(props.expense/props.count).toFixed(2)}</span>
    return (
        <div
            className="display-expense"
            style={{
                backgroundColor: props.toggle ? 'red' : 'black',
                color: props.toggle ? 'black' : 'white',

            }}
            onClick={props.onClick}
        >
            <span className="expense-content">{props.name}</span>
            {props.toggle && individualExpense}
        </div>
    )
}