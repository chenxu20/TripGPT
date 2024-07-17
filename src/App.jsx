import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Explore from './components/Explore'
import Trips from './components/Trips'
import { Account } from './components/Account'
import { ForgotPassword } from './components/user-auth/ForgotPassword'
import { SignIn } from './components/user-auth/SignIn'
import { SignUp } from './components/user-auth/SignUp'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'

export default function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/trips/*" element={<ProtectedRoute><Trips /></ProtectedRoute>} />
            <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </AuthContextProvider>
    </div>
  )
}