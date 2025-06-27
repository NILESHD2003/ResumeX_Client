import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Navbar from './components/shared/Navbar.jsx'
import HeroSection from './components/LandingPage/HeroSection.jsx'
import Features from './components/LandingPage/Features.jsx'
import Pricing from './components/LandingPage/Pricing.jsx'
import Referral from './components/LandingPage/Refferal.jsx'
import FAQ from './FAQ'
import Login from './pages/Login'
import Signup from './pages/Signup'
import HowItWorks from './components/LandingPage/HowItWorks.jsx'
import Footer from './components/LandingPage/Footer.jsx'
import Dashboard from "./pages/Dashboard.jsx";
import GenerateResume from "./pages/GenerateResume.jsx";
import Onboarding from "./pages/Onboarding.jsx";

function App() {
    return (
        <div className='min-h-screen bg-gray-950 text-gray-100'>
            <Navbar></Navbar>
            <Routes>
                <Route path='/' element={
                    <main>
                        <HeroSection></HeroSection>
                        <HowItWorks></HowItWorks>
                        <Features></Features>
                        <Pricing></Pricing>
                        <Referral></Referral>
                        <FAQ></FAQ>
                        <Footer></Footer>
                    </main>
                }></Route>
                <Route path='/login' element={<>
                    <Login/>
                    <Footer/>
                </>}></Route>
                <Route path='/signup' element={<>
                    <Signup/>
                    <Footer/>
                </>}></Route>
                <Route path='/dashboard' element={<>
                    <Dashboard></Dashboard>
                </>}></Route>
                <Route path='/generate/resume' element={<GenerateResume></GenerateResume>}></Route>
                <Route path='/generate/cover-letter' element={<div className="pt-24 p-8 text-center"><h1 className="text-2xl">Generate Cover Letter Page</h1><p className="text-gray-400">Coming soon...</p></div>}></Route>
                <Route path='/onboarding' element={<Onboarding></Onboarding>}></Route>
            </Routes>
        </div>
    )
}

export default App