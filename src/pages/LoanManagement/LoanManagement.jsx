import React, { useContext, useState, useEffect } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import {
  Add,
  Cancel,
  CheckCircle,
  Error,
  Pending,
  Info,
} from "@mui/icons-material";
import { useQuery } from "react-query";
import { UseContext } from "../../State/UseState/UseContext";
import CreateLoanMgtModal from "../../components/Modal/CreateLoanMgtModal/CreateLoanMgtModal";
import UserProfile from "../../hooks/UserData/useUser";
import LoanManagementSkeleton from "./LoanManagementSkeleton";
import LoanManagementPieChart from "./LoanManagementPieChart";

const LoanManagement = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  console.log("user", user);
  const userId = user._id;
  const organisationId = user.organizationId;
  console.log(organisationId);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
  };

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
  const [showPieChart, setShowPieChart] = useState(false);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [totalPendingAmount, setTotalPendingAmount] = useState(0);

  // Function to update total paid and pending amounts
  useEffect(() => {
    let paidAmount = 0;
    let pendingAmount = 0;

    selectedLoans.forEach((selectedLoan) => {
      const { loanAmountPaid, loanAmountPending } =
        calculateLoanStatus(selectedLoan);
      paidAmount += loanAmountPaid;
      pendingAmount += loanAmountPending;
      console.log(paidAmount);
      console.log(pendingAmount);
    });

    setTotalPaidAmount(paidAmount);
    setTotalPendingAmount(pendingAmount);
  }, [selectedLoans]);

  const handleCheckboxChange = (loan) => {
    if (selectedLoans.includes(loan)) {
      setSelectedLoans(
        selectedLoans.filter((selectedLoan) => selectedLoan !== loan)
      );
      setShowPieChart(false); // Hide pie chart when unchecking
    } else {
      setSelectedLoans([...selectedLoans, loan]);
      setShowPieChart(true); // Show pie chart when checking
    }
  };

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
                <div className="overflow-auto p-0 border border-gray-200">
                  <table className="min-w-full bg-white text-left text-sm font-light">
                    <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                      <tr className="font-semibold">
                        <th scope="col" className=" px-3 py-3"></th>
                        <th scope="col" className="text-left pl-6 py-3">
                          SR NO
                        </th>
                        <th scope="col" className="px-8 py-3">
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
                          Total Deduction Montly
                        </th>
                        <th scope="col" className="px-6 py-3">
                          ROI (%)
                        </th>
                        <th scope="col" className="px-8 py-3">
                          Disbursement Date
                        </th>
                        <th scope="col" className="px-8 py-3">
                          Completion Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getEmployeeLoanData?.map((loanMgtData, id) => {
                        const { loanAmountPaid, loanAmountPending } =
                          calculateLoanStatus(loanMgtData);
                        return (
                          <tr className="font-medium border-b" key={id}>
                            <td className="py-3 pl-3">
                              <input
                                type="checkbox"
                                checked={selectedLoans.includes(loanMgtData)}
                                onChange={() => {
                                  handleCheckboxChange(loanMgtData);
                                }}
                              />
                            </td>
                            <td className="text-left pl-6 py-3">{id + 1}</td>
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
                              {loanMgtData?.totalDeduction}
                            </td>
                            <td className="py-3 pl-6">
                              {loanMgtData?.rateOfIntereset}
                            </td>

                            <td className="py-3 pl-6">
                              {formatDate(loanMgtData?.loanDisbursementDate) ||
                                ""}
                            </td>
                            <td className="py-3 pl-6">
                              {formatDate(loanMgtData?.loanCompletedDate) || ""}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
          {/* Show LoanManagementPieChart if showPieChart is true */}
          {showPieChart && (
            <LoanManagementPieChart
              totalPaidAmount={totalPaidAmount}
              totalPendingAmount={totalPendingAmount}
            />
          )}
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
