import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import SearchProjects from './components/features/SearchProjects'
import Messaging from './components/features/Messaging'
import SecurePayments from './components/features/SecurePayments'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-primary">
        <Navbar />
        <main className="flex-grow pt-[72px]"> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/features/search" element={<SearchProjects />} />
            <Route path="/features/messaging" element={<Messaging />} />
            <Route path="/features/payments" element={<SecurePayments />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
