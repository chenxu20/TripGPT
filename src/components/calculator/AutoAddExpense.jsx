import React from "react"
import "./AutoAddExpense.css"

export default function AutoAddExpense(props) {
    let expense = (props.expense / props.count)
    React.useEffect(() => {
        if (!props.toggle) {
            props.updateAmount(0)
            return
        }
        props.updateAmount(expense)
    }, [expense])


    const individualExpense = <span className="expense-content">${expense.toFixed(2)}</span>
    return (
        <div
            className="display-expense"
            onClick={props.onClick}
        >
            <button className={`indiv-traveller ${props.toggle ? "payee" : ""}`}>
                <span className="expense-content">{props.name}</span>
                <div>
                    {props.toggle && individualExpense}
                    {!props.toggle && (
                        <span className="expense-content">$0.00</span>
                    )}
                    <input type="checkbox" checked={props.toggle} onChange={props.onClick} />
                </div>
            </button>
        </div>
    )
}