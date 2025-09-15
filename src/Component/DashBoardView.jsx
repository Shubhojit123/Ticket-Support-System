import React, { useContext, useEffect, useState } from "react";
import { TicketContext } from "./ContextApi";
import { FaTicketSimple } from "react-icons/fa6";
import { FaRegCircle } from "react-icons/fa";
import { PiCircleHalfFill } from "react-icons/pi";
import { GoCheckCircleFill } from "react-icons/go";
import { FaChartPie } from "react-icons/fa";
import { Button, Drawer } from "antd";

function DashBoardView() {
  const { getAllTickets, datas, getPriorityColor } = useContext(TicketContext);
  const [totalOpen, setTotalOpen] = useState([]);
  const [totalProcess, setTotalProcess] = useState([]);
  const [totalComplete, setTotalComplete] = useState([]);
  const [totalHigh, setTotalHigh] = useState([]);
  const [totalLow, setTotalLow] = useState([]);
  const [totalMedium, setTotalMedium] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getAllTickets();
  }, []);

  useEffect(() => {
    try {
      const totalOpenTicket = datas.filter((data) => data.status === "Open");
      const totalProcessTicket = datas.filter(
        (data) => data.status === "Processing"
      );
      const totalCompleteTicket = datas.filter(
        (data) => data.status === "Completed"
      );

      const totalHighTicket = datas.filter(
        (data) => data.priority === "High"
      );
      const totalMediumTicket = datas.filter(
        (data) => data.priority === "Medium"
      );
      const totalLowTicket = datas.filter(
        (data) => data.priority === "Low"
      );

      setTotalOpen(totalOpenTicket);
      setTotalProcess(totalProcessTicket);
      setTotalComplete(totalCompleteTicket);

      setTotalHigh(totalHighTicket);
      setTotalLow(totalLowTicket);
      setTotalMedium(totalMediumTicket);
    } catch (error) {
      console.log(error);
    }
  }, [datas]);

  const overviewContent = (
    <div className="flex flex-col gap-3">
      <div className="w-full p-4 shadow-md bg-blue-100 text-blue-600 rounded-md flex flex-col">
        <p className="flex flex-row items-center gap-3">
          <FaTicketSimple />
          <span>Total Tickets ({datas.length})</span>
        </p>
        <div className="w-full text-xs font-semibold flex flex-wrap gap-2 py-3">
          <p className={`${getPriorityColor("High")} p-2 rounded-md`}>
            High ({totalHigh.length})
          </p>
          <p className={`${getPriorityColor("Medium")} p-2 rounded-md`}>
            Medium ({totalMedium.length})
          </p>
          <p className={`${getPriorityColor("Low")} p-2 rounded-md`}>
            Low ({totalLow.length})
          </p>
        </div>
      </div>

      <div className="w-full p-4 shadow-md bg-blue-100 text-blue-600 rounded-md">
        <p className="flex flex-row items-center gap-3">
          <FaRegCircle className="text-red-600" />
          <span>Total Opens ({totalOpen.length})</span>
        </p>
      </div>

      <div className="w-full p-4 shadow-md bg-blue-100 text-blue-600 rounded-md">
        <p className="flex flex-row items-center gap-3">
          <PiCircleHalfFill className="text-yellow-400" />
          <span>Total In Process ({totalProcess.length})</span>
        </p>
      </div>

      <div className="w-full p-4 shadow-md bg-blue-100 text-blue-600 rounded-md">
        <p className="flex flex-row items-center gap-3">
          <GoCheckCircleFill className="text-green-400" />
          <span>Total Completed ({totalComplete.length})</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="h-[90vh] w-full flex flex-col gap-4">
      <div className="w-full p-4 shadow-md flex items-center justify-between">
        <p className="flex flex-row justify-center gap-3 items-center font-semibold text-gray-700">
          <span className="bg-blue-200 text-blue-600 p-2 rounded-md">
            <FaChartPie />
          </span>
          <span>Overview</span>
        </p>

        <p
        className="block md:hidden px-2 py-1 text-sm font-semibold cursor-pointer rounded-lg text-blue-600 bg-blue-100"
          onClick={() => setOpen(true)}
        >
          View
        </p>
      </div>

      <div className="hidden md:flex flex-col gap-3">{overviewContent}</div>

      <Drawer
        title="Overview"
        placement="left"
        onClose={() => setOpen(false)}
        open={open}
      >
        {overviewContent}
      </Drawer>
    </div>
  );
}

export default DashBoardView;
