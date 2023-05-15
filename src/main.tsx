import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import RelayPoolProvider from './utils/use-relays-pool'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RelayPoolProvider>
      <App />
    </RelayPoolProvider>
  </React.StrictMode>,
)
