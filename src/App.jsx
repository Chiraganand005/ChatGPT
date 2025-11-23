import React, { useState, useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import SideBar from './components/SideBar/SideBar'
import Main from './components/Main/Main'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'

const App = () => {
  const { isAuthenticated, loading } = useContext(AuthContext)
  const [showRegister, setShowRegister] = useState(false)

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: 'var(--bg-primary, #f0f4f9)'
      }}>
        <div style={{ fontSize: '18px', color: 'var(--text-primary, #333)' }}>
          Loading...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    )
  }

  return (
    <>
      <SideBar/>
      <Main/>
    </>
  )
}

export default App
