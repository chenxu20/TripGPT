import React from "react"
import "./ManualAddExpense.css"

export default function ManualAddExpense(props) {
    const [expense, setExpense] = React.useState()

    React.useEffect(() => {
        props.updateAmount(expense)
    }, [expense])

    function individualExpense(event) {
        setExpense(event.target.value)
    }

    function reset() {
        setExpense()
    }

    const manualInput =
        <div className="indiv-expense-container">
            <span>$</span>
            <input
                placeholder="Enter amount"
                className="individual-expense"
                value={expense}
                onChange={individualExpense}
                onClick={(e) => e.stopPropagation()}
                type="number"
                min={0}
            />
        </div>
    return (
        <div>
            <div className="display-expense" onClick={() => {
                props.onClick()
                reset()
            }}>
                <button className={`indiv-traveller ${props.toggle ? "payee" : ""}`}>
                    <span className="expense-content">
                        {props.name}
                    </span>
                    <div>
                        <input type="checkbox" checked={props.toggle} onChange={props.onClick} />
                    </div>
                </button>
            </div>
            {props.toggle && manualInput}
        </div>
    )
}