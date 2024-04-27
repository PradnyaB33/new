import { Stack } from "@mui/material";
import React, { useState } from "react";

const ReviewTab = () => {
  const rowsPerPage = 10; // Define the number of rows per page
  const [page, setPage] = useState(1);
  return (
    <div className=" bg-white rounded-md ">
      <div className="flex items-center justify-between ">
        <div className="w-full p-4  ">
          <h1 className="text-2xl ">Review & Ratings</h1>
          <p>Review and rate your employee</p>
        </div>
      </div>

      <div className="p-4  rounded-md">
        <div className="bg-white w-full overflow-x-auto">
          <div className="overflow-auto ">
            <table className="w-full table-auto  border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
              <thead className="border-b bg-gray-100 font-bold">
                <tr className="!font-semibold ">
                  <th
                    scope="col"
                    className="!text-left px-2 w-max py-3 text-sm "
                  >
                    Sr. No
                  </th>
                  <th scope="col" className="py-3 text-sm px-2 ">
                    Employee Name
                  </th>

                  <th scope="col" className="py-3 text-sm px-2 ">
                    Employee Ratings
                  </th>

                  <th scope="col" className=" py-3 text-sm px-2 ">
                    Actions
                  </th>
                </tr>
              </thead>
            </table>
            <Stack
              direction={"row"}
              className="border-[.5px] border-gray-200 border-t-0 px-4 py-2 h-full  items-center w-full justify-between "
            >
              <div>
                <h1>Showing {page} to 1 of 20 entries</h1>
              </div>
              {/* <Pagination
              count={page}
              page={page}
              color="primary"
              shape="rounded"
              onChange={(event, value) => setPage(value)}
            /> */}
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewTab;
