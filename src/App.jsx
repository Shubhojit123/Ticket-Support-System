import React from 'react'
import Dashboard from './Pages/Dashboard'
import CreateTicket from './Pages/CreateTicket'
import TicketDetails from './Pages/TicketDetails'
import {BrowserRouter, Route, Routes} from 'react-router'
import Deleted from './Pages/Deleted'
import DeletedTicketDetails from './Pages/DeletedTicketDetails'
import ErrorPage from './Component/ErrorPage'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateTicket />} />
        <Route path="/ticket/:id" element={<TicketDetails />} />
        <Route path='/deleted' element={<Deleted/>}/>
         <Route path='/deleted-ticket/:id' element={<DeletedTicketDetails/>}/>
         <Route path='*' element={<ErrorPage/>}/>
      </Routes>
    </BrowserRouter>

  )
}

export default App