import React, { useContext, useEffect, useState } from 'react'
import { FaUser } from "react-icons/fa6";
import { TicketContext } from './ContextApi';
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router';




function Overview({ data }) {
  const { getPriorityColor, getStatusIcon,updateStatus,isTablet } = useContext(TicketContext);
  const allStatuses = ["Open", "Completed", "Processing"];

  const navigate = useNavigate("");


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
  ];

  function handelChangeStatus(e) {
    console.log(items[0],e.key)
    const selected = items.find((item)=>item.key == e.key);
    updateStatus(data.id,selected.value)
    
  }
  return (
    <div className='h-[60vh] w-[100%] p-4 '>
      <div className='w-[100%] p-6  flex flex-row gap-3 rounded-md'>
      
        <div className='flex flex-row gap-3 items-center'>
          <p><FaUser /></p>
          <p>{data.name}</p>
        </div>
        <div>
          <p className={`text-xs px-2 py-1 font-medium border rounded-lg ${getPriorityColor(data.priority)}`}>{data.priority}</p>

        </div>
      </div>
      <div className='w-[100%] p-6 flex flex-row gap-3 rounded-md justify-between'>
        <p className='flex flex-row gap-3 items-center min-w[40%]'>{getStatusIcon(data.status)}{data.status}</p>
        <p>
          <Dropdown menu={{ items, onClick: handelChangeStatus }} >

            <a onClick={e => e.preventDefault()}>
              <Space>
                Change Status
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </p>

      </div>
      <div className='w-[100%] p-6 shadow-md flex flex-col gap-3 rounded-md'>
        <p className={`md:text-xs text-lg font-semibold`}>Description</p>
        <p className='text-xs font-medium text-gray-600'>{data.desc}</p>
      </div>
      
    </div>
  )
}

export default Overview