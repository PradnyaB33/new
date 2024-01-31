import React, { useContext } from "react";
import Setup from "../Setup";
import { BorderColor } from "@mui/icons-material";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import { Button, IconButton } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import CreateEmpCodeModel from "../../../components/Modal/EmpCodeModel/CreateEmpCodeModel";
import EditEmpCodeModel from "../../../components/Modal/EmpCodeModel/EditEmpCodeModel";
import { Delete, Warning } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { TestContext } from "../../../State/Function/Main";
const EmployeeCodeGenerator = () => {
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aeigs"];
  const queryClient = useQueryClient();
  const { organisationId } = useParams();
  // state for delete the employee code
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  // Modal states and function for edit
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [empCodeId, setEmpCodeId] = useState(null);
  // Modal states and function for create
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // for create the emp sal cal day
  // for open the modal
  const handleCreateModalOpen = () => {
    setCreateModalOpen(true);
  };
  // for close the modal
  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
  };

  // for update the emp sal cal day
  const handleEditModalOpen = (empCode) => {
    setEditModalOpen(true);
    setEmpCodeId(empCode);
  };

  const handleEditModelClose = () => {
    setEmpCodeId(null);
    setEditModalOpen(false);
  };

  const getEmployeeCodeData = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: authToken,
      },
    };

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get/employee-code/${organisationId}`,
        config
      );

      return response.data.getEmployeeCode; // Return employeeCodes directly
    } catch (error) {
      // Handle errors if necessary
      console.error("Error fetching employee codes:", error);
      return [];
    }
  };

  const { data: employeeCodes } = useQuery({
    queryKey: ["employee-code"],
    queryFn: getEmployeeCodeData,
  });

  // Delete Query for deleting the employee code
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    // Manually update the query data to reflect the deletion
    queryClient.setQueryData(["employee-code"], (prevData) => {
      // Filter out the deleted employee code
      const updatedData = prevData.filter((empCode) => empCode._id !== id);
      return updatedData;
    });
    setDeleteConfirmation(null);
    // Clear the alert message after 3000 milliseconds (3 seconds)
    setTimeout(() => {
      handleAlert(false, "success", "");
    }, 3000);
  };
  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/delete/employee-code/${organisationId}/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("employeecode");
        handleAlert(true, "success", "Employee Code deleted succesfully");
      },
    }
  );

  return (
    <section className="bg-gray-50 min-h-screen w-full">
      <Setup>
        <article className="SetupSection bg-white w-[100%] md:w-[80%]  h-max shadow-md rounded-sm border  items-center">
          <div className="p-4  border-b-[.5px] flex items-center justify-between  gap-3 w-full border-gray-300">
            <div className="flex items-center  gap-3 ">
              <div className="rounded-full bg-sky-500 h-[30px] w-[30px] flex items-center justify-center">
                <EventNoteOutlinedIcon className="!text-lg text-white" />
              </div>
              <h1 className="!text-lg tracking-wide">
                Employee Code Generation
              </h1>
            </div>
            <Button
              className="!font-semibold !bg-sky-500 flex items-center gap-2"
              variant="contained"
              onClick={handleCreateModalOpen}
            >
              Generate Employee Code
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
                    Employee Code
                  </th>
                  <th scope="col" className="px-6 py-3 ">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {employeeCodes?.map((empCode, id) => (
                  <tr className="!font-medium border-b" key={id}>
                    <td className="!text-left pl-8 py-3 ">{id + 1}</td>
                    <td className="py-3 ">{empCode?.code}</td>
                    <td className="whitespace-nowrap px-6 py-2">
                      <IconButton
                        onClick={() => handleEditModalOpen(empCode?._id)}
                      >
                        <BorderColor className="!text-xl" color="success" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteConfirmation(empCode?._id)}
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
      {/* this dialogue for delete the employee code */}
      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle color={"error"}>
          <Warning color="error" /> All information of employee code will be
          deleted. Are you sure you want to delete it?
        </DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this employee code, as this
            action cannot be retrived
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
      <CreateEmpCodeModel
        handleClose={handleCreateModalClose}
        open={createModalOpen}
        organisationId={organisationId}
      />
      s{/* for update */}
      <EditEmpCodeModel
        handleClose={handleEditModelClose}
        organisationId={organisationId}
        open={editModalOpen}
        empCodeId={empCodeId}
      />
    </section>
  );
};

export default EmployeeCodeGenerator;
