import { West } from "@mui/icons-material";
import React from "react";
import { Link } from "react-router-dom";
import TDSTab1 from "../../components/Tabs/TDSTab1";

const IncomeTax = () => {
  return (
    <>
      <section className=" min-h-[90vh]  h-auto  bg-gray-50 ">
        <header className="text-xl w-full pt-6 bg-white shadow-md   p-4">
          <Link to={"/organizationList"}>
            <West className="mx-4 !text-xl" />
          </Link>
          Income Tax
        </header>

        <div className="px-8 py-6">
          <h1 className="pb-5 text-2xl font-bold">
            Welcome to Income Tax declaration
          </h1>
          <div className="flex gap-4 items-center ">
            <div className="bg-white py-4 px-10 w-[350px] shadow-md rounded-md">
              <h1 className="text-sm space-y-2 font-semibold">
                My Monthly TDS
              </h1>
              <p className="text-xl">120000</p>
            </div>
            <div className="bg-white py-4 px-10 w-[350px] shadow-md rounded-md">
              <h1 className="text-sm space-y-2 font-semibold">My Yearly TDS</h1>
              <p className="text-xl">120000</p>
            </div>
            <div className="bg-white py-4 px-10 w-[350px] shadow-md rounded-md">
              <h1 className="text-sm space-y-2 font-semibold">
                My Annual Investment
              </h1>
              <p className="text-xl">120000</p>
            </div>
          </div>

          <TDSTab1 />
        </div>
      </section>
    </>
  );
};

export default IncomeTax;
