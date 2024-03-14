import { Add, Info } from "@mui/icons-material";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import { Button } from "@mui/material";
import axios from "axios";
import {
  default as React,
  default as React,
  useContext,
  useState,
} from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import CreateLoanMgtModal from "../../components/Modal/CreateLoanMgtModal/CreateLoanMgtModal";
import UserProfile from "../../hooks/UserData/useUser";

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

  // for create
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
                <div className="overflow-auto !p-0  border-[.5px] border-gray-200 w-[60%]">
                  <table className="min-w-full bg-white  text-left !text-sm font-light">
                    <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                      <tr className="!font-semibold ">
                        <th scope="col" className="!text-left pl-8 py-3 ">
                          Sr. No
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                          Laon Type
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                          Laon Status
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
                      {getEmployeeLoanData?.map((loanMgtData, id) => (
                        <tr className="!font-medium border-b" key={id}>
                          <td className="!text-left pl-8 py-3 ">{id + 1}</td>
                          <td className="py-3 pl-6">
                            {loanMgtData.loanType?.loanName}
                          </td>
                          <td className="py-3 pl-6"></td>
                          <td className="py-3 pl-6">
                            {loanMgtData.loanAmount}
                          </td>
                          <td className="py-3 pl-6"></td>
                          <td className="py-3 pl-6"></td>
                          <td className="py-3 pl-6">
                            {loanMgtData.rateOfIntereset}
                          </td>
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
