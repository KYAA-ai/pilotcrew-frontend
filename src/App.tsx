import './App.css'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/Loginpage'
import Dashboard from './pages/Dashboard' 

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage mode="login" />} />
      <Route path="/signup" element={<LoginPage mode="signup" />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App
