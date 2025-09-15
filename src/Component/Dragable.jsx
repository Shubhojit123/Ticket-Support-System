import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { BsCalendar3Fill } from "react-icons/bs"
import dayjs from 'dayjs'
import { message, Tooltip, Drawer } from "antd"
import { TicketContext } from './ContextApi'
import { FaRegCircle } from "react-icons/fa"
import { IoCheckmarkCircleSharp } from 'react-icons/io5'
import { BsCircleHalf } from "react-icons/bs"
import Comments from './Comments'
import { FaCommentDots } from "react-icons/fa6"
import { GoInbox } from 'react-icons/go'

function Dragable() {
    const { addComment, isTablet } = useContext(TicketContext)
    const STORAGE = import.meta.env.VITE_STORAGE
    const [messageApi, contextHolder] = message.useMessage()
    const [open, setopen] = useState([])
    const [process, setProcess] = useState([])
    const [completed, setCompleted] = useState([])
    const { getAllTickets, datas, setData } = useContext(TicketContext)
    const [comment, setComment] = useState("")
    const [cmntOpen, setCmntOpen] = useState(false)
    const [drawerData, setDrawerData] = useState([])

    function divideData() {
        const openData = datas.filter((data) => data.status === "Open")
        const processData = datas.filter((data) => data.status === "Processing")
        const completeData = datas.filter((data) => data.status === "Completed")
        setopen(openData)
        setProcess(processData)
        setCompleted(completeData)
    }

    useEffect(() => {
        getAllTickets()
    }, [])

    useEffect(() => {
        divideData()
    }, [datas])

    function getCol(col) {
        switch (col) {
            case "Open":
                return open
            case "Processing":
                return process
            case "Completed":
                return completed
            default:
                return []
        }
    }

    const navigate = useNavigate()
    let prvStatus
    let getId
    let state

    function handelDragStart(e, id, status) {
        prvStatus = status
        getId = id
        e.target.style.opacity = "0.5"
    }

    function handelDragEnd(e) {
        e.target.style.opacity = "1"
    }

    function handelDrop(item) {
        try {
            state = item
            const updateStatus = datas.map((data) =>
                data.id === getId ? { ...data, status: state } : data
            )
            localStorage.setItem(STORAGE, JSON.stringify(updateStatus))
            setData(updateStatus)
            if (state !== prvStatus) {
                messageApi.success("Task Status changed")
            }
        } catch (error) {
            messageApi.error(error)
            console.log(error)
        }
    }

    function handelDragover(e) {
        e.preventDefault()
    }

    function getStatusIcon(data) {
        switch (data) {
            case "Open":
                return <FaRegCircle className='text-xl text-red-800' />
            case "Processing":
                return <BsCircleHalf className='text-xl text-yellow-400' />
            case "Completed":
                return <IoCheckmarkCircleSharp className='text-xl text-green-500' />
            default:
                return null
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
            default:
                return ""
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
            default:
                return ""
        }
    }

    useEffect(() => {
        if (drawerData?.id) {
            const updated = datas.find(d => d.id === drawerData.id)
            if (updated) {
                setDrawerData(updated)
            }
        }
    }, [datas])

    const container = ["Open", "Processing", "Completed"]




    return (
        <div className='h-[80vh] w-full flex flex-col items-center'>
            {datas.length < 1 && 
            <div className='flex justify-center items-center h-[50vh] flex-col gap-4 '>
                 <p className='text-7xl text-gray-600 '><GoInbox /></p>
                <p className='font-semibold text-gray-600'>No Data</p>
            </div>}
        { contextHolder }

{/* <div className="w-[96%] mt-4 bg-white flex flex-col md:flex-row rounded-lg shadow-sm hidden md:block">
                {container.map((item, idx) => (
                    <div key={idx} className={`text-center font-semibold text-lg md:text-xl w-full p-3 ${getBgByItem(item)}`}>
                        {item}
                    </div>
                ))}
            </div> */}

            <div className="flex flex-col md:flex-row w-[96%] gap-4 mt-4">
                {datas.length > 1 && container.map((item) => (
                    <div
                        key={item}
                        className={`w-full md:w-1/3 mb-1 h-[75vh] p-4 overflow-auto flex flex-col gap-3 rounded-md ${getBgByItem(item)}`}
                        onDragOver={handelDragover}
                        onDrop={() => handelDrop(item)}
                    >
                        <div className='flex items-center justify-center text-xl font-semibold '>{item}</div>

                        {getCol(item).map((data, idx) => (
                            <div
                                key={idx}
                                className="w-full min-h-[180px] border border-gray-200 shadow-md bg-white rounded-lg flex flex-col gap-3 cursor-move p-3"
                                draggable
                                onDragStart={(e) => handelDragStart(e, data.id, data.status)}
                                onDragEnd={handelDragEnd}
                                onDoubleClick={() => navigate(`/ticket/${data.id}`)}
                            >
                                <div className="flex justify-between items-center">
                                    <Tooltip title={data.name}>
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${data.name || "John"}&background=random&color=fff`}
                                            alt=""
                                            className="w-8 rounded-full"
                                        />
                                    </Tooltip>
                                    <p
                                        className={`text-xs px-2 py-1 font-medium border rounded-lg ${getPriorityColor(data.priority)}`}
                                    >
                                        {data.priority}
                                    </p>
                                    <Tooltip title={data.id}>
                                        <p className="hidden md:block text-xs font-medium text-gray-400">
                                            {data.id.substring(0, 6)}
                                        </p>
                                    </Tooltip>
                                </div>

                                <Tooltip title={data.title}>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {data.title?.length > 20 ? data.title.substring(0, 20) + "..." : data.title}
                                    </p>
                                </Tooltip>

                                <Tooltip title={<div className="max-h-[40vh] max-w-[300px] overflow-auto p-3">{data.desc}</div>}>
                                    <p className="text-xs font-semibold text-gray-600">
                                        {data.desc?.length > 30 ? data.desc.substring(0, 15) + "..." : data.desc}
                                    </p>
                                </Tooltip>

                                <div className="flex justify-between items-center">
                                    <p className="text-xs flex gap-2 font-semibold text-gray-800">
                                        {getStatusIcon(data.status)} {data.status}
                                    </p>
                                    <p
                                        className="text-xs font-semibold flex items-center gap-1 text-blue-600 cursor-pointer"
                                        onClick={() => { setDrawerData(data); setCmntOpen(true) }}
                                    >
                                        <FaCommentDots /> {`(${data.comments.length})`}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs font-semibold text-gray-500">{dayjs(data.time).format("DD MMM YYYY")}</p>
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
                width={isTablet ? 300 : 600}
                onClose={() => setCmntOpen(false)}
            >
                <Comments data={drawerData} />
            </Drawer>
        </div >
    )
}

export default Dragable
