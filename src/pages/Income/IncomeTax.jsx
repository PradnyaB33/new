import { Calculate, Check, DoneAll, Settings, West } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

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

        <div className="px-8 pt-6 space-y-4">
          <h1 className="pb-2 text-2xl ">Welcome to Income Tax Declaration</h1>

          <div className="bg-white border-[.5px] border-gray-200 p-4">
            <div className="mb-4 flex justify-between items-center pr-2   w-full space-y-3">
              <h1 className="text-[1.2em]  text-gray-500">
                TDS Declarations and others
              </h1>
              <button className="!p-0 h-max !m-0 flex gap-2 text-blue-500">
                <Settings />
                Change Regime settings
              </button>
            </div>

            <article className="flex gap-4 items-center">
              <div className="flex-col w-[225px]  border-[.5px] border-gray-200 gap-3 flex items-center px-4 py-6 rounded-md shadow-sm">
                <Avatar className="!bg-green-500">
                  <Calculate />
                </Avatar>
                <h1 className="text-lg">TDS Calculation</h1>
              </div>

              <Link
                to={"/income-tax/declarations"}
                className="hover:scale-[1.02] transition-all"
              >
                <div className="flex-col w-[225px]  border-[.5px] border-gray-200 gap-3 flex items-center px-4 py-6 rounded-sm shadow-sm">
                  <Avatar className="!bg-blue-500">
                    <Check />
                  </Avatar>
                  <h1 className="text-lg ">My declarations</h1>
                </div>
              </Link>
            </article>
          </div>

          <div className="bg-white border-[.5px] border-gray-200 p-4">
            <div className="mb-4   w-full space-y-3">
              <h1 className="text-[1.2em] text-gray-500">
                Accountant Workflow
              </h1>
            </div>

            <article className="flex  gap-4 items-center">
              <Link
                to={"/income-tax/accountant-declarations"}
                className="hover:scale-[1.02] transition-all"
              >
                <div className="flex-col w-[225px] bg-white border-[.5px] border-gray-200 gap-3 flex items-center px-4 py-6 rounded-sm shadow-sm">
                  <Avatar className="!bg-yellow-500">
                    <DoneAll />
                  </Avatar>
                  <h1 className="text-lg">Employee Declarations</h1>
                </div>
              </Link>
            </article>
          </div>
        </div>
      </section>
    </>
  );
};

export default IncomeTax;
