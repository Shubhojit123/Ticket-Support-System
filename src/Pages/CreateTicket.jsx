import React from 'react'
import TicketForm from '../Component/TicketForm'

function CreateTicket() {
  return (
    <div className='h-[100vh] w-screen flex flex-row justify-between'>
      <div className='h-[100%] w-[48%] border border-gray-300'>
      </div>
      <div className='h-[100%] w-[50%] flex justify-center items-center'>
        <TicketForm/>
      </div>
    </div>
  )
}

export default CreateTicket