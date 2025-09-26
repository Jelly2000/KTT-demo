import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/header/Header'
import Footer from './components/Footer/Footer'
import FloatingContacts from './components/FloatingContacts/FloatingContacts'
import Home from './pages/home/Home'
import RentCar from './pages/rent-car/RentCar'
import Procedures from './pages/procedure/Procedures'
import Contact from './pages/contact/Contact'
import ETCPayment from './pages/etc-payment/ETCPayment'
import PVIInsurance from './pages/pvi/PVIInsurance'
import VehicleDetail from './pages/vehicle-detail/VehicleDetail'
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
            <Route path="/thue-xe/:id" element={<VehicleDetail />} />
            <Route path="/thu-tuc" element={<Procedures />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/nap-phi-etc" element={<ETCPayment />} />
            <Route path="/bao-hiem-pvi" element={<PVIInsurance />} />
          </Routes>
        </main>
        <Footer />
        <FloatingContacts />
      </div>
    </Router>
  )
}

export default App
