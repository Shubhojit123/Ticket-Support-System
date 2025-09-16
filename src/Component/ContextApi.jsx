import React, { createContext, useEffect, useState } from 'react'
import {  FaRegCircle } from "react-icons/fa";
import { BsCircleHalf } from "react-icons/bs";
import { IoCheckmarkCircleSharp } from 'react-icons/io5';

export const TicketContext = createContext();

const ContextApi = ({ children }) => {
  const [datas, setData] = useState([]);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 770);
  const STORAGE = import.meta.env.VITE_STORAGE;
  const DELSTORAGE = import.meta.env.VITE_DELETE_STORAGE;
  function getAllTickets() {
    try {
      const totalTickets = JSON.parse(localStorage.getItem(STORAGE)) || [];
      setData(totalTickets.reverse());
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const handleResize = () => setIsTablet(window.innerWidth < 770);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  },[])

function addComment(id, newComment) {
  try {
    const updatedTickets = datas.map((data) => {
      if (data.id == id) {
        const commentObj = {
          cmnt: newComment,
          time: Date.now()
        };
        const updatedComments = data.comments
          ? [...data.comments, commentObj]
          : [commentObj];

        return { ...data, comments: updatedComments };
      }
      return data;
    });
    setData(updatedTickets);
    localStorage.setItem(STORAGE, JSON.stringify(updatedTickets));
    return updatedTickets;
  } catch (error) {
    console.log(error);
  }
}


function deleteTicket(id)
{
    try {
        let tickets = JSON.parse(localStorage.getItem(STORAGE));
        if(tickets.length < 1)
        {
              alert("Ticket have ticket");
              return;
        }

        let deletes = JSON.parse(localStorage.getItem(DELSTORAGE)) || [];
        let deleted = tickets.filter (ticket => ticket.id === id);
        deletes.push(deleted);
        localStorage.setItem(DELSTORAGE,JSON.stringify(deletes));
        tickets = tickets.filter(ticket=>ticket.id !== id);
        localStorage.setItem(STORAGE,JSON.stringify(tickets));

    } catch (error) {
      console.log(error)
    }
}


  async function updateStatus(id, newStatus) {
    if (newStatus.length < 1) {
      messageApi.info("Please Select Vaild Option");
      return;
    }
    try {
      const updateTickets = datas.map((data) =>
        data.id == id ? { ...data, status: newStatus } : data
      )
      localStorage.setItem(STORAGE, JSON.stringify(updateTickets));
      setData(updateTickets);
    } catch (error) {
      console.log(error);
    }
  }

  function getPriorityColor(item) {
    switch (item) {
      case "Low":
        return "bg-green-50 border-green-200 text-green-500"
      case "Medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-700"
      case "High":
        return "bg-red-50 border-red-200 text-red-500"
    }
  }

    function getStatusIcon(data) {
          switch (data) {
              case "Open":
                  return <FaRegCircle className='text-xl text-red-800' />
              case "Processing":
                  return <BsCircleHalf className='text-xl text-yellow-400' />
              case "Completed":
                  return <IoCheckmarkCircleSharp className='text-xl text-green-500' />
          }
      }
  return (
    <TicketContext.Provider value={{ getAllTickets, datas, setData, addComment,getPriorityColor,getStatusIcon,updateStatus,isTablet,deleteTicket }}>
      {children}
    </TicketContext.Provider>
  )
}

export default ContextApi