import React, { useContext, useState } from "react";
import { MoreVert, Info } from "@mui/icons-material";
import {
  Container,
  Menu,
  MenuItem,
  Box,
  Button,
  Grid,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate, useParams } from "react-router";
import { formatDistanceToNow } from "date-fns";
import useRecruitmentQuery from "../../hooks/RecruitmentHook/useRecruitmentQuery";
import axios from "axios";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import { useMutation, useQueryClient } from "react-query";

const ViewJobPosition = () => {
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  const { getJobPosition } = useRecruitmentQuery(organisationId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  console.log("get job position", getJobPosition);

  // for morevert icon
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e, data) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseIcon = () => {
    setAnchorEl(null);
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
        `${process.env.REACT_APP_API}/route/delete-job-position/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("get-job-position");
        handleAlert(true, "success", "Job position deleted successfully");
      },
    }
  );

  // for edit
  const handleEditClick = (jobPositionId) => {
    navigate(
      `/organisation/${organisationId}/edit-job-position/${jobPositionId}`
    );
  };

  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50">
        <article className="bg-white w-full h-max shadow-md rounded-sm border items-center">
          <h1 className="text-lg pl-2 font-semibold text-center modal-title py-2">
            View Job Position
          </h1>
          <p className="text-xs text-gray-600 text-center">
            You can view and manage the job positions.
          </p>
        </article>

        {getJobPosition && getJobPosition.length > 0 ? (
          getJobPosition.map((job, index) => (
            <Grid key={job?._id} item className="py-4 w-full px-4">
              <Box className="flex justify-between items-start w-full">
                <div className="flex-1">
                  <div className="px-4">
                    <Button color="primary" variant="outlined">
                      {job?.isPublished ? "Actively Hiring" : "Not Hiring"}
                    </Button>
                  </div>
                  <h1 className="text-xl px-4 font-semibold">
                    {job?.position_name}
                  </h1>
                  <p className="px-4">{job?.organizationId?.orgName}</p>
                  <p className="px-4">
                    {job?.location_name?.city} ({job?.mode_of_working?.label})
                  </p>

                  <p className="px-4">
                    Posted on: {formatDistanceToNow(new Date(job.createdAt))}{" "}
                    ago
                  </p>
                </div>
                <div>
                  <MoreVert
                    className="cursor-pointer"
                    onClick={(e) => handleClick(e, job)}
                  />
                  <Menu
                    elevation={2}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseIcon}
                  >
                    <Tooltip title="Edit job position">
                      <MenuItem onClick={() => handleEditClick(job._id)}>
                        <EditIcon
                          color="primary"
                          aria-label="edit"
                          style={{
                            color: "#2196f3",
                            marginRight: "10px",
                          }}
                        />
                      </MenuItem>
                    </Tooltip>
                    <Tooltip title="Delete job position">
                      <MenuItem
                        onClick={() => handleDeleteConfirmation(job?._id)}
                      >
                        <DeleteOutlineIcon
                          color="primary"
                          aria-label="delete"
                          style={{
                            color: "#f50057",
                            marginRight: "10px",
                          }}
                        />
                      </MenuItem>
                    </Tooltip>
                  </Menu>
                </div>
              </Box>
            </Grid>
          ))
        ) : (
          <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
            <article className="flex items-center mb-1 text-red-500 gap-2">
              <Info className="!text-2xl" />
              <h1 className="text-lg font-semibold">Add Job Position</h1>
            </article>
            <p>No job position found. Please add job position.</p>
          </section>
        )}
      </Container>

      {/* for delete */}
      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this email communication, as
            this action cannot be undone.
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

export default ViewJobPosition;
