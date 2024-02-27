import { Help, MoreHoriz, MoreVert } from "@mui/icons-material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { IconButton, Popover, Skeleton, Tooltip } from "@mui/material";
import Divider from "@mui/material/Divider";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { TestContext } from "../../../../State/Function/Main";
import { UseContext } from "../../../../State/UseState/UseContext";
import SummaryTable from "./SummaryTable";

const ShiftsTable = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [shifts, setShifts] = useState([]);
  const authToken = cookies["aegis"];
  const [pending, setPending] = useState([])
  const [approved, setApproved] = useState([])
  const [rejected, setRejected] = useState([])

  const getSHifts = async () => {
    try {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/shiftApply/get`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setShifts(resp.data.requests);
    } catch (error) {}
  };

  useEffect(() => {
    getSHifts();
  }, [shifts]);

  useEffect(() =>{
   const pendingArr = shifts.filter((item, idx) =>{
      return item.status === "Pending"
    })

   const approvedArr = shifts.filter((item, idx) =>{
      return item.status === "Approved"
    })
    const rejectedArr = shifts.filter((item, idx) =>{
      return item.status === "Rejected"
    })
    setPending(pendingArr)
    setApproved(approvedArr)
    setRejected(rejectedArr)
  
  },[shifts])


  const { data, isLoading, isError, error } = useQuery(
    "employee-leave-table",
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/leave/getEmployeeLeaveTable`,
        {
          headers: { Authorization: authToken },
        }
      );

      return response.data;
    }
  );

  if (isError) {
    handleAlert(
      true,
      "warning",
      error?.response?.data?.message || "Sorry Server is under maintainance"
    );
    return (
      <article className="w-[350px] h-max py-6 bg-white border-red-700 border shadow-xl rounded-lg ">
        <h1 className="text-xl px-8 font-semibold flex items-center gap-3 ">
          <Help className="text-red-700" /> Failed to load data
        </h1>
        <Divider
          className="pt-6 !border-red-700"
          variant="fullWidth"
          orientation="horizontal"
        />
        <div className="w-full px-6 mt-4 space-y-4 ">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="mt-6">
              <Skeleton variant="text" className="w-[15%] h-6 text-lg " />
              <Skeleton
                variant="text"
                className="w-[25%] !h-8 !mb-4 text-md "
              />
              <Divider
                variant="fullWidth"
                className="!border-red-700 !border"
                orientation="horizontal"
              />
            </div>
          ))}
        </div>
      </article>
    );
  }
  if (isLoading) {
    return (
      <article className="w-full md:w-[350px] h-max py-6 bg-white shadow-xl rounded-lg ">
        <h1 className="text-xl px-8 font-semibold flex items-center gap-3 ">
          <AccountBalanceIcon className="text-gray-400" /> Balance Leaves
          <Tooltip title="Click to get Summary for current month">
            <IconButton>
              <MoreHoriz className="!text-[19px] text-black" />
            </IconButton>
          </Tooltip>
        </h1>
        <Divider
          className="pt-6"
          variant="fullWidth"
          orientation="horizontal"
        />
        <div className="w-full px-6 mt-4 space-y-4 ">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="mt-6">
              <Skeleton variant="text" className="w-[15%] h-6 text-lg " />
              <Skeleton
                variant="text"
                className="w-[25%] !h-8 !mb-4 text-md "
              />
              <Divider variant="fullWidth" orientation="horizontal" />
            </div>
          ))}
        </div>
      </article>
    );
  }

  if (isError) {
    return <p>Error loading data</p>;
  }
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  return (
    <article className="md:w-[350px] w-full h-max bg-white shadow-lg rounded-lg ">
      <h1 className="text-xl py-6 px-6 font-semibold flex items-center gap-3 justify-between">
        <AccountBalanceIcon className="text-gray-400" />
        <div>Summary of shifts</div>
        <Tooltip title="Click to get Summary for current month">
          <IconButton onClick={handlePopoverOpen}>
            <MoreVert className="!text-[19px] text-black" />
          </IconButton>
        </Tooltip>
      </h1>
      <div className="w-full">
        <div className="bg-[#7f567b]">
          <div className="flex justify-between items-center py-6 px-6">
            <h1 className="text-md text-gray-200 font-bold tracking-wide">
              Applied Shifts
            </h1>
            <h1 className="text-lg tracking-wide font-bold text-gray-200">{shifts.length}</h1>
          </div>
        </div>
        <div className="bg-[#7f567b]">
          <div className="flex justify-between items-center py-6 px-6">
            <h1 className="text-md text-gray-200 font-bold tracking-wide">
              Approved Shifts
            </h1>
            <h1 className="text-lg tracking-wide font-bold text-gray-200">{approved.length}</h1>
          </div>
        </div>
        <div className="bg-[#7f567b]">
          <div className="flex justify-between items-center py-6 px-6">
            <h1 className="text-md text-gray-200 font-bold tracking-wide">
              Pending Shifts
            </h1>
            <h1 className="text-lg tracking-wide font-bold text-gray-200">{pending.length}</h1>
          </div>
        </div>
        <div className="bg-[#7f567b]">
          <div className="flex justify-between items-center py-6 px-6">
            <h1 className="text-md text-gray-200 font-bold tracking-wide">
              Rejected Shifts
            </h1>
            <h1 className="text-lg tracking-wide font-bold text-gray-200">{rejected.length}</h1>
          </div>
        </div>
      </div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <SummaryTable />
      </Popover>
    </article>
  );
};

export default ShiftsTable;
