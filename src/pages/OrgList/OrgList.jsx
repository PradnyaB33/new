import { Avatar, Skeleton } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { IoBusiness } from "react-icons/io5";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import Organisation from "../Home/components/Organisation";

const OrgList = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];

  const { data, isLoading } = useQuery(["orgData"], async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/organization/get`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  });

  return (
    <div className="bg-gray-50 h-screen">
      <div className="p-10  !pb-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center justify-center gap-2 ">
              <Avatar
                className="!bg-blue-500  h-[100px] text-4xl p-1 shadow-sm"
                variant="rounded"
                sx={{ width: "46", height: "46" }}
              >
                <IoBusiness />
              </Avatar>
              {/* <SvgIcon className="text-blue-500 bg-white h-[100px] text-4xl p-1 shadow-sm"></SvgIcon> */}
              <h1 className="!text-[1.7rem] font-semibold text-black">
                List of Organizations
              </h1>
            </div>
            <p className="text-gray-600">Select and manage your oragnization</p>
          </div>

          <Link to={"/add-organisation"}>
            <button className=" flex  group justify-center gap-2 items-center rounded-md px-6 py-[.3rem] text-md  text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500">
              Add Organization
            </button>
          </Link>
        </div>
      </div>

      {!isLoading && (
        <div className="flex flex-wrap  gap-x-6 gap-y-2 px-10">
          {data?.organizations?.length <= 0 ? (
            <div
              className={`border-b-[3px]  block min-w-[21rem] rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-200`}
            >
              <div className="border-b-2 flex items-center justify-between border-[#0000002d] px-6 py-3 text-black">
                <Avatar variant="rounded" sx={{ height: 35, width: 35 }} />
              </div>
              <div className="p-6 pt-6  pb-4">
                <Skeleton
                  animation="wave"
                  height={35}
                  width="60%"
                  style={{ marginBottom: 6 }}
                />
                <Skeleton animation="wave" height={30} width="80%" />
              </div>
              <div className="p-6 py-4 flex gap-4">
                <Skeleton variant="rounded" height={30} width="30%" />
                <Skeleton variant="rounded" height={30} width="50%" />
              </div>
            </div>
          ) : (
            data?.organizations?.map((item, index) => (
              <div className="h-max py-4" key={index}>
                <Organisation item={item} id={index} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OrgList;
