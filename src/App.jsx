import { Routes, Route } from 'react-router-dom'
import { LocationProvider } from './hooks/uselocation'
import { TripProvider } from './store/trip-context'
import { AuthProvider } from './store/auth-context'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { AIChatbot } from './components/ai/AIChatbot'
import HomePage from './pages/homepage'
import ExplorePage from './pages/ExplorePage'
import TripPlanner from './pages/TripPlanner'
import SavedPlaces from './pages/SavedPlaces'
import NearbySpots from './pages/NearbySpots'
import Profile from './pages/Profile'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <TripProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/trips" element={<TripPlanner />} />
                <Route path="/saved" element={<SavedPlaces />} />
                <Route path="/nearby" element={<NearbySpots />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </main>
            <Footer />
            <AIChatbot />
          </div>
        </TripProvider>
      </LocationProvider>
    </AuthProvider>
  )
}

export default App