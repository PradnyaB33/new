import Skeleton from "@mui/material/Skeleton";
import React from "react";

const AdminCardSke = () => {
  return (
    <div className="hover:scale-105 !px-0 !py-0 cursor-pointer h-max transition-all min-w-[320px] w-[25%] shadow-md  bg-white !rounded-xl ">
      <div className="space-y-2 !px-6 !py-2  flex justify-between">
        <div>
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={120} height={30} />
        </div>
        <Skeleton
          variant="rounded"
          width={46}
          height={46}
          className={`!bg-gray-300 text-4xl  shadow-sm`}
        />
      </div>
    </div>
  );
};

export default AdminCardSke;
