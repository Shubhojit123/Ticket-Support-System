import React, { useContext, useEffect, useRef, useState } from 'react'
import { TicketContext } from '../Component/ContextApi'
import { Avatar, Dropdown, Input, Space, Tag, Tooltip, Select, message, Badge } from 'antd';
import { FaArrowLeft, FaTrashRestoreAlt, FaUser } from "react-icons/fa";
import { MdDescription, MdOutlineFilterList } from "react-icons/md";
import { useNavigate } from 'react-router';
import { DownOutlined } from '@ant-design/icons';
import { GoInbox, GoStack } from "react-icons/go";
import { CiFilter, CiSearch } from "react-icons/ci";
import { FaBolt, FaFilter } from 'react-icons/fa6';
import { PiSubtitlesBold } from 'react-icons/pi';

const { Option } = Select;

function Deleted() {
  const [messageApi, contextHolder] = message.useMessage()
  const [isMobile, setMobile] = useState(window.innerWidth < 450);



  const { getPriorityColor, getStatusIcon, updateStatus } = useContext(TicketContext);

  const [datas, setDatas] = useState([]);

  useEffect(() => {
    const res = JSON.parse(localStorage.getItem(import.meta.env.VITE_DELETE_STORAGE)) || [];
    console.log(res[0])
    setDatas(res);
  }, []);

  const allStatuses = ["Open", "Completed", "Processing"];
  function handelChangeStatus(e, id) {
    updateStatus(id, e.key);
  }

  const [filterData, setFiltedData] = useState([]);
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    applyFilter();
  }, [datas, priority, status, search]);

  function applyFilter() {
    let result = [...datas];

    if (search) {
      const lowerValue = search.toLowerCase();
      result = result.filter(
        item =>
          item.title?.toLowerCase().includes(lowerValue) ||
          item.name?.toLowerCase().includes(lowerValue)
      );
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



  const navigate = useNavigate();
  return (
    <div className='w-[100%] h-[100vh] flex flex-col gap-4 p-4'>
      <div className='w-full py-4 shadow-md flex flex-row  items-center justify-between px-4 '>
        <div className='flex flex-row gap-1.5 items-center cursor-pointer text-blue-600 hover:text-blue-200 duration-800 ' onClick={()=>navigate(-1)}>
          <p><FaArrowLeft /></p><p>Back</p>
        </div>
            <div className='text-xl font-semibold dark:text-white flex flex-row gap-1.5 items-center'>
              <p><FaTrashRestoreAlt/></p>
            <p>{`Deleted Ticket List (${datas.length})`}</p>
            </div>
      </div>
      {contextHolder}
      <div className='w-[100%] p-4   rounded flex flex-col justify-between gap-2 md:flex-row dark:bg-gray-800 dark:border-gray-900 '>
        <div className='w-[100%] md:w-[55%]'>
          <Input
            prefix={<CiSearch className="text-gray-500" />}
            placeholder="Search"
            onChange={(e) => { setSearch(e.target.value) }}
            className="md:w-[150px] "
            allowClear
          />
        </div>

        <div className='flex flex-row w-[100%] md:w-[55%]  items-center justify-evenly gap-1 md:gap-0 '>
          <Select
            prefix={<GoStack className="text-gray-500" />}
            placeholder={isMobile ? "Priority" : "Select Priority"}
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
            placeholder={isMobile ? "Status" : "Select Status"}
            allowClear
            onChange={(value) => { applyFilter(datas), setStatus(value) }}
            className="md:w-[150px] w-[135px]"

          >
            <Option value="Open"><p className='flex flex-row items-center gap-2'>{getStatusIcon("Open")}Open</p></Option>
            <Option value="Processing"><p className='flex flex-row items-center gap-2'>{getStatusIcon("Processing")}Processing</p></Option>
            <Option value="Completed"><p className='flex flex-row items-center gap-2'>{getStatusIcon("Completed")}Completed</p></Option>
          </Select>
        </div>
      </div>
      <div className='w-[100%]  overflow-y-auto flex flex-col gap-3 max-h-[75vh] '>
        {filterData.length < 1 && <div className='flex justify-center items-center h-[50vh] flex-col gap-4 '>
          <p className='text-7xl text-gray-600 '><GoInbox /></p>
          <p className='font-semibold text-gray-600'>No Data</p>
        </div>}
        
    

        {filterData?.map((data, idx) => {
          return (
            <div className='w-[100%] p-4 shadow-md flex flex-row border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 duration-200 dark:bg-gray-800 dark:border-gray-600 dark:text-white  dark:hover:bg-black duration-300'
              key={idx} onClick={() => navigate(`/deleted-ticket/${data.id}`)}>
              <div className='w-[100%] flex flex-col gap-3'>
                <div className='flex flex-row gap-2 justify-between items-center '>
                  <div className='flex flex-row gap-2  justify-between items-center '>

                    <p className='text-xs font-semibold flex flex-row gap-1 items-center'><FaUser />{data.name}</p>
                  </div>
                  <div>
                    <p className={`${getPriorityColor(data.priority)} px-2 py-1 rounded-md text-xs`}>{data.priority}</p>
                  </div>
                </div>
                <div className=' w-[100%] flex flex-row justify-between'>
                  <div>
                    <Tooltip title={data.id}><Tag className='cursor-pointer' onClick={async () => { await navigator.clipboard.writeText(data.id); messageApi.success("ID Copied") }}>#{data.id.substring(0, 6)}</Tag></Tooltip>
                    <p className='flex flex-row gap-1 py-3 text-xs font-semibold items-center'>
                      <PiSubtitlesBold />
                      {(() => {
                        if (isMobile) {
                          return data.title.length > 10 ? data.title.substring(0, 10) + "..." : data.title;
                        }
                        else {
                          return data.title.length > 60 ? data.title.substring(0, 60) + "..." : data.title;
                        }
                      })()}
                    </p>
                    <p className='flex flex-row gap-1 py-3 text-xs text-gray-700 items-center dark:text-gray-200'>
                      <MdDescription />
                      {(() => {
                        if (isMobile) {
                          return data.desc.length > 10 ? data.desc.substring(0, 10) + "..." : data.desc;
                        }
                        else {
                          return data.desc.length > 60 ? data.desc.substring(0, 60) + "..." : data.desc;
                        }
                      })()}

                    </p>

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

export default Deleted