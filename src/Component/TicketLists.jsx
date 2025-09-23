import React, { useState, useEffect, useContext } from 'react'
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { FaCircle, FaRegCircle } from "react-icons/fa";
import { BsCircleHalf } from "react-icons/bs";
import { IoCheckmarkCircleSharp, IoCalendarClear } from "react-icons/io5";
import { LuBox } from "react-icons/lu";
import { TicketContext } from './ContextApi';
import { Table, Avatar, Tooltip, Input, Select, Badge, message } from "antd";
import { AudioOutlined, CopyOutlined } from '@ant-design/icons';
import { GoInbox, GoStack } from 'react-icons/go';
import { MdOutlineFilterList } from 'react-icons/md';
import { CiSearch } from 'react-icons/ci';


function TicketLists() {
    const { Option } = Select;
    const [messageApi, contextHolder] = message.useMessage();

    const navigate = useNavigate();
    const { getAllTickets, datas, getStatusIcon } = useContext(TicketContext);

    useEffect(() => {
        getAllTickets();
    }, []);

    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const [filterData, setFiltedData] = useState([]);

    useEffect(() => {
        applyFilter();
    }, [datas, search, priority, status]);


    function applyFilter() {
        let result = [...datas];

        if (search) {
            const lowerValue = search.toLowerCase();
            result = result.filter(
                item =>
                    item.title?.toLowerCase().includes(lowerValue));
        }

        if (priority) {
            result = result.filter(
                item => item.priority?.toLowerCase() === priority.toLowerCase()
            );
        }

        if (status) {
            result = result.filter(
                item => item.status?.toLowerCase() === status.toLowerCase()
            );
        }

        setFiltedData(result);
    }


    const columns = [
        {
            title: `ID (Total ${datas.length})`,
            dataIndex: "id",
            key: "id",
            render: (id,record) => (
                <div className="flex items-center gap-2 dark:text-white">
                    <Avatar src={`https://ui-avatars.com/api/?name=${record.name || "John"}&background=random&color=fff`} />
                    <p className='w-[80px]'>{id.substring(0, 9)}...</p>
                    <span className='text-sm hover:text-green-500 duration-300 cursor-pointer'
                        onClick={async (e) => {
                            e.stopPropagation();
                            await navigator.clipboard.writeText(id); messageApi.success("Id Copied")
                        }}
                    >
                        <CopyOutlined />
                    </span>
                </div >
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (name) => (
                <p className='text-xs dark:text-white '>{name}</p>
            ),
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (title) => <Tooltip title={title}><span className='dark:text-white font-semibold'>{title.length > 10 ? title.substring(0, 10) + "..." : title}</span>,</Tooltip>
        },
        {
            title: "Description",
            dataIndex: "desc",
            key: "desc",
            render: (desc) => <span className='dark:text-white'>{desc.length > 10 ? desc.substring(0, 10) + "..." : desc}</span>
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
                <div className="flex items-center gap-2 dark:text-white">
                    <FaCircle
                        className={`text-xs ${priority === "Low"
                            ? "text-green-600"
                            : priority === "Medium"
                                ? "text-yellow-400"
                                : "text-red-500"
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
                <div className="flex items-center gap-2 dark:text-white">
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
                    <div className="flex items-center gap-2 dark:text-white">
                        <IoCalendarClear className="text-lg" />
                        {dayjs(time).isAfter(dayjs().subtract(1, "day")) ? dayjs(time).fromNow() : dayjs(time).format("DD MMM YY")}
                    </div>
                </Tooltip>
            ),
        },
    ];
    return (
        <>
            <div className='w-[96%] mt-4 flex items-center justify-center gap-4'>
                {contextHolder}
                <Input
                    prefix={<CiSearch className="text-gray-500" />}
                    placeholder="Search"
                    onChange={(e) => { setSearch(e.target.value) }}
                    className="md:w-[150px] "
                    allowClear
                />

                <Select
                    prefix={<GoStack className="text-gray-500" />}
                    placeholder="Select Priority"
                    allowClear
                    onChange={(value) => { applyFilter(); setPriority(value) }}
                    className="md:w-[150px] w-[135px] "
                >
                    <Option value="High"><p className='flex flex-row items-center gap-2'><Badge status="error" />High</p></Option>
                    <Option value="Medium"><p className='flex flex-row items-center gap-2'><Badge status="warning" />Medium</p></Option>
                    <Option value="Low"><p className='flex flex-row items-center gap-2'><Badge status="success" />Low</p></Option>
                </Select>

                <Select
                    prefix={<MdOutlineFilterList className="text-gray-500" />}
                    placeholder="Select Status"
                    allowClear
                    onChange={(value) => { applyFilter(datas), setStatus(value) }}
                    className="md:w-[150px] w-[135px]"

                >
                    <Option value="Open"><p className='flex flex-row items-center gap-2'>{getStatusIcon("Open")}Open</p></Option>
                    <Option value="Processing"><p className='flex flex-row items-center gap-2'>{getStatusIcon("Processing")}Processing</p></Option>
                    <Option value="Completed"><p className='flex flex-row items-center gap-2'>{getStatusIcon("Completed")}Completed</p></Option>
                </Select>
            </div>

            {filterData.length < 1 &&
                <div className='flex justify-center items-center h-[50vh] flex-col gap-4 '>
                    <p className='text-7xl text-gray-600 '><GoInbox /></p>
                    <p className='font-semibold text-gray-600'>No Data</p>
                </div>}


            {filterData.length > 0 && <div className="w-[96%] h-[73vh] mt-4 bg-white dark:bg-gray-900 flex items-center px-4 rounded-lg shadow-sm justify-center overflow-hidden">
                <Table
                    dataSource={filterData}
                    scroll={{ x: "max-content" }}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 6 }}
                    style={{ width: "100%", height: "100%" }}
                    onRow={(record) => ({
                        onClick: () => navigate(`/ticket/${record.id}`),
                    })}
                    rowClassName={() => "dark:bg-gray-900 cursor-pointer"}
                />
            </div>
            }
        </>
    )
}

export default TicketLists