import React, { useContext, useEffect, useState } from "react";
import { TicketContext } from "./ContextApi";
import { FaTicketSimple } from "react-icons/fa6";
import { FaRegCircle } from "react-icons/fa";
import { PiCircleHalfFill } from "react-icons/pi";
import { GoCheckCircleFill } from "react-icons/go";
import { FaChartPie } from "react-icons/fa";

function DashBoardView() {
  const { getAllTickets, datas, getPriorityColor } = useContext(TicketContext);
  const [totalOpen, setTotalOpen] = useState([]);
  const [totalProcess, setTotalProcess] = useState([]);
  const [totalComplete, setTotalComplete] = useState([]);
  const [totalHigh, setTotalHigh] = useState([]);
  const [totalLow, setTotalLow] = useState([]);
  const [totalMedium, setTotalMedium] = useState([]);

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

      const totalHighTicket = datas.filter((data) => data.priority === "High");
      const totalMediumTicket = datas.filter(
        (data) => data.priority === "Medium"
      );
      const totalLowTicket = datas.filter((data) => data.priority === "Low");

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

  return (
    <div className="h-[90vh] w-full flex flex-col gap-4">
     

      <div className="flex flex-col gap-3">
        <div className="w-full p-4 shadow-md  text-blue-600 rounded-md flex flex-col">
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

        <div className="w-full p-4 shadow-md  text-blue-600 rounded-md">
          <p className="flex flex-row items-center gap-3">
            <FaRegCircle className="text-red-600" />
            <span>Total Opens ({totalOpen.length})</span>
          </p>
        </div>

        <div className="w-full p-4 shadow-md text-blue-600 rounded-md">
          <p className="flex flex-row items-center gap-3">
            <PiCircleHalfFill className="text-yellow-400" />
            <span>Total In Process ({totalProcess.length})</span>
          </p>
        </div>

        <div className="w-full p-4 shadow-md  text-blue-600 rounded-md">
          <p className="flex flex-row items-center gap-3">
            <GoCheckCircleFill className="text-green-400" />
            <span>Total Completed ({totalComplete.length})</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashBoardView;
