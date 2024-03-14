import {
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import axios from "axios";
import Setup from "../SetUpOrganization/Setup";

const Designation = () => {
  const [click, setClick] = useState(false);
  const [designationIdRequired, setDesignationIdRequired] = useState(false);
  const [prefixRequired, setPrefixRequired] = useState(false);
  const [prefixLength, setPrefixLength] = useState(0);
  const [numCharacters, setNumCharacters] = useState(0);
  const [designation, setDesignation] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [designationName, setDesignationName] = useState("");
  const [counter, setCounter] = useState(1);
  const [designationError, setDesignationError] = useState("");
  const [designationId, setDesignationId] = useState("");
  const [enterDesignationId, setEnterDesignationId] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [designationToDelete, setDesignationToDelete] = useState(null);
  const [trackedId, setTrackedId] = useState("");
  const [showUpdateConfirmationDialog, setShowUpdateConfirmationDialog] =
    useState(false);

  const handleClick = (id) => {
    setDesignationError("");
    setClick(!click);
    setDesignationId("");
    setPrefixRequired(false);
    setPrefixLength(0);
    setNumCharacters(0);
    setDesignationName("");
    setEditMode(false);
    setCounter(1);
    setEnterDesignationId(false);

    axios
      .get(`${process.env.REACT_APP_API}/route/designation/create/${id}`)
      .then((response) => {
        setTrackedId(id);
        setDesignationName(response.data.designation.designationName);
        setDesignationId(response.data.designation.designationId);
        setPrefixRequired(response.data.designation.prefixRequired || false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleClickEdit = (id) => {
    setDesignationError("");
    setClick(!click);
    setDesignationId("");
    setPrefixRequired(false);
    setPrefixLength(0);
    setNumCharacters(0);
    setDesignationName("");
    setCounter(1);
    setEditMode(true);
    setEnterDesignationId(false);
    setTrackedId(id);

    axios
      .get(`${process.env.REACT_APP_API}/route/designation/create/${id}`)
      .then((response) => {
        setDesignationName(response.data.designation.designationName);
        setDesignationId(response.data.designation.designationId);
        setEnterDesignationId(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleAddDesignation = () => {
    if (!designationName.trim()) {
      setDesignationError("Designation Name is required.");
      return;
    }

    if (designationIdRequired && !designationId.trim()) {
      setDesignationError("Designation ID is required.");
      return;
    }

    if (editMode) {
      setShowUpdateConfirmationDialog(true);
    } else {
      generateDesignationIds();

      axios
        .post(`${process.env.REACT_APP_API}/route/designation/create`, data)
        .then((response) => {
          console.log("Designation added successfully:", response.data);
          fetchDesignations();
          handleClick();
        })
        .catch((error) => {
          console.error("Error adding designation:", error);
        });
    }

    setClick(false);
  };

  const handleUpdateConfirmation = () => {
    setShowUpdateConfirmationDialog(false);

    const patchData = {
      designationName,
      designationId,
    };
    axios
      .patch(
        `${process.env.REACT_APP_API}/route/designation/create/${trackedId}`,
        patchData
      )
      .then((response) => {
        console.log("Designation updated successfully:", response.data);
        fetchDesignations();
        handleClick();
        setClick(false);
      })
      .catch((error) => {
        console.error("Error updating designation:", error);
      });
  };

  const handleClose = () => {
    setDesignationError("");
    setDesignationIdRequired(false);
    setPrefixRequired(false);
    setPrefixLength(0);
    setNumCharacters(0);
    setDesignationName("");
    setClick(false);
  };

  const generateDesignationIds = () => {
    if (designationIdRequired) {
      let generatedIds = "";
      for (let i = 0; i < 1; i++) {
        let designationId = "";
        const prefix = getPrefixFromName(designationName, prefixLength);
        designationId += prefix;
        designationId += counter.toString().padStart(numCharacters, "0");
        generatedIds = designationId;
        setDesignationId(generatedIds);
        setCounter((prevCounter) => prevCounter + 1);
      }
    }
  };

  const handleDesignationIdChange = (e) => {
    const input = e.target.value;
    const charactersOnly = input.replace(/\d/g, "");

    if (charactersOnly.length <= numCharacters) {
      setDesignationId(input);
    }
  };

  const handleDeleteDesignation = (id) => {
    setDesignationToDelete(id);
    setShowConfirmationDialog(true);
  };

  const handleConfirmDelete = () => {
    if (designationToDelete) {
      axios
        .delete(
          `${process.env.REACT_APP_API}/route/designation/create/${designationToDelete}`
        )
        .then(() => {
          console.log("Designation deleted successfully");
          fetchDesignations();
        })
        .catch((error) => {
          console.error("Error deleting designation:", error);
        })
        .finally(() => {
          setDesignationToDelete(null);
          setShowConfirmationDialog(false);
        });
    }
  };

  const handleCloseConfirmationDialog = () => {
    setShowConfirmationDialog(false);
    setDesignationToDelete(null);
  };

  const fetchDesignations = () => {
    axios
      .get(`${process.env.REACT_APP_API}/route/designation/create`)
      .then((response) => {
        setDesignation(response.data.designations);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const getPrefixFromName = (name, length) => {
    return name.substring(0, length);
  };

  const data = {
    designationName,
    designationId,
  };

  return (
    <>
      <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
        <Setup>
          {/* <div className='right-4 top-[8rem]'>
  
        </div> */}

          <Dialog open={click} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
              {editMode ? "Edit Designation" : "Add Designation"}
            </DialogTitle>
            <DialogContent>
              <TextField
                style={{ marginTop: "1rem", marginBottom: "1rem" }}
                required
                name="name"
                size="small"
                className="w-full"
                label="Designation Name"
                type="text"
                value={designationName}
                onChange={(e) => setDesignationName(e.target.value)}
                error={designationError !== ""}
                helperText={designationError}
              />

              {designationIdRequired && (
                <>
                  {prefixRequired && (
                    <TextField
                      style={{ marginBottom: "1rem", marginTop: "1rem" }}
                      required
                      name="prefixLength"
                      size="small"
                      className="w-full"
                      label="Prefix Length"
                      type="number"
                      value={prefixLength}
                      onChange={(e) => setPrefixLength(e.target.value)}
                      inputProps={{ min: "1", max: "6" }}
                    />
                  )}
                </>
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={enterDesignationId}
                    onChange={() => setEnterDesignationId(!enterDesignationId)}
                  />
                }
                label="Prefix Required"
              />
              {enterDesignationId && (
                <>
                  <p className="font-extrabold">
                    Note 1: Please provide the length of prefix characters
                    below.
                  </p>
                  <p className="font-extrabold">
                    Note 2: If the number of characters is 0, only numeric
                    values are accepted.
                  </p>
                </>
              )}
              {!enterDesignationId && (
                <p className="font-extrabold">
                  Note : you can add numbers by default
                </p>
              )}

              {enterDesignationId && (
                <TextField
                  style={{ marginTop: "1rem" }}
                  required
                  name="numCharacters"
                  size="small"
                  className="w-full"
                  label="no of Characters"
                  type="number"
                  value={numCharacters}
                  onChange={(e) => setNumCharacters(e.target.value)}
                />
              )}

              <TextField
                style={{ marginBottom: "1rem", marginTop: "1rem" }}
                required
                name="designationId"
                size="small"
                className="w-full"
                label="Designation ID"
                type="text"
                value={designationId}
                onChange={handleDesignationIdChange}
                error={designationError !== ""}
                helperText={designationError}
              />
              {!designationId}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={handleClose}>
                Cancel
              </Button>
              <Button color="error" onClick={handleAddDesignation}>
                {editMode ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={showConfirmationDialog}
            onClose={handleCloseConfirmationDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this designation?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={handleCloseConfirmationDialog}>
                Cancel
              </Button>
              <Button color="error" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={showUpdateConfirmationDialog}
            onClose={() => setShowUpdateConfirmationDialog(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to update this designation?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                color="primary"
                onClick={() => setShowUpdateConfirmationDialog(false)}
              >
                Cancel
              </Button>
              <Button color="error" onClick={handleUpdateConfirmation}>
                Update
              </Button>
            </DialogActions>
          </Dialog>

          <Container
            className="relative gap-5 flex flex-col items-center h-fit"
            style={{
              borderRadius: "10px",
              maxWidth: "100%",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            }}
          >
            <div className="flex justify-between w-full my-2 m-0">
              <h1 style={{ fontSize: "2rem" }}>Add Designation</h1>
              <Button
                onClick={handleClick}
                className="flex justify-end items-center"
                variant="contained"
                color="info"
              >
                Add Designation
              </Button>
            </div>
            <div
              className="py-2"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "2px solid rgb(177, 177, 177)",
                width: "100%",
                marginTop: "1rem",
                borderTop: "2px solid rgb(177, 177, 177)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "11rem",
                  width: "100%",
                }}
              >
                <h1>Sr. No</h1>
                <h4 style={{ margin: 0, color: "black" }}>Designation Name</h4>
                <div
                  style={{ display: "flex", gap: "10px", marginLeft: "auto" }}
                >
                  <h1>Edit</h1>
                  <h1>Delete</h1>
                </div>
              </div>
            </div>
            {designation.length === 0 && (
              <h1 className="text-center">no designations right now</h1>
            )}
            {designation && Array.isArray(designation) ? (
              designation.map((data, index) => (
                <div
                  key={data._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom:
                      index < designation.length - 1
                        ? "2px solid rgb(177, 177, 177)"
                        : "none",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12.7rem",
                      width: "100%",
                    }}
                  >
                    <h1>{index + 1}</h1>
                    <h4 style={{ margin: 0, color: "black" }}>
                      {data.designationName}
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginLeft: "auto",
                      }}
                    >
                      <IconButton
                        color="primary"
                        aria-label="edit"
                        onClick={() => handleClickEdit(data._id)}
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        aria-label="delete"
                        onClick={() => handleDeleteDesignation(data._id)}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </Container>
        </Setup>
      </section>
    </>
  );
};

export default Designation;
