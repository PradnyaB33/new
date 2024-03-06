import { West } from "@mui/icons-material";
import React from "react";
import { Link } from "react-router-dom";
import TDSTab1 from "./components/TDSTab1";

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

        {/* <div className="px-8 py-6">
          <h1 className="pb-5 text-2xl ">Welcome to Income Tax Declaration</h1>

          <div className="flex gap-4 items-center ">
            <div className="bg-white py-4 px-10 w-[350px] shadow-md rounded-md">
              <h1 className="text-gray-600">Net Taxable Income</h1>
              <p className="text-xl">INR 12000.00</p>
            </div>
            <div className="bg-white py-4 px-10 w-[350px] shadow-md rounded-md">
              <h1 className="text-gray-600">Total Tax Payable</h1>
              <p className="text-xl">INR 120000.00</p>
            </div>
            <div className="bg-white py-4 px-10 w-[350px] shadow-md rounded-md">
              <h1 className="text-gray-600">Tax Already Paid</h1>
              <p className="text-xl">INR 0</p>
            </div>
          </div>

        </div> */}

        <div className="px-4 mt-4">
          <TDSTab1 />
        </div>
      </section>
    </>
  );
};

export default IncomeTax;
