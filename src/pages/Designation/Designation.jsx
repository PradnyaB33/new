import { Add, Info } from "@mui/icons-material";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import Setup from "../SetUpOrganization/Setup";

const Designation = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [click, setClick] = useState(false);
  const { organisationId } = useParams();
  const [designationIdRequired, setDesignationIdRequired] = useState(false);
  const { setAppAlert } = useContext(UseContext);
  const [prefixRequired, setPrefixRequired] = useState(false);
  const [prefixLength, setPrefixLength] = useState(0);
  const [numCharacters, setNumCharacters] = useState(1);
  const [designation, setDesignation] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [designationName, setDesignationName] = useState("");
  const [counter, setCounter] = useState(1);
  const queryClient = useQueryClient();
  const [designationId, setDesignationId] = useState("");
  const [enterDesignationId, setEnterDesignationId] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [designationToDelete, setDesignationToDelete] = useState(null);
  const [trackedId, setTrackedId] = useState("");
  const [showUpdateConfirmationDialog, setShowUpdateConfirmationDialog] =
    useState(false);

  const handleClick = (id) => {
    setClick(!click);
    setDesignationId("");
    setPrefixRequired(false);
    setPrefixLength(0);
    setNumCharacters(1);
    setDesignationName("");
    setEditMode(false);
    setCounter(1);
    setEnterDesignationId(false);

    axios
      .get(`${process.env.REACT_APP_API}/route/designation/create/${id}`)
      .then((response) => {
        setDesignation(response.data.designation);
        console.log(designation);
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
    setClick(!click);
    setDesignationId("");
    setPrefixRequired(false);
    setPrefixLength(0);
    setNumCharacters(1);
    setDesignationName("");
    setCounter(1);
    setEditMode(true);
    setEnterDesignationId(false);
    setTrackedId(id);

    axios
      .get(`${process.env.REACT_APP_API}/route/designation/findone/${id}`)
      .then((response) => {
        console.log(id);
        console.log(response);
        setDesignationName(response.data.designation.designationName);
        setDesignationId(response.data.designation.designationId);
        setEnterDesignationId(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleAddDesignation = () => {
    setPrefixRequired(false);
    setClick(true);
    if (!designationName) return;

    if (editMode) {
      setShowUpdateConfirmationDialog(true);
    } else {
      generateDesignationIds();

      axios
        .post(`${process.env.REACT_APP_API}/route/designation/create`, data, {
          headers: {
            Authorization: authToken,
          },
        })
        .then((response) => {
          setAppAlert({
            alert: true,
            type: "success",
            msg: "Designation added successfully!",
          });
          console.log("Designation added successfully:", response.data);
          queryClient.invalidateQueries("designations");
          handleClose(); // Close the dialog after adding
        })
        .catch((error) => {
          setAppAlert({
            alert: true,
            type: "error",
            msg: error.response.data.message,
          });
          console.error("Error adding designation:", error);
        });
    }
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
        setAppAlert({
          alert: true,
          type: "success",
          msg: "Designation updated successfully.",
        });
        queryClient.invalidateQueries("designations");
        handleClick();
        setClick(false);
      })
      .catch((error) => {
        console.error("Error updating designation:", error);
        setAppAlert({
          alert: true,
          type: "error",
          msg: "Error adding designation",
        });
      });
  };

  const handleClose = () => {
    // setDesignationError("");
    setDesignationIdRequired(false);
    setPrefixRequired(false);
    setPrefixLength(0);
    setNumCharacters(1);
    setDesignationName("");
    setClick(false);
    setEditMode(false);
    setDesignationId("");
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
          console.log("Designation deleted successfully.");
          setAppAlert({
            alert: true,
            type: "success",
            msg: "Designation deleted successfully.",
          });
          queryClient.invalidateQueries("designations");
        })
        .catch((error) => {
          console.error("Error deleting designation:", error);
          setAppAlert({
            alert: true,
            type: "error",
            msg: "Error deleting designation",
          });
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

  const { data: data2 } = useQuery("designations", async () => {
    try {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/designation/create/${organisationId}`
      );
      return resp.data.designations;
    } catch (error) {
      console.error("Error fetching data :", error.message);
    }
  });

  const getPrefixFromName = (name, length) => {
    return name.substring(0, length);
  };

  const data = {
    designationName,
    designationId,
    organizationId: organisationId,
  };

  return (
    <>
      <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
        <Setup>
          <article className="SetupSection bg-white lg:w-[80%] w-full  h-max shadow-md rounded-sm border  items-center">
            <div className="p-4 border-b-[.5px] flex  justify-between gap-3 w-full border-gray-300">
              <div className="flex gap-3 ">
                <div className="mt-1">
                  <AssignmentIndOutlinedIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Designation</h1>
                  <p className="text-xs text-gray-600">
                    Add multiple designation to your organisation.
                  </p>
                </div>
              </div>
              <Button
                className="!font-semibold !bg-sky-500 flex items-center gap-2"
                onClick={handleAddDesignation}
                variant="contained"
              >
                <Add />
                Add Designation
              </Button>
            </div>
            {data2?.length > 0 ? (
              <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
                <table className="min-w-full bg-white text-left !text-sm font-light">
                  <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                    <tr className="!font-semibold ">
                      <th scope="col" className="!text-left pl-8 py-3 w-1/12">
                        Sr. No
                      </th>
                      <th scope="col" className="py-3 w-8/12">
                        Designation Name
                      </th>
                      <th scope="col" className="px-6 py-3 w-2/12">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data2?.map((data, id) => (
                      <tr className="!font-medium border-b" key={id}>
                        <td className="!text-left pl-9">{id + 1}</td>
                        <td className=" py-3">{data?.designationName}</td>
                        <td className="px-2">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                <article className="flex items-center mb-1 text-red-500 gap-2">
                  <Info className="text-2xl" />
                  <h1 className="text-lg font-semibold">Add Designation</h1>
                </article>
                <p>No designation found. Please add a designation.</p>
              </section>
            )}

            <Dialog open={click} onClose={handleClose} maxWidth="sm" fullWidth>
              <h1 className="text-xl pl-2 font-semibold font-sans mt-4 ml-4">
                {editMode ? "Edit Designation" : "Add Designation"}
              </h1>
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
                  onChange={(e) => {
                    if (e.target.value.length <= 35) {
                      setDesignationName(e.target.value);
                    }
                  }}
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
                      onChange={() =>
                        setEnterDesignationId(!enterDesignationId)
                      }
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
                  </>
                )}
                {!enterDesignationId && (
                  <>
                    <p className="font-extrabold">
                      Note : you can add numbers by default
                    </p>
                  </>
                )}

                {enterDesignationId && (
                  <>
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
                    <p className="font-extrabold my-2">
                      Note 2: If the number of characters is 0, only numeric
                      values are accepted.
                    </p>
                  </>
                )}

                <TextField
                  style={{ marginTop: "1rem" }}
                  name="designationId"
                  size="small"
                  className="w-full"
                  label="Designation ID"
                  type="text"
                  value={designationId}
                  onChange={handleDesignationIdChange}
                />
                {!designationId}
              </DialogContent>

              <div className="mt-5  mb-4 flex  gap-2  mr-4 justify-end">
                <Button color="error" variant="outlined" onClick={handleClose}>
                  cancel
                </Button>
                <Button
                  onClick={handleAddDesignation}
                  variant="contained"
                  color="primary"
                >
                  {editMode ? "Apply" : "Submit"}
                </Button>
              </div>
            </Dialog>
            <Dialog
              open={showConfirmationDialog}
              onClose={handleCloseConfirmationDialog}
            >
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                <p>
                  Please confirm your decision to delete this designation, as
                  this action cannot be undone.
                </p>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseConfirmationDialog}
                  variant="outlined"
                  color="primary"
                  size="small"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleConfirmDelete}
                  color="error"
                >
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
          </article>
        </Setup>
      </section>
    </>
  );
};

export default Designation;
