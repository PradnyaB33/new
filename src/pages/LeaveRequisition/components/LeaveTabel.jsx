import { Help, MoreHoriz, MoreVert } from "@mui/icons-material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { IconButton, Popover, Skeleton, Tooltip } from "@mui/material";
import Divider from "@mui/material/Divider";
import React, { useContext, useState } from "react";
import { TestContext } from "../../../State/Function/Main";
import useLeaveRequesationHook from "../../../hooks/QueryHook/Leave-Requsation/hook";
import SummaryTable from "./summaryTable";

const LeaveTable = () => {
  const { handleAlert } = useContext(TestContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const { data, isLoading, isError, error } = useLeaveRequesationHook();

  if (isError) {
    handleAlert(
      true,
      "error",
      error?.response?.data?.message || "Sorry, the server is under maintenance"
    );
    return (
      <article className="w-full md:w-[215px] h-max py-4 bg-white border border-red-500 shadow-xl rounded-lg ">
        <h1 className="text-lg px-6 font-semibold flex items-center gap-2 text-red-600">
          <Help />
          <span>Failed to load data</span>
        </h1>
        <Divider className="mt-4 mb-6 border-red-500" />
        <div className="px-6 space-y-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="space-y-2">
              <Skeleton variant="text" className="w-1/4 h-6" />
              <Skeleton variant="text" className="w-2/4 h-8" />
              <Divider className="border-red-500" />
            </div>
          ))}
        </div>
      </article>
    );
  }

  if (isLoading) {
    return (
      <article className="w-full  px-6 h-max py-6 bg-white   ">
        <div className="text-lg  font-semibold flex  text-gray-700   ">
          <div className="flex gap-2">
            <AccountBalanceIcon />
            <h1 className="text-gray-500 tracking-tight">Balance Leaves</h1>
          </div>
          <Tooltip title="Click to get Summary for current month">
            <IconButton className="">
              <MoreHoriz className="text-black" />
            </IconButton>
          </Tooltip>
        </div>
        <Divider className="mt-4 mb-6" />
        <div className="px-6 space-y-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="space-y-2">
              <Skeleton variant="text" className="w-1/4 h-6" />
              <Skeleton variant="text" className="w-2/4 h-8" />
              <Divider />
            </div>
          ))}
        </div>
      </article>
    );
  }

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <article className="w-full  h-max bg-white">
      <h1 className="text-lg p-1 pl-4 pr-0 font-semibold flex items-center gap-2 justify-between bg-white ">
        <div className="gap-2 flex">
          <AccountBalanceIcon className="text-gray-600" />
          <h1 className=" text-gray-600 font-semibold">Balance Leaves</h1>
        </div>
        <Tooltip title="Click to get Summary for current month">
          <IconButton
            onClick={handlePopoverOpen}
            className="transition-transform transform hover:scale-110"
          >
            <MoreVert className="text-black" />
          </IconButton>
        </Tooltip>
      </h1>

      <div className="mt-2 px-4">
        {data?.leaveTypes?.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center  py-2 px-0 rounded-lg mb-2  "
          >
            <div className="gap-2 flex">
              <span
                style={{ backgroundColor: item.color }}
                className="h-8 w-8 rounded-full"
              ></span>

              <div style={{ width: "100px" }}>
                <h2 className="text-md font-medium text-gray-800">
                  {item.leaveName}
                </h2>
              </div>
            </div>
            <h2 className="text-md font-semibold text-gray-900">
              {item.count}
            </h2>
          </div>
        ))}
        <div className="flex justify-between items-center py-2 px-0 border-t border-gray-300">
          <h2 className="text-md font-medium text-gray-800">
            Total Leave Balance
          </h2>
          <h2 className="text-md font-semibold text-gray-900">
            {data.totalCoutn}
          </h2>
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
        className="transition-transform transform scale-95"
      >
        <SummaryTable />
      </Popover>
    </article>
  );
};

export default LeaveTable;
