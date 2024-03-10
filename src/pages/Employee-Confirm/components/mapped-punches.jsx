import React from "react";
import useGetSinglePunch from "../../../hooks/QueryHook/Remote-Punch/components/hook";

const MappedPunches = ({ Id }) => {
  const { data, isLoading } = useGetSinglePunch({ Id });
  console.log(`🚀 ~ file: mapped-punches.jsx:6 ~ data:`, data);
  return (
    <>
      {" "}
      {/* {data?.punchData?.map((doc) => ( */}
      <div className="w-full h-auto bg-[#e2f1ff]">
        <div className="flex w-full items-center h-full p-5">
          <div className="mr-3">
            <div className="w-[55px] h-[55px] bg-black rounded-full"></div>
          </div>
          <div className="pl-5 flex flex-col ">
            <h1>Location: Pune Station</h1>
            <h1>Distance Travelled : 2 km</h1>
          </div>
        </div>
      </div>
      {/* // ))} */}
    </>
  );
};

export default MappedPunches;
