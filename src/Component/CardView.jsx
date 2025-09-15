import React, { useContext, useEffect, useState } from 'react'
import { TicketContext } from './ContextApi'
import { Avatar, Dropdown, Input, Space, Tag, Tooltip, Select, message } from 'antd';
import { FaUser } from "react-icons/fa";
import { MdDescription } from "react-icons/md";
import { useNavigate } from 'react-router';
import { DownOutlined } from '@ant-design/icons';
import { GoInbox } from "react-icons/go";

const { Option } = Select;

function CardView() {
  const [messageApi, contextHolder] = message.useMessage();
  const { getAllTickets, datas, getPriorityColor, getStatusIcon, updateStatus } = useContext(TicketContext);

  const [filterData, setFiltedData] = useState([]);
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const allStatuses = ["Open", "Completed", "Processing"];
  const navigate = useNavigate();

  useEffect(() => {
    getAllTickets();
  }, []);

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

  function handelChangeStatus(e, id) {
    updateStatus(id, e.key);
  }

  return (
    <div className="w-[100%] h-[80vh] flex flex-col gap-4">
      {contextHolder}
      <div className="w-[100%] p-4 shadow-md border border-gray-300 rounded flex flex-row justify-between gap-2 flex-wrap">
        <Input
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-[150px]"
          allowClear
        />

        <Select
          placeholder="Select Priority"
          allowClear
          onChange={(value) => setPriority(value || "")}
          className="md:w-[100px]"
        >
          <Option value="High">High</Option>
          <Option value="Medium">Medium</Option>
          <Option value="Low">Low</Option>
        </Select>

        <Select
          placeholder="Select Status"
          allowClear
          onChange={(value) => setStatus(value || "")}
          className="md:w-[100px]"
        >
          <Option value="Open">Open</Option>
          <Option value="Processing">Processing</Option>
          <Option value="Completed">Completed</Option>
        </Select>
      </div>

      <div className="w-[100%] overflow-y-auto flex flex-col gap-3 max-h-[75vh]">
        {filterData.length < 1 && (
          <div className="flex justify-center items-center h-[50vh] flex-col gap-4">
            <p className="text-7xl text-gray-600">
              <GoInbox />
            </p>
            <p className="font-semibold text-gray-600">No Data</p>
          </div>
        )}

        {filterData?.map((data, idx) => {
          const items = [
            {
              key: '1',
              label: (
                <p className="flex flex-row gap-2 text-xs font-semibold">
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
              .filter((st) => st !== data.status)
              .map((st) => ({
                key: `${st}`,
                label: (
                  <p className="flex flex-row gap-2 text-xs font-semibold">
                    {getStatusIcon(st)}
                    {st}
                  </p>
                ),
                value: st,
              })),
          ];

          return (
            <div
              className="w-[100%] p-4 shadow-md flex flex-row border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 duration-200"
              key={idx}
              onDoubleClick={() => navigate(`/ticket/${data.id}`)}
            >
              <div className="w-[100%] flex flex-col gap-3">
                <div className="flex flex-row gap-2 justify-between items-center">
                  <div className="flex flex-row gap-2 justify-between items-center">
                    <p className="text-xs font-semibold flex flex-row gap-1 items-center">
                      <FaUser />
                      {data.name}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`${getPriorityColor(
                        data.priority
                      )} px-2 py-1 rounded-md text-xs`}
                    >
                      {data.priority}
                    </p>
                  </div>
                </div>

                <div className="w-[100%] flex flex-row justify-between">
                  <div>
                    <Tooltip title={data.id}>
                      <Tag
                        className="cursor-pointer"
                        onClick={async () => {
                          await navigator.clipboard.writeText(data.id);
                          messageApi.success("ID Copied");
                        }}
                      >
                        #{data.id.substring(0, 6)}
                      </Tag>
                    </Tooltip>
                    <p className="flex flex-row gap-1 py-3 text-xs">
                      <MdDescription />
                      {data.desc.length > 10
                        ? data.desc.substring(0, 10) + "..."
                        : data.desc}
                    </p>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <p className="flex flex-row gap-2 text-xs items-center">
                      {getStatusIcon(data.status)}
                      {data.status}
                    </p>
                    <Dropdown
                      menu={{ items, onClick: (e) => handelChangeStatus(e, data.id) }}
                    >
                      <a
                        onClick={(e) => e.preventDefault()}
                        style={{ cursor: "pointer" }}
                      >
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
          );
        })}
      </div>
    </div>
  );
}

export default CardView;
