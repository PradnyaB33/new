// import { West } from "@mui/icons-material";
import React from "react";
// import { Link } from "react-router-dom";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import EmployeeInvestmentTable from "./EmployeeTable";

const EmployeeInvestmentPage = () => {
  return (
    <>
      <BoxComponent>
        <HeadingOneLineInfo
          heading={"  TDS Declarations done by individuals"}
          info={
            " Accountant can view and download the declaration document from here"
          }
        />

        <section className="justify-between  min-h-[85vh] bg-gray-50">
          <div className="pb-4  gap-8">
            <EmployeeInvestmentTable />
          </div>
        </section>
      </BoxComponent>
    </>
  );
};

export default EmployeeInvestmentPage;
