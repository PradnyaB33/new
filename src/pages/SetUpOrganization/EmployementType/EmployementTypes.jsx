import {
  BorderColor,
  Delete,
  Info,
  ManageAccountsOutlined,
  Warning,
} from "@mui/icons-material";
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
import EmpTypeModal from "../../../components/Modal/EmployeeTypesModal/EmpTypeModal";
import Setup from "../Setup";
import EmployeeTypeSkeleton from "../components/EmployeeTypeSkeleton";

const EmployementTypes = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const { organisationId } = useParams();

  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Modal states and function
  const [open, setOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [empTypeId, setempTypeId] = useState(null);

  // const handleClickOpen = (scrollType) => () => {
  //   setOpen(true);
  //   setScroll(scrollType);
  // };

  const handleOpen = (scrollType) => {
    setOpen(true);
    setempTypeId(null);
  };

  const handleClose = () => {
    setOpen(false);
    setempTypeId(null);
    setEditModalOpen(false);
  };

  // Get Query
  const { data: empList, isLoading } = useQuery(
    ["empTypes", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employment-types-organisation/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    }
  );

  // Delete Query
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const handleEditModalOpen = (empTypeId) => {
    setEditModalOpen(true);
    queryClient.invalidateQueries(["shift", empTypeId]);
    setempTypeId(empTypeId);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    handleCloseConfirmation();
  };

  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/employment-types/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("empTypes");
        handleAlert(true, "success", "Employeement types deleted succesfully");
      },
    }
  );

  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <Setup>
          <article className="SetupSection bg-white w-full md:w-[80%]  h-max shadow-md rounded-sm border  items-center">
            <div className="p-4  border-b-[.5px] flex items-center justify-between  gap-3 w-full border-gray-300">
              <div className="flex items-center  gap-3 ">
                <div className="rounded-full bg-sky-500 h-[30px] w-[30px] flex items-center justify-center">
                  <ManageAccountsOutlined className="!text-lg text-white" />
                </div>
                <h1 className="!text-lg tracking-wide">
                  Create Employeement types for organization
                </h1>
              </div>
              <Button
                className="!font-semibold !bg-sky-500 flex items-center gap-2"
                onClick={() => handleOpen("paper")}
                variant="contained"
              >
                Create Employeement types
              </Button>
            </div>

            {isLoading ? (
              <EmployeeTypeSkeleton />
            ) : empList?.empTypes?.length > 0 ? (
              <div className="overflow-auto !p-0  border-[.5px] border-gray-200">
                <table className="min-w-full bg-white  text-left !text-sm font-light">
                  <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                    <tr className="!font-semibold ">
                      <th scope="col" className="!text-left pl-8 py-3 ">
                        SR NO
                      </th>
                      <th scope="col" className="py-3 ">
                        Employment Title
                      </th>
                      <th scope="col" className="px-6 py-3 ">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {empList?.empTypes?.map((emptype, id) => (
                      <tr className="!font-medium border-b" key={id}>
                        <td className="!text-left pl-8 py-3 ">{id + 1}</td>
                        <td className="py-3 ">{emptype?.title}</td>
                        <td className="whitespace-nowrap px-6 py-2">
                          <IconButton
                            onClick={() =>
                              handleDeleteConfirmation(emptype._id)
                            }
                          >
                            <Delete className="!text-xl" color="error" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleEditModalOpen(emptype._id)}
                          >
                            <BorderColor className="!text-xl" color="success" />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                <article className="flex items-center mb-1 text-red-500 gap-2">
                  <Info className="!text-2xl" />
                  <h1 className="text-xl font-semibold">
                    Employement Types Not found
                  </h1>
                </article>
                <p>
                  Employeement types have not been set up for your organization.
                  Please create the 'Employeement types'
                </p>
              </section>
            )}
          </article>
        </Setup>
      </section>

      {/* Delete Confirmation Dialog */}

      <EmpTypeModal id={organisationId} open={open} handleClose={handleClose} />
      <EmpTypeModal
        handleClose={handleClose}
        id={organisationId}
        open={editModalOpen}
        empTypeId={empTypeId}
      />

      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle color={"error"}>
          <Warning color="error" /> Are you sure to delete the Employeement
          types?
        </DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this employement type, as
            this action cannot be undone
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
    </>
  );
};

export default EmployementTypes;
