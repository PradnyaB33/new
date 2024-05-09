import { Avatar } from "@mui/material";
import React from "react";
import AdminCardSke from "../../Skeletons/AdminCardSke";

const SuperAdminCard = ({ title, icon: Icon, data, color, isLoading }) => {
  return (
    <>
      {isLoading ? (
        <AdminCardSke />
      ) : (
        <div className="hover:scale-105 !px-0 !py-0  h-max transition-all w-full flex-1      shadow-md  bg-white !rounded-xl ">
          <div className="space-y-2 w-full !px-6 !py-2  flex justify-between">
            <div className="w-[50%]">
              <h1 className="md:text-md text-sm font-bold text-[#67748E]  ">
                {title}
              </h1>
              <h1 className="md:text-2xl text-xl">{data}</h1>
            </div>
            <Avatar
              className={`${color} md:!text-4xl md:!w-[46px] !w-[32px]  !text-2xl  shadow-sm`}
              variant="rounded"
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
