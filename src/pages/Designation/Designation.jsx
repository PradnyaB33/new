import React, { useEffect, useState, useContext } from "react";
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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import axios from "axios";
import { useParams } from "react-router-dom";
import Setup from "../SetUpOrganization/Setup";
import { UseContext } from "../../State/UseState/UseContext";

const Designation = () => {
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

  const [designationId, setDesignationId] = useState("");
  const [enterDesignationId, setEnterDesignationId] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [designationToDelete, setDesignationToDelete] = useState(null);
  const [trackedId, setTrackedId] = useState("");
  const [showUpdateConfirmationDialog, setShowUpdateConfirmationDialog] =
    useState(false);

  // useEffect(() =>{
  // !done for the day guys
  // const filteredDesignations = designation.filter(
  //     (d) => d.organizationId === organisationId
  //   )

  // },[])

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
    if (!designationName.trim()) {
      // todo setDesignationError("Designation Name is required.");
      return;
    }

    if (designationIdRequired && !designationId.trim()) {
      // ! setDesignationError("Designation ID is required.");
      return;
    }

    if (editMode) {
      setShowUpdateConfirmationDialog(true);
    } else {
      generateDesignationIds();

      axios
        .post(`${process.env.REACT_APP_API}/route/designation/create`, data)
        .then((response) => {
          setAppAlert({
            alert: true,
            type: "success",
            msg: "Designation Added successfully!",
          });
          console.log("Designation added successfully:", response.data);
          fetchDesignations();
          handleClose(); // ? Close the dialog after adding
        })
        .catch((error) => {
          setAppAlert({
            alert: true,
            type: "error",
            msg: "Error adding designation",
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
          msg: "Designation updated successfully!",
        });
        fetchDesignations();
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
          console.log("Designation deleted successfully");
          setAppAlert({
            alert: true,
            type: "success",
            msg: "designation deleted successfully",
          })
          fetchDesignations();
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

  const fetchDesignations = () => {
    axios
      .get(
        `${process.env.REACT_APP_API}/route/designation/create/${organisationId}`
      )
      .then((response) => {
        setDesignation(response.data.designations);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchDesignations();
    // eslint-disable-next-line
  }, []);

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
          <article className="SetupSection bg-white w-[80%]  h-max shadow-md rounded-sm border  items-center">
            <div className="p-4 border-b-[.5px] flex items-center justify-between gap-3 w-full border-gray-300">
              <div className="flex items-center gap-3 ">
                <div className="rounded-full bg-sky-500 h-[30px] w-[30px] flex items-center justify-center">
                  <BadgeOutlinedIcon className="!text-lg text-white" />
                </div>
                <h1 className="!text-lg tracking-wide">Add Designation</h1>
              </div>
              <Button
                className="!font-semibold !bg-sky-500 flex items-center gap-2"
                onClick={handleAddDesignation}
                variant="contained"
              >
                Create Designation
              </Button>
            </div>

            <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
              <table className="min-w-full bg-white text-left !text-sm font-light">
                <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                  <tr className="!font-semibold ">
                    <th scope="col" className="!text-left pl-8 py-3 w-1/12">
                      SR NO
                    </th>
                    <th scope="col" className="py-3 w-8/12">
                      Designation Name
                    </th>
                    <th scope="col" className="px-6 py-3 w-2/12">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody >
                  {designation.length === 0 ? (
                    <tr className="!w-full !font-medium border-b text relative">
                      <td className="font-bold p-3">No designations found</td>
                    </tr>
                  ) : (
                    designation.map((data, id) => (
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
                  required
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
              <DialogActions>
                <div className="flex flex-col w-[95%] m-auto gap-3 mb-2">
                  <Button variant="contained" color="primary" onClick={handleAddDesignation}>
                    {editMode ? "Update" : "Add"}
                  </Button>
                  <Button variant="contained" fullWidth color="error" onClick={handleClose}>
                    Cancel
                  </Button>
                </div>
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
                <div className="flex w-[95%] flex-col gap-3 m-auto mb-2">
                  <Button variant="contained" fullWidth color="error" onClick={handleConfirmDelete}>
                    Delete
                  </Button>
                  <Button variant="contained" fullWidth color="primary" onClick={handleCloseConfirmationDialog}>
                    Cancel
                  </Button>
                </div>
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
