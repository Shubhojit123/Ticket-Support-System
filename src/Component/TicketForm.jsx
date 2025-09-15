import React, { useContext, useEffect, useRef, useState } from 'react'
import { IoIosSend } from "react-icons/io";
import { FaCopy } from "react-icons/fa6";
import { AiOutlineCheck } from "react-icons/ai";
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { TicketContext } from './ContextApi';
import { Input, message } from 'antd';
import { MdBackHand } from 'react-icons/md';

const { TextArea } = Input;

function TicketForm() {
    const [messageApi, contextHolder] = message.useMessage()
    const { getAllTickets } = useContext(TicketContext);

    useEffect(() => {
        getAllTickets();
    }, []);

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [option, setOption] = useState("");
    const [copied, setCopied] = useState(false);
    const [name, setName] = useState("");

    const idShow = useRef();
    const id = uuidv4();

    const titleRef = useRef();
    const descRef = useRef();
    const optionRef = useRef();
    const nameRef = useRef();

    const handelSubmit = async (e) => {
        e.preventDefault();
        try {
            const titleTrim = title.trim();
            const descTrim = desc.trim();
            const optionTrim = option.trim();
            const nameTrim = name.trim();

            if (!nameTrim) {
                messageApi.info("Please enter Name");
                nameRef.current.focus();
                return;
            }
            if (!titleTrim) {
                messageApi.info("Please enter Title");
                titleRef.current.focus();
                return;
            }
            if (!descTrim) {
                messageApi.info("Please enter Description");
                descRef.current.focus();
                return;
            }
            if (!optionTrim) {
                messageApi.info("Please select Priority");
                optionRef.current.focus();
                return;
            }

            const STORAGE = import.meta.env.VITE_STORAGE;
            const oldTicket = await JSON.parse(localStorage.getItem(STORAGE)) || [];

            const payLoad = {
                id,
                name: nameTrim,
                title: titleTrim,
                desc: descTrim,
                priority: optionTrim,
                status: "Open",
                time: Date.now(),
                comments: []
            };

            oldTicket.push(payLoad);
            localStorage.setItem(STORAGE, JSON.stringify(oldTicket));
            messageApi.success("We will contact Soon");
            idShow.current.style.display = "block";

            setTitle("");
            setDesc('');
            getAllTickets();
        } catch (error) {
            toast.error("Internal Error");
            console.log(error);
        }
    };

    const copyToClipboard = async (id) => {
        try {
            await navigator.clipboard.writeText(id);
            setCopied(true);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {contextHolder}
            <div className='h-full w-full p-4 flex flex-col gap-3'>
                <div className='h-10 w-full flex rounded-sm text-blue-600 text-xl font-semibold items-center justify-center flex-row gap-1'>
                    <p><MdBackHand /></p>
                    <p>Add Ticket</p>
                </div>

                <div className='h-[82%] w-full'>
                    <form onSubmit={handelSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Enter Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                showCount
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                className="w-full h-12 border-2 border-gray-200 rounded-lg px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                onChange={(e) => setName(e.target.value)}
                                ref={nameRef}
                                maxLength={25}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Ticket Title <span className="text-red-500">*</span>
                            </label>
                            <Input
                                showCount
                                type="text"
                                placeholder="Brief description of your issue"
                                value={title}
                                className="w-full h-12 border-2 border-gray-200 rounded-lg px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                onChange={(e) => setTitle(e.target.value)}
                                ref={titleRef}
                                maxLength={50}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <TextArea
                                placeholder="Provide detailed information about your issue..."
                                value={desc}
                                rows={4}
                                showCount
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                onChange={(e) => setDesc(e.target.value)}
                                ref={descRef}
                                maxLength={400}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Priority Level <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full h-12 border-2 rounded-lg px-4 pr-10 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2
                                    focus:ring-blue-100 transition-all duration-200 cursor-pointer appearance-none"
                                    onChange={(e) => setOption(e.target.value)}
                                    value={option}
                                    ref={optionRef}
                                >
                                    <option value="">Select Priority Level</option>
                                    <option value="Low">Low Priority</option>
                                    <option value="Medium">Medium Priority</option>
                                    <option value="High">High Priority</option>
                                </select>
                            </div>
                            {option && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                    <span>
                                        {option === 'Low' && 'Response within 2-3 business days'}
                                        {option === 'Medium' && 'Response within 1 business day'}
                                        {option === 'High' && 'Response within 4 hours'}
                                    </span>
                                </div>
                            )}
                        </div>

                       <div className=' w-[100%] flex justify-center'>
                             <button
                            type="submit"
                            className="py-2 px-2  flex flex-row items-center text-xs font-bold rounded-lg text-blue-600 bg-blue-100 cursor-pointer hover:bg-blue-200 duration-200 w-[100%] justify-center gap-4 ">
                            <p className='p-3 group-hover:text-gray-50 scale-135'>Create Ticket</p>
                            <p className='p-2 scale-250 group-hover:text-gray-50 '><IoIosSend /></p>
                        </button>
                       </div>
                    </form>

                    <div className="flex items-center justify-between hidden mt-3" ref={idShow}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                            <div className="bg-green-100 p-2 rounded-full">
                                <span className="text-sm">✅</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-green-800">Ticket Created Successfully!</h3>
                                <p className="text-green-700 text-sm">
                                    Your ticket ID is: <span className="font-mono font-bold ">{id}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => copyToClipboard(id)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200
                                text-green-700 rounded-lg transition-colors duration-200 font-medium cursor-pointer"
                                title="Copy Ticket ID"
                            >
                                {copied ? (
                                    <>
                                        <AiOutlineCheck />
                                        <span className="text-sm">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <FaCopy />
                                        <span className="text-sm">Copy ID</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TicketForm
