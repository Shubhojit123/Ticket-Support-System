import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer, toast } from 'react-toastify';
import ContextApi, { TicketContext } from './Component/ContextApi.jsx';
import { HappyProvider } from '@ant-design/happy-work-theme';
import { Provider } from 'react-redux';
import { store } from './Redux/Store.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <HappyProvider>
    <ContextApi>
      <App />
      <ToastContainer />
    </ContextApi>
  </HappyProvider>
  </Provider>

)
