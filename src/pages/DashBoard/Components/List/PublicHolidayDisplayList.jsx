import { BeachAccessOutlined } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import Divider from "@mui/material/Divider";
import React from "react";

const PublicHolidayDisplayList = () => {
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
            <h1 className="text-xl py-3">Upcoming Public holiday</h1>
          </div>
          <button className=" flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500">
            View All
          </button>
        </div>
        <Divider variant="fullWidth" orientation="horizontal" />

        {Array.from({ length: 3 }).map((i, id) => (
          <>
            <div key={id} className="p-4">
              <h1 className="text-md font-semibold">Diwali</h1>
              <p className="text-lg">25 sept 2023</p>
            </div>
            <Divider variant="fullWidth" orientation="horizontal" />
          </>
        ))}
      </div>
    </article>
  );
};

export default PublicHolidayDisplayList;
