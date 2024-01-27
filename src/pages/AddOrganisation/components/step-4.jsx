import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
} from "@mui/material";
import React from "react";
import useOrg from "../../../State/Org/Org";
import { convertCamelToTitle } from "./step-3";

const Step4 = () => {
  const { data } = useOrg();
  const valueObject = {
    memberCount: 40,
    remotePunchingCount: 1000,
    performanceManagementCount: 40,
    analyticsAndReportingCount: 40,
    skillMatricesCount: 40,
  };
  if (data === undefined) {
    return "Please Select Plan And Package";
  }
  console.log(`🚀 ~ file: step-4.jsx:6 ~ data:`, data);
  return (
    <div className="px-4 grid grid-cols-6 bg-[#f8fafb] p-4 rounded-md">
      <div className="grid col-span-2">
        <img src="/payment.svg" alt="" />
      </div>
      <div className=" grid col-span-4 p-8 gap-2 grid-rows-4">
        <div className=" !row-span-1">
          <h2 className="text-2xl font-bold ">Your Package Pricing</h2>
          <p className=" text-gray-500">Organisation Package </p>
        </div>
        <div className="flex flex-col gap-2 !row-span-4">
          {Object.entries(data)
            .reverse()
            .map((doc) => {
              console.log(`🚀 ~ file: step-4.jsx:17 ~ doc:`, doc);
              return (
                <>
                  <Accordion className="">
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      {convertCamelToTitle(doc[0]) === "Member Count"
                        ? "Basic Package"
                        : convertCamelToTitle(doc[0])}
                    </AccordionSummary>
                    <AccordionDetails className="!px-4">
                      <div className="grid grid-cols-2 w-full">
                        <div className="col-span-1 text-left underline">
                          {" "}
                          {valueObject[doc[0]]}Rs × {doc[1]} Employees
                        </div>
                        <div className="col-span-1 text-center">
                          {" "}
                          {valueObject[doc[0]] * doc[1]}
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </>
              );
            })}
        </div>
        <div className="row-span-1 items-center justify-center flex">
          <Button variant="contained">Confirm And Pay</Button>
        </div>
      </div>
    </div>
  );
};

export default Step4;
