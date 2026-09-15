import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initRealtimeEngine } from './utils/realtimeEngine'

// Start real-time cross-device and cross-tab synchronization
initRealtimeEngine()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

