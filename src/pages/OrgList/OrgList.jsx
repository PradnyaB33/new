import { West } from "@mui/icons-material";
import { Avatar, Skeleton } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import useOrgList from "../../hooks/QueryHook/Orglist/hook";
import Organisation from "../Home/components/Organisation";

const OrgList = () => {
  const { data, isLoading } = useOrgList();
  console.log(data?.organizations?.map((item) => item?._id));

  return (
    <>
      <div className="bg-gray-50 h-screen">
        <header className="text-xl w-full pt-6 bg-white border-b   p-4">
          {/* <BackComponent /> */}
          <Link to={"/"}>
            <West className="mx-4 !text-xl" />
          </Link>
          Organisation list
        </header>
        <div className="px-8 mt-6 mb-4 w-full">
          <div className="flex md:justify-between items-start  gap-2  flex-col md:flex-row">
            <div>
              <h1 className="md:text-2xl tracking-tight text-xl">
                Organisations List
              </h1>
              <p>Select and Manage Your Organisation</p>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Link to={"/assingOrganizationToSelf"}>
                <button className=" flex bg-white  group justify-center gap-2 items-center rounded-sm px-6 py-2 md:text-md xs:text-sm  text-xs  text-blue-500 border border-gray-300 hover:bg-blue-500 hover:text-white focus-visible:outline-blue-500">
                  Assign Organisation
                </button>
              </Link>
              <Link to={"/add-organisation"}>
                <button className=" flex  group justify-center gap-2 items-center rounded-sm px-6 py-2 md:text-md xs:text-sm text-xs    text-white bg-blue-500 hover:bg-blue-300 focus-visible:outline-blue-500">
                  Add Organisation
                </button>
              </Link>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-wrap sm:justify-start justify-center  gap-x-6 gap-y-2 sm:px-8">
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
          </div>
        ) : (
          <div className="flex flex-wrap sm:justify-start justify-center   gap-x-6 gap-y-2 sm:px-8">
            {data?.organizations?.length <= 0 ? (
              <p>NO data</p>
            ) : (
              data?.organizations?.map((item, index) => (
                <div className="h-max max-w-96 py-4" key={index}>
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
