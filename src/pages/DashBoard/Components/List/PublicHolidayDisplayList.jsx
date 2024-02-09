import { BeachAccessOutlined, WarningOutlined } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { format } from "date-fns";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";
import PublicSkeletonComponent from "../SkeletonComponents/PublicSkeletonComponent";

const PublicHolidayDisplayList = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const GetUpcomingHoliday = async () => {
    const data = await axios.get(
      `${process.env.REACT_APP_API}/route/holiday/getUpcomingHoliday`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return data;
  };

  const { data: upcomingHoliday, isLoading } = useQuery(
    ["upcomingHolidays", authToken],
    GetUpcomingHoliday
  );

  return (
    <article>
      {isLoading ? (
        <PublicSkeletonComponent />
      ) : (
        <div className="bg-white rounded-md  w-full shadow-md">
          <div className="flex w-full px-4 items-center justify-between">
            <div className="flex items-center gap-2 py-2  ">
              <Avatar
                variant="rounded"
                className="!bg-sky-400 p-1 h-[30px] rounded-full"
              >
                <BeachAccessOutlined />
              </Avatar>
              <h1 className="text-xl py-3">Upcoming Public Holiday</h1>
            </div>
            {/* <button className=" flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500">
            View All
          </button> */}
          </div>
          <Divider variant="fullWidth" orientation="horizontal" />

          {upcomingHoliday?.data?.upcomingHolidays?.length <= 0 ? (
            <div className="p-5 ">
              <div className="space-x-2 items-center text-red-600  flex">
                <WarningOutlined className="text-xl text-red-600" />
                <h1 className="text-xl">No vacation available</h1>
              </div>
            </div>
          ) : (
            upcomingHoliday?.data?.upcomingHolidays.map((item, id) => (
              <>
                <div key={id} className="p-4">
                  <h1 className="text-md font-semibold">{item.name}</h1>
                  <p className="text-lg">{format(new Date(item.date), "PP")}</p>
                </div>
                <Divider variant="fullWidth" orientation="horizontal" />
              </>
            ))
          )}
        </div>
      )}
    </article>
  );
};

export default PublicHolidayDisplayList;
