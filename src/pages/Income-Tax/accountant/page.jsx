// import { West } from "@mui/icons-material";
import React from "react";
// import { Link } from "react-router-dom";
import EmployeeInvestmentTable from "./EmployeeTable";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const EmployeeInvestmentPage = () => {
  return (
    <>
      <BoxComponent>
        <HeadingOneLineInfo heading={"  TDS Declarations done by individuals"} info={" Accountant can view and download the declaration document from here"} />
        {/* <header className="text-lg w-full pt-6 bg-white border  p-4">
        <Link to={-1}>
          <West className="mx-4 !text-xl" />
        </Link>
        Income Tax
      </header> */}

        <section className="justify-between  min-h-[85vh] bg-gray-50">
          {/* <headers className="flex items-center justify-between ">
            <div class="flex items-center justify-between ">
              <div class="space-y-1">
                <h2 class=" md:text-2xl  tracking-tight">
                  TDS Declarations done by individuals
                </h2>
                <p class="text-sm text-muted-foreground">
                  Accountant can view and download the declaration document from
                  here
                </p>
              </div>
            </div>
          </headers> */}
          <div className="pb-4  gap-8">
            <EmployeeInvestmentTable />
          </div>
        </section>
      </BoxComponent>
    </>
  );
};

export default EmployeeInvestmentPage;
