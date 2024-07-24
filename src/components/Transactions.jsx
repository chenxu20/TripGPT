import React from "react"
import { doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore"
import { database } from "../config/firebase"
import "./Transactions.css"

export default function Transactions(props) {
    let payers = []
    let payees = []

    for (let i = 0; i < props.transaction.expenseTracker.length; i++) {
        if (props.transaction.expenseTracker[i].isPayer && props.transaction.expenseTracker[i].expensePlaceholder > 0) {
            payers.push(props.transaction.expenseTracker[i])
        }
        if ((props.transaction.expenseTracker[i].expensePlaceholder && !(props.transaction.expenseTracker[i].isPayer)) || (props.transaction.expenseTracker[i].expensePlaceholder < 0 && props.transaction.expenseTracker[i].isPayer)) {
            payees.push(props.transaction.expenseTracker[i])
        }
    }

    let displayPayers = payers.map(payer => {
        return (
            <div>
                <span>{payer.travellerName} should receive
                    ${parseFloat(payer.expensePlaceholder).toFixed(2)}</span>
            </div>
        )
    })
    //displayPayers[displayPayers.length - 1] = <>{payers[payers.length - 1].travellerName}</>

    let displayPayees = payees.map(payee => {
        return (
            <div>
                <span>{payee.travellerName} needs to pay
                    ${Math.abs(parseFloat(payee.expensePlaceholder)).toFixed(2)}</span>
            </div>
        )
    })
    //displayPayees[displayPayees.length - 1] = <>{payees[payees.length - 1].travellerName}</>

    function deleteTransaction() {
        if (!props.transaction?.id) {
            console.error('Transaction ID is missing');
            return;
        }

        let payeeAmount = 0

        for (let i = 0; i < payees.length; i++) {
            let tempAmountHolder
            payeeAmount += parseFloat(payees[i].expensePlaceholder)
            let transactionAmount = Math.abs(parseFloat(payees[i].expensePlaceholder))
            const travellerDocRef = doc(database, "calculators", props.userId, "travellers-info", payees[i].id)
            getDoc(travellerDocRef)
                .then((doc) => {
                    tempAmountHolder = doc.data().netAmount
                    if (tempAmountHolder + transactionAmount < 0.0001 && tempAmountHolder + transactionAmount > -0.0001) {
                        updateDoc(travellerDocRef, {
                            netAmount: 0
                        })
                    } else {
                        updateDoc(travellerDocRef, {
                            netAmount: tempAmountHolder + transactionAmount
                        })
                    }
                })
        }

        for (let i = 0; i < payers.length; i++) {
            let tempAmountHolder
            const travellerDocRef = doc(database, "calculators", props.userId, "travellers-info", payers[i].id)
            getDoc(travellerDocRef)
                .then((doc) => {
                    tempAmountHolder = doc.data().netAmount
                    if (tempAmountHolder - parseFloat(payers[i].expensePlaceholder) < 0.0001 && tempAmountHolder - parseFloat(payers[i].expensePlaceholder) > -0.0001) {
                        updateDoc(travellerDocRef, {
                            netAmount: 0
                        })
                    } else {
                        updateDoc(travellerDocRef, {
                            netAmount: tempAmountHolder - parseFloat(payers[i].expensePlaceholder)
                        })
                    }
                })
        }

        const transactionDocRef = doc(database, "calculators", props.userId, "transactions", props.transaction.id)
        deleteDoc(transactionDocRef)
            .catch((err) => alert(`Error removing document: ${err}`))
    }

    return (
        <div className="indiv-transaction-el">
            <h4>Transaction Description: {props.transaction.description}</h4>
            {displayPayees}
            {displayPayers}
            <button onClick={deleteTransaction} className="delete-transaction-btn">Delete Transaction</button>
        </div>
    )
}