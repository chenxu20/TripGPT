import React from 'react'
import Home from './components/Home'
import Explore from './components/Explore'
import Trips from './components/Trips'
import { SignIn } from './components/user-auth/SignIn'
import { SignUp } from './components/user-auth/SignUp'
import { Account } from './components/user-auth/Account'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import { AuthContextProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/explore" element={<Explore />}/>
          <Route path="/trips" element={<Trips />}/>
          <Route path="/signin" element={<SignIn />}/>
          <Route path="/signup" element={<SignUp />}/>
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>}/>
        </Routes>
      </AuthContextProvider>
    </div>
  )
}
