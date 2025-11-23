import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ContextProvider from './context/Context.jsx'
import AuthProvider from './context/AuthContext.jsx'
import ThemeProvider from './context/ThemeContext.jsx'
import { SidebarProvider } from './context/SidebarContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ThemeProvider>
      <SidebarProvider>
        <ContextProvider>
          <App />
        </ContextProvider>
      </SidebarProvider>
    </ThemeProvider>
  </AuthProvider>,
)
