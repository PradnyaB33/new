import { BeachAccessOutlined, Info } from "@mui/icons-material";
import { Avatar, Card } from "@mui/material";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { format } from "date-fns";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { UseContext } from "../../../../State/UseState/UseContext";

const EmployeeLeaveRequest = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];

  // const GetLastLeaves = async () => {
  //   const { data } = await axios.get(
  //     `${process.env.REACT_APP_API}/route/leave/get-3-leaves-employee`,
  //     {
  //       headers: {
  //         Authorization: authToken,
  //       },
  //     }
  //   );
  //   return data.leaves;
  // };

  // const { data: previousLeaves } = useQuery(
  //   ["upcomingLeaves", authToken],
  //   GetLastLeaves
  // );

  const { data: EmployeeLeavesRequest } = useQuery(
    "employeeleaves",
    async () => {
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
    }
  );

  return (
    <Card elevation={3}>
      <div className="bg-white rounded-md  w-full shadow-md">
        <div className="flex w-full px-4 items-center justify-between">
          <div className="flex items-center gap-2 py-2  ">
            <Avatar
              variant="circle"
              className="!bg-sky-400 p-1 !h-[32px] !w-[32px] rounded-full"
            >
              <BeachAccessOutlined className="!text-xl" />
            </Avatar>
            <h1 className="text-[#152745] font-semibold">
              Employee Leave Request
            </h1>
          </div>
          <Link
            to={"/notification"}
            className=" flex group justify-center   gap-2 items-center rounded-md h-max px-4 py-1 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            View All
          </Link>
        </div>
        <Divider variant="fullWidth" orientation="horizontal" />
        {EmployeeLeavesRequest?.length > 0 ? (
          EmployeeLeavesRequest?.slice(0, 3)?.map((item, id) => (
            <div className="p-4 " key={id}>
              <div key={id} className="gap-3   flex">
                <Avatar variant="circle" />
                <div>
                  <div className="flex items-center gap-6">
                    <h1 className="text-md font-semibold">
                      {item?.employeeId?.first_name}{" "}
                      {item?.employeeId?.last_name}
                    </h1>
                    {/* <div className="text-sm flex items-center gap-2 border-[.5px] text-[red] border-[red] rounded-full px-4">
                      <div className="bg-[red]  h-0 p-1 rounded-full"></div>
                      <p>{item.status}</p>
                    </div> */}
                  </div>
                  <span className={`text-sm  text-[${item.color}]`}>
                    {item.title}
                  </span>{" "}
                  <p className="text-md">
                    {format(new Date(item?.start), "PP")} -{" "}
                    {format(new Date(item?.end), "PP")}{" "}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4">
            <article className="flex  items-center mb-1 text-red-500 gap-2">
              <Info className="!text-2xl" />
              <h1 className="text-xl font-semibold">No record found</h1>
            </article>
            <p>Currenlty no leave request is in pending</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EmployeeLeaveRequest;
