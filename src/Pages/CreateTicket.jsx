import React from 'react'
import TicketForm from '../Component/TicketForm'
import UserPage from '../Component/UserPage'

function CreateTicket() {
  return (
    <div className='h-auto md:h-[100vh] w-screen flex flex-col-reverse md:flex-row justify-around'>
      <div className='h-[100%] w-[100%] md:w-[48%] '>
        <UserPage/>
      </div>
      <div className='h-[100%] w-[100%] md:w-[40%] flex justify-center items-center px-5 py-2 '>
        <TicketForm/>
      </div>
    </div>
  )
}

export default CreateTicket