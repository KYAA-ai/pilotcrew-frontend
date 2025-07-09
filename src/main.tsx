import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ProfileProvider } from './contexts/ProfileContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ProfileProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ProfileProvider>
)
