import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router'
import { TicketContext } from '../Component/ContextApi'
import { Button, Input, message, Tag } from 'antd'
import dayjs from 'dayjs'
import { MdMessage } from "react-icons/md"
import { PiClockClockwiseBold } from "react-icons/pi"
import Comments from '../Component/Comments'
import Overview from '../Component/Overview'
import { FaArrowLeft } from 'react-icons/fa'

function TicketDetails() {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const { id } = useParams()
  const STORAGE = import.meta.env.VITE_STORAGE
  const [idData, setIdData] = useState()
  const [commentText, setCommentText] = useState("")
  const { addComment, getAllTickets, datas, setData, isTablet } = useContext(TicketContext)

  function byId(id) {
    const ticket = datas.find(d => d.id == id)
    setIdData(ticket)
  }

  async function updateStatus(id, newStatus) {
    if (!newStatus) {
      messageApi.info("Please Select Valid Option")
      return
    }
    const updatedTickets = datas.map(d => d.id == id ? { ...d, status: newStatus } : d)
    localStorage.setItem(STORAGE, JSON.stringify(updatedTickets))
    setIdData(updatedTickets.find(d => d.id == id))
  }

  function handelComment(id, comment) {
    if (!comment) {
      messageApi.info("Please add Comment")
      return
    }
    const response = addComment(id, comment)
    messageApi.success("Comment Added Successfully")
    setCommentText("")
    setData(response)
  }

  useEffect(() => { getAllTickets() }, [])
  useEffect(() => { byId(id) }, [datas, id])

  if (!idData) return <p>Loading...</p>

  return (
    <>
      {contextHolder}
      <div className="flex flex-col-reverse md:flex-row w-full h-full min-h-screen gap-4 fixed bg-gray-100  dark:bg-black">

        <div className="w-full sm:w-[50%] md:w-[40%] lg:w-[25%] h-[60vh] md:h-auto border border-gray-100 rounded-md overflow-auto hidden md:block dark:border-gray-800">
          <Comments data={idData} />
        </div>

        <div className="w-full sm:w-[50%] md:w-[60%] lg:w-[75%] flex flex-col gap-5 mb-20 md:mb-0 overflow-hidden ">

          <div className="w-full p-4 shadow-md flex flex-col gap-3 bg-white rounded-md dark:bg-gray-800 dark:text-white">
            <button
              onClick={() => navigate(-1)}
              className='p-1 text-blue-600 cursor-pointer flex flex-row items-center gap-2  rounded-lg text-sm font-semibold hover:text-blue-800 duration-300 block dark:text-blue-300  '
            >
              <FaArrowLeft />
              <span>Back</span>
            </button>
            <p className={`${isTablet ? "text-[14px]" : "text-xl"} font-semibold line-clamp-3 flex items-center gap-2`}>
              <MdMessage /> {idData.title}
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              <Tag className="cursor-pointer" onClick={async () => { await navigator.clipboard.writeText(idData.id); messageApi.success("ID Copied") }}>
                #{idData.id}
              </Tag>
              <p className="flex items-center text-xs gap-2"><PiClockClockwiseBold /> {dayjs(idData.time).format("DD MMM YYYY")}</p>
            </div>
          </div>

          <div className="w-full h-[60vh] md:h-[80vh] bg-white rounded-md p-4 shadow-md overflow-auto dark:bg-black">
            <Overview data={idData} />
          </div>

        </div>
      </div>
    </>
  )
}

export default TicketDetails
