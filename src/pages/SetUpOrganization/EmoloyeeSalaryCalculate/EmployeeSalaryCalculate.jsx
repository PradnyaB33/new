import { BorderColor, Delete, Warning } from "@mui/icons-material";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import CreateEmpSalCalDayModel from "../../../components/Modal/EmployeeSalaryDayModal/CreateEmpSalCalDay";
import EmpSalaryDayModal from "../../../components/Modal/EmployeeSalaryDayModal/EmpSalaryDayModal";
import Setup from "../Setup";
const EmployeeSalaryCalculateDay = () => {
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  const queryClient = useQueryClient();
  // state for delete the employee salary calculate day
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
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

  // Delete Query for deleting the employee code
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  // Delete Query for deleting the employee code
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    setDeleteConfirmation(null);
    // Manually update the query data to reflect the deletion
    queryClient.setQueryData(
      ["empSalaryCalData", organisationId],
      (prevData) => {
        // Filter out the deleted employee salary calculation day
        const updatedData = prevData.empSalaryCalDayData.filter(
          (empSalCal) => empSalCal._id !== id
        );
        return { ...prevData, empSalaryCalDayData: updatedData };
      }
    );
    // Clear the alert message after 3000 milliseconds (3 seconds)
    setTimeout(() => {
      handleAlert(false, "success", "");
    }, 3000);
  };

  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/delete/employee-computation-day/${organisationId}/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        handleAlert(
          true,
          "success",
          " Salary Computation Day deleted succesfully"
        );
      },
    }
  );

  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <Setup>
          <article className="SetupSection bg-white w-[100%] md:w-[80%]  h-max shadow-md rounded-sm border  items-center">
            <div className="p-4  border-b-[.5px] flex items-center justify-between  gap-3 w-full border-gray-300">
              <div className="flex items-center  gap-3 ">
                <div className="rounded-full bg-sky-500 h-[30px] w-[30px] flex items-center justify-center">
                  <EventNoteOutlinedIcon className="!text-lg text-white" />
                </div>
                <h1 className="!text-lg tracking-wide">
                  Salary Computation Day
                </h1>
              </div>
              <Button
                className="!font-semibold !bg-sky-500 flex items-center gap-2"
                variant="contained"
                onClick={handleCreateModalOpen}
              >
                Create Salary Computation Day
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
                      Salary Computation Day
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
                        <IconButton
                          onClick={() =>
                            handleDeleteConfirmation(empSalCal._id)
                          }
                        >
                          <Delete className="!text-xl" color="error" />
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

      {/* this dialogue for delete the employee code */}
      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle color={"error"}>
          <Warning color="error" /> All information of salary computation day
          will be deleted. Are you sure you want to delete it?
        </DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this salary computation day,
            as this action cannot be retrived
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmation}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDelete(deleteConfirmation)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
