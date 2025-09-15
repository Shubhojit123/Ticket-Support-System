import React from 'react'
import Dashboard from './Pages/Dashboard'
import CreateTicket from './Pages/CreateTicket'
import TicketDetails from './Pages/TicketDetails'
import {BrowserRouter, Route, Routes} from 'react-router'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateTicket />} />
        <Route path="/ticket/:id" element={<TicketDetails />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App