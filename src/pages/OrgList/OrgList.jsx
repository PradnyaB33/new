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
  const authToken = cookies["aegis"];

  const { data, isLoading } = useQuery("orglist", async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/get`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Rethrow the error to be caught by React Query
    }
  });

  return (
    <>
      <div className="bg-gray-50 h-screen">
        <div className="md:p-10  sm:p-4 p-1 py-4  !pb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar
                className="!bg-blue-500 !h-[40px] md:h-[100] text-xl md:text-4xl p-1 shadow-sm"
                variant="rounded"
              >
                <IoBusiness />
              </Avatar>
              <div>
                <h1 className="md:text-2xl text-xl font-semibold">
                  Organisations
                </h1>
                <p className="md:text-lg text-sm ">
                  Select and Manage Your Oragnisation
                </p>
              </div>
            </div>

            <Link to={"/add-organisation"}>
              <button className=" flex  group justify-center gap-2 items-center rounded-md md:px-6 md:py-[.3rem] text-xs p-2  md:text-sm text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500">
                Add Organisation
              </button>
            </Link>
          </div>
        </div>

        {!isLoading && (
          <div className="flex flex-wrap sm:justify-start justify-center  gap-x-6 gap-y-2 sm:px-10">
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
    </>
  );
};

export default OrgList;
