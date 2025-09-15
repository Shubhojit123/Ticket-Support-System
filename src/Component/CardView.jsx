import React, { useContext, useEffect, useRef, useState } from 'react'
import { TicketContext } from './ContextApi'
import { Avatar, Dropdown, Input, Space, Tag, Tooltip, Select } from 'antd';
import { FaUser } from "react-icons/fa";
import { MdDescription } from "react-icons/md";
import { useNavigate } from 'react-router';
import { DownOutlined } from '@ant-design/icons';

const { Option } = Select;

function CardView() {
    const { getAllTickets, datas, getPriorityColor, getStatusIcon, updateStatus } = useContext(TicketContext);
    useEffect(() => {
        getAllTickets();
    }, []);

    const allStatuses = ["Open", "Completed", "Processing"];
    function handelChangeStatus(e, id) {
        updateStatus(id, e.key);
    }

    const [filterData, setFiltedData] = useState([]);
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        setFiltedData(datas);
    }, [datas])

    function filter(data, field, value,subValue="") {
        if (!value && !subValue || priority !== "" && status !== "") {
            setFiltedData(data);
            return;
        }

        if (field === "search") {
            const lowerValue = value?.toLowerCase?.() || "";
            if (!lowerValue.trim()) {
                setFiltedData(data);
                return;
            }
            const res = data.filter(
                item =>
                    item.title?.toLowerCase().includes(lowerValue) ||
                    item.name?.toLowerCase().includes(lowerValue)
            );
            setFiltedData(res);
            return;
        }

        if (priority && status) {
            
             const res =   data.filter(
                    item =>
                        item.priority?.toLowerCase?.() === priority?.toLowerCase?.() &&
                        item.status?.toLowerCase?.() === status?.toLowerCase?.()
                )
            
            setFiltedData(res);
            return;
        }

        setFiltedData(
            data.filter(
                item => item[field]?.toLowerCase?.() === value?.toLowerCase?.()
            )
        );
    }


    function handelSearch(e) {
        e.preventDefault();
        filter(datas, "search", e.target.value);
    }




    const navigate = useNavigate();
    return (
        <div className='w-[100%] h-[80vh] flex flex-col gap-4 '>
            <div className='w-[100%] p-4 shadow-md border border-gray-300 rounded flex flex-row justify-between'>
                <Input
                    placeholder="Search"
                    onChange={(e) => handelSearch(e)}
                    className="md:max-w-[150px] "
                />

                <Select
                    placeholder="Select Priority"
                    allowClear
                    onChange={(value) => { filter(datas, "priority", value); setPriority(value) }}
                    className="md:w-[100px]"
                >
                    <Option value="High">High</Option>
                    <Option value="Medium">Medium</Option>
                    <Option value="Low">Low</Option>
                </Select>

                <Select
                    placeholder="Select Status"
                    allowClear
                    onChange={(value) => { filter(datas, "status", value), setStatus(value) }}
                    className="md:w-[100px]"

                >
                    <Option value="Open">Open</Option>
                    <Option value="Processing">Processing</Option>
                    <Option value="Completed">Completed</Option>
                </Select>
            </div>
            <div className='w-[100%]  overflow-y-auto flex flex-col gap-3 max-h-[75vh] '>
                {filterData?.map((data, idx) => {
                    const items = [
                        {
                            key: '1',
                            label: <p className='flex flex-row gap-2 text-xs font-semibold'>{getStatusIcon(data.status)}{data.status}</p>,
                            disabled: true,
                        },
                        {
                            type: 'divider',
                        },

                        ...allStatuses.filter((status) => status != data.status)
                            .map((status) => ({
                                key: `${status}`,
                                label: (
                                    <p className="flex flex-row gap-2 text-xs font-semibold">
                                        {getStatusIcon(status)}
                                        {status}
                                    </p>
                                ),
                                value: status
                            })),
                    ];

                    return (
                        <div className='w-[100%] p-4 shadow-md flex flex-row border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 duration-200' key={idx} onDoubleClick={() => navigate(`/ticket/${data.id}`)}>
                            <div className='w-[100%] flex flex-col gap-3'>
                                <div className='flex flex-row gap-2 justify-between items-center '>
                                    <div className='flex flex-row gap-2  justify-between items-center '>
                                        <Avatar src={`https://ui-avatars.com/api/?name=${data.name || "John"}&background=random&color=fff`} />
                                        <p className='text-xs font-semibold flex flex-row gap-1 items-center'><FaUser />{data.name}</p>
                                    </div>
                                    <div>
                                        <p className={`${getPriorityColor(data.priority)} px-2 py-1 rounded-md text-xs`}>{data.priority}</p>
                                    </div>
                                </div>
                                <div className=' w-[100%] flex flex-row justify-between'>
                                    <div>
                                        <Tooltip title={data.id}><Tag className='cursor-pointer'>#{data.id.substring(0, 6)}</Tag></Tooltip>
                                        <p className='flex flex-row gap-1 py-3 text-xs'><MdDescription />{" "}{data.desc.length > 10 ? data.desc.substring(0, 10) + "..." : data.desc}</p>
                                    </div>
                                    <div className='flex flex-col justify-between items-end'>
                                        <p className='flex flex-row gap-2 text-xs items-center'>{getStatusIcon(data.status)}{data.status}</p>
                                        <Dropdown menu={{ items, onClick: (e) => handelChangeStatus(e, data.id) }} >

                                            <a onClick={e => e.preventDefault()} style={{ cursor: "pointer" }}>
                                                <Space>
                                                    Change Status
                                                    <DownOutlined />
                                                </Space>
                                            </a>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default CardView