import { BeachAccessOutlined } from "@mui/icons-material";
import { Avatar, Card } from "@mui/material";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { format } from "date-fns";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";

const EmployeeLeaveRequest = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];

  const GetLastLeaves = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/get-3-leaves-employee`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data.leaves;
  };

  const { data: previousLeaves } = useQuery(
    ["upcomingLeaves", authToken],
    GetLastLeaves
  );

  const {
    data: EmployeeLeavesRequest,
    isLoading,
    isError,
    error,
  } = useQuery("employee-leave", async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/leave/get`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data.leaveRequests;
    } catch (err) {
      throw err;
    }
  });

  console.log(EmployeeLeavesRequest);

  return (
    <Card elevation={3}>
      <div className="bg-white rounded-md  w-full shadow-md">
        <div className="flex w-full px-4 items-center justify-between">
          <div className="flex items-center gap-2 py-2  ">
            <Avatar
              variant="rounded"
              className="!bg-sky-400 p-1 h-[30px] rounded-full"
            >
              <BeachAccessOutlined />
            </Avatar>
            <h1 className="text-xl font-semibold py-3">
              Employee Leave Request
            </h1>
          </div>
          {/* <button className=" flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500">
            View All
          </button> */}
        </div>
        <Divider variant="fullWidth" orientation="horizontal" />

        {EmployeeLeavesRequest?.slice(0, 3)?.map((item, id) => (
          <div className="p-4 " key={id}>
            <div key={id} className="gap-3   flex">
              <Avatar variant="circle" />
              <div>
                <div className="flex items-center gap-6">
                  <h1 className="text-md font-semibold">
                    {item?.employeeId?.first_name} {item?.employeeId?.last_name}
                  </h1>
                  <div className="text-sm flex items-center gap-2 border-[.5px] text-[red] border-[red] rounded-full px-4">
                    <div className="bg-[red]  h-0 p-1 rounded-full"></div>
                    <p>{item.status}</p>
                  </div>
                </div>
                <span className={`text-sm  text-[${item.color}]`}>
                  {item.title}
                </span>{" "}
                <p className="text-md">
                  {format(new Date(item?.start), "PP")} -{" "}
                  {format(new Date(item?.end), "PP")}{" "}
                </p>
                {/* <div className="flex gap-2 mt-2 ">
                  <button className=" flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-sm font-semibold text-white bg-red-500 hover:bg-red-500 focus-visible:outline-red-500">
                    Reject
                  </button>
                  <button className=" flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-sm font-semibold text-white bg-green-500 hover:bg-green-500 focus-visible:outline-green-500">
                    Accept
                  </button> */}
                {/* </div> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EmployeeLeaveRequest;
