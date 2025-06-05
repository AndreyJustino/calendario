import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import 'rsuite/dist/rsuite.min.css';
import { CustomProvider } from 'rsuite';
import { ptBR } from 'rsuite/esm/locales/index.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CustomProvider locale={ptBR}>
      <App />
    </CustomProvider>
  </StrictMode>,
)
