import "./Calculator.css"
import React from "react"
import AutoAddExpense from "./AutoAddExpense"
import ManualAddExpense from "./ManualAddExpense"
import Transactions from "./Transactions"
import Payer from "./Payer"
import { calculatorsCollection, transactionCollection, travellersCollection, database } from "../config/firebase"
import { doc, addDoc, deleteDoc, getDocs, onSnapshot, updateDoc, getDoc, collection, query, orderBy } from "firebase/firestore"
import { useParams, Link, useNavigate } from "react-router-dom"
import { FaChevronLeft } from "react-icons/fa"

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
    const [numPayee, setNumPayee] = React.useState(0)
    const [remainingAmount, setRemainingAmount] = React.useState(0)
    const [visibleDates, setVisibleDates] = React.useState([])
    let displayDate = ""
    const { userId } = useParams()
    const calculatorDocRef = doc(database, "calculators", userId)
    const transactionColRef = collection(calculatorDocRef, "transactions")
    const travellersColRef = collection(calculatorDocRef, "travellers-info")
    const navigate = useNavigate();

    let curr = new Date()
    curr.setDate(curr.getDate())
    let currDate = curr.toISOString().substring(0, 10)

    const [date, setDate] = React.useState(currDate)
    console.log("currdate is " + currDate)
    console.log("date is " + date)

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
        let numPayee = 0
        let remainingAmount = expense
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
        for (let i = 0; i < travellers.length; i++) {
            if (travellers[i].expensePlaceholder !== 0) {
                numPayee++
                remainingAmount -= travellers[i].expensePlaceholder
                remainingAmount = remainingAmount.toFixed(2)
            }
        }
        setNumPayee(numPayee)
        setNumPayer(numPayer)
        setRemainingAmount(remainingAmount)
    }, [travellers])

    React.useEffect(() => {
        const q = query(transactionColRef, orderBy("date", "desc"))
        const unsubscribe = onSnapshot(q, snapshot => {
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
            if (displayDate === "" || transaction.date !== displayDate) {
                displayDate = transaction.date
                return (
                    <div>
                        <div className="display-transaction-el">
                            <h3>{transaction.date} Transactions</h3>
                            <button className="display-transaction-btn calculator-button" onClick={() => toggleDateVisibility(transaction.date)}>{visibleDates.includes(transaction.date) ? "Hide information" : "Show information"}</button>
                        </div>
                        {visibleDates.includes(transaction.date) && (
                            <Transactions
                                transaction={transaction}
                                travellers={travellers}
                                userId={userId}
                            />
                        )}
                    </div>
                )
            } else {
                return visibleDates.includes(transaction.date)
                    ? <Transactions
                        transaction={transaction}
                        travellers={travellers}
                        userId={userId}
                    />
                    : null
            }
        })

    displayDate = ""

    const displayTravellers = !(travellers.length)
        ? travellers
        : travellers.map(traveller => {
            const netAmount = traveller.netAmount
            const styles = {
                color: netAmount > 0 ? "green" : netAmount < 0 ? "red" : "white"
            }
            return (
                <div className="display-traveller" key={traveller.id}>
                    <p>
                        {traveller.travellerName}
                    </p>
                    {netAmount > 0 && <p style={styles}>$+{netAmount.toFixed(2)}</p>}
                    {netAmount < 0 && <p style={styles}>${netAmount.toFixed(2)}</p>}
                    {netAmount == 0 && <p style={styles}>${netAmount.toFixed(2)}</p>}
                    <button className="delete-btn" onClick={() => deleteTraveller(traveller.id)}>Delete traveller</button>
                    <button className="edit-btn calculator-button" onClick={() => toggleEditModal(traveller.id)}>Edit Name</button>
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

    function toggleDateVisibility(date) {
        setVisibleDates(prevDates => {
            return prevDates.includes(date)
                ? prevDates.filter(d => d !== date)
                : [...prevDates, date]
        })
    }

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
        setDate(currDate)
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
            alert("Enter a description first!")
            return
        }
        if (!date) {
            alert("Enter the date of transaction first!")
            return
        }
        if (!expense) {
            alert("Enter an amount first!")
            return
        }
        if (isNaN(expense)) {
            alert("Key in valid numbers!")
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
        if (travellers.length === 1) {
            alert("You only have 1 traveller now, add more travellers!")
            return
        }
        if (numPayer === 0) {
            alert("Select at least 1 payer!")
            return
        }
        if (counter === 0) {
            alert("Select at least 1 payee!")
            return
        }
        if (!description) {
            alert("Enter a description first!")
            return
        }
        if (!date) {
            alert("Enter the date of transaction first!")
            return
        }
        if (!expense) {
            alert("Enter an amount first!")
            return
        }
        if (isNaN(expense)) {
            alert("Key in valid numbers!")
            return
        }
        if (!split.auto && (remainingAmount < 0 || remainingAmount > 0)) {
            alert("Split your bills properly!")
            return
        }

        if (numPayee === numPayer) {
            let count = 0
            for (let i = 0; i < travellers.length; i++) {
                if (travellers[count].isPayer && travellers[count].expensePlaceholder !== 0) {
                    count++
                }
            }
            if (count === numPayee) {
                alert("Choose different payers and payees!")
                return
            }
        }

        const travellersInvolved = travellers.filter(traveller => traveller.toggle || traveller.isPayer)

        let calculatedPayerExpense = (parseFloat(expense) / numPayer).toFixed(2) * numPayer
        let diffInPayerExpense = (calculatedPayerExpense - expense).toFixed(2)
        console.log(diffInPayerExpense)

        let calculatedIndivExpense = (parseFloat(expense) / counter).toFixed(2) * counter
        let diffInIndivExpense = (calculatedIndivExpense - expense).toFixed(2)
        console.log(diffInIndivExpense)

        for (let i = 0; i < travellersInvolved.length; i++) {
            const docRef = doc(database, "calculators", userId, "travellers-info", travellersInvolved[i].id)
            if (travellersInvolved[i].isPayer) {
                if (diffInPayerExpense > 0) {
                    diffInPayerExpense -= 0.01
                    updateDoc(docRef, {
                        netAmount: parseFloat(travellersInvolved[i].netAmount) + parseFloat(expense) / numPayer - parseFloat(travellersInvolved[i].expensePlaceholder) - 0.01
                    })
                } else if (diffInPayerExpense < 0) {
                    diffInPayerExpense += 0.01
                    updateDoc(docRef, {
                        netAmount: parseFloat(travellersInvolved[i].netAmount) + parseFloat(expense) / numPayer - parseFloat(travellersInvolved[i].expensePlaceholder) + 0.01
                    })
                } else {
                    updateDoc(docRef, {
                        netAmount: parseFloat(travellersInvolved[i].netAmount) + parseFloat(expense) / numPayer - parseFloat(travellersInvolved[i].expensePlaceholder)
                    })
                }
            } else {
                if (split.auto) {
                    if (diffInIndivExpense > 0) {
                        diffInIndivExpense -= 0.01
                        updateDoc(docRef, {
                            netAmount: parseFloat(travellersInvolved[i].netAmount) - parseFloat(travellersInvolved[i].expensePlaceholder) + 0.01
                        })
                    } else if (diffInIndivExpense < 0) {
                        diffInIndivExpense += 0.01
                        updateDoc(docRef, {
                            netAmount: parseFloat(travellersInvolved[i].netAmount) - parseFloat(travellersInvolved[i].expensePlaceholder) - 0.01
                        })
                    } else {
                        updateDoc(docRef, {
                            netAmount: parseFloat(travellersInvolved[i].netAmount) - parseFloat(travellersInvolved[i].expensePlaceholder)
                        })
                    }
                } else {
                    updateDoc(docRef, {
                        netAmount: parseFloat(travellersInvolved[i].netAmount) - parseFloat(travellersInvolved[i].expensePlaceholder)
                    })
                }
            }
        }

        diffInPayerExpense = (calculatedPayerExpense - expense).toFixed(2)
        diffInIndivExpense = (calculatedIndivExpense - expense).toFixed(2)

        const truncatedInfo = travellers.map(traveller => {
            if (traveller.isPayer) {
                if (diffInPayerExpense > 0) {
                    diffInPayerExpense -= 0.01
                    return {
                        travellerName: traveller.travellerName,
                        expensePlaceholder: expense / numPayer - traveller.expensePlaceholder - 0.01,
                        isPayer: traveller.isPayer,
                        id: traveller.id
                    }
                } else if (diffInPayerExpense < 0) {
                    diffInPayerExpense += 0.01
                    return {
                        travellerName: traveller.travellerName,
                        expensePlaceholder: expense / numPayer - traveller.expensePlaceholder + 0.01,
                        isPayer: traveller.isPayer,
                        id: traveller.id
                    }
                } else {
                    return {
                        travellerName: traveller.travellerName,
                        expensePlaceholder: expense / numPayer - traveller.expensePlaceholder,
                        isPayer: traveller.isPayer,
                        id: traveller.id
                    }
                }
            } else {
                if (split.auto) {
                    if (diffInIndivExpense > 0) {
                        diffInIndivExpense -= 0.01
                        return {
                            travellerName: traveller.travellerName,
                            expensePlaceholder: traveller.expensePlaceholder - 0.01,
                            isPayer: traveller.isPayer,
                            id: traveller.id
                        }
                    } else if (diffInIndivExpense < 0) {
                        diffInIndivExpense += 0.01
                        return {
                            travellerName: traveller.travellerName,
                            expensePlaceholder: traveller.expensePlaceholder + 0.01,
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
                } else {
                    return {
                        travellerName: traveller.travellerName,
                        expensePlaceholder: traveller.expensePlaceholder,
                        isPayer: traveller.isPayer,
                        id: traveller.id
                    }
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
        <>
            <button className="back-btn" onClick={() => navigate("/trips")}><FaChevronLeft />Trips</button>
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
                                <input name="date" type="date" onChange={trackChanges} defaultValue={currDate} max={currDate} required />
                            </label>
                            <br />
                            <label>Cost: $
                                <input name="add-expense" onChange={trackChanges} required />
                            </label>
                            <br />
                            <p>Person who paid:</p>
                            {displayPayer}
                            <button name="auto" className={`auto-btn calculator-button ${split.auto ? "auto-click" : ""}`} onClick={toggleSplit}>Split equally</button>
                            <button name="manual" className={`manual-btn calculator-button ${split.manual ? "manual-click" : ""}`} onClick={toggleSplit}>Split manually</button>
                            {split.auto && displayAutoSplit}
                            {split.manual && displayManualSplit}
                            {split.manual && numPayee > 0 && remainingAmount >= 0 && (
                                <p>total expenditure: ${expense}, remaining amount: ${remainingAmount}</p>
                            )}
                            {split.manual && numPayee > 0 && remainingAmount < 0 && (
                                <p>error!</p>
                            )}
                            {(split.auto || split.manual) && <button className="calculator-button" onClick={updateDatabase}>Confirm</button>}
                            <button className="close-modal calculator-button" onClick={toggleModal}>
                                CLOSE
                            </button>
                        </div>
                    </div>
                )}
                {editModal && (
                    <div className="modal">
                        <div onClick={toggleEditModal} className="overlay"></div>
                        <div className="edit-modal-content">
                            <input name="edited-name" onChange={trackChanges} placeholder="Enter new name" className="edit-name-el" />
                            <br />
                            <button className="calculator-button" onClick={() => editTraveller(travellerId)}>Update</button>
                            <button className="close-modal calculator-button" onClick={toggleEditModal}>
                                CLOSE
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}