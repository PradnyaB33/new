import { Avatar } from "@mui/material";
import React from "react";

const PerformanceTable = () => {
  return (
    <section className="py-0 my-4 ">
      <div className=" bg-white rounded-md ">
        <div className="overflow-auto ">
          <table className="w-full table-auto  border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
            <thead className="border-b bg-gray-100 font-bold">
              <tr className="!font-semibold ">
                <th scope="col" className="!text-left px-2 w-max py-3 text-sm ">
                  Sr. No
                </th>

                <th scope="col" className="py-3 text-sm px-2 ">
                  Assignee
                </th>
                <th scope="col" className="py-3 text-sm px-2 ">
                  Average Rating
                </th>

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
              <tr
                //   key={id}
                className={` hover:bg-gray-50 !font-medium  w-max border-b `}
              >
                <td
                  // onClick={() => handleOpen(goal._id)}
                  className="!text-left  cursor-pointer py-4    px-2 text-sm w-[70px]  "
                >
                  1
                </td>

                <td
                  // onClick={() => handleOpen(goal._id)}
                  className="text-sm cursor-pointer  text-left   px-2"
                >
                  <div className="flex items-center gap-4">
                    <Avatar />

                    <p className="text-sm">test name</p>
                  </div>
                </td>

                <td
                  // onClick={() => handleOpen(goal._id)}
                  className="text-sm cursor-pointer truncate text-left   px-2"
                >
                  <p className="space-x-3 truncate">Best</p>
                </td>
                <td
                  // onClick={() => handleOpen(goal._id)}
                  className="text-sm cursor-pointer truncate text-left   px-2"
                >
                  <p className="space-x-3 truncate"> 1 / 10</p>
                </td>
                <td
                  // onClick={() => handleOpen(goal._id)}
                  className="text-sm cursor-pointer truncate text-left   px-2"
                >
                  <p className="space-x-3 truncate">9</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PerformanceTable;
