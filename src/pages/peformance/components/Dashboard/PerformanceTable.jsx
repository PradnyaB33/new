import { Close } from "@mui/icons-material";
import { Avatar, IconButton, Pagination, Stack, Tooltip } from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";

const PerformanceTable = ({ tableData, performance }) => {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(null);
  console.log(`🚀 ~ isOpen:`, isOpen);
  const itemsPerPage = 10;

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
    },
  }));

  const handleChange = (event, value) => {
    setPage(value);
  };

  const paginatedData = tableData?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <section className="py-0 my-4 ">
      <div className=" bg-white flex gap-2 items-start rounded-md border">
        <div
          className={`overflow-auto   overflow-y-hidden ${
            !!isOpen ? "w-[50%] " : "w-full"
          }`}
        >
          <table
            className={`  table-auto  border border-collapse min-w-full  text-left  !text-sm font-light `}
          >
            <thead className="border-b bg-gray-100 font-bold">
              <tr className="!font-semibold ">
                <th scope="col" className="!text-left px-2 w-max py-3 text-sm ">
                  Sr. No
                </th>

                <th scope="col" className="py-3 text-sm px-2 ">
                  Assignee
                </th>
                {/* <th scope="col" className="py-3 text-sm px-2 ">
                  Average Rating
                </th> */}

                <th scope="col" className="py-3 text-sm px-2 ">
                  Goal Completed
                </th>

                <th scope="col" className=" py-3 text-sm px-2 ">
                  Goal Overdue
                </th>
              </tr>
            </thead>
            <tbody>
              {/* {orgGoals?.goals?.map((goal, id) => ( */}
              {paginatedData?.map((goal, id) => (
                <tr
                  //   key={id}
                  className={` hover:bg-gray-50 !font-medium  w-max border-b `}
                >
                  <Tooltip title="Click to get employee performance details">
                    <td
                      onClick={() => setIsOpen(goal)}
                      className="!text-left  cursor-pointer py-4    px-2 text-sm w-[70px]  "
                    >
                      {id + 1}
                    </td>
                  </Tooltip>

                  <Tooltip title="Click to get employee performance details">
                    <td
                      onClick={() => setIsOpen(goal)}
                      className="text-sm cursor-pointer  text-left   px-2"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar src={goal?.empId?.user_logo_url} />

                        <p className="text-sm">
                          {goal?.empId.first_name} {goal?.empId.last_name}
                        </p>
                      </div>
                    </td>
                  </Tooltip>

                  {/* <td
                  onClick={() => setIsOpen(goal)}
                    className="text-sm cursor-pointer truncate text-left   px-2"
                  >
                    <p className="space-x-3 truncate">Best</p>
                  </td> */}

                  <Tooltip title="Click to get employee performance details">
                    <td
                      onClick={() => setIsOpen(goal)}
                      className="text-sm cursor-pointer truncate text-left   px-2"
                    >
                      <p className="space-x-3 truncate">
                        {" "}
                        {goal?.completedGoals} / {goal?.totalGoals}
                      </p>
                    </td>
                  </Tooltip>
                  <Tooltip title="Click to get employee performance details">
                    <td
                      // onClick={() => handleOpen(goal._id)}
                      className="text-sm cursor-pointer truncate text-left   px-2"
                    >
                      <p className="space-x-3 truncate">{goal?.overdueGoals}</p>
                    </td>
                  </Tooltip>
                </tr>
              ))}
            </tbody>
          </table>
          <Stack
            direction={"row"}
            className="border-[.5px] border-gray-200 border-t-0 px-4 py-2 h-full  items-center w-full justify-between "
          >
            <div>
              <h1>
                Showing {page} to {Math.ceil(tableData?.length / itemsPerPage)}{" "}
                of {tableData?.length} entries
              </h1>
            </div>
            <Pagination
              count={Math.ceil(tableData?.length / itemsPerPage)}
              page={page}
              color="primary"
              shape="rounded"
              onChange={(event, value) => setPage(value)}
            />
          </Stack>
        </div>

        {/* Right Side */}
        <div
          className={` ${
            !!isOpen
              ? "rounded-md visible w-[50%]  max-h-[76vh] overflow-y-hidden h-max  "
              : "hidden"
          }`}
        >
          <div className="p-4 flex justify-between gap-4 w-full">
            <div className="flex  gap-4">
              <Avatar src={isOpen?.empId?.user_logo_url} />
              <h1 className="text-2xl font-semibold">
                {isOpen?.empId?.first_name} {isOpen?.empId?.last_name}
              </h1>
            </div>
            <IconButton onClick={() => setIsOpen(null)}>
              <Close />
            </IconButton>
          </div>

          {/* Task Completed bar */}
          <div className="px-4 ">
            <div className="space-y-3">
              <div className="flex justify-between">
                <h1 className="font-semibold text-[#67748E] ">Task status</h1>
                <h1 className="font-semibold text-[#67748E] ">
                  {Math.round(
                    (isOpen?.completedGoals / isOpen?.totalGoals) * 100
                  )}{" "}
                  % Done
                </h1>
              </div>
              <BorderLinearProgress
                variant="determinate"
                value={(isOpen?.completedGoals / isOpen?.totalGoals) * 100}
              />
            </div>
          </div>

          {/* Table of all task for employee */}
          <div className="p-4 ">
            <table
              className={`  table-auto  border border-collapse min-w-full  text-left  !text-sm font-light `}
            >
              <thead className="border-b bg-gray-100 font-bold">
                <tr className="!font-semibold ">
                  <th
                    scope="col"
                    className="!text-left px-2 w-max py-2 text-sm "
                  >
                    Sr. No
                  </th>

                  <th scope="col" className="py-2 text-sm px-2 ">
                    Goal Name
                  </th>
                  <th scope="col" className="py-2 text-sm px-2 ">
                    Goal Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {isOpen?.goals?.map((goal, id) => (
                  <tr
                    className={` hover:bg-gray-50 !font-medium  w-max border-b `}
                  >
                    <td className="!text-left  cursor-pointer py-3    px-2 text-sm w-[70px]  ">
                      {id + 1}
                    </td>
                    <td
                      // onClick={() => handleOpen(goal._id)}
                      className="text-sm cursor-pointer truncate text-left   px-2"
                    >
                      <p className="space-x-3 truncate">{goal.goal}</p>
                    </td>
                    <td
                      // onClick={() => handleOpen(goal._id)}
                      className="text-sm cursor-pointer truncate text-left   px-2"
                    >
                      <p className="space-x-3 truncate">
                        {performance?.stage ===
                          "Monitoring stage/Feedback collection stage" &&
                        goal?.isGoalCompleted
                          ? "Monitoring Completed"
                          : "Pending"}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceTable;
