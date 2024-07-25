import React from "react"
import { calculatorsCollection, transactionCollection, travellersCollection, database, auth } from "../config/firebase"
import { doc, addDoc, deleteDoc, getDocs, onSnapshot, collection, updateDoc, getDoc, writeBatch, query, where, setIndexConfiguration } from "firebase/firestore"
import { Link } from "react-router-dom"
import "./AddCalculator.css"

export default function AddCalculator() {
    const [name, setName] = React.useState("")
    const [calculatorData, setCalculatorData] = React.useState([])
    const [userData, setUserData] = React.useState([])
    const [modal, setModal] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const [calcId, setCalcId] = React.useState("")
    let err = false

    const userCollection = collection(database, "users")

    React.useEffect(() => {
        const unsubscribe = onSnapshot(userCollection, snapshot => {
            const fetchedData = snapshot.docs.map(doc => {
                return {
                    email: doc.data().email,
                    uid: doc.data().uid
                }
            })
            setUserData(fetchedData)
        })
        return () => unsubscribe()
    }, [])

    React.useEffect(() => {
        const q = query(calculatorsCollection, where("user", "array-contains", auth.currentUser.uid))
        const unsubscribe = onSnapshot(q, snapshot => {
            const fetchedData = snapshot.docs.map(doc => {
                return {
                    calculatorName: doc.data().calculatorName,
                    user: doc.data().user,
                    id: doc.id
                }
            })
            setCalculatorData(fetchedData);
        })

        return () => unsubscribe();
    }, [])

    const displayCalculator = calculatorData.map(data => {
        return (
            <div className="calc-div">
                <h3>{data.calculatorName}</h3>
                <div className="calculator-btns">
                    <Link to={`calculator/${data.id}`}><button>View Calculator</button></Link>
                    <button onClick={() => deleteCalculator(data.id, data.calculatorName)}>Delete Calculator</button>
                    <button onClick={() => toggleModal(data.id)}>Share Calculator</button>
                </div>
            </div>
        )
    })

    function toggleModal(id) {
        if (modal === false) {
            setCalcId(id)
        } else {
            setCalcId("")
        }
        setModal(prev => !prev)
        setEmail("")
        err = false
    }

    function trackChanges(event) {
        if (event.target.name === "email") {
            setEmail(event.target.value)
        }
    }

    function addUser() {
        let tempUid = null
        let tempArr = []
        let docRef = doc(database, "calculators", calcId)
        for (let i = 0; i < userData.length; i++) {
            if (email === userData[i].email) {
                tempUid = userData[i].uid
            }
        }
        if (tempUid !== null) {
            getDoc(docRef)
                .then(doc => {
                    tempArr = doc.data().user
                    if (tempArr.includes(tempUid)) {
                        alert("User already has access to calculator")
                        return
                    }
                    tempArr.push(tempUid)
                    updateDoc(docRef, {
                        user: tempArr
                    })
                        .then(alert("Success"))
                })
        } else {
            alert("User does not exist")
        }
    }

    async function deleteCalculator(id, name) {
        const confirmDel = window.confirm(`Are you sure you want to delete calculator for "${name}"?`)
        if (confirmDel) {
            try {
                await deleteSubcollection(id, "travellers-info")
                await deleteSubcollection(id, "transactions")
                const docRef = doc(database, "calculators", id)
                deleteDoc(docRef)
                    .then(alert("Deleted successfully!"))
            } catch (error) {
                console.error('Error deleting subcollection:', error)
                alert('Failed to delete calculator')
            }
        }
    }

    async function deleteSubcollection(rootDocId, subcollectionName) {
        const subcollectionRef = collection(database, "calculators", rootDocId, subcollectionName)
        const querySnapshot = await getDocs(subcollectionRef)

        const batch = writeBatch(database)

        querySnapshot.forEach((document) => {
            const docRef = doc(database, "calculators", rootDocId, subcollectionName, document.id)
            batch.delete(docRef)
        });

        await batch.commit()
        console.log('Subcollection deleted successfully')
    }

    function handleChange(event) {
        if (event.target.name === "calculator-name") {
            setName(event.target.value)
        }
    }

    function createCalculator() {
        if (name === "") {
            alert("Enter a name!")
            return
        }
        let users = [auth.currentUser.uid]
        addDoc(calculatorsCollection, {
            calculatorName: name,
            user: users
        })
            .then(alert("success"))
            .then(setName(""))
            .catch(error => {
                console.error("Error adding document: ", error);
            })
    }

    return (
        <div className="calculator-wrapper">
            <h2>Bill Split Calculator</h2>
            <p>Travelling with friends? Add a calculator below to record your expenses and split the bill automatically!</p>
            <div>
                <label>Enter name: <input placeholder="Calculator Name" onChange={handleChange} name="calculator-name" value={name} className="add-calc-el"></input></label>
                <br />
                <button onClick={createCalculator} className="calculator-button">Add Calculator</button>
            </div>
            {displayCalculator}
            {modal && (
                <div className="modal">
                    <div onClick={toggleModal} className="overlay"></div>
                    <div className="email-modal-content">
                        <label>Enter Email:</label>
                        <input name="email" onChange={trackChanges} placeholder="Enter email" className="email-el" type="email" />
                        <br />
                        <button onClick={addUser}>Confirm</button>
                        <button className="close-modal" onClick={toggleModal}>
                            CLOSE
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}