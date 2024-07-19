import React from "react"
import { calculatorsCollection, transactionCollection, travellersCollection, database } from "../config/firebase"
import { doc, addDoc, deleteDoc, getDocs, onSnapshot, updateDoc, getDoc } from "firebase/firestore"
import { Link } from "react-router-dom"

export default function AddCalculator() {
    const [name, setName] = React.useState("")
    const [calculatorData, setCalculatorData] = React.useState([])

    React.useEffect(() => {
        const unsubscribe = onSnapshot(calculatorsCollection, snapshot => {
            const fetchedData = snapshot.docs.map(doc => {
                return {
                    calculatorName: doc.data().calculatorName,
                    id: doc.id
                }
            })
            setCalculatorData(fetchedData);
        })

        return () => unsubscribe();
    }, [])

    const displayCalculator = calculatorData.map(data => {
        return (
            <div>
                <p>{data.calculatorName}</p>
                <Link to={data.id}><button>View Calculator</button></Link>
                <button onClick={() => deleteCalculator(data.id, data.calculatorName)}>Delete Calculator</button>
            </div>
        )
    })

    function deleteCalculator(id, name) {
        const confirmDel = window.confirm(`Are you sure you want to delete calculator for "${name}"?`)
        if (confirmDel) {
            const docRef = doc(database, "calculators", id)
            deleteDoc(docRef)
                .then(alert("Deleted successfully!"))
        }
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
        addDoc(calculatorsCollection, {
            calculatorName: name
        })
            .then(alert("Successfully added!"))
            .then(setName(""))
            .catch(error => {
                console.error("Error adding document: ", error);
            })
    }

    return (
        <div>
            <h2>Bill Split Calculator</h2>
            <p>Travelling with friends? Add a calculator below to record your expenses and split the bill automatically!</p>
            <div>
                <label>Enter name: <input placeholder="Calculator Name" onChange={handleChange} name="calculator-name" value={name}></input></label>
                <br />
                <button onClick={createCalculator}>Add Calculator</button>
            </div>
            {displayCalculator}
        </div>
    )
}