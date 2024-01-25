import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import axios from "axios";
import { Delete, Edit, Warning } from "@mui/icons-material";
import { useMutation, useQueryClient } from "react-query";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  FormControl,
  Select,
  InputLabel,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from "@mui/material";

const DepartmentList = () => {
  const { handleAlert } = useContext(TestContext);
  const [departmentName, setDepartmentName] = useState("");
  const [headList, setHeadList] = useState([]);
  const [delegateHeadList, setDelegateHeadList] = useState([]);
  const [numCharacters, setNumCharacters] = useState(0);
  const [enterDepartmentId, setEnterDepartmentId] = useState(false);
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [departmentLocation, setDepartmentLocation] = useState("");
  const [costCenterName, setCostCenterName] = useState("");
  const [costCenterDescription, setCostCenterDescription] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departmentHeadName, setDepartmentHeadName] = useState("");
  const [departmentHeadDelegateName, setDepartmentHeadDelegateName] =
    useState("");
  const [locations, setLocations] = useState([]);
  const { cookies } = useContext(UseContext);
  const [locationID, setLocationID] = useState("");
  const [deptID, setDeptID] = useState("");
  const authToken = cookies["aeigs"];
  const { organisationId } = useParams();
  const queryClient = useQueryClient();
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [open, setOpen] = useState(false);

  //pull the department list
  const [departmentList, setDepartmentList] = useState([]);

  useEffect(() => {
    (async () => {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get-department-head/${organisationId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      setHeadList(resp.data.employees);
      console.log(resp.data.employees);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get-department-delegate-head/${organisationId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      setDelegateHeadList(resp.data.employees);
      console.log(resp.data.employees);
    })();
  }, []);

  const fetchDepartmentList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/department/get/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      setDepartmentList(response.data.department);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Department");
    }
  };
  useEffect(() => {
    fetchDepartmentList();
    // eslint-disable-next-line
  }, [deptID, locationID]);

  // Delete Query for deleting Single Department
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDepartmentIdChange = (e) => {
    const input = e.target.value;
    const charactersOnly = input.replace(/\d/g, "");

    if (charactersOnly.length <= numCharacters) {
      setDepartmentId(input);
    }
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    setDepartmentList((department) =>
      department.filter((department) => department._id !== id)
    );
    setDeleteConfirmation(null);
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      )
      .then((response) => {
        setLocations(response.data.locationsData);
        console.log("locations are: ", response.data);
      })
      .catch((error) => console.error("Error fetching locations:", error));
  }, [authToken, organisationId]);

  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/department/delete/${organisationId}/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("department");
        handleAlert(true, "success", "Department deleted succesfully");
      },
    }
  );

  //! update functionality

  const handleUpdate = async (idx) => {
    setOpen(true);
    const selectedDept = departmentList[idx];
    console.log(selectedDept);
    setDepartmentName(selectedDept.departmentName);
    setLocationID(selectedDept.departmentLocation._id);
    setDepartmentDescription(selectedDept.departmentDescription);
    setDepartmentLocation(selectedDept.departmentLocation.shortName);
    console.log(selectedDept.departmentLocation.shortName);
    setCostCenterName(selectedDept.costCenterName);
    setCostCenterDescription(selectedDept.costCenterDescription);
    setDepartmentId(selectedDept.departmentId);
    setDeptID(selectedDept._id);
    setDepartmentHeadName(selectedDept.departmentHeadName);
    setDepartmentHeadDelegateName(selectedDept.departmentHeadDelegateName);
    console.log(deptID);
    console.log(locationID);
  };

  const handleUpdateRequest = async () => {
    try {
      const resp = await axios.put(
        `${process.env.REACT_APP_API}/route/department/update`,
        {
          departmentHeadName,
          departmentDescription,
          departmentLocation: locationID,
          costCenterName,
          costCenterDescription,
          departmentId,
          departmentHeadName,
          departmentHeadDelegateName,
          deptID,
        },
        {
          headers: { Authorization: authToken },
        }
      );

      handleAlert(true, "success", "Department updated successfully");
      console.log(resp);
      setOpen(false);
      fetchDepartmentList();
    } catch (error) {
      handleAlert(true, "error", "Failed to update department");
    }
  };

  const handleDataChange = (e, fieldName) => {
    const value = e.target.value;

    if (fieldName === "head") {
      setDepartmentHeadName(value);
    } else if (fieldName === "delegate") {
      setDepartmentHeadDelegateName(value);
    }
  };

  return (
    <>
      {departmentList?.length === 0 ? (
        <Typography variant="h5" className="text-center mb-2 text-red-600">
          <Warning /> No departments added, please add department first.
        </Typography>
      ) : (
        <div className="p-4">
          <Typography variant="h4" className="text-center mb-6">
            Department List
          </Typography>
          <table className="min-w-full bg-white text-left text-sm font-light">
            <thead className="border-b bg-gray-300 font-medium dark:border-neutral-500">
              <tr className="!font-medium">
                <th scope="col" className="px-3 py-3 whitespace-nowrap">
                  Sr. No
                </th>
                <th scope="col" className="px-3 py-3 ">
                  Department Name
                </th>
                <th scope="col" className="px-3 py-3 ">
                  Department Head
                </th>
                <th scope="col" className="px-3 py-3 ">
                  Department Head Delegate
                </th>
                <th scope="col" className="px-3 py-3 ">
                  Department Location
                </th>
                <th scope="col" className="px-3 py-3 ">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {departmentList?.map((department, id) => (
                <tr
                  key={id}
                  className={`${
                    id % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } border-b dark:border-neutral-500 !font-medium`}
                >
                  <td className="py-2 px-3">{id + 1}</td>
                  <td className="py-2 px-3">{department?.departmentName}</td>
                  <td className="py-2 px-3">
                    {department?.departmentHeadName}
                  </td>
                  <td className="py-2 px-3">
                    {department?.departmentHeadDelegateName}
                  </td>
                  <td className="py-2 px-3">
                    {department?.departmentLocation.city}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <IconButton
                      onClick={() => handleUpdate(id)}
                      aria-label="edit"
                    >
                      <Edit className="!text-xl" color="success" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteConfirmation(department._id)}
                      aria-label="delete"
                    >
                      <Delete className="!text-xl" color="error" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* this dialogue for deleting single department*/}
      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle color={"error"}>
          <Warning color="error" /> All information of Department will be
          deleted. Are you sure you want to delete it?
        </DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this department, as this
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

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogActions>
          <DialogContent>
            <h1 className="text-2xl">Edit Department</h1>
            <TextField
              required
              inputProps={{
                pattern: "^[a-zA-Z0-9 ]*$",
                minLength: 2,
                maxLength: 40,
                value: departmentName,
              }}
              helperText={
                "Department Name cannot repeat. No special characters, Max 5 words."
              }
              size="small"
              fullWidth
              style={{ margin: "10px 0" }}
              name="departmentName"
              label="Department Name"
              type="text"
              placeholder="Enter Department name"
              onChange={(e) => setDepartmentName(e.target.value)}
            />
            <TextField
              size="small"
              inputProps={{
                minLength: 8,
                maxLength: 250,
                value: departmentDescription,
              }}
              helperText={"Max 250 characters allowed"}
              fullWidth
              style={{ marginBottom: "10px" }}
              multiline
              name="departmentDescription"
              label="Department Description"
              type="text"
              placeholder="Enter Department Description"
              onChange={(e) => setDepartmentDescription(e.target.value)}
            />
            <FormControl
              required
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
              size="small"
              variant="outlined" // Add variant outlined for better visual separation
            >
              <InputLabel
                id="holiday-type-label"
                // Ensure the label doesn't cut into the border
                style={{
                  backgroundColor: "white", // Set the background color to match the container
                  paddingLeft: 8, // Adjust left padding for better alignment
                }}
              >
                Select Location
              </InputLabel>
              <Select
                labelId="holiday-type-label"
                id="demo-simple-select"
                value={departmentLocation}
                label="Select Location"
                // Add label prop for better alignment
              >
                {locations.map((data, index) => (
                  <MenuItem key={index} value={data.shortName}>
                    {data.shortName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              required
              size="small"
              fullWidth
              style={{ marginBottom: "10px" }}
              name="costCenterName"
              inputProps={{
                value: costCenterName,
              }}
              label="Cost Center Name"
              type="text"
              placeholder="Enter Cost Center"
              onChange={(e) => setCostCenterName(e.target.value)}
            />

            <TextField
              size="small"
              fullWidth
              style={{ marginBottom: "10px" }}
              inputProps={{
                minLength: 8,
                maxLength: 50,
                value: costCenterDescription,
              }}
              name="costCenterDescription"
              label="Cost Center description"
              multiline
              type="text"
              placeholder="Enter Cost Center description"
              onChange={(e) => setCostCenterDescription(e.target.value)}
            />
            <div
              style={{
                width: "100%",
                display: "flex",
                gap: "8px",
                marginBottom: "-1rem",
              }}
            >
              <FormControlLabel
                style={{
                  width: "85%",
                  alignItems: "center",
                }}
                control={
                  <Checkbox
                    checked={enterDepartmentId}
                    onChange={() => setEnterDepartmentId(!enterDepartmentId)}
                  />
                }
                label="Use prefix in ID"
              />
              {/* Make departmentIdRequired And prefixRequired variable and not string. */}

              {enterDepartmentId && (
                <TextField
                  style={{ marginTop: "1rem" }}
                  inputProps={{
                    min: 1,
                  }}
                  value={numCharacters}
                  required
                  name="numCharacters"
                  size="small"
                  className="w-full"
                  label="no of Characters"
                  type="number"
                  onChange={(e) => setNumCharacters(e.target.value)}
                />
              )}
            </div>
            {enterDepartmentId && (
              <p
                style={{ alignSelf: "start", margin: "12px 0" }}
                className="font-extralight"
              >
                Note: Please adjust the character length of prefix in ID.
              </p>
            )}
            {!enterDepartmentId && (
              <p
                className="font-extralight"
                style={{ alignSelf: "start", margin: "5px 0" }}
              >
                Note : No prefix added to Department ID.
              </p>
            )}
            <TextField
              required
              name="departmentId"
              style={{ marginBottom: "10px" }}
              size="small"
              className="w-full"
              label="Department ID"
              type="text"
              value={departmentId}
              onChange={handleDepartmentIdChange}
            />

            <FormControl
              required
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
              size="small"
              variant="outlined" // Add variant outlined for better visual separation
            >
              <InputLabel
                id="holiday-type-label"
                // Ensure the label doesn't cut into the border
                style={{
                  backgroundColor: "white", // Set the background color to match the container
                  paddingLeft: 8, // Adjust left padding for better alignment
                }}
              >
                Add Department Head Name
              </InputLabel>
              <Select
                labelId="holiday-type-label"
                id="demo-simple-select"
                value={departmentHeadName}
                label="Add department Head Name"
                onChange={(e) => handleDataChange(e, "head")}
                // Add label prop for better alignment
              >
                {headList.map((data, index) => (
                  <MenuItem
                    key={index}
                    value={data.first_name + " " + data.last_name}
                  >
                    {data.first_name + " " + data.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              required
              style={{
                width: "100%",
              }}
              size="small"
              variant="outlined" // Add variant outlined for better visual separation
            >
              <InputLabel
                id="holiday-type-label"
                // Ensure the label doesn't cut into the border
                style={{
                  backgroundColor: "white", // Set the background color to match the container
                  paddingLeft: 8, // Adjust left padding for better alignment
                }}
              >
                Add Department Head Delegate Name
              </InputLabel>
              <Select
                labelId="holiday-type-label"
                id="demo-simple-select"
                value={departmentHeadDelegateName}
                label="Add Department head delegate name"
                onChange={(e) => handleDataChange(e, "delegate")}
                // Add label prop for better alignment
              >
                {delegateHeadList.map((data, index) => (
                  <MenuItem
                    key={index}
                    value={data.first_name + " " + data.last_name}
                  >
                    {data?.first_name + " " + data?.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="flex gap-3 mt-4 ">
              <Button
                color="success"
                size="small"
                onClick={handleUpdateRequest}
                variant="contained"
              >
                Confirm
              </Button>
              <Button
                size="small"
                onClick={handleClose}
                color="error"
                variant="contained"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DepartmentList;
