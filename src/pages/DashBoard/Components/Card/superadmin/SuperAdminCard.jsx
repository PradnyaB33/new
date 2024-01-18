import { Avatar } from "@mui/material";
import React from "react";
import AdminCardSke from "../../Skeletons/AdminCardSke";

const SuperAdminCard = ({ title, icon: Icon, data, color, isLoading }) => {
  return (
    <>
      {isLoading ? (
        <AdminCardSke />
      ) : (
        <div className="hover:scale-105 !px-0 !py-0    h-max transition-all flex-1  md:!w-full xs:!w-[350px] shadow-md  bg-white !rounded-xl ">
          <div className="space-y-2 !px-6 !py-2  flex justify-between">
            <div>
              <h1 className="text-md text-[#67748E] ">{title}</h1>
              <h1 className="text-2xl">{data}</h1>
            </div>
            <Avatar
              className={`${color}   text-4xl  shadow-sm`}
              variant="rounded"
              sx={{ width: "46", height: "full" }}
            >
              <Icon />
            </Avatar>
          </div>
        </div>
      )}
    </>
  );
};

export default SuperAdminCard;
