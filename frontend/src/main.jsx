import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { LocaleProvider } from './context/LocaleContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

const root = document.getElementById('root')

if (!root) {
  document.body.textContent = 'No se encontro #root'
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <LocaleProvider>
          <ThemeProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ThemeProvider>
        </LocaleProvider>
      </ErrorBoundary>
    </React.StrictMode>,
  )
}
