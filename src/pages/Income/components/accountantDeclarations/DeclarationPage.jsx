import { Info, Search, West } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const DeclarationPage = () => {
  return (
    <div>
      <header className="text-xl w-full pt-6 border bg-white shadow-md   p-4">
        <Link to={"/income-tax"}>
          <West className="mx-4 !text-xl" />
        </Link>
        Employee TDS Request
      </header>
      <section className="min-h-[90vh] flex items-center justify-center">
        <article className="w-[25%] min-h-[90vh] h-full bg-white border-r-[.5px] border-gray-200">
          <div className="p-6 !py-2 ">
            <div className="space-y-2">
              <div
                // onFocus={() => {
                //   handleFocus(name);
                // }}
                // onBlur={() => setFocusedInput(null)}
                className={
                  //  ${
                  //   focusedInput === name
                  //     ? "outline-blue-500 outline-3 border-blue-500 border-[2px]"
                  //     : "outline-none border-gray-200 border-[.5px]"
                  //                   }
                  `
                flex  rounded-md items-center px-2 outline-none border-gray-200 border-[.5px]  bg-white py-1 md:py-[6px]`
                }
              >
                <Search className="text-gray-700 md:text-lg !text-[1em]" />

                <input
                  type={"test"}
                  placeholder={"Search Employee by name"}
                  className={`border-none bg-white w-full outline-none px-2  `}
                />
              </div>
            </div>
          </div>

          {Array.from({ length: 5 }).map((ele) => (
            <div className="px-6 my-1 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50">
              <Avatar />
              <div>
                <h1 className="text-[1.2rem]">Test user</h1>
                <h1 className="text-sm text-gray-500">9 Declarations</h1>
              </div>
            </div>
          ))}
        </article>

        <article className="w-[75%] min-h-[90vh]  bg-gray-50">
          <div className="flex px-4 w-full items-center my-4">
            <h1 className="text-lg w-full  text-gray-700 border bg-blue-200 p-4 rounded-md">
              <Info /> Select Employee First to view his declarations
            </h1>
          </div>
        </article>
      </section>
    </div>
  );
};

export default DeclarationPage;
