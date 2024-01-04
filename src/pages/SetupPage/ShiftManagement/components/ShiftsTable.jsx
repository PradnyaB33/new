import { Help, MoreHoriz, MoreVert } from "@mui/icons-material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { IconButton, Popover, Skeleton, Tooltip } from "@mui/material";
import Divider from "@mui/material/Divider";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { TestContext } from "../../../../State/Function/Main";
import { UseContext } from "../../../../State/UseState/UseContext";
import SummaryTable from "./SummaryTable";

const ShiftTable = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const authToken = cookies["aeigs"];
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
      <article className="w-[350px] h-max py-6 bg-white shadow-xl rounded-lg ">
        <h1 className="text-xl px-8 font-semibold flex items-center gap-3 ">
          <AccountBalanceIcon className="text-gray-400" /> Balance for Shifts
          <Tooltip title="Click to get Summary for current month">
            <IconButton
            // aria-describedby={Popid}
            // onClick={(event) => handlePopClick(event, item)}
            >
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
    <article className="w-[350px] h-max bg-white shadow-lg rounded-lg ">
      <h1 className="text-xl py-6 px-6 font-semibold flex items-center gap-3 justify-between">
        <AccountBalanceIcon className="text-gray-400" />
        <div>Balance for Shifts</div>
        <Tooltip title="Click to get Summary for current month">
          <IconButton onClick={handlePopoverOpen}>
            <MoreVert className="!text-[19px] text-black" />
          </IconButton>
        </Tooltip>
      </h1>
      <div className="w-full">
        {data?.leaveTypes?.map((item, index) => {
          return (
            <div key={index} style={{ background: item.color }}>
              <div className="flex justify-between items-center py-6 px-6">
                <h1 className="text-md text-gray-200 font-bold tracking-wide">
                  {item.leaveName}
                </h1>
                <h1 className="text-lg tracking-wide font-bold text-gray-200">
                  {item.count}
                </h1>
              </div>
            </div>
          );
        })}
        <div className="flex justify-between items-center py-6 px-6">
          <h1 className="text-md text-gray-200 font-bold tracking-wide">
            Total Leave Balance
          </h1>
          <h1 className="text-lg tracking-wide text-gray-400">
            {data.totalCoutn}
          </h1>
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

export default ShiftTable;