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

    const manualInput =
        <div className="indiv-expense-container">
            <span>$</span>
            <input
                placeholder="Enter amount"
                className="individual-expense"
                onChange={individualExpense}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    return (
        <div>
            <div className="display-expense" onClick={props.onClick}>
                {/* <div className="expense-content" onClick={props.onClick} style={{
                    backgroundColor: props.toggle ? 'red' : 'black',
                    color: props.toggle ? 'black' : 'white',
                }}>{props.name}</div> */}
                <button className={`indiv-traveller ${props.toggle ? "payee" : ""}`}>
                    <span className="expense-content">
                        {props.name}
                    </span>
                    <div>
                        <input type="checkbox" checked={props.toggle} />
                    </div>
                </button>
            </div>
            {props.toggle && manualInput}
        </div>
    )
}