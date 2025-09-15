import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { BsCalendar3Fill } from "react-icons/bs";
import dayjs from 'dayjs';
import { message, Tooltip, Input, Button, Drawer } from "antd";
import { TicketContext } from './ContextApi';
import { FaRegCircle } from "react-icons/fa";
import { IoCheckmarkCircleSharp } from 'react-icons/io5';
import { BsCircleHalf } from "react-icons/bs";
import Comments from './Comments';
import { FaRegComment } from "react-icons/fa";
import { FaCommentDots } from "react-icons/fa6";

function Dragable() {

    const { addComment,isTablet } = useContext(TicketContext);

    const STORAGE = import.meta.env.VITE_STORAGE;
    const [messageApi, contextHolder] = message.useMessage();
    const [open, setopen] = useState([]);
    const [process, setProcess] = useState([]);
    const [completed, setCompleted] = useState([]);
    const { getAllTickets, datas, setData } = useContext(TicketContext);
    const [comment, setComment] = useState("");
    const [cmntOpen, setCmntOpen] = useState(false);
    const [drawerData,setDrawerData] = useState([]);

    function divideData() {
        const openData = datas.filter((data) => {
            return data.status == "Open"
        });

        const processData = datas.filter((data) => {
            return data.status == "Processing"
        });

        const completeData = datas.filter((data) => {
            return data.status == "Completed"
        });

        setopen(openData);
        setCompleted(completeData);
        setProcess(processData);
    }

    function handelComment() {

    }
    useEffect(() => {
        getAllTickets();
    }, []);

    useEffect(() => {
        divideData();
    }, [datas]);

    function getCol(col) {
        switch (col) {
            case "Open":
                return open
            case "Processing":
                return process
            case "Completed":
                return completed
        }
    }

    const navigate = useNavigate();
    let prvStatus
    let getId;
    let state;
    function handelDragStart(e, id, status) {
        prvStatus = status;
        getId = id
        console.log(id)
        e.target.style.opacity = "0.5"
    }
    function handelDragEnd(e) {
        e.target.style.opacity = "1"
    }

    function handelDrop(item) {
        try {
            state = item;
            const updateStatus = datas.map((data) =>
                data.id == getId ? { ...data, status: state } : data
            )
            console.log(updateStatus)
            localStorage.setItem(STORAGE, JSON.stringify(updateStatus));
            setData(updateStatus);
            if (state !== prvStatus) {
                messageApi.success("Task Status change ")
            }
        } catch (error) {
            messageApi.success(error)
            console.log(error);
        }
    }

    function handelDragover(e) {
        e.preventDefault();
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

    function getBgByItem(item) {
        switch (item) {
            case "Open":
                return "bg-blue-50 border border-blue-200"
            case "Processing":
                return "bg-yellow-50 border border-yellow-200"
            case "Completed":
                return "bg-green-50 border border-green-200"
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

       useEffect(() => {
            if (drawerData?.id) {
                const updated = datas.find(d => d.id === drawerData.id);
                if (updated) {
                    setDrawerData(updated);
                }
            }
        }, [datas]);
    



    const container = ["Open", "Processing", "Completed"];

 

    return (
        <div className='h-[80vh] w-[100%]'>
            {contextHolder}
            <div className="w-[96%]  mt-4  bg-white flex flex-col md:flex-row items-center  rounded-lg shadow-sm justify-between">
                {container.map((item, idx) => (
                    <div key={idx} className={`justify-center items-center font-semibold  text-xl w-[100%] h-[100%] p-3 flex text-gray-700 ${getBgByItem(item)}`}>{item}</div>
                ))}
            </div>

            <div className='flex justify-between md:flex-row flex-col items-center space-y-4 w-[96%]   '>
                {container.map((item) => (
                    <div key={item} className={`w-[100%] md:w-[45%] mb-1 h-[75vh] flex items-center  p-6 overflow-auto flex-col gap-3 ${getBgByItem(item)}`}
                        onDragOver={(e) => handelDragover(e)}
                        onDrop={() => handelDrop(item)}
                    >

                        {getCol(item).map((data, idx) => (
                            <div key={idx} className='w-full min-h-[180px] border border-gray-200 shadow-md bg-white rounded-lg flex flex-col gap-3 cursor-move p-3'
                                draggable
                                onDragStart={(e) => handelDragStart(e, data.id, data.status)}
                                onDragEnd={(e) => handelDragEnd(e)}
                                onDoubleClick={() => navigate(`/ticket/${data.id}`)}
                            >
                                <div className='w-[100%] flex flex-row justify-around items-center'>
                                    <Tooltip title={data.name} className='md:hidden lg:block'><img src={`https://ui-avatars.com/api/?name=${data.name ? data.name : "John"}&background=random&color=fff`} alt="" className='w-8 rounded-full' /></Tooltip>

                                    <p className={`text-xs px-2 py-1 font-medium border rounded-lg ${getPriorityColor(data.priority)}`}>{data.priority}</p>
                                    <Tooltip title={data.id}><p className='text-xs font-medium lg:block md:hidden text-gray-400'>{data.id.substring(0, 6)}</p></Tooltip>
                                    <Tooltip title={data.title}><p className='text-sm font-semibold text-gray-800 md:block lg:hidden'>{data.title?.length > 15 ? data.title.substring(0, 8) + "..." : data.title}</p></Tooltip>
                                </div>

                                <div className=' w-[80%] flex flex-col gap-2 cursor-pointer'>
                                    <Tooltip title={data.title}><p className='text-sm font-semibold text-gray-800 lg:block md:hidden'>{data.title?.length > 15 ? data.title.substring(0, 20) + "..." : data.title}</p></Tooltip>
                                    <Tooltip title={<div className='max-h-[40vh] max-w-[300px] overflow-auto p-3'>{data.desc}</div>}> <p className='text-xs font-semibold text-gray-600'>{data.desc?.length > 20 ? data.desc.substring(0, 10) + "..." : data.desc}</p></Tooltip>
                                    <div className='flex w-[100%] justify-between items-center'>
                                        <p className='text-xs py-1 flex rounded-md items-left gap-2 font-semibold text-gray-800'>
                                            {getStatusIcon(data.status)}{data.status}
                                        </p>

                                        {/* <p className="md:text-xs sm:text-sm font-semibold flex flex-row gap-1  justify-center text-blue-600 cursor-pointer" onClick={() => {setDrawerData(data);setCmntOpen(true);}}  >
                                            <FaRegComment/>{`(${data.comments.length})`}
                                        </p> */}

                                    </div>
                                </div>

                                <div className=' border border-gray-200 w-[90%]' />

                                <div className='w-[80%] flex flex-row justify-between items-center gap-1'>
                                    <p className="md:text-xs sm:text-sm font-semibold flex flex-row gap-1  justify-center text-blue-600 cursor-pointer" onClick={() => {setDrawerData(data);setCmntOpen(true);}}  >
                                            <FaCommentDots/>{`(${data.comments.length})`}
                                        </p>
                                    <p className='text-xs font-semibold text-gray-800'>{dayjs(data.time).format("DD MMM YYYY")}</p>
                                </div>

                            </div>
                        ))}

                    </div>
                ))}

            </div>

            <Drawer
            key={drawerData.id}
                closable
                destroyOnHidden
                title={<p>Comments</p>}
                placement="right"
                open={cmntOpen}
                width={isTablet ? 300:600}
                onClose={() => setCmntOpen(false)}
            >
                <Comments data={drawerData}/>

            </Drawer>

        </div>
    )
}

export default Dragable;