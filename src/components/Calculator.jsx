import "./Calculator.css"
import React from "react"
import AutoAddExpense from "./AutoAddExpense"
import ManualAddExpense from "./ManualAddExpense"
import Transactions from "./Transactions"
import { nanoid } from "nanoid"
import Payer from "./Payer"
import { transactionCollection, travellersCollection, db } from "../config/firebase"
import { doc, addDoc, deleteDoc, getDocs, onSnapshot, updateDoc } from "firebase/firestore"

export default function Calculator() {
    const [modal, setModal] = React.useState(false)
    const [travellers, setTravellers] = React.useState([])
    const [description, setDescription] = React.useState()
    const [expense, setExpense] = React.useState()
    const [split, setSplit] = React.useState({
        auto: false,
        manual: false
    })
    const [name, setName] = React.useState("")
    const [counter, setCounter] = React.useState(0)
    const [transactions, setTransactions] = React.useState([])
    const [numPayer, setNumPayer] = React.useState(0)

    React.useEffect(() => {
        async function getData() {
            try {
                const snapshot = await getDocs(transactionCollection)
                const fetchedData = snapshot.docs.map(doc => {
                    return {
                        description: doc.data().description,
                        expenseTracker: JSON.parse(doc.data().expenseTracker),
                        numPayer: doc.data().numPayer,
                        id: doc.id
                    }
                })
                setTransactions(fetchedData)
            } catch (error) {
                console.error(`Error fetching documents: ${error}`)
            }
        }
        getData()
    }, [])

    React.useEffect(() => {
        async function getData() {
            try {
                const snapshot = await getDocs(travellersCollection)
                const fetchedData = snapshot.docs.map(doc => {
                    return {
                        travellerName: doc.data().name,
                        netAmount: doc.data().netAmount,
                        expensePlaceholder: 0,
                        toggle: true,
                        isPayer: false,
                        id: doc.id
                    }
                })
                setTravellers(fetchedData)
            } catch (error) {
                console.error(`Error fetching documents: ${error}`)
            }
        }
        getData()
    }, [])

    React.useEffect(() => {
        if (split.auto) {
            setTravellers(prev => prev.map(
                traveller => {
                    return {
                        ...traveller,
                        expensePlaceholder: (expense/counter)
                    }
                }
            ))
        } else {
            setTravellers(prev => prev.map(
                traveller => {
                    return {
                        ...traveller,
                        expensePlaceholder: 0
                    }
                }
            ))
        }
    }, [split])

    React.useEffect(() => {
        let count = 0
        let numPayer = 0
        for (let i = 0; i < travellers.length; i++) {
            if (travellers[i].toggle === true) {
                count++
            }
        }
        setCounter(count)
        for (let i = 0; i < travellers.length; i++) {
            if (travellers[i].isPayer === true) {
                numPayer++
            }
        }
        setNumPayer(numPayer)
    }, [travellers])

    React.useEffect(() => {
        const unsubscribe = onSnapshot(transactionCollection, (snapshot) => {
            const fetchedData = snapshot.docs.map(doc => {
                return {
                    description: doc.data().description,
                    expenseTracker: JSON.parse(doc.data().expenseTracker),
                    numPayer: doc.data().numPayer,
                    id: doc.id
                }
            })
        setTransactions(fetchedData)
        })
        return () => unsubscribe()
    }, [])

    React.useEffect(() => {
        const unsubscribe = onSnapshot(travellersCollection, (snapshot) => {
            const fetchedData = snapshot.docs.map(doc => {
                return {
                    travellerName: doc.data().name,
                    netAmount: doc.data().netAmount,
                    expensePlaceholder: 0,
                    toggle: true,
                    isPayer: false,
                    id: doc.id
                }
            })
        setTravellers(fetchedData)
        })
        return () => unsubscribe()
    }, [])

    const displayTransactions = !(transactions.length)
        ? transactions
        : transactions.map(transaction => {
            return (
                <Transactions 
                    transaction={transaction}
                />
            )
        })

    const displayTravellers = !(travellers.length) 
        ? travellers 
        : travellers.map(traveller => {
            const netAmount = traveller.netAmount
            const styles = {
                color: netAmount > 0 ? "green" : netAmount < 0 ? "red" : "white"
            }
            return (
                <>
                    <span>
                        {traveller.travellerName}
                    </span>
                    {netAmount > 0 && <span style={styles}>+{netAmount.toFixed(2)}</span>}
                    {netAmount < 0 && <span style={styles}>{netAmount.toFixed(2)}</span>}
                    {netAmount == 0 && <span style={styles}>{netAmount.toFixed(2)}</span>}
                    <button className="delete-btn" onClick={() => deleteTraveller(traveller.id)}>Delete traveller</button>
                    <br></br>
                </>)
            }
        )

    const displayAutoSplit = !(travellers.length)
        ? travellers
        : travellers.map(traveller => {
            return (
                <AutoAddExpense
                    name={traveller.travellerName}
                    key={traveller.id}
                    value={traveller.netAmount}
                    toggle={traveller.toggle}
                    onClick={() => {
                        toggleSelected(traveller.id)
                    }}
                    expense={expense}
                    count={counter}
                    updateAmount={(amount) => updatePlaceholder(traveller.id, amount)}
                    isPayer={traveller.isPayer}
                />
            )
        })

    const displayManualSplit = !(travellers.length)
        ? travellers
        : travellers.map(traveller => {
            return (
                <ManualAddExpense
                    name={traveller.travellerName}
                    key={traveller.id}
                    value={traveller.netAmount}
                    toggle={traveller.toggle}
                    onClick={() => {
                        toggleSelected(traveller.id)
                    }}
                    expense={expense}
                    count={counter}
                    updateAmount={(amount) => updatePlaceholder(traveller.id, amount)}
                    isPayer={traveller.isPayer}
                />
            )
        })

    const displayPayer = !(travellers.length)
        ? travellers
        : travellers.map(traveller => {
            return (
                <Payer
                    name={traveller.travellerName}
                    key={traveller.id}
                    value={traveller.netAmount}
                    toggle={traveller.toggle}
                    onClick={() => {
                        toggleSelected(traveller.id)
                    }}
                    expense={expense}
                    count={counter}
                    updatePayer={() => updatePayer(traveller.id)}
                    isPayer={traveller.isPayer}
                />
            )
        })

    function toggleSelected(id) {
        setTravellers(prev => 
            prev.map(traveller => {
                return traveller.id === id
                    ? {...traveller, toggle: !traveller.toggle, expensePlaceholder: 0}
                    : traveller
            }
        ))
    }

    function updatePayer(id) {
        setTravellers(prev => 
            prev.map(traveller => {
                return traveller.id === id
                    ? {...traveller, isPayer: !traveller.isPayer}
                    : traveller
            })
        )
    }

    function updatePlaceholder(id, amount) {
        setTravellers(prev => 
            prev.map(traveller => {
                return traveller.id === id
                    ? {...traveller, expensePlaceholder: amount}
                    : traveller
            })
        )
    }

    function toggleModal() {
        setModal(prevModal => !prevModal)
        setTravellers(prevTraveller => {
                for (let i = 0; i < prevTraveller.length; i++) {
                    prevTraveller[i].toggle = true
                }
                return prevTraveller
            }
        )
        setExpense()
        setSplit(prev => {
            return {
                auto: false,
                manual: false
            }
        })
    }

    function toggleSplit(event) {
        if (!description) {
            alert("enter a description first!")
            return
        }
        if (!expense) {
            alert("enter an amount first!")
            return
        }

        if (event.target.name === "auto") {
            setSplit(prev => {
                if (split.manual) {
                    return {
                        auto: true,
                        manual: false
                    }
                }
                return {
                    ...prev,
                    auto: !prev.auto
                }
            })
        } else {
            setSplit(prev => {
                if (split.auto) {
                    return {
                        auto: false,
                        manual: true
                    }
                }
                return {
                    ...prev,
                    manual: !prev.manual
                }
            })
        }
    }

    function addTraveller() {
        if (!name) {
            setName("")
            alert("key in a valid name!")
        } else {
            addDoc(travellersCollection, {
                name: name,
                netAmount: 0
            })
            .then(() => {
                //alert("Success")
            })
            setName("")
        }
    }

    function deleteTraveller(id) {
        const docRef = doc(db, "travellers-info", id)
        deleteDoc(docRef)
            .then(() => {
                //alert("Traveller successfully deleted!")
            })
            .catch((err) => alert(`Error removing document: ${err}`))
    }
    
    function trackChanges(event) {
        if (event.target.name === "traveller-name") {
            setName(event.target.value)
        }
        if (event.target.name === "add-expense") {
            setExpense(event.target.value)
            setCounter(travellers.length)
        }
        if (event.target.name === "description") {
            setDescription(event.target.value)
        }
    }

    function updateDatabase() {
        const travellersInvolved = travellers.filter(traveller => traveller.toggle || traveller.isPayer)
        for (let i = 0; i < travellersInvolved.length; i++) {
            const docRef = doc(db, "travellers-info", travellersInvolved[i].id)
            console.log(expense, travellersInvolved[i].expensePlaceholder)
            if (travellersInvolved[i].isPayer) {
                updateDoc(docRef, {
                    netAmount: parseFloat(travellersInvolved[i].netAmount) + parseFloat(expense) / numPayer - parseFloat(travellersInvolved[i].expensePlaceholder)
                })
            } else {
                updateDoc(docRef, {
                    netAmount: parseFloat(travellersInvolved[i].netAmount) - parseFloat(travellersInvolved[i].expensePlaceholder)
                })
            }
        }

        const truncatedInfo = travellers.map(traveller => {
            return {
                travellerName: traveller.travellerName,
                expensePlaceholder: traveller.expensePlaceholder,
                isPayer: traveller.isPayer,
                id: traveller.id
            }
        })
        addDoc(transactionCollection, {
            description: description,
            expenseTracker: JSON.stringify(truncatedInfo),
            numPayer: numPayer
        })
        .then(() => {
            alert("Success")
            toggleModal()
        })
    }

    if(modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

    return (
        <>
            <div>
                {displayTravellers}
                {travellers.length !== 0 && <button onClick={toggleModal}>Add expense</button>}
                <input name="traveller-name" className="traveller-name" placeholder ="Name" onChange={trackChanges} value={name} />
                <button onClick={addTraveller}>Add Traveller</button>
                {modal && (
                    <div className="modal">
                        <div onClick={toggleModal} className="overlay"></div>
                        <div className="modal-content">
                            <input name="description" onChange={trackChanges} placeholder="Enter a description" />
                            <br />
                            $<input name="add-expense" onChange={trackChanges}></input>
                            <br />
                            <p>Person who paid:</p>
                            {displayPayer}
                            <button name="auto" onClick={toggleSplit}>Split equally</button>
                            <button name="manual" onClick={toggleSplit}>Split manually</button>
                            {split.auto && displayAutoSplit}
                            {split.manual && displayManualSplit}
                            {(split.auto || split.manual) && <button onClick={updateDatabase}>Confirm</button>}
                            <button className="close-modal" onClick={toggleModal}>
                            CLOSE
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div>
                {displayTransactions}
            </div>
        </>
    )
}