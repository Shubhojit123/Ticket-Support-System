import React from 'react'
import TicketForm from '../Component/TicketForm'

function CreateTicket() {
  return (
    <div className='h-[100vh] w-screen flex flex-col-reverse md:flex-row justify-between'>
      <div className='h-[100%] w-[48%] '>
      </div>
      <div className='h-[100%] w-[100%] md:w-[40%] flex justify-center items-center px-5 py-2'>
        <TicketForm/>
      </div>
    </div>
  )
}

export default CreateTicket