import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import RentCar from './pages/RentCar'
import Procedures from './pages/Procedures'
import Contact from './pages/Contact'
import ETCPayment from './pages/ETCPayment'
import PVIInsurance from './pages/PVIInsurance'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/thue-xe" element={<RentCar />} />
            <Route path="/thu-tuc" element={<Procedures />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/nap-phi-etc" element={<ETCPayment />} />
            <Route path="/bao-hiem-pvi" element={<PVIInsurance />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
