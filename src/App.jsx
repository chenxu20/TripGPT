import React from 'react'
import Home from './components/Home'
import Explore from './components/Explore'
import Trips from './components/Trips'
import { SignIn } from './components/user-account/SignIn'
import { SignUp } from './components/user-account/SignUp'
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
        <Route path="/signin" element={<SignIn />}/>
        <Route path="/signup" element={<SignUp />}/>
      </Routes>
    </div>
  )
}
