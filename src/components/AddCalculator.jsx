import React from "react"
import { calculatorsCollection, transactionCollection, travellersCollection, database } from "../config/firebase"
import { doc, addDoc, deleteDoc, getDocs, onSnapshot, collection, updateDoc, getDoc, writeBatch } from "firebase/firestore"
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
                <Link to={`calculator/${data.id}`}><button className="calculator-button">View Calculator</button></Link>
                <button className="calculator-button" onClick={() => deleteCalculator(data.id, data.calculatorName)}>Delete Calculator</button>
            </div>
        )
    })

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
                alert('Failed to delete subcollection')
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
        <div className="calculator-wrapper">
            <h2>Bill Split Calculator</h2>
            <p>Travelling with friends? Add a calculator below to record your expenses and split the bill automatically!</p>
            <div>
                <label>Enter name: <input placeholder="Calculator Name" onChange={handleChange} name="calculator-name" value={name}></input></label>
                <br />
                <button onClick={createCalculator} className="calculator-button">Add Calculator</button>
            </div>
            {displayCalculator}
        </div>
    )
}