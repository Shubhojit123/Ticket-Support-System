import dayjs from 'dayjs'
import React, { useContext, useEffect, useRef, useState } from 'react'
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { MessageCircle, Clock8, User } from 'lucide-react'
import { FaRegClock } from "react-icons/fa";
import { Button, Input, message, Tag, Tooltip } from 'antd';
import { VscSend } from "react-icons/vsc";
import { HappyProvider } from '@ant-design/happy-work-theme';
import { TicketContext } from './ContextApi';
import { useNavigate } from 'react-router';
import { AiOutlineInbox } from "react-icons/ai";


function Comments({ data, del }) {
    const [messageApi, contextHolder] = message.useMessage();

    console.log(data.comments.length)
    const messagesEndRef = useRef(null);
    const [commentText, setComment] = useState("");
    const { addComment, isTablet } = useContext(TicketContext);
    function handelComment(id) {
        if (commentText.length < 1) {
            messageApi.info("Please enter the Comment");
            return;
        }
        addComment(id, commentText);
        setComment("");
    }

    const navigate = useNavigate();


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [data.comments])
    console.log(del)
    return (

        <div className='w-[100%] h-[100%] p-2 flex flex-col gap-2 dark:bg-black overflow-hidden'>
            {contextHolder}
            <div className='bg-white border-b border-slate-200 p-4 flex items-center gap-3 shadow-sm rounded-md dark:bg-black'>
                <div className='p-2 bg-blue-100 rounded-lg'>
                    <MessageCircle className='w-5 h-5 text-blue-600' />
                </div>
                <div className='flex-1'>
                    <h2 className={`${isTablet ? "text-xs" : "text-lg"} font-semibold text-slate-800 dark:text-white`}>Comments</h2>
                    <p className={` ${isTablet ? "text-xs" : "text-sm"}   text-slate-500 dark:text-white dark:shadow-md`}>{data.comments.length} {data.comments.length === 1 ? 'comment' : 'comments'}</p>
                </div>
            </div>
            <div className='w-[100%] h-[80%]  flex flex-col overflow-y-auto p-2  gap-3 rounded-md dark:bg-black'>
                {data.comments.length > 0 ? data.comments.map((comment, idx) => (
                    <div key={idx} className='p-2 border-gray-400 shadow-md rounded-md bg-white gap-2 flex flex-col dark:bg-gray-800 dark:shadow-md dark:text-white dark:border-gray-400' ref={messagesEndRef}>
                        <p className='w-[100%] text-[12px] font-medium ' >{comment.cmnt}</p>
                        <p className='w-[100%] text-[10px] flex flex-row gap-1 justify-end items-center'><p ><FaRegClock /></p>{dayjs(comment.time).isAfter(dayjs().subtract(1, "day"))
                            ? dayjs(comment.time).fromNow()
                            : dayjs(comment.time).format("DD MMM YY")}</p>
                    </div>)) :
                    <div className='w-[100%] h-[100%]  flex items-center justify-center text-gray-800 flex-col gap-3'>
                        <AiOutlineInbox className='text-9xl  text-gray-700 opacity-75 dark:text-gray-200' />
                        <p className='dark:text-gray-100'>No Comment Available</p>
                    </div>}
            </div>
            <div className='w-[100%] h-[10%]  mt-2  border-gray-200 shadow-md rounded-md p-2 flex flex-row gap-2 items-center dark:border-gray-500 '>
                <Input placeholder='Enter Comment' style={{ width: "80%" }} value={commentText} onChange={(e) => setComment(e.target.value)} onPressEnter={() => handelComment(data.id)}
                   disabled={del}
                />
                <HappyProvider >
                    
                    <Button
                        type="default"
                        shape="circle"
                        size="large"
                        onClick={() => handelComment(data.id)}
                        className="bg-blue-100 text-blue-600"
                        disabled={del}
                    >
                        <VscSend style={{ fontWeight: "bold" }} />
                    </Button>
                    
                </HappyProvider>
            </div>
        </div>
    )
}

export default Comments