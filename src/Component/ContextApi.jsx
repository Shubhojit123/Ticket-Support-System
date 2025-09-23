import React, { createContext, useEffect, useState } from 'react'
import { FaRegCircle } from "react-icons/fa";
import { BsCircleHalf } from "react-icons/bs";
import { IoCheckmarkCircleSharp } from 'react-icons/io5';
import { Navigate } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

export const TicketContext = createContext();

const ContextApi = ({ children }) => {
  const [datas, setData] = useState([]);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 770);
  const STORAGE = import.meta.env.VITE_STORAGE;
  const DELSTORAGE = import.meta.env.VITE_DELETE_STORAGE;
  const NOTIFICATION = import.meta.env.VITE_CREATE_NOTIFICATION;
  const [notifyData, setNotifyData] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [ticketId,setTicketId] = useState("");
  

  function getAllTickets() {
    try {
      const totalTickets = JSON.parse(localStorage.getItem(STORAGE)) || [];
      setData(totalTickets.reverse());
    } catch (error) {
      console.log(error);
    }
  }

  function setTicket(id)
  {
      try {
        setTicketId(id);
      } catch (error) {
        console.log(error)
      }
  }



  useEffect(() => {
    const interval = setInterval(() => {
      const res = JSON.parse(localStorage.getItem(import.meta.env.VITE_CREATE_NOTIFICATION)) || [];
      setNotifyData(res);
      const count = res.filter(r => r.read === false)
      setNotificationCount(count.length)
    }, 1000);
    return () => clearInterval(interval)
  }, [])

  function addNotification(msg, desc) {
    try {
      const notificationMsg = {
        id: uuidv4(),
        msg: msg,
        time: Date.now(),
        desc: desc,
        read: false
      }
      const notification = JSON.parse(localStorage.getItem(NOTIFICATION)) || [];
      notification.push(notificationMsg);
      localStorage.setItem(NOTIFICATION, JSON.stringify(notification));
      setNotifyData(notification);
      const count = notification.filter(r => r.read === false)
      setNotificationCount(count.length);
    } catch (error) {
      console.log(error)
    }
  }

  function deleteNotification(id) {
    try {
      const res = notifyData.filter(n => n.id != id);
      setNotifyData(res);
      const count = res.filter(r => r.read === false)
      setNotificationCount(count.length)
      localStorage.setItem(NOTIFICATION, JSON.stringify(res));
    } catch (error) {
      console.log(error)
    }
  }

  function viewNotification(id) {
    try {
      const res = notifyData.map((n) => n.id === id ? { ...n, read: true } : n);
      setNotifyData(res)
      let count = res.filter(r => r.read === false)
      setNotificationCount(count.length)
      localStorage.setItem(NOTIFICATION, JSON.stringify(res));
    } catch (error) {
      console.log(error)
    }
  }

  function viewAllNotification() {
    try {
      console.log("wjewakj")
      const res = notifyData.map((n) => ({ ...n, read: true }));
      setNotifyData(res)
      let count = res.filter(r => r.read === false)
      setNotificationCount(count.length)
      localStorage.setItem(NOTIFICATION, JSON.stringify(res))
    } catch (error) {
      console.log(error)
    }
  }

  function deleteAllNotification() {
    try {
      localStorage.removeItem(NOTIFICATION);
      setNotifyData([]);
      setNotificationCount(0);
    } catch (error) {

    }
  }

  useEffect(() => {
    const handleResize = () => setIsTablet(window.innerWidth < 770);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [])

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


  function deleteTicket(id, del) {
    try {
      let tickets = JSON.parse(localStorage.getItem(STORAGE)) || [];
      let deletes = JSON.parse(localStorage.getItem(DELSTORAGE)) || [];

      if (del) {
        deletes = deletes.filter(d => d.id !== id);
        localStorage.setItem(DELSTORAGE, JSON.stringify(deletes));
        const notificationMsg = {
          id: uuidv4(),
          msg: `Tikcet Parmanent Deleted  `,
          time: Date.now(),
          desc: id,
          read: false
        }
        const notification = JSON.parse(localStorage.getItem(NOTIFICATION)) || [];
        notification.push(notificationMsg);
        localStorage.setItem(NOTIFICATION, JSON.stringify(notification));
        return;
      }

      if (tickets.length < 1) {
        alert("No tickets available");
        return;
      }

      const deletedTicket = tickets.find(ticket => ticket.id === id);
      if (deletedTicket) {
        deletes.push(deletedTicket);
        localStorage.setItem(DELSTORAGE, JSON.stringify(deletes));

        tickets = tickets.filter(ticket => ticket.id !== id);
        localStorage.setItem(STORAGE, JSON.stringify(tickets));
        const notificationMsg = {
          id: uuidv4(),
          msg: `Tikcet Deleted  `,
          time: Date.now(),
          desc: id,
          read: false
        }
        const notification = JSON.parse(localStorage.getItem(NOTIFICATION)) || [];
        notification.push(notificationMsg);
        localStorage.setItem(NOTIFICATION, JSON.stringify(notification));
      }
    } catch (error) {
      console.log(error);
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
        return <FaRegCircle className='text-xl text-red-500' />
      case "Processing":
        return <BsCircleHalf className='text-xl text-yellow-400' />
      case "Completed":
        return <IoCheckmarkCircleSharp className='text-xl text-green-500' />
    }
  }

  const reStoreData = (id) => {
    try {
      console.log(id)
      let tickets = JSON.parse(localStorage.getItem(STORAGE)) || [];
      let deletes = JSON.parse(localStorage.getItem(DELSTORAGE)) || [];

      const idData = deletes.find(del => del.id === id);
      if (!idData) return;

      const delRes = deletes.filter(d => d.id !== id);
      localStorage.setItem(DELSTORAGE, JSON.stringify(delRes));

      const updatedTickets = [...tickets, idData];
      localStorage.setItem(STORAGE, JSON.stringify(updatedTickets));

    } catch (error) {
      console.error("Error while restoring ticket:", error);
    }
  };

  return (
    <TicketContext.Provider value={{
      getAllTickets, datas, setData, addComment, getPriorityColor, notifyData, notificationCount, viewAllNotification,
      getStatusIcon, updateStatus, isTablet, deleteTicket, reStoreData, addNotification,
      deleteNotification, viewNotification, deleteAllNotification,ticketId,setTicketId,setTicket
    }}>
      {children}
    </TicketContext.Provider>
  )
};



export default ContextApi