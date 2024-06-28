import React from "react"

export default function Transactions(props) {
    let payers = []
    let payees = []
    for (let i = 0; i < props.transaction[1].length; i++) {
        if (props.transaction[1][i].isPayer) {
            payers.push(props.transaction[1][i].travellerName)
        } else {
            payees.push(props.transaction[1][i].travellerName)
        }
    }
    let displayPayers = payers.map(payer => {
        return (
            <>{payer}</>
        )
    })
    let displayPayees = payees.map(payee => {
        return (
            <>{payee}</>
        )
    })
    return (
        <div>
            <span>{props.transaction[0]}: </span>
            <span>{displayPayees} owes ${props.transaction[1][1].expensePlaceholder} to {displayPayers}</span>
            <button>Delete Transaction</button>
            <button>Bill Cleared Up</button>
        </div>
    )
}