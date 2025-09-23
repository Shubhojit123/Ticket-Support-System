import React, { useContext, useState } from 'react'
import { FaUser } from "react-icons/fa6"
import { TicketContext } from './ContextApi'
import { CommentOutlined, DownOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Dropdown, Space, Drawer, Button, Popconfirm, message, Badge } from 'antd'
import Comments from './Comments'
import { MdDelete, MdSettingsBackupRestore } from 'react-icons/md'
import { useNavigate, useParams, useSearchParams } from 'react-router'

function Overview({ data, del }) {
  const [messageApi, contextHolder] = message.useMessage()

  const { getPriorityColor, getStatusIcon, updateStatus, reStoreData, deleteTicket } = useContext(TicketContext)
  const allStatuses = ["Open", "Completed", "Processing"]
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const navigate = useNavigate()
  const { id } = useParams();
  const items = [
    {
      key: '1',
      label: (
        <p className='flex flex-row gap-2 text-xs font-semibold'>
          {getStatusIcon(data.status)}
          {data.status}
        </p>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    ...allStatuses
      .filter((status) => status !== data.status)
      .map((status, idx) => ({
        key: `status-${idx}`,
        label: (
          <p className="flex flex-row gap-2 text-xs font-semibold">
            {getStatusIcon(status)}
            {status}
          </p>
        ),
        value: status
      })),
  ]

  function handelChangeStatus(e) {
    const selected = items.find((item) => item.key == e.key)
    updateStatus(data.id, selected.value)
  }



  return (

    <div className=' h-full flex flex-col gap-4 p-2 md:p-4 w-full dark:bg-black  '>
      {contextHolder}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-white dark:bg-gray-800 dark:text-white rounded-md shadow-sm w-full'>
        <div className='flex items-center gap-3'>
          <FaUser />
          <p className='text-sm sm:text-base font-medium'>{data.name}</p>
        </div>
        <p className={`text-xs sm:text-sm px-2 py-1 font-medium border rounded-lg ${getPriorityColor(data.priority)}`}>
          {data.priority}
        </p>
      </div>

      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3  p-4 bg-white rounded-md shadow-sm dark:bg-gray-800 dark:text-white'>
        <p className='flex items-center gap-2 text-sm sm:text-base'>
          {getStatusIcon(data.status)} {data.status}
        </p>
        {!del && <Dropdown menu={{ items, onClick: handelChangeStatus }}>
          <a onClick={e => e.preventDefault()}>
            <Space className='text-sm sm:text-base cursor-pointer'>
              Change Status <DownOutlined />
            </Space>
          </a>
        </Dropdown>}
        {
          del &&
          <Popconfirm
            title="Restore the Ticket"
            description="Are you Restore this Ticket?"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => { reStoreData(id); messageApi.success("Data Restored"); setTimeout(() => navigate(-1), 1000) }}
          >
            <p className='flex flex-row gap-1 items-center px-2 py-2 bg-gray-600 hover:bg-gray-900 duration-300 dark:text-white cursor-pointer text-white rounded-lg'>
              <MdSettingsBackupRestore />Restore
            </p>
          </Popconfirm>
        }

      </div>
      <div className="p-4 w-full bg-white dark:bg-gray-800 dark:text-white rounded-md shadow flex flex-col gap-2">
        <p className="text-base sm:text-lg font-semibold break-words">
          Description
        </p>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-100 break-words whitespace-normal">
          {data.desc}
        </p>
      </div>


      {data.image && (<div className="p-4 w-full shadow-md bg-white dark:bg-gray-800 flex justify-center items-center rounded-md">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <img
            src={data.image}
            alt="Ticket"
            className="w-full h-auto max-h-[400px] rounded-md object-contain"
          />
        </div>
      </div>)}



      <div className="flex items-center  gap-6 p-2 justify-center">
        <button
          onClick={() => setCommentDrawerOpen(true)}
          className="relative flex items-center font-semibold text-sm md:hidden"
        >
          <Badge
            count={data.comments.length}
            className=" dark:bg-blue-200 rounded-md"
          >
            <CommentOutlined className="text-2xl text-blue-700 dark:text-blue-200 dark:p-1 rounded-md" />
          </Badge>
        </button>


        <Popconfirm
          title="Delete the Ticket"
          description="Are you sure to delete this Ticket?"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => { deleteTicket(data.id, del); messageApi.success("Deleted Successfully"); setTimeout(() => { navigate(-1); }, 1000) }}

        >
          <p className='text-2xl text-red-500 cursor-pointer md:text-4xl'><MdDelete /></p>
        </Popconfirm>
      </div>

      <Drawer
        title="Comments"
        placement="right"
        open={commentDrawerOpen}
        onClose={() => setCommentDrawerOpen(false)}
        width={400}
        className='dark:bg-black'
      >
        <Comments data={data} del={del} />
      </Drawer>


    </div>
  )
}

export default Overview
