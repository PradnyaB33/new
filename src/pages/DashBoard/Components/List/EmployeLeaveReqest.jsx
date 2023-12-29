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

        {[1, 2, 3]?.map((item, id) => (
          <div className="p-4 " key={id}>
            <div key={id} className="gap-3   flex">
              <Avatar variant="circle" />
              <div>
                <h1 className="text-md font-semibold">Employee one</h1>
                <p className="text-lg">
                  {format(new Date(), "PP")} - {format(new Date(), "PP")}{" "}
                </p>
                <div className="flex gap-2 mt-2 ">
                  <button className=" flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-sm font-semibold text-white bg-red-500 hover:bg-red-500 focus-visible:outline-red-500">
                    Reject
                  </button>
                  <button className=" flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-sm font-semibold text-white bg-green-500 hover:bg-green-500 focus-visible:outline-green-500">
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EmployeeLeaveRequest;
