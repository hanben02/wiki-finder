import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './front-end/index.css'
import App from './front-end/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
