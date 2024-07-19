import "./Calculator.css"
import React from "react"
import AutoAddExpense from "./AutoAddExpense"
import ManualAddExpense from "./ManualAddExpense"
import Transactions from "./Transactions"
import Payer from "./Payer"
import { calculatorsCollection, transactionCollection, travellersCollection, database } from "../config/firebase"
import { doc, addDoc, deleteDoc, getDocs, onSnapshot, updateDoc, getDoc, collection } from "firebase/firestore"
import { useParams } from "react-router-dom"

export default function Calculator() {
    const [modal, setModal] = React.useState(false)
    const [editModal, setEditModal] = React.useState(false)
    const [editName, setEditName] = React.useState()
    const [travellerId, setTravellerId] = React.useState()
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
    const [date, setDate] = React.useState()
    const { userId } = useParams()
    const calculatorDocRef = doc(database, "calculators", userId)
    const transactionColRef = collection(calculatorDocRef, "transactions")
    const travellersColRef = collection(calculatorDocRef, "travellers-info")

    React.useEffect(() => {
        async function getData() {
            try {
                const snapshot = await getDocs(transactionColRef)
                const fetchedData = snapshot.docs.map(doc => {
                    return {
                        description: doc.data().description,
                        expenseTracker: JSON.parse(doc.data().expenseTracker),
                        numPayer: doc.data().numPayer,
                        expense: doc.data().expense,
                        date: doc.data().date,
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
                const snapshot = await getDocs(travellersColRef)
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
                        expensePlaceholder: (expense / counter)
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
        const unsubscribe = onSnapshot(transactionColRef, (snapshot) => {
            const fetchedData = snapshot.docs.map(doc => {
                return {
                    description: doc.data().description,
                    expenseTracker: JSON.parse(doc.data().expenseTracker),
                    numPayer: doc.data().numPayer,
                    expense: doc.data().expense,
                    date: doc.data().date,
                    id: doc.id
                }
            })
            setTransactions(fetchedData)
        })
        return () => unsubscribe()
    }, [])

    React.useEffect(() => {
        const unsubscribe = onSnapshot(travellersColRef, (snapshot) => {
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
                    travellers={travellers}
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
                <div className="display-traveller">
                    <p>
                        {traveller.travellerName}
                    </p>
                    {netAmount > 0 && <p style={styles}>$+{netAmount.toFixed(2)}</p>}
                    {netAmount < 0 && <p style={styles}>${netAmount.toFixed(2)}</p>}
                    {netAmount == 0 && <p style={styles}>${netAmount.toFixed(2)}</p>}
                    <button className="delete-btn" onClick={() => deleteTraveller(traveller.id)}>Delete traveller</button>
                    <button className="edit-btn" onClick={() => toggleEditModal(traveller.id)}>Edit Name</button>
                    <br />
                </div>
            )
        })

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
                    ? { ...traveller, toggle: !traveller.toggle, expensePlaceholder: 0 }
                    : traveller
            }
            ))
    }

    function updatePayer(id) {
        setTravellers(prev =>
            prev.map(traveller => {
                return traveller.id === id
                    ? { ...traveller, isPayer: !traveller.isPayer }
                    : traveller
            })
        )
    }

    function updatePlaceholder(id, amount) {
        setTravellers(prev =>
            prev.map(traveller => {
                return traveller.id === id
                    ? { ...traveller, expensePlaceholder: amount }
                    : traveller
            })
        )
    }

    function toggleModal() {
        setModal(prevModal => !prevModal)
        setTravellers(prevTraveller => {
            for (let i = 0; i < prevTraveller.length; i++) {
                prevTraveller[i].toggle = true
                prevTraveller[i].isPayer = false
            }
            return prevTraveller
        }
        )
        setExpense()
        setDate()
        setDescription()
        setSplit(prev => {
            return {
                auto: false,
                manual: false
            }
        })
    }

    function toggleEditModal(id = "") {
        setEditModal(prevModal => !prevModal)
        setEditName()
        setTravellerId(id)
    }

    function toggleSplit(event) {
        if (!description) {
            alert("enter a description first!")
            return
        }
        if (!date) {
            alert("exter the date of transaction first!")
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

    function nameExist(name) {
        for (let counter = 0; counter < travellers.length; counter++) {
            if (travellers[counter].travellerName == name) {
                return true
            }
        }
        return false
    }

    function addTraveller() {
        if (!name) {
            setName("")
            alert("key in a valid name!")
        } else if (nameExist(name)) {
            alert("The name exists. Please key in a unique name!")
        } else {
            addDoc(travellersColRef, {
                name: name,
                netAmount: 0
            })
                .then(() => {
                    alert("Success")
                })
            setName("")
        }
    }

    function deleteTraveller(id) {
        const docRef = doc(database, "calculators", userId, "travellers-info", id)
        getDoc(docRef)
            .then(doc => {
                if (doc.data().netAmount != 0) {
                    alert("The debt has not been cleared yet!")
                } else {
                    deleteDoc(docRef)
                        .then(() => {
                            alert("Traveller successfully deleted!")
                        })
                        .catch((err) => alert(`Error removing document: ${err}`))
                }
            })
    }

    function editTraveller(id) {
        const docRef = doc(database, "calculators", userId, "travellers-info", id)
        if (nameExist(editName)) {
            alert("The name exists. Please key in a unique name!")
        } else {
            updateDoc(docRef, {
                name: editName
            })
                .then(() => {
                    for (let x = 0; x < transactions.length; x++) {
                        for (let y = 0; y < transactions[x].expenseTracker.length; y++) {
                            if (transactions[x].expenseTracker[y].id === travellerId) {
                                const duplicateExpenseTracker = [...transactions[x].expenseTracker]
                                duplicateExpenseTracker[y].travellerName = editName
                                const docRef = doc(database, "calculators", userId, "transactions", transactions[x].id)
                                updateDoc(docRef, {
                                    expenseTracker: duplicateExpenseTracker
                                })
                            }
                        }
                    }
                })
                .then(() => alert("Changed name sucessfully!"))
                .then(() => setEditModal())
        }
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
        if (event.target.name === "edited-name") {
            setEditName(event.target.value)
        }
        if (event.target.name === "date") {
            setDate(event.target.value)
        }
    }

    function updateDatabase() {
        if (numPayer === 0) {
            alert("Select at least 1 payer!")
            return
        }
        if (counter === 0) {
            alert("Select at least 1 payee!")
            return
        }
        const travellersInvolved = travellers.filter(traveller => traveller.toggle || traveller.isPayer)
        for (let i = 0; i < travellersInvolved.length; i++) {
            const docRef = doc(database, "calculators", userId, "travellers-info", travellersInvolved[i].id)
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
            if (traveller.isPayer) {
                return {
                    travellerName: traveller.travellerName,
                    expensePlaceholder: expense / numPayer - traveller.expensePlaceholder,
                    isPayer: traveller.isPayer,
                    id: traveller.id
                }
            } else {
                return {
                    travellerName: traveller.travellerName,
                    expensePlaceholder: traveller.expensePlaceholder,
                    isPayer: traveller.isPayer,
                    id: traveller.id
                }
            }
        })
        addDoc(transactionColRef, {
            description: description,
            expenseTracker: JSON.stringify(truncatedInfo),
            numPayer: numPayer,
            expense: expense,
            date: date
        })
            .then(() => {
                alert("Success")
                toggleModal()
            })
    }

    if (modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

    if (editModal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

    return (
        <div className="calculator-display-el">
            <div className="traveller-el">
                <h2>Bill Split Calculator</h2>
                <div className="traveller-title">
                    <span>Name</span>
                    <span>Net Amount</span>
                </div>
                {displayTravellers}
                <input name="traveller-name" className="traveller-name" placeholder="Name" onChange={trackChanges} value={name} />
                <button onClick={addTraveller} className="add-traveller-button">Add Traveller</button>
                <br />
            </div>
            <div className="transaction-el">
                {travellers.length !== 0 && <button onClick={toggleModal} className="add-expense-button">Add expense</button>}
                <h2>Transaction Records</h2>
                {displayTransactions}
            </div>
            {modal && (
                <div className="modal">
                    <div onClick={toggleModal} className="overlay"></div>
                    <div className="modal-content">
                        <label>Description:
                            <input name="description" onChange={trackChanges} placeholder="Enter a description" required />
                        </label>
                        <br />
                        <label>Date:
                            <input name="date" type="date" onChange={trackChanges} required />
                        </label>
                        <br />
                        <label>Cost: $
                            <input name="add-expense" onChange={trackChanges} required />
                        </label>
                        <br />
                        <p>Person who paid:</p>
                        {displayPayer}
                        <button name="auto" className={`auto-btn ${split.auto ? "auto-click" : ""}`} onClick={toggleSplit}>Split equally</button>
                        <button name="manual" className={`manual-btn ${split.manual ? "manual-click" : ""}`} onClick={toggleSplit}>Split manually</button>
                        {split.auto && displayAutoSplit}
                        {split.manual && displayManualSplit}
                        {(split.auto || split.manual) && <button onClick={updateDatabase}>Confirm</button>}
                        <button className="close-modal" onClick={toggleModal}>
                            CLOSE
                        </button>
                    </div>
                </div>
            )}
            {editModal && (
                <div className="modal">
                    <div onClick={toggleEditModal} className="overlay"></div>
                    <div className="modal-content">
                        <input name="edited-name" onChange={trackChanges} placeholder="Enter new name" />
                        <br />
                        <button onClick={() => editTraveller(travellerId)}>Confirm</button>
                        <button className="close-modal" onClick={toggleEditModal}>
                            CLOSE
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}