import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Header from './components/header/Header'
import Footer from './components/Footer/Footer'
import FloatingContacts from './components/FloatingContacts/FloatingContacts'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import RentCarModal, { RentModalProvider } from './components/RentCarModal'

// Lazy load components
const Home = React.lazy(() => import('./pages/home/Home'))
const RentCar = React.lazy(() => import('./pages/rent-car/RentCar'))
const VehicleDetail = React.lazy(() => import('./pages/vehicle-detail/VehicleDetail'))
const Procedures = React.lazy(() => import('./pages/procedure/Procedures'))
const Contact = React.lazy(() => import('./pages/contact/Contact'))
const ETCPayment = React.lazy(() => import('./pages/etc-payment/ETCPayment'))
const PVIInsurance = React.lazy(() => import('./pages/pvi/PVIInsurance'))

import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner'
import './App.css'

function App() {
  return (
    <HelmetProvider>
      <Router>
        <RentModalProvider>
          <div className="app">
            <ScrollToTop />
            <Header />
            <main className="main-content">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/thue-xe" element={<RentCar />} />
                  <Route path="/thue-xe/:slug" element={<VehicleDetail />} />
                  <Route path="/thu-tuc" element={<Procedures />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/nap-phi-etc" element={<ETCPayment />} />
                  <Route path="/bao-hiem-pvi" element={<PVIInsurance />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <FloatingContacts />
            <RentCarModal />
          </div>
        </RentModalProvider>
      </Router>
    </HelmetProvider>
  )
}

export default App
