import React from "react"
import { doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore"
import { db } from "../config/firebase"

export default function Transactions(props) {
    let payers = []
    let payees = []
    //const [travellers, setTravellers] = React.useState([])

    // React.useEffect(() => {
    //     async function getData() {
    //         try {
    //             const snapshot = await getDocs(travellersCollection)
    //             const fetchedData = snapshot.docs.map(doc => {
    //                 return {
    //                     travellerName: doc.data().name,
    //                     netAmount: doc.data().netAmount,
    //                     expensePlaceholder: 0,
    //                     toggle: true,
    //                     isPayer: false,
    //                     id: doc.id
    //                 }
    //             })
    //             setTravellers(fetchedData)
    //         } catch (error) {
    //             console.error(`Error fetching documents: ${error}`)
    //         }
    //     }
    //     getData()
    // }, [])

    // React.useEffect(() => {
    //     const unsubscribe = onSnapshot(travellersCollection, (snapshot) => {
    //         const fetchedData = snapshot.docs.map(doc => {
    //             return {
    //                 travellerName: doc.data().name,
    //                 netAmount: doc.data().netAmount,
    //                 expensePlaceholder: 0,
    //                 toggle: true,
    //                 isPayer: false,
    //                 id: doc.id
    //             }
    //         })
    //     setTravellers(fetchedData)
    //     })
    //     return () => unsubscribe()
    // }, [])

    for (let i = 0; i < props.transaction.expenseTracker.length; i++) {
        if (props.transaction.expenseTracker[i].isPayer) {
            payers.push(props.transaction.expenseTracker[i])
        } 
        if (props.transaction.expenseTracker[i].expensePlaceholder && !(props.transaction.expenseTracker[i].isPayer)) {
            payees.push(props.transaction.expenseTracker[i])
        }
    }

    let displayPayers = payers.map(payer => {
        return (
            <>{payer.travellerName}, </>
        )
    })
    displayPayers[displayPayers.length - 1] = <>{payers[payers.length - 1].travellerName}</>

    let displayPayees = payees.map(payee => {
        return (
            <>{payee.travellerName}, </>
        )
    })
    displayPayees[displayPayees.length - 1] = <>{payees[payees.length - 1].travellerName}</>

    function deleteTransaction() {
        if (!props.transaction?.id) {
            console.error('Transaction ID is missing');
            return;
        }

        let payeeAmount = 0

        for (let i = 0; i < payees.length; i++) {
            let tempAmountHolder
            payeeAmount += parseFloat(payees[i].expensePlaceholder)
            console.log(payees[i].expensePlaceholder)
            const travellerDocRef = doc(db, "travellers-info", payees[i].id)
            getDoc(travellerDocRef)
                .then((doc) => {
                    tempAmountHolder = doc.data().netAmount
                    if (tempAmountHolder + parseFloat(payees[i].expensePlaceholder) < 0.0001 && tempAmountHolder + parseFloat(payees[i].expensePlaceholder) > -0.0001) {
                        updateDoc(travellerDocRef, {
                            netAmount: 0
                        })
                    } else {
                        updateDoc(travellerDocRef, {
                            netAmount: tempAmountHolder + parseFloat(payees[i].expensePlaceholder)
                        })
                    }
                })
        }

        for (let i = 0; i < payers.length; i++) {
            let tempAmountHolder
            const travellerDocRef = doc(db, "travellers-info", payers[i].id)
            getDoc(travellerDocRef)
                .then((doc) => {
                    tempAmountHolder = doc.data().netAmount
                    if (tempAmountHolder - payeeAmount / parseFloat(props.transaction.numPayer) < 0.0001 && tempAmountHolder - payeeAmount / parseFloat(props.transaction.numPayer)> -0.0001) {
                        updateDoc(travellerDocRef, {
                            netAmount: 0
                        })
                    } else {
                        updateDoc(travellerDocRef, {
                            netAmount: tempAmountHolder - payeeAmount / parseFloat(props.transaction.numPayer)
                        })
                    }
                })
        }

        const transactionDocRef = doc(db, "transactions", props.transaction.id)
        deleteDoc(transactionDocRef)
            .then(() => {
                alert("Transaction successfully deleted!")
            })
            .catch((err) => alert(`Error removing document: ${err}`))
    }

    return (
        <div>
            <span>{props.transaction.description}: </span>
            <span>{displayPayees} owes ${parseFloat(props.transaction.expenseTracker[0].expensePlaceholder).toFixed(2)} to {displayPayers}</span>
            <button onClick={deleteTransaction}>Delete Transaction</button>
            <button>Bill Cleared Up</button>
        </div>
    )
}