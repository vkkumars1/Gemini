import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import ContextProvider from './context/Context.jsx'
// Import your publishable key
const PUBLISHABLE_KEY = "pk_test_YWxpdmUtZG9yeS02NS5jbGVyay5hY2NvdW50cy5kZXYk"

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  <ContextProvider>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
 
    </ClerkProvider>
  </ContextProvider>
)
