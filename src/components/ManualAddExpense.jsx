import React from "react"

export default function ManualAddExpense(props) {
    const [expense, setExpense] = React.useState()

    React.useEffect(() => {
        props.updateAmount(expense)
    }, [expense])

    function individualExpense(event) {
        setExpense(event.target.value)
    }

    const manualInput = 
        <>
            <span>$</span>
            <input placeholder="Enter amount" className="individual-expense" onChange={individualExpense} />
        </>
    return (
        <div className="display-expense">
            <div className="expense-content" onClick={props.onClick} style={{
                backgroundColor: props.toggle ? 'red' : 'black',
                color: props.toggle ? 'black' : 'white',
            }}>{props.name}</div>
            {props.toggle && manualInput}
        </div>
    )
}