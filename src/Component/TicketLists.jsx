import React, { useState, useEffect, useContext } from 'react'
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { FaCircle, FaRegCircle } from "react-icons/fa";
import { BsCircleHalf } from "react-icons/bs";
import { IoCheckmarkCircleSharp, IoCalendarClear } from "react-icons/io5";
import { LuBox } from "react-icons/lu";
import { TicketContext } from './ContextApi';
import { Table, Avatar, Tooltip, Input } from "antd";
import { AudioOutlined } from '@ant-design/icons';


function TicketLists() {
    const { Search } = Input;

    const navigate = useNavigate();
    const { getAllTickets, datas, setData } = useContext(TicketContext);

    useEffect(() => {
        getAllTickets();
    }, []);

    const [search, setSearch] = useState([]);

    function handelSearch(value) {
        setSearch(value);
    }

    const filterData = datas.filter((item) => (
        item.name.toLowerCase().includes(search)
    ))

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
    const columns = [
        {
            title: `ID (Total ${datas.length})`,
            dataIndex: "id",
            key: "id",
            render: (id) => (
                <Tooltip title={id}>
                    <div className="flex items-center gap-2">
                        <LuBox className="text-2xl border p-1 text-white bg-gray-900 rounded-lg" />
                        {id.substring(0, 6)}...
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (name) => (
                <Tooltip title={name}>
                    <Avatar
                        src={`https://ui-avatars.com/api/?name=${name || "John"}&background=random&color=fff`}
                    />
                </Tooltip>
            ),
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (title) => <Tooltip title={title}><span>{title.length > 10 ? title.substring(0, 10)+"..." : title}</span>,</Tooltip>
        },
        {
            title: "Description",
            dataIndex: "desc",
            key: "desc",
            render: (desc) => <Tooltip title={<div className='max-h-[40vh] max-w[350px] overflow-auto p-3'>{desc}</div>}><span>{desc.length > 10 ? desc.substring(0, 10)+"..." : desc}</span>,</Tooltip>
        },
        {
            title: "Priority",
            dataIndex: "priority",
            key: "priority",
            filters: [
                { text: "Low", value: "Low" },
                { text: "Medium", value: "Medium" },
                { text: "High", value: "High" }
            ],
            onFilter: (value, record) => record.priority === value,
            render: (priority) => (
                <div className="flex items-center gap-2">
                    <FaCircle
                        className={`text-xs ${priority === "Low"
                            ? "text-green-600"
                            : priority === "Medium"
                                ? "text-yellow-400"
                                : "text-red-800"
                            }`}
                    />
                    {priority}
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            filters: [
                { text: "Open", value: "Open" },
                { text: "Processing", value: "Processing" },
                { text: "Completed", value: "Completed" },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => (
                <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    {status}
                </div>
            ),
        },
        {
            title: "CreatedAt",
            dataIndex: "time",
            key: "time",
            render: (time) => (
                <Tooltip title={dayjs(time).format("DD MMM YYYY")}>
                    <div className="flex items-center gap-2">
                        <IoCalendarClear className="text-lg" />
                        {dayjs(time).format("DD MMM")}
                    </div>
                </Tooltip>
            ),
        },
    ];
    return (
        <>
            <div className='w-[96%] mt-4'>
                <Search placeholder="Search title" onChange={(e) => setSearch(e.target.value.toLowerCase())} 
                    onSearch={(value) => setSearch(value.toLowerCase())} enterButton allowClear />
            </div>
            <div className="w-[96%] h-[73vh] mt-4 bg-white  flex items-center px-4 rounded-lg shadow-sm justify-center overflow-hidden">
                <Table dataSource={filterData} className="cursor-pointer" scroll={{ x: "max-content" }} columns={columns} rowKey="id" pagination={{ pageSize: 6 }} style={{ width: "100%", height: "100%" }} onRow={(record) => ({
                    onClick: () => navigate(`/ticket/${record.id}`),
                })} />
            </div>



        </>
    )
}

export default TicketLists