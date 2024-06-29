import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Menu, MenuItem, Dialog, DialogTitle, Button, DialogActions, DialogContent } from "@mui/material";
import UserProfile from "../../../hooks/UserData/useUser";
import { UseContext } from "../../../State/UseState/UseContext";
import DOMPurify from "dompurify";
import { MoreVert } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";

const SaveAsDraft = () => {
  // Hooks
  const navigate = useNavigate();
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  // Get organizationId
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const organisationId = user?.organizationId;

  // Get cookies
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  // State for survey list
  const [surveys, setSurveys] = useState([]);
  console.log("surveys", surveys);

  // Fetch surveys data
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-draft-survey`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        setSurveys(response.data);
      } catch (error) {
        console.error("Error fetching survey data:", error);
      }
    };

    fetchSurveys();
  }, [authToken, organisationId]);

  const [anchorEl, setAnchorEl] = useState(null);
  // const [selectedSurveyId, setSelectedSurveyId] = useState(null);

  const handleClick = (e, id) => {
    setAnchorEl(e.currentTarget);
    // setSelectedSurveyId(id);
  };

  const handleCloseIcon = () => {
    setAnchorEl(null);
    // setSelectedSurveyId(null);
  };

  const handleOpenEditCommunicationModal = (surveyId) => {
    navigate(`/organisation/${organisationId}/create-new-survey/${surveyId}`);
  };

  // for delete
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const deleteMutation = useMutation(
    (surveyId) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/delete-draft-survey/${surveyId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("getEmailCommunication");
        handleAlert(true, "success", "Employee survey deleted successfully");
        // Update state after deletion
        setSurveys((prevSurveys) =>
          prevSurveys.filter((survey) => survey._id !== deleteConfirmation)
        );
      },
      onError: (error) => {
        handleAlert(true, "error", "Failed to delete the survey");
      }
    }
  );

  const handleDeleteConfirmation = (surveyId) => {
    setDeleteConfirmation(surveyId);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const handleDelete = () => {
    deleteMutation.mutate(deleteConfirmation);
    handleCloseConfirmation();
  };

  return (
    <div>
      <div className="p-4 border-y-[.5px] border-gray-300">
        <div className="flex justify-end gap-3 mb-3 md:mb-0 w-full md:w-auto">
          <TextField
            placeholder="Search"
            variant="outlined"
            size="small"
            sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
          />
        </div>
      </div>

      {surveys && surveys?.length > 0 ? (
        <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
          <table className="min-w-full bg-white text-left !text-sm font-light">
            <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
              <tr className="!font-semibold">
                <th scope="col" className="!text-left pl-8 py-3">
                  Title
                </th>
                <th scope="col" className="!text-left pl-8 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {surveys?.map((survey, index) => (
                <tr key={index} className="!font-medium border-b ">
                  <td className="!text-left pl-8 py-3">
                    {DOMPurify.sanitize(survey.title, { USE_PROFILES: { html: false } })}
                  </td>
                  <td className="!text-left pl-9 py-3">
                    <MoreVert
                      onClick={(e) => handleClick(e, survey._id)}
                      className="cursor-pointer"
                    />
                    <Menu
                      elevation={2}
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleCloseIcon}
                    >
                      <Tooltip title="Edit Survey">
                        <MenuItem
                          onClick={() => handleOpenEditCommunicationModal(survey._id)}
                        >
                          <EditIcon
                            color="primary"
                            aria-label="edit"
                            style={{
                              color: "#2196f3",
                              marginRight: "10px",
                            }}
                          />
                          Edit
                        </MenuItem>
                      </Tooltip>
                      <Tooltip title="Delete Survey">
                        <MenuItem
                          onClick={() => handleDeleteConfirmation(survey._id)}
                        >
                          <DeleteOutlineIcon
                            color="primary"
                            aria-label="delete"
                            style={{
                              color: "#f50057",
                              marginRight: "10px",
                            }}
                          />
                          Delete
                        </MenuItem>
                      </Tooltip>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
        : (
          <section className="py-6 px-8 w-full">
            <p>
              Nothing to draft
            </p>
          </section>
        )
      }

      {/* for delete */}
      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this survey, as this action cannot be undone.
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
            onClick={handleDelete}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SaveAsDraft;
