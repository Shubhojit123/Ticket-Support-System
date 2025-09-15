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
              <img src={logo} className='w-9 h-9' />
              <h1 className="md:text-lg font-semibold text-gray-700 sm:text-sm">Ticketing</h1>
            </div>


            <div className='mx-4'>
              <Segmented
                options={[
                  { value: 'List', icon: <BarsOutlined /> },
                  { value: 'Kanban', icon: <AppstoreOutlined /> },
                ]}
                value={kanban}
                onChange={(val) => handelKanban(val)}
              />
            </div>

            <button onClick={() => setOpen(true)} className="bg-blue-600 text-white text-xs sm:bg-green-600 sm:text-sm md:bg-yellow-600 md:text-base lg:bg-purple-600 lg:text-lg px-4 py-2 rounded-lg shadow-md hover:opacity-80">
              + Create</button>


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