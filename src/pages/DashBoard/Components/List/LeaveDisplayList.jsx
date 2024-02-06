import { BeachAccessOutlined } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { format } from "date-fns";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";

const LeaveDisplayList = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

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
    <article>
      <div className="bg-white rounded-md  w-full shadow-md">
        <div className="flex w-full px-4 items-center justify-between">
          <div className="flex items-center gap-2 py-2  ">
            <Avatar
              variant="rounded"
              className="!bg-sky-400 p-1 h-[30px] rounded-full"
            >
              <BeachAccessOutlined />
            </Avatar>
            <h1 className="text-xl py-3">Last taken leaves</h1>
          </div>
          {/* <button className=" flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500">
            View All
          </button> */}
        </div>
        <Divider variant="fullWidth" orientation="horizontal" />

        {previousLeaves?.map((item, id) => (
          <>
            <div key={id} className="p-4">
              <h1 className="text-md font-semibold">{item.title}</h1>
              <p className="text-lg">
                {format(new Date(item.start), "PP")} -{" "}
                {format(new Date(item.end), "PP")}{" "}
              </p>
            </div>
            <Divider variant="fullWidth" orientation="horizontal" />
          </>
        ))}
      </div>
    </article>
  );
};

export default LeaveDisplayList;
