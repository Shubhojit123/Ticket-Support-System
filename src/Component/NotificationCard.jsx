import { message, notification, Popconfirm } from 'antd'
import dayjs from 'dayjs'
import React, { useContext } from 'react'
import { FaRegClock } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import { IoCheckmark } from 'react-icons/io5'
import { MdDeleteSweep, MdNotificationsOff } from 'react-icons/md'
import { RiCheckDoubleFill } from 'react-icons/ri'
import { RxCross1, RxCross2, RxCrosshair1 } from 'react-icons/rx'
import ContextApi, { TicketContext } from './ContextApi'

function NotificationCard({ notifyData }) {
  const [messageApi, contextHolder] = message.useMessage()
  const { deleteNotification, viewNotification, viewAllNotification, deleteAllNotification } = useContext(TicketContext);
  if(notifyData.length < 1)
  {
    return(
      <div className='flex flex-col items-center justify-center h-[90vh]'>
        <MdNotificationsOff className='text-7xl text-gray-500' />
        <p className='text-sm font-semibold text-gray-600'>No Notification</p>
      </div>
    )
  }
  return (
    <div className='h-[90vh]  w-full overflow-hidden'>
      {contextHolder}
      <div className='py-3 px-2 bg-gray-300 text-sm flex flex-row items-center justify-between font-semibold h-[6vh] mb-2'>
        <p className='text-gray-600 font-semibold'>Notification</p>
        <p className='text-[#0255d2] flex flex-row items-center gap-2 cursor-pointer' onClick={() => viewAllNotification()}>
          <p className='text-xl'><RiCheckDoubleFill /></p><p>Mark all as a read</p></p>
      </div>
      <div className='h-[77vh] shadow-md overflow-x-auto flex flex-col gap-4  '>
        {notifyData?.map((notification) => (
          <div
            key={notification.id}
            className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex flex-col gap-2 relative"
          >
           
              <RxCross2 onClick={()=>deleteNotification(notification.id)}
                size={23}
                className=" absolute top-3 right-3 text-red-500 hover:text-red-600 transition cursor-pointer"
              />

            {!notification.read && (
              <IoCheckmark
              size={23}
                className=" absolute top-9 right-3 text-[#0255d2] transition cursor-pointer dark:text-green-500"
                onClick={() => viewNotification(notification.id)}
              />
            )}

            <p className={`text-sm font-semibold ${notification.read ? "text-gray-700 dark:text-gray-300":"text-gray-900 dark:text-gray-100 font-semibold"} `}>
              {notification.msg}
            </p>
            <p className={`text-sm ${notification.read ? "text-gray-500 dark:text-gray-400":"text-gray-800 dark:text-gray-200"} `}>
              {notification.desc}
            </p>

            <div className="w-full text-[11px] flex flex-row gap-1 justify-end items-center text-gray-500">
              <FaRegClock />
              {dayjs(notification.time).isAfter(dayjs().subtract(1, "day"))
                ? dayjs(notification.time).fromNow()
                : dayjs(notification.time).format("DD MMM YY")}
            </div>
          </div>
        ))}

      </div>
      <div className='h-[6vh] px-2 py-3 cursor-pointer' >
         <Popconfirm
              title="Delete All Notifications?"
              description="This action cannot be undone."
              onConfirm={deleteAllNotification}
              placement='top'
            >
        <p className='flex flex-row items-center gap-2 text-sm font-semibold justify-end '>
          <p className='text-2xl text-red-600'><MdDeleteSweep /></p>Delete All</p>
          </Popconfirm>
      </div>
    </div >
  )
}

export default NotificationCard