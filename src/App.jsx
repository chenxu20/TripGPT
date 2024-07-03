import React from 'react'
import Home from './components/Home'
import Explore from './components/Explore'
import Trips from './components/Trips'
import { ForgotPassword } from './components/user-auth/ForgotPassword'
import { SignIn } from './components/user-auth/SignIn'
import { SignUp } from './components/user-auth/SignUp'
import { Account } from './components/Account'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import { AuthContextProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'

export default function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/explore" element={<Explore />}/>
          <Route path="/trips" element={<ProtectedRoute><Trips /></ProtectedRoute>}/>
          <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>}/>
          <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>}/>
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>}/>
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>}/>
        </Routes>
      </AuthContextProvider>
    </div>
  )
}