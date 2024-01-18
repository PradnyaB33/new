import { BorderColor } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import Setup from "../Setup";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import EmpSalaryDayModal from "../../../components/Modal/EmployeeSalaryDayModal/EmpSalaryDayModal";
import CreateEmpSalCalDayModel from "../../../components/Modal/EmployeeSalaryDayModal/CreateEmpSalCalDay";
const EmployeeSalaryCalculateDay = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const { organisationId } = useParams();
  const queryClient = useQueryClient();
  // Modal states and function for edit
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [empSalCalId, setEmpSalCalId] = useState(null);
  // Modal states and function for create
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // for update the emp sal cal day
  const handleEditModalOpen = (empSalCalId) => {
    setEditModalOpen(true);
    queryClient.invalidateQueries(["empsal", empSalCalId]);
    setEmpSalCalId(empSalCalId);
  };

  const handleClose = () => {
    setEmpSalCalId(null);
    setEditModalOpen(false);
  };

  // for create the emp sal cal day
  const handleCreateModalOpen = () => {
    setCreateModalOpen(true);
  };
  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
  };

  // pull the emp salary cal day
  const { data: empSalCalData } = useQuery(
    ["empSalaryCalData", organisationId],
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/employee-salary-cal-day/get/${organisationId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return response.data;
      } catch (error) {
        throw new Error(
          error.response.data.message ||
            "Failed to fetch Employee Salary Calculation Data"
        );
      }
    }
  );

  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <Setup>
          <article className="SetupSection bg-white w-[80%]  h-max shadow-md rounded-sm border  items-center">
            <div className="p-4  border-b-[.5px] flex items-center justify-between  gap-3 w-full border-gray-300">
              <div className="flex items-center  gap-3 ">
                <div className="rounded-full bg-sky-500 h-[30px] w-[30px] flex items-center justify-center">
                  <EventNoteOutlinedIcon className="!text-lg text-white" />
                </div>
                <h1 className="!text-lg tracking-wide">
                  Create Employee Salary Calculation Day For Organization
                </h1>
              </div>
              <Button
                className="!font-semibold !bg-sky-500 flex items-center gap-2"
                variant="contained"
                onClick={handleCreateModalOpen}
              >
                Create Employee Salary Calculate Day
              </Button>
            </div>

            <div className="overflow-auto !p-0  border-[.5px] border-gray-200">
              <table className="min-w-full bg-white  text-left !text-sm font-light">
                <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                  <tr className="!font-semibold ">
                    <th scope="col" className="!text-left pl-8 py-3 ">
                      SR NO
                    </th>
                    <th scope="col" className="py-3 ">
                      Salary Calculation Day
                    </th>
                    <th scope="col" className="px-6 py-3 ">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {empSalCalData?.empSalaryCalDayData?.map((empSalCal, id) => (
                    <tr className="!font-medium border-b" key={id}>
                      <td className="!text-left pl-8 py-3 ">{id + 1}</td>
                      <td className="py-3 ">{empSalCal.selectedDay}</td>
                      <td className="whitespace-nowrap px-6 py-2">
                        <IconButton
                          onClick={() => handleEditModalOpen(empSalCal._id)}
                        >
                          <BorderColor className="!text-xl" color="success" />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </Setup>
      </section>

      {/* for create */}
      <CreateEmpSalCalDayModel
        handleClose={handleCreateModalClose}
        open={createModalOpen}
        id={organisationId}
      />

      {/* for update */}
      <EmpSalaryDayModal
        handleClose={handleClose}
        id={organisationId}
        open={editModalOpen}
        empSalCalId={empSalCalId}
      />
    </>
  );
};

export default EmployeeSalaryCalculateDay;
