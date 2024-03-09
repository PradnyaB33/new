import React, { useState } from "react";
import { Button } from "@mui/material";
import { Add, Info } from "@mui/icons-material";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import LoanManagementSkeleton from "./LoanManagementSkeleton";
import LoanManagementPieChart from "./LoanManagementPieChart";

const LoanManagement = () => {
  let isLoading;
  const [LoanManagementData, setLoanManagementData] = useState([
    {
      id: 1,
      loanType: "Medical Loan",
      loanStatus: "Approved",
      loanAmountApplied: 30000,
      loanAmountPaid: 10000,
      loanAmountPending: 20000,
      roi: 2.0,
    },
    {
      id: 2,
      loanType: "Medical Loan",
      loanStatus: "Approved",
      loanAmountApplied: 30000,
      loanAmountPaid: 10000,
      loanAmountPending: 20000,
      roi: 2.0,
    },
  ]);
  console.log(setLoanManagementData);

  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <article className="SetupSection bg-white w-[100%] md:w-[100%]  h-max shadow-md rounded-sm border  items-center">
          <div className="p-4  border-b-[.5px] flex  justify-between  gap-3 w-full border-gray-300">
            <div className="flex  gap-3 ">
              <div className="mt-1">
                <EventNoteOutlinedIcon />
              </div>
              <div>
                <h1 className="!text-lg">Loan Management</h1>
                <p className="text-xs text-gray-600">Manage the loan here.</p>
              </div>
            </div>
          </div>
          <div className="p-4  border-b-[.5px] flex  justify-between  gap-3 w-full border-gray-300">
            <div className="flex  gap-3 ">
              <div>
                <h1 className="!text-lg">Your Current Active Loans</h1>
              </div>
            </div>
            <Button
              className="!font-semibold !bg-sky-500 flex items-center gap-2"
              variant="contained"
              //onClick={handleCreateModalOpen}
            >
              <Add />
              Apply For Loan
            </Button>
          </div>

          {isLoading ? (
            <LoanManagementSkeleton />
          ) : LoanManagementData?.length > 0 ? (
            <>
              <div className=" flex w-full ">
                <div className="overflow-auto !p-0  border-[.5px] border-gray-200 w-[60%]">
                  <table className="min-w-full bg-white  text-left !text-sm font-light">
                    <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                      <tr className="!font-semibold ">
                        <th scope="col" className="!text-left pl-8 py-3 ">
                          SR NO
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                          Laon Type
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                          Loan Status
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                          Loan Amount applied
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                          Loan Amount paid
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                          Loan Amount pending
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                          ROI (%)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {LoanManagementData?.map((loanMgtData, id) => (
                        <tr className="!font-medium border-b" key={id}>
                          <td className="!text-left pl-8 py-3 ">{id + 1}</td>
                          <td className="py-3 pl-6">{loanMgtData.loanType}</td>
                          <td className="py-3 pl-6 ">
                            {loanMgtData.loanStatus}
                          </td>
                          <td className="py-3 pl-6">
                            {loanMgtData.loanAmountApplied}
                          </td>
                          <td className="py-3 pl-6 ">
                            {loanMgtData.loanAmountPaid}
                          </td>
                          <td className="py-3 pl-6">
                            {loanMgtData.loanAmountPending}
                          </td>
                          <td className="py-3 pl-6">{loanMgtData.roi}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* pie chart for loan management */}
                <div className="w-[40%]">
                  <LoanManagementPieChart />
                </div>
              </div>
            </>
          ) : (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-lg font-semibold">Apply Loan</h1>
              </article>
              <p>No loan found. add the loan.</p>
            </section>
          )}
        </article>
      </section>
    </>
  );
};

export default LoanManagement;
