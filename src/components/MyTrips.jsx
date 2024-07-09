import React from "react"
import "./MyTrips.css"
import OutboundDetails from "./OutboundDetails"
import InboundDetails from "./InboundDetails"
import TripDetails from "./TripDetails"
import { addDoc, getDocs, onSnapshot } from "firebase/firestore"
import { tripCollection } from "../config/firebase"
import DisplayTrip from "./DisplayTrip"

export default function MyTrips() {
    const [modal, setModal] = React.useState(false)
    const [outbound, setOutbound] = React.useState({
        date: "",
        flightNumber: "",
        start: "",
        end: ""
    })
    const [inbound, setInbound] = React.useState({
        date: "",
        flightNumber: "",
        start: "",
        end: ""
    })
    const [tripDetails, setTripDetails] = React.useState({
        accommodations: ""
    })
    const [details, setDetails] = React.useState({
        outboundDetails: {},
        inboundDetails: {},
        tripDetails: {}
    })
    const [data, setData] = React.useState([])

    const displayData = !data.length
        ? data
        : data.map(indiv => {
            return (
                <DisplayTrip 
                    key={indiv.id}
                    data={indiv}
                />
            )
        })

    // console.log(displayData)

    const toggleModal = () => {
      setModal(!modal);
    }

    React.useEffect(() => {
        setDetails(prev => {
            return {
                ...prev,
                outboundDetails: outbound
            }
        })
    }, [outbound])

    React.useEffect(() => {
        setDetails(prev => {
            return {
                ...prev,
                inboundDetails: inbound
            }
        })
    }, [inbound])

    React.useEffect(() => {
        setDetails(prev => {
            return {
                ...prev,
                tripDetails: tripDetails
            }
        })
    }, [tripDetails])

    React.useEffect(() => {
        async function getData() {
            try {
                const snapshot = await getDocs(tripCollection)
                const fetchedData = snapshot.docs.map(doc => {
                    return {
                        outboundDetails: doc.data().outboundDetails,
                        inboundDetails: doc.data().inboundDetails,
                        tripDetails: doc.data().tripDetails,
                        id: doc.id
                    }
                })
                setData(fetchedData)
            } catch (error) {
                console.error(`Error fetching documents: ${error}`)
            }
        }
        getData()
    }, [])

    React.useEffect(() => {
        const unsubscribe = onSnapshot(tripCollection, (snapshot) => {
            const fetchedData = snapshot.docs.map(doc => {
                return {
                    outboundDetails: doc.data().outboundDetails,
                    inboundDetails: doc.data().inboundDetails,
                    tripDetails: doc.data().tripDetails,
                    id: doc.id
                }
            })
        setData(fetchedData)
        })
        return () => unsubscribe()
    }, [])

    function handleOutboundChange(event) {
        const { name, value } = event.target
        setOutbound(prev => {
            return {
                ...prev,
                [name] : value
            }
        })
    }

    function handleInboundChange(event) {
        const { name, value } = event.target
        setInbound(prev => {
            return {
                ...prev,
                [name] : value
            }
        })
    }

    function handleTripDetailsChange(event) {
        const { name, value } = event.target
        setTripDetails(prev => {
            return {
                ...prev,
                [name] : value
            }
        })
    }

    function addToDatabase() {
        addDoc(tripCollection, {
            outboundDetails: details.outboundDetails,
            inboundDetails: details.inboundDetails,
            tripDetails: details.tripDetails
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
                <h2 className="trip-title">My Trips</h2>
                {data.length > 0 && 
                <div className="trip-display">
                    <span>Outbound Details</span>
                    <span>Inbound Details</span>
                    <span>Trip Details</span>
                </div>}
                {data.length > 0 && <hr />}
                {displayData}
                <button className="add-trip-btn" onClick={toggleModal}>Add Trip</button>
            </div>
    
            {modal && (
            <div className="modal">
                <div onClick={toggleModal} className="overlay"></div>
                <div className="modal-content">
                    <h2>Enter Trip Details</h2>
                    <button className="close-modal" onClick={toggleModal}>
                        CLOSE
                    </button>
                    <OutboundDetails 
                        handleChange={handleOutboundChange}
                    />
                    <TripDetails 
                        handleChange={handleTripDetailsChange}
                    />
                    <InboundDetails 
                        handleChange={handleInboundChange}
                    />
                    <button onClick={addToDatabase}>Confirm</button>
                </div>
            </div>
            )}
        </>
    )
}