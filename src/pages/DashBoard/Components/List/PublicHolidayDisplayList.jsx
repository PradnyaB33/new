import { Info } from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { format } from "date-fns";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { Skeleton } from "@mui/material";
import { UseContext } from "../../../../State/UseState/UseContext";

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
    <div>
      <h1 className="text-xl md:text-2xl font-semibold text-[#67748E] mb-4">
        Upcoming Public Holiday
      </h1>
      <article>
        {isLoading ? (
          // Skeleton Loader while data is loading
          <div className="w-full h-[180px] bg-white border-[0.5px] border-[#E5E7EB] rounded-lg shadow-sm p-4">
            {[...Array(3)].map((_, index) => (
              <div key={index}>
                <Skeleton variant="text" width="70%" height={30} />
                <Skeleton variant="text" width="50%" height={20} />
                {index < 2 && <Divider variant="fullWidth" orientation="horizontal" />}
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-auto w-full h-[180px] bg-white border-[0.5px] border-[#E5E7EB] rounded-lg shadow-sm ">
            {upcomingHoliday?.data?.upcomingHolidays?.length <= 0 ? (
              <div className="px-5 py-2  ">
                <div className="space-x-2 items-center text-red-600  flex">
                  <Info className="text-xl text-red-600" />
                  <h1 className="text-lg font-bold">No Vacations</h1>
                </div>
              </div>
            ) : (
              upcomingHoliday?.data?.upcomingHolidays.map((item, id) => (
                <div key={id}>
                  <div className="p-4">
                    <h1 className="text-lg">{item.name}</h1>
                    <p className="text-md">{format(new Date(item.date), "PP")}</p>
                  </div>
                  <Divider variant="fullWidth" orientation="horizontal" />
                </div>
              ))
            )}
          </div>
        )}
      </article>
    </div>
  );
};

export default PublicHolidayDisplayList;
