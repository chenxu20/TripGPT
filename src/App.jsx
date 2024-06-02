import React from 'react'
import Home from './components/Home'
import Explore from './components/Explore'
import Trips from './components/Trips'
import { Auth } from './components/Auth'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/explore" element={<Explore />}/>
        <Route path="/trips" element={<Trips />}/>
        <Route path="/signin" element={<Auth />}/>
      </Routes>
    </div>
  )
}
