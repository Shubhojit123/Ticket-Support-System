import React, { useContext, useEffect, useState } from 'react'
import TicketLists from '../Component/TicketLists';
import { MdViewKanban } from "react-icons/md";
import { BsCardText } from "react-icons/bs";
import Dragable from '../Component/Dragable';
import { Button, Drawer } from "antd";
import { FiPlus } from "react-icons/fi";
import TicketForm from "../Component/TicketForm"
import logo from "../assets/logo.png"
import { useDispatch, useSelector } from 'react-redux';
import { change } from "../Redux/Slice";
import { Segmented } from 'antd';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import DashBoardView from '../Component/DashBoardView';
import { TicketContext } from '../Component/ContextApi';
import CardView from '../Component/CardView';
import { IoMdAdd } from 'react-icons/io';

function Dashboard() {

  const [table, setTable] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false)
  const [kanban, setKanban] = useState()
  const {isTablet} = useContext(TicketContext);
  const kanbanValue = useSelector((state) => state.kanban.value);
  const dispatch = useDispatch();


  function handelKanban(val) {
    setKanban(val)
    dispatch(change(val));
  }

  return (
    <>

      <div className="w-full h-screen flex flex-col md:flex-row">

        <div className="w-[100%] h-[15vh] md:w-[25%] md:h-[100vh] border-r border-gray-100 p-6">
          <DashBoardView />
        </div>

        <div className=" w-[100%] md:w-[80%] h-[100vh] bg-gray-100 p-4 flex flex-col gap-5">
          <div className="w-full h-16 bg-white shadow-md rounded-lg px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={logo} className='w-9 h-9 hidden md:block' />
              <h1 className="md:text-lg font-semibold text-gray-700 sm:text-sm">Ticketing</h1>
            </div>


            <div className='mx-4 hidden md:block'>
              <Segmented
                options={[
                  { value: 'List', icon: <BarsOutlined /> },
                  { value: 'Kanban', icon: <AppstoreOutlined /> },
                ]}
                value={kanban}
                onChange={(val) => handelKanban(val)}
              />
            </div>


           <p className='text-sm md:test-xs font-semibold flex flex-row gap-1 items-center py-2 px-3 rounded-lg cursor-pointer text-blue-600 bg-blue-100 hover:bg-blue-200 duration-200' onClick={() => setOpen(true)}>
            <p><IoMdAdd /></p><p>Add</p></p>

          </div>

          <div className="flex flex-col justify-center items-center ">
            {kanban == "Kanban" ? <Dragable /> : isTablet ? <CardView/> : <TicketLists />}
          </div>
        </div>
      </div>



      <Drawer
        closable
        destroyOnHidden
        title={<p>Ticket Form</p>}
        placement="right"
        open={open}
        width={500}
        onClose={() => setOpen(false)}
      >
        <div className='w-[100%] h-[100%] '>
          <TicketForm />
        </div>


      </Drawer>

    </>
  )
}

export default Dashboard