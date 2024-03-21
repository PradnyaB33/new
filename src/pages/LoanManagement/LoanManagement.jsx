import { Add, Info } from "@mui/icons-material";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import { Button } from "@mui/material";
import axios from "axios";
import { default as React, useContext, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import CreateLoanMgtModal from "../../components/Modal/CreateLoanMgtModal/CreateLoanMgtModal";
import UserProfile from "../../hooks/UserData/useUser";
import LoanManagementPieChart from "./LoanManagementPieChart";
import LoanManagementSkeleton from "./LoanManagementSkeleton";
import { Cancel, CheckCircle, Error, Pending } from "@mui/icons-material";
const LoanManagement = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const userId = user._id;

  //for get loan data
  const { data: getEmployeeLoanData, isLoading } = useQuery(
    ["loanDatas", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/${userId}/get-loan-data`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  console.log(getEmployeeLoanData);

  // Function to calculate loan amount paid and pending
  const calculateLoanStatus = (loan) => {
    const currentDate = new Date();
    const loanStartingDate = loan?.loanDisbursementDate
      ? new Date(loan?.loanDisbursementDate)
      : null;
    const loanEndingDate = loan?.loanCompletedDate
      ? new Date(loan.loanCompletedDate)
      : null;

    const loanAmount = loan?.totalDeductionWithSi;
    const totalDeductionPerMonth = loan?.totalDeduction;

    let loanAmountPaid = 0;
    let loanAmountPending = loanAmount;

    if (currentDate < loanStartingDate) {
      loanAmountPaid = 0;
      loanAmountPending = loanAmount;
    } else {
      const elapsedMonths = Math.max(
        0,
        (currentDate.getFullYear() - loanStartingDate.getFullYear()) * 12 +
          currentDate.getMonth() -
          loanStartingDate.getMonth() +
          1
      );
      loanAmountPaid = Math.min(
        loanAmount,
        totalDeductionPerMonth * elapsedMonths
      );
      loanAmountPending = loanAmount - loanAmountPaid;
    }

    let currentDateToCheck = new Date(loanStartingDate);
    while (
      currentDateToCheck <= loanEndingDate &&
      currentDateToCheck <= currentDate
    ) {
      loanAmountPaid += totalDeductionPerMonth;
      loanAmountPending -= totalDeductionPerMonth;
      currentDateToCheck.setMonth(currentDateToCheck.getMonth() + 1);
    }

    return { loanAmountPaid, loanAmountPending };
  };

  // State to manage selected loans
  const [selectedLoans, setSelectedLoans] = useState([]);

  const handleCheckboxChange = (loan) => {
    if (selectedLoans.includes(loan)) {
      setSelectedLoans(
        selectedLoans.filter((selectedLoan) => selectedLoan !== loan)
      );
    } else {
      setSelectedLoans([...selectedLoans, loan]);
    }
  };
  console.log(selectedLoans);

  // Calculate total loan amount paid and pending based on selected loans
  let totalPaidAmount = 0;
  let totalPendingAmount = 0;

  selectedLoans.forEach((selectedLoan) => {
    const { loanAmountPaid, loanAmountPending } =
      calculateLoanStatus(selectedLoan);
    totalPaidAmount += loanAmountPaid;
    totalPendingAmount += loanAmountPending;
    console.log(totalPaidAmount);
    console.log(totalPendingAmount);
  });
  // for create the loan data
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const handleCreateModalOpen = () => {
    setCreateModalOpen(true);
  };
  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
  };

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
              <h1 className="!text-lg">Your Current Active Loans</h1>
            </div>
            <Button
              className="!font-semibold !bg-sky-500 flex items-center gap-2"
              variant="contained"
              onClick={handleCreateModalOpen}
            >
              <Add />
              Apply For Loan
            </Button>
          </div>

          {isLoading ? (
            <LoanManagementSkeleton />
          ) : getEmployeeLoanData?.length > 0 ? (
            <>
              <div className=" flex w-full ">
                <div className="overflow-auto p-0 border border-gray-200 w-70%">
                  <table className="min-w-full bg-white text-left text-sm font-light">
                    <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                      <tr className="font-semibold">
                        <th scope="col" className="px-6 py-3"></th>
                        <th scope="col" className="text-left pl-8 py-3">
                          SR NO
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Loan Type
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Loan Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Loan Amount Applied
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Total Loan Amount
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Loan Amount Paid
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Loan Amount Pending
                        </th>
                        <th scope="col" className="px-6 py-3">
                          ROI (%)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getEmployeeLoanData?.map((loanMgtData, id) => {
                        const { loanAmountPaid, loanAmountPending } =
                          calculateLoanStatus(loanMgtData);
                        return (
                          <tr className="font-medium border-b" key={id}>
                            <td className="py-3 pl-6">
                              <input
                                type="checkbox"
                                checked={selectedLoans.includes(loanMgtData)}
                                onChange={() =>
                                  handleCheckboxChange(loanMgtData)
                                }
                              />
                            </td>
                            <td className="text-left pl-8 py-3">{id + 1}</td>
                            <td className="py-3 pl-6">
                              {loanMgtData.loanType?.loanName}
                            </td>
                            <td className="text-left leading-7 text-[16px] w-[200px] ">
                              {loanMgtData.status === "Pending" ? (
                                <div className="flex items-center gap-2">
                                  <Pending className="text-yellow-400" />
                                  <span className="text-yellow-400">
                                    Pending
                                  </span>
                                </div>
                              ) : loanMgtData.status === "Ongoing" ? (
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="text-green-400" />
                                  <span className="text-green-400">
                                    Ongoing
                                  </span>
                                </div>
                              ) : loanMgtData.status === "Rejected" ? (
                                <div className="flex items-center gap-2">
                                  <Cancel className="text-red-400" />
                                  <span className="text-red-400">Rejected</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Error className="text-gray-400" />
                                  <span className="text-gray-400">
                                    {loanMgtData.status}
                                  </span>
                                </div>
                              )}
                            </td>

                            <td className="py-3 pl-6">
                              {loanMgtData?.loanAmount}
                            </td>
                            <td className="py-3 pl-6">
                              {loanMgtData?.totalDeductionWithSi}
                            </td>
                            <td className="py-3 pl-6">{loanAmountPaid}</td>
                            <td className="py-3 pl-6">{loanAmountPending}</td>
                            <td className="py-3 pl-6">
                              {loanMgtData?.rateOfIntereset}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* pie chart for loan management */}
                <div className="w-[30%]">
                  <LoanManagementPieChart
                    totalPaidAmount={totalPaidAmount}
                    totalPendingAmount={totalPendingAmount}
                  />
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

      {/* for create */}
      <CreateLoanMgtModal
        handleClose={handleCreateModalClose}
        open={createModalOpen}
        organisationId={organisationId}
      />
    </>
  );
};

export default LoanManagement;
