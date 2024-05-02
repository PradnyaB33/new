import { Add, Info } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import Setup from "../Setup";
import AddCommunicationModal from "../../../components/Modal/CommunicationModal/AddCommunicationModal";
import EditCommunicationModal from "../../../components/Modal/CommunicationModal/EditCommunicationModal";
import EmployeeTypeSkeleton from "../components/EmployeeTypeSkeleton";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import axios from "axios";

const EmpCommunication = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  const queryClient = useQueryClient();

  //for  Get Query
  const { data: getCommunication, isLoading } = useQuery(
    ["emailCommunication", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-communication`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  console.log("get communication", getCommunication);

  // for add
  const [openCommunciationModal, setOpenCommunicationModal] = useState(false);
  const handleOpenCommunicationModal = () => {
    setOpenCommunicationModal(true);
  };
  const handleCloseCommunicationModal = () => {
    setOpenCommunicationModal(false);
  };

  // for update
  const [editCommunicationModal, setEditCommunicationModal] = useState(false);
  const [editCommunicationId, setEditCommunicationId] = useState(null);

  const handleOpenEditCommunicationModal = (communicationId) => {
    setEditCommunicationModal(true);
    queryClient.invalidateQueries(["communicationId", communicationId]);
    setEditCommunicationId(communicationId);
  };

  const handleCloseEditCommunicationModal = () => {
    setEditCommunicationModal(false);
  };

  // for delete
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    handleCloseConfirmation();
  };

  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/${id}/delete-communication`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("emailCommunication");
        handleAlert(true, "success", "Email deleted successfully");
      },
    }
  );

  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <Setup>
          <article className="SetupSection bg-white w-[100%] md:w-[80%]  h-max shadow-md rounded-sm border  items-center">
            <div className="p-4  border-b-[.5px] flex  justify-between  gap-3 w-full border-gray-300">
              <div className="flex gap-3 ">
                <div className="mt-1">
                  <EmailOutlinedIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Email Setup</h1>
                  <p className="text-xs text-gray-600">
                    Manage the email setup here.
                  </p>
                </div>
              </div>
              <Button
                className="!font-semibold !bg-sky-500 flex items-center gap-2"
                variant="contained"
                onClick={handleOpenCommunicationModal}
              >
                <Add />
                <h1 className="!text-lg">Email Setup</h1>
              </Button>
            </div>
            {isLoading ? (
              <EmployeeTypeSkeleton />
            ) : getCommunication?.length > 0 ? (
              <div className="overflow-auto !p-0  border-[.5px] border-gray-200">
                <table className="min-w-full bg-white  text-left !text-sm font-light">
                  <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                    <tr className="!font-semibold ">
                      <th scope="col" className="!text-left pl-8 py-3 ">
                        Sr. No
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 ">
                        Communication
                      </th>
                      <th scope="col" className=" px-9 py-3 ">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(getCommunication) &&
                      getCommunication?.map((communciation, id) => (
                        <tr className="!font-medium border-b" key={id}>
                          <td className="!text-left pl-8 py-3 ">{id + 1}</td>
                          <td className="!text-left  pl-6 py-3 ">
                            {communciation?.email}
                          </td>
                          <td className="!text-left pl-6 py-3 ">
                            {communciation?.communication}
                          </td>

                          <td className="whitespace-nowrap px-6 py-2">
                            <IconButton
                              color="primary"
                              aria-label="edit"
                              onClick={() => handleOpenEditCommunicationModal(communciation?._id)}
                            >
                              <EditOutlinedIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              aria-label="delete"
                              onClick={() =>
                                handleDeleteConfirmation(communciation?._id)
                              }
                            >
                              <DeleteOutlineIcon />
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
                  <h1 className="text-lg font-semibold">Setup the email</h1>
                </article>
                <p>No email found for communication. Please setup the email.</p>
              </section>
            )}
          </article>
        </Setup>

        {/* for add */}
        <AddCommunicationModal
          handleClose={handleCloseCommunicationModal}
          open={openCommunciationModal}
          organisationId={organisationId}
        />
      </section>

      {/* for update */}
      <EditCommunicationModal
        handleClose={handleCloseEditCommunicationModal}
        organisationId={organisationId}
        open={editCommunicationModal}
        editCommunicationId={editCommunicationId}
      />

      {/* for delete */}
      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this loan type, as this
            action cannot be undone.
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

export default EmpCommunication;
