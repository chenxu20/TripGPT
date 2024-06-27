import "./Calculator.css"
import React from "react"
import AutoAddExpense from "./AutoAddExpense"
import { nanoid } from "nanoid"

export default function Calculator() {
    const [modal, setModal] = React.useState(false)
    const [travellers, setTravellers] = React.useState([])
    const [expense, setExpense] = React.useState()
    const [split, setSplit] = React.useState({
        auto: false,
        manual: false
    })
    const [name, setName] = React.useState("")
    const [counter, setCounter] = React.useState(0)

    const displayTravellers = !(travellers.length) 
        ? travellers 
        : travellers.map(traveller => {
            return (
                <p>
                    {traveller.id}
                </p>)
            }
        )

    const userElements = !(travellers.length)
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
                        selectedNumber()
                    }}
                    expense={expense}
                    count={counter}
                />
            )
        })

    React.useEffect(() => {
        let count = 0;
        for (let i = 0; i < travellers.length; i++) {
            if (travellers[i].toggle === true) {
                count++
            }
        }
        setCounter(count)
    }, [travellers])

    function toggleSelected(id) {
        setTravellers(prev => 
            prev.map(traveller => {
                return traveller.id === id
                    ? {...traveller, toggle: !traveller.toggle}
                    : traveller
            }
        ))
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
        if (!expense) {
            alert("enter an amount first!")
            return
        }
        console.log(event)
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
            if (split.auto) {
                return {
                    auto: false,
                    manual: true
                }
            }
            setSplit(prev => {
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
            setTravellers(prevTraveller => {
                setName("")
                return [...prevTraveller, {
                    travellerName: name,
                    netAmount: 0,
                    id: nanoid(),
                    toggle: true
                }]  
            })
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
    }

    if(modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

    return (
        <>
            {displayTravellers}
            {travellers.length !== 0 && <button onClick={toggleModal}>Add expense</button>}
            <input name="traveller-name" className="traveller-name" placeholder ="Name" onChange={trackChanges} value={name} />
            <button onClick={addTraveller}>Add Traveller</button>
            {modal && (
                <div className="modal">
                    <div onClick={toggleModal} className="overlay"></div>
                    <div className="modal-content">
                        <input placeholder="Enter a description" />
                        <br />
                        $<input name="add-expense" onChange={trackChanges}></input>
                        <br />
                        <button name="auto" onClick={toggleSplit}>Split equally</button>
                        <button name="manual" onClick={toggleSplit}>Split manually</button>
                        <button>Confirm</button>
                        {split.auto && userElements}
                        <button className="close-modal" onClick={toggleModal}>
                        CLOSE
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}