import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider } from 'convex/react'
import { convex } from './utils/convexClient'
import './index.css'
import App from './App.jsx'
import { initRealtimeEngine } from './utils/realtimeEngine'

// Start real-time cross-device and cross-tab synchronization
initRealtimeEngine()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </StrictMode>,
)
