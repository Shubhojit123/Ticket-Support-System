import React, { useContext, useEffect, useRef, useState } from 'react'
import { IoIosSend } from "react-icons/io";
import { FaCopy } from "react-icons/fa6";
import { AiOutlineCheck } from "react-icons/ai";
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { MdCircle } from "react-icons/md";
import { TicketContext } from './ContextApi';
import { Input } from 'antd';
const { TextArea } = Input;


function TicketForm() {

    const {getAllTickets} = useContext(TicketContext)

    useEffect(()=>{
        getAllTickets();
    },[])
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [option, setOption] = useState("");
    const [copied, setCopied] = useState(false);
    const [name,setName] = useState("");
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

            if(!nameTrim)
            {
                toast.info("Please enter Name")
                nameRef.current.focus();
                return;
            }

            if (!titleTrim) {
                toast.info("Please enter Title");
                titleRef.current.focus();
                return;
            }

            if (!descTrim) {
                toast.info("Please enter Description");
                descRef.current.focus();
                return;
            }

            if (!optionTrim) {
                toast.info("Please select Priority");
                optionRef.current.focus();
                return;
            }
            const STORAGE = import.meta.env.VITE_STORAGE;
            const oldTicket = await JSON.parse(localStorage.getItem(STORAGE)) || [];
            const payLoad = {
                id,
                name:nameTrim,
                title: titleTrim,
                desc: descTrim,
                priority: optionTrim,
                status: "Open",
                time: Date.now(),
                comments:[]
            };
            oldTicket.push(payLoad);
            localStorage.setItem(STORAGE, JSON.stringify(oldTicket));
            toast.success("We will conatact Soon");
            idShow.current.style.display = "block";
            setTitle("")
            setDesc('')
            getAllTickets()

        } catch (error) {
            toast.error("Internal Error");
            console.log(error)
        }
    }

    const copyToClipboard = async (id) => {
        try {
            await navigator.clipboard.writeText(id);
            setCopied(true);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className='h-[100%] w-[100%]  p-4 flex flex-col gap-3'>
                <div className='h-10 w-[100%]  line bg-gradient-to-r from-blue-400 to-indigo-600 flex rounded-sm'>
                    <div className='w-[20%] flex h-[100%] justify-between items-center ml-2'>
                        <span className='p-2 text-xs bg-blue-500 rounded-sm shadow-cyan-500/50'>🎫</span>
                    </div>
                    <div className='w-[75%] h-[100%] flex mr-2 p-2  items-center'>
                        <p className='text-2xl text-gray-100 font-semibold'>Ticket Support System</p>
                    </div>
                </div>

                <div className='h-[82%] w-[100%] '>
                    <form onSubmit={handelSubmit}>
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
                                    className={`w-full h-12 border-2 rounded-lg px-4 pr-10 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2
                                         focus:ring-blue-100 transition-all duration-200 cursor-pointer appearance-none`}
                                    onChange={(e) => setOption(e.target.value)}
                                    value={option}
                                    ref={optionRef}
                                >
                                    <option value="">Select Priority Level</option>
                                    <option value="Low">Low Priority</option>
                                    <option value="Medium"> Medium Priority</option>
                                    <option value="High">High Priority</option>
                                </select>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <span className="text-lg"></span>
                                </div>
                            </div>
                            {option && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                    <span className="text-base"></span>
                                    <span>
                                        {option === 'Low' && 'Response within 2-3 business days'}
                                        {option === 'Medium' && 'Response within 1 business day'}
                                        {option === 'High' && 'Response within 4 hours'}
                                    </span>
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-blue-400 to-indigo-600 cursor-pointer mt-2.5
                        rounded-md flex text-gray-200 text-xl font-bold justify-center items-center group hover:from-blue-500 to-indigo-800 transition ">
                            <p className=' p-3 group-hover:text-gray-50'>Create Ticket</p><p className='p-2 scale-150 group-hover:text-gray-50'><IoIosSend /></p>
                        </button>
                    </form>

                    <div className="flex items-center justify-between hidden mt-3" ref={idShow}>
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full">
                                <span className="text-sm">✅</span>
                            </div>
                            <div>
                                <div>
                                    <h3 className="font-semibold text-green-800">Ticket Created Successfully!</h3>
                                    <p className="text-green-700 text-sm">Your ticket ID is: <span className="font-mono font-bold ">{id}</span></p>
                                </div>
                            </div>
                            <button
                                onClick={() => copyToClipboard(id)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200
                         text-green-700 rounded-lg transition-colors duration-200 font-medium cursor-pointer"
                                title="Copy Ticket ID"
                            >
                                {copied ? (
                                    <>
                                        <span><AiOutlineCheck /></span>
                                        <span className="text-sm">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <span><FaCopy /></span>
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