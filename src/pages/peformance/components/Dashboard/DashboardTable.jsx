import { Checklist } from "@mui/icons-material";
import { Avatar, Pagination } from "@mui/material";
import React from "react";
import Select from "react-select";
import TabelSkeleton from "../GoalTable/Skelton/TabelSkeleton";
import ManagerPerfromanceDashboard from "./ManagerPerfromanceDashboard";

const DashboardTable = ({ tableData, role, tableFetching, performance }) => {
  const counts = tableData?.reduce((acc, record) => {
    if (record.managerRating) {
      if (!acc[record.managerRating]) {
        acc[record.managerRating] = 0;
      }
      acc[record.managerRating]++;
    }

    return acc;
  }, {});

  console.log(counts);

  return (
    <>
      <div className="my-2 flex">
        <div className=" gap-4 ">
          {role !== "Employee" && (
            <div className={`space-y-1 min-w-[250px]  md:min-w-[15vw] `}>
              <div
                className={`flex rounded-md px-2 border-gray-200 border-[.5px] bg-white items-center`}
              >
                <Checklist className="text-gray-700 md:text-lg !text-[1em]" />
                <Select
                  aria-errormessage=""
                  placeholder={"Goal Type"}
                  isClearable
                  styles={{
                    control: (styles) => ({
                      ...styles,
                      borderWidth: "0px",
                      boxShadow: "none",
                    }),
                  }}
                  className={` bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                  components={{
                    // Option: CustomOption,
                    IndicatorSeparator: () => null,
                  }}
                  options={[
                    {
                      label: "data",
                      value: "Datat",
                    },
                  ]}
                  // onChange={(value) => {
                  //   setEmployeeGoals(value?.value);
                  // }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {tableFetching ? (
        <TabelSkeleton />
      ) : (
        <div className="flex gap-2">
          <div className="w-[70%]">
            <table className=" overflow-auto table-fixed  border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
              <thead className="border-b bg-gray-100 font-bold">
                <tr className="!font-semibold ">
                  <th
                    scope="col"
                    className="!text-left px-2 w-max py-3 text-sm "
                  >
                    Sr. No
                  </th>
                  <th scope="col" className="py-3 text-sm px-2 ">
                    Employee id
                  </th>
                  <th scope="col" className="py-3 text-sm px-2 ">
                    Employee Name
                  </th>

                  <th scope="col" className="py-3 text-sm px-2 ">
                    Goals Completed
                  </th>
                  <th scope="col" className="py-3 text-sm px-2 ">
                    Goals Overdue
                  </th>

                  <th scope="col" className="py-3 text-sm px-2 ">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData?.map((item) => (
                  <tr
                    className={` hover:bg-gray-50 !font-medium  w-max border-b `}
                  >
                    <td className="!text-left  cursor-pointer py-4    px-2 text-sm w-max  ">
                      1
                    </td>

                    <td className="w-max px-2 hover:bg-gray-50 !font-medium   border-b">
                      {item?.empId?.empId}
                    </td>
                    <td className="text-sm cursor-pointer truncate text-left   px-2">
                      <div className="flex w-max items-center gap-4">
                        <Avatar src={item?.empId?.user_logo_url} />
                        <p className="space-x-3 truncate">
                          {item?.empId?.first_name} {item?.empId?.last_name}
                        </p>
                      </div>
                    </td>
                    <td className="text-sm w-max cursor-pointer  text-left   px-2">
                      {item?.goals.reduce((i, acc) => {
                        if (acc?.goalStatus === "Completed") {
                          return i + 1;
                        }
                        return i;
                      }, 0)}{" "}
                      / {item?.goals.length}
                    </td>

                    <td className=" cursor-pointer text-left !p-0 !w-[250px]  ">
                      <p
                        className={`
                        px-2 md:w-full w-max text-sm`}
                      >
                        {item?.goals.reduce((i, acc) => {
                          const { goalStatus, endDate } = acc;
                          const today = new Date();
                          const goalEndDate = new Date(endDate);
                          if (
                            goalEndDate < today &&
                            goalStatus !== "Completed"
                          ) {
                            return i + 1;
                          }
                          return i;
                        }, 0)}
                      </p>
                    </td>

                    <td className=" cursor-pointer text-left !p-0 !w-[250px]  ">
                      <p
                        className={`
                        px-2 md:w-full w-max text-sm`}
                      >
                        {item?.managerRating ? item?.managerRating : "-"}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-[.5px] border-gray-200 border-t-0 px-4 py-2 h-max flex  items-center w-full justify-between ">
              <div>
                <h1>
                  Showing {1} to {1} of {4} entries
                </h1>
              </div>
              <Pagination
                count={1}
                page={1}
                color="primary"
                shape="rounded"
                // onChange={(event, value) => setPage(value)}
              />
            </div>
          </div>

          <div className="w-[30%]">
            <ManagerPerfromanceDashboard performance={performance} />
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardTable;
