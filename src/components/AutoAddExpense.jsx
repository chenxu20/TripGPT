import React from "react"
import "./AutoAddExpense.css"

export default function AutoAddExpense(props) {
    let expense = (props.expense/props.count).toFixed(2)
    React.useEffect(() => {
        if (!props.toggle) {
            props.updateAmount(0)
            return
        }
        props.updateAmount(expense)}, [expense])


    const individualExpense = <span className="expense-content">${expense}</span>
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