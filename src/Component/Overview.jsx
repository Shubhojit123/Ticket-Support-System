import React, { useContext, useState } from 'react'
import { FaUser } from "react-icons/fa6"
import { TicketContext } from './ContextApi'
import { CommentOutlined, DownOutlined } from '@ant-design/icons'
import { Dropdown, Space, Drawer, Button } from 'antd'
import Comments from './Comments'

function Overview({ data }) {
  const { getPriorityColor, getStatusIcon, updateStatus, isTablet } = useContext(TicketContext)
  const allStatuses = ["Open", "Completed", "Processing"]
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false)

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
    <div className='w-full h-full flex flex-col gap-4 p-2 md:p-4'>

      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full p-4 bg-white rounded-md shadow-sm'>
        <div className='flex items-center gap-3'>
          <FaUser />
          <p className='text-sm sm:text-base font-medium'>{data.name}</p>
        </div>
        <p className={`text-xs sm:text-sm px-2 py-1 font-medium border rounded-lg ${getPriorityColor(data.priority)}`}>
          {data.priority}
        </p>
      </div>

      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full p-4 bg-white rounded-md shadow-sm'>
        <p className='flex items-center gap-2 text-sm sm:text-base'>
          {getStatusIcon(data.status)} {data.status}
        </p>
        <Dropdown menu={{ items, onClick: handelChangeStatus }}>
          <a onClick={e => e.preventDefault()}>
            <Space className='text-sm sm:text-base cursor-pointer'>
              Change Status <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>

      <div className='w-full p-4 bg-white rounded-md shadow-sm flex flex-col gap-2 max-h-[45vh] overflow-auto'>
        <p className='text-base sm:text-lg font-semibold break-words'>Description</p>
        <p className='text-xs sm:text-sm text-gray-600 break-words whitespace-pre-wrap'>
          {data.desc}
        </p>
      </div>


      
        
          <p className='text-xl font-semibold flex items-center justify-center gap-1 text-blue-600 cursor-pointer block md:hidden z-10' onClick={() => setCommentDrawerOpen(true)}>
            <p><CommentOutlined className="absolute text-2xl"/></p><p className="relative text-xs -z-50 ml-3 mt-0.5 h-5 w-5  rounded-full flex justify-center items-center bg-blue-50">{data.comments.length}</p></p>
          <Drawer
            title="Comments"
            placement="right"
            open={commentDrawerOpen}
            onClose={() => setCommentDrawerOpen(false)}
            width={300}
          >
            <Comments data={data} />
          </Drawer>
    

    </div>
  )
}

export default Overview
