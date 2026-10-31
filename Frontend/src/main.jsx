import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { RouterProvider } from 'react-router-dom'
import { store } from '@/app/store'
import { router } from '@/app/router'
import '@/styles/globals.css'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
const app = <RouterProvider router={router} />

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider>
      ) : app}
    </Provider>
  </React.StrictMode>,
)
