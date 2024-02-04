import { West } from "@mui/icons-material";
import React from "react";
import { Link } from "react-router-dom";

const EmployeeTest = () => {
  return (
    <div className="bg-gray-50 h-auto">
      <header className="text-xl w-full pt-6 bg-white shadow-md   p-4">
        <Link to={"/organizationList"}>
          <West className="mx-4 !text-xl" />
        </Link>
        Employee Onboarding
      </header>

      <section className="px-8 flex space-x-2 py-6">
        <article className="w-max h-full bg-white shadow-xl  ">
          <div class=" h-[225px] w-[225px] rounded-lg overflow-hidden">
            <img
              class="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="none"
            />
          </div>

          <div className="flex items-center flex-col py-2 justify-center gap-2">
            <h1 className="font-bold text-lg">Jhon Show Doe</h1>

            <div>
              <div className="py-[2px] bg-slate-50 border-b-gray-200 border-[.5px] px-3 rounded-full text-blue-400 text-[.6rem]">
                Employee
              </div>
            </div>
          </div>

          <div className=""></div>
        </article>

        <article className="w-full rounded-lg bg-white ">
          <div className="flex">
            <div className="p-4">
              <h1>Personal Details</h1>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default EmployeeTest;
