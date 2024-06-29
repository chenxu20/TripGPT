import React from "react"
import { doc, deleteDoc } from "firebase/firestore"
import { db } from "../config/firebase"

export default function Transactions(props) {
    let payers = []
    let payees = []
    console.log(props.transaction.id)
    for (let i = 0; i < props.transaction.expenseTracker.length; i++) {
        if (props.transaction.expenseTracker[i].isPayer) {
            payers.push(props.transaction.expenseTracker[i].travellerName)
        } else {
            payees.push(props.transaction.expenseTracker[i].travellerName)
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

    function deleteTransaction() {
        if (!props.transaction?.id) {
            console.error('Transaction ID is missing');
            return;
        }

        const docRef = doc(db, "transactions", props.transaction.id)
        deleteDoc(docRef)
            .then(() => {
                alert("Transaction successfully deleted!")
            })
            .catch((err) => alert(`Error removing document: ${err}`))
    }

    return (
        <div>
            <span>{props.transaction.description}: </span>
            <span>{displayPayees} owes ${props.transaction.expenseTracker[0].expensePlaceholder} to {displayPayers}</span>
            <button onClick={deleteTransaction}>Delete Transaction</button>
            <button>Bill Cleared Up</button>
        </div>
    )
}