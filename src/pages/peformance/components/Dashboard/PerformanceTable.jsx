import { Avatar, Pagination, Stack, Tooltip } from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import TabelSkeleton from "../GoalTable/Skelton/TabelSkeleton";
import RightSideTable from "./RightSideTable";

const PerformanceTable = ({ tableData, isLoading, performance }) => {
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
    <>
      {isLoading ? (
        <section className="py-0 my-4 ">
          <TabelSkeleton />
        </section>
      ) : (
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
                    <th
                      scope="col"
                      className="!text-left px-2 w-max py-3 text-sm "
                    >
                      Sr. No
                    </th>

                    <th scope="col" className="py-3 text-sm px-2 ">
                      Assignee
                    </th>
                    {/* <th scope="col" className="py-3 text-sm px-2 ">
                  Average Rating
                </th> */}

                    <th scope="col" className="py-3 text-sm px-2 ml-auto ">
                      Goal Completed
                    </th>

                    {/* <th scope="col" className=" py-3 text-sm px-2 ">
                      Goal Overdue
                    </th> */}
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
                              {goal?.empId?.first_name} {goal?.empId?.last_name}
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
                          className="text-sm cursor-pointer truncate text-left ml-auto   px-2"
                        >
                          <p className="space-x-3 truncate">
                            {" "}
                            {
                              goal?.goals?.filter(
                                (goal) => goal.goalStatus === "Goal Completed"
                              ).length
                            }{" "}
                            / {goal?.goals?.length}
                          </p>
                        </td>
                      </Tooltip>
                      {/* <Tooltip title="Click to get employee performance details">
                        <td
                          // onClick={() => handleOpen(goal._id)}
                          className="text-sm  cursor-pointer truncate text-left   px-2"
                        >
                          <p className="space-x-3 truncate">
                            {goal?.overdueGoals}
                          </p>
                        </td>
                      </Tooltip> */}
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
                    Showing {page} to{" "}
                    {Math.ceil(tableData?.length / itemsPerPage)} of{" "}
                    {tableData?.length} entries
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

            <RightSideTable isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </section>
      )}
    </>
  );
};

export default PerformanceTable;
