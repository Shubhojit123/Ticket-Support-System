import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router';
import { TicketContext } from '../Component/ContextApi';
import { Button, Input, message, Tag, Tooltip } from 'antd';
import { FaRegCircle } from "react-icons/fa";
import { BsCircleHalf } from "react-icons/bs";
import { IoCheckmarkCircleSharp } from 'react-icons/io5';
import dayjs from 'dayjs';
import { BsCalendar3Fill } from "react-icons/bs";
import { FaUser } from "react-icons/fa6";
import { Drawer, Tabs } from "antd";
import { MdMessage } from "react-icons/md";
import { PiClockClockwiseBold } from "react-icons/pi";
import Overview from '../Component/Overview';
import { CiEdit } from "react-icons/ci";
import Comments from '../Component/Comments';


const { TabPane } = Tabs;

function TicketDetails() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false)
  const { id } = useParams();
  const STORAGE = import.meta.env.VITE_STORAGE;
  const [idData, setIdData] = useState();
  const [commentTest, setCommentText] = useState("");
  const [option, setOption] = useState();
  const { addComment } = useContext(TicketContext);
  const { getAllTickets, datas,setData,isTablet } = useContext(TicketContext);

  function byId(id) {
    console.log(id)
    try {
      const idDatas = datas.find((data) =>
        data.id == id
      );
      console.log(idDatas)
      setIdData(idDatas);
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
      console.log(updateTickets)
      await localStorage.setItem(STORAGE, JSON.stringify(updateTickets));

      const updatedTicket = updateTickets.find((data) => data.id == id);
      setIdData(updatedTicket);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getAllTickets();
  }, []);




  useEffect(() => {
    byId(id);
  }, [datas, id])




  function handelComment(id, comment) {
    try {
      if (comment.length < 1) {
        messageApi.info("Please add Comment");
        return;
      }
      const response = addComment(id, comment);
      console.log("res", response)
      messageApi.success("Comment Added Successfully");
      setCommentText("");
      setData(response)
    } catch (error) {
      messageApi.error(error);
      console.log(error);
    }

  }

  if (!idData) return <p>Loading...</p>;


  return (
    <>
      {contextHolder}
      <div className='w-[100%] h-[100vh] flex flex-row'>
       
        <div className={`${isTablet ? "w-[40%]":"w-[25%]"} h-[100vh] border-r border-gray-100 p-2`}>
          <Comments data={idData}/>
        </div>
        <div className='w-[80%] h-[100vh] bg-gray-100 p-4 flex flex-col gap-5'>
          <div className='w-[100%] p-4 shadow-md flex flex-col gap-3 rounded-md'>
            
            <div>
              <p className={`${isTablet ? "text-[14px]" : "text-xl"} font-semibold line-clamp-3 flex flex-row gap-4 items-center`}><MdMessage />{idData.title}</p>
            </div>
            <div className='flex flex-row gap-5'>
              <Tag className="cursor-pointer" onClick={async () => { await navigator.clipboard.writeText(idData.id); messageApi.success("ID Copied") }}>#{idData.id}</Tag>
              <p className='flex flex-row items-center text-xs  gap-2'><PiClockClockwiseBold />{dayjs(idData.time).format("DD MMM YYYY")}</p>
            </div>
          </div>
          <div className="w-[100%] bg-white h-[80vh] rounded-md p-6 shadow-md">
              <Overview data={idData}/>
          </div>
        </div>
      </div>
    </>
  )
}

export default TicketDetails