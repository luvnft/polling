import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import RelayPoolProvider from './utils/use-relays-pool'
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <RelayPoolProvider>
        <App />
      </RelayPoolProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
