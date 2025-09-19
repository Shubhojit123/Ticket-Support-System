import React, { useContext, useEffect, useState } from 'react'
import { TicketContext } from './ContextApi'
import { Input, message, Tag } from 'antd';
import { Search } from 'lucide-react';
import { RxCross2 } from 'react-icons/rx';
import { FaRegCopy } from 'react-icons/fa';
import { ImportOutlined, InfoOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { MdOutlineSubtitles } from 'react-icons/md';
import { LuInbox } from 'react-icons/lu';
import { useRef } from 'react';
import { IoIosInformationCircle } from 'react-icons/io';

function UserPage() {
    const [messageApi, contextHolder] = message.useMessage()
    const [data, setData] = useState(null);
    const detailsRef = useRef(null);
    const [search, setSearch] = useState("")
    function handelSearch() {
        console.log("call")
        try {
            const res = JSON.parse(localStorage.getItem(import.meta.env.VITE_STORAGE));
            const idData = res.filter((r) => r.id == search);
            console.log(idData)
            setData(idData[0] || null);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (search !== "") handelSearch();
        else setData(null);
    }, [search]);

    useEffect(() => {
        detailsRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [data])
    const { ticketId, getPriorityColor, getStatusIcon, setTicketId } = useContext(TicketContext);
    return (
        <div className='w-full flex items-center flex-col justify-around gap-5  '>
            {contextHolder}
            { ticketId && (
                <div className='p-5 shadow-md mt-4 w-full flex flex-row  items-center justify-between px-4 rounded-md '>
                    <div className='flex flex-col justify-between gap-5'>
                        <Tag>{ticketId}</Tag>
                        <p className='text-xs text-gray-500 flex flex-row gap-2 items-center'><IoIosInformationCircle/>Please save this ticket for your information </p>
                    </div>    
                    <div className='flex flex-col justify-center gap-2 text-sm'>
                        <p className='cursor-pointer text-gray-700 p-1.5  hover:text-white hover:bg-gray-400 duration-300 rounded-md' onClick={() => setTicketId("")}><RxCross2 /></p>
                        <p className='cursor-pointer text-blue-600 p-1.5 hover:bg-blue-200 duration-300 rounded-md'
                            onClick={async () => { await navigator.clipboard.writeText(ticketId); messageApi.success("ID Copied") }}
                        >
                            <FaRegCopy /></p>
                    </div>
                </div>)}
            <div className={`p-5 shadow-md w-full mt-4 flex flex-col gap-5 rounded-md ${ticketId === "" || data ? "mt-0 md:mt-20" : "mt-0"}`}>
                <p className='text-sm text-blue-600 font-semibold'>Search Ticket By ID</p>
                <Input type='search' prefix={<SearchOutlined />} value={search} onChange={(e) => { setSearch(e.target.value); handelSearch() }} placeholder='Enter Id'
                    onPressEnter={handelSearch} allowClear />
            </div>

            {data && search !== "" && (<div className='p-5 shadow-md w-full mt-4 flex flex-col gap-4' ref={detailsRef}>
                <div className='flex justify-between'>
                    <Tag>{data?.id}</Tag>
                    <p className={`${getPriorityColor(data.priority || "High")} text-sm p-1.5 rounded-md `}>{data.priority || "High"}</p>
                </div>
                <div className='flex flex-row justify-between'>
                    <div className='flex flex-row gap-1.5'>
                        <p><UserOutlined /></p>
                        <p>{data?.name || "Test"}</p>
                    </div>
                    <div className='flex flex-row gap-1.5 items-center'>
                        <p>{getStatusIcon(data?.status)}</p>
                        <p>{data?.status}</p>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='text-sm font-semibold text-gray-900'>{data?.title || "Lorem ipsum dolor sit amet consectetur adipisicing"}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='text-xs font-semibold text-gray-600'>{data?.desc}</p>
                </div>
            </div>)}
            {
                !data && search !== "" && (
                    <div className='text-xl flex flex-col items-center justify-center text-gray-700'>
                        <p className='text-6xl text-gray-500'><LuInbox /> </p>
                        <p>Not found</p>
                    </div>
                )
            }
        </div>
    )
}


export default UserPage