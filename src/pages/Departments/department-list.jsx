import { Delete, Edit, Warning } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage, IntlProvider } from "react-intl";
import { useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";

const DepartmentList = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const { handleAlert } = useContext(TestContext);
  const { organisationId } = useParams();
  let organizationId = organisationId;
  const [departmentList, setDepartmentList] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [departmentHeadName, setDepartmentHeadName] = useState("");
  const [departmentHeadDelegateName, setDepartmentHeadDelegateName] =
    useState("");
  const [departmentLocation, setDepartmentLocation] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [costCenterName, setCostCenterName] = useState("");
  const [costCenterDescription, setCostCenterDescription] = useState("");
  const [organizationLocationId, setOrganizationLocationId] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [locationID, setLocationId] = useState([]);
  const [enterDepartmentId, setEnterDepartmentId] = useState(false);
  const [numCharacters, setNumCharacters] = useState(0);
  console.log(departmentList);
  const Employees = [
    { label: "Ramesh patnayak", email: "ramesh1@gmail.com" },
    { label: "Raj Sathe", email: "rsathe@gmail.com" },
    { label: "Jay Jadhav", email: "jayjadhav1@gmail.com" },
    { label: "Vaibhav Pawar", email: "vaibhavp@gmail.com" },
    { label: "Ram Desai", email: "ramdesai1@gmail.com" },
    { label: "Vishal Solanki", email: "vsolanki1@gmail.com" },
    { label: "Viraj Raman", email: "vraman@gmail.com" },
    { label: "Harsh Modi", email: "harshmodi2@gmail.com" },
  ];

  const handleEditDepartment = async (index) => {
    setEditIndex(index);
    const selectedDepartment = departmentList.department[index];
    setDepartmentId(selectedDepartment.departmentId);
    setDepartmentName(selectedDepartment.departmentName);
    setCostCenterName(selectedDepartment.costCenterName);
    setDepartmentLocation(selectedDepartment.departmentLocation);
    setDepartmentHeadName(selectedDepartment.departmentHeadName);
    setDepartmentDescription(selectedDepartment.departmentDescription);
    setCostCenterDescription(selectedDepartment.costCenterDescription);
    setDepartmentHeadDelegateName(
      selectedDepartment.departmentHeadDelegateName
    );
    setOrganizationLocationId(locationID);

    setOpen(true);
    console.log("id is;", departmentId);
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organizationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      )
      .then((response) => {
        setLocations(response.data.locationsData);
      })
      .catch((error) => console.error("Error fetching locations:", error));
  }, [authToken, organizationId]);

  useEffect(() => {
    const fetchDepartmentList = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/department/get/${organizationId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        console.log(response);
        setDepartmentList(response.data.department);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };
    fetchDepartmentList();
    // eslint-disable-next-line
  }, [authToken]);

  const handleDepartmentIdChange = (e) => {
    const input = e.target.value;
    const charactersOnly = input.replace(/\d/g, "");

    if (charactersOnly.length <= numCharacters) {
      setDepartmentId(input);
    }
  };

  const handleDeleteDepartmentConfirmation = (index) => {
    setConfirmOpen(true);
    setDeleteIndex(index);
  };

  const handleDeleteDepartment = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/route/department/delete/${departmentList.department[deleteIndex]._id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/department/get/${organizationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setDepartmentList(response.data.department);

      handleAlert(true, "success", "Department deleted successfully");
    } catch (error) {
      console.error(error.response);
      handleAlert(true, "error", error.response);
    }
    setConfirmOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setEditIndex(null);
    setDepartmentName("");
    setDepartmentId("");
    setDepartmentDescription("");
    setCostCenterName("");
    setCostCenterDescription("");
    setDepartmentHeadName("");
    setDepartmentHeadDelegateName("");
    setOrganizationLocationId(locationID);
  };

  const handleUpdateDepartment = async (index) => {
    setEditIndex(index);

    const newDepartment = {
      departmentName,
      departmentId,
      departmentDescription,
      departmentLocation,
      costCenterName,
      costCenterDescription,
      departmentHeadName,
      departmentHeadDelegateName,
      organizationLocationId,
      organizationId: organizationId,
    };
    try {
      if (
        !departmentName ||
        !departmentHeadName ||
        !departmentHeadDelegateName ||
        !departmentLocation ||
        !organizationId
      ) {
        handleAlert(true, "error", "All fields are mandatory");
        return false;
      }
      await axios.put(
        `${process.env.REACT_APP_API}/route/department/update/${departmentList.department[index]._id}`,
        newDepartment,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/department/get/${organizationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setDepartmentList(response.data);
      handleAlert(true, "success", "Location updated successfully");
      handleClose();
    } catch (error) {
      console.error("error is: ", error.response.data.error);
      handleAlert(true, "error", error.response.data.error);
    }
  };

  return (
    <div>
      {departmentList?.length === 0 ? (
        // <div className="flex items-center justify-center h-screen">
        <Typography variant="h5" className="w-50 text-center mb-2 text-red-600">
          <Warning /> No departments added, please add department first.
        </Typography>
      ) : (
        // </div>
        <div style={{ padding: "1.5rem" }}>
          <Typography variant="h4" className="w-50 text-center mb-2">
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
              {departmentList?.map((department, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } border-b dark:border-neutral-500 !font-medium`}
                >
                  <td className="py-2 px-3">{index + 1}</td>
                  <td className="py-2 px-3">{department.departmentName}</td>
                  <td className="py-2 px-3">{department.departmentHeadName}</td>
                  <td className="py-2 px-3">
                    {department.departmentHeadDelegateName}
                  </td>
                  <td className="py-2 px-3">
                    {department.departmentLocation.shortName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <IconButton
                      onClick={() => handleEditDepartment(index)}
                      aria-label="edit"
                    >
                      <Edit className="!text-xl" color="success" />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleDeleteDepartmentConfirmation(index);
                        setDeleteIndex(index);
                      }}
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
      <IntlProvider>
        <form>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
              <FormattedMessage
                id="editDepartment"
                defaultMessage="Edit Department"
              />
            </DialogTitle>
            <DialogContent>
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
              <Autocomplete
                size="small"
                fullWidth
                style={{ marginBottom: "10px" }}
                disablePortal
                value={locations.map(
                  (thisLocation) => thisLocation === departmentLocation
                )}
                id="departmentLocation"
                name="departmentLocation"
                options={locations}
                onChange={(e, value) => {
                  setLocationId(value._id);

                  // handleChange({
                  //   target: { name: "departmentLocation", value: locationID },
                  // });
                }}
                isOptionEqualToValue={(option, value) =>
                  option.shortName === value.shortName
                }
                getOptionLabel={(option) => option.shortName}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Enter Department location"
                    required
                  />
                )}
              />
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
              {!departmentId}
              <Autocomplete
                size="small"
                fullWidth
                style={{ marginBottom: "10px" }}
                disablePortal
                id="departmentHeadName"
                options={Employees}
                onChange={(e, value) => {
                  // const headName = value ? value.label : "";
                  // handleChange({
                  //   target: { name: "departmentHeadName", value: headName },
                  // });
                }}
                isOptionEqualToValue={(option, value) =>
                  option.label === value.label
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add Department head name"
                    required
                  />
                )}
              />
              <Autocomplete
                size="small"
                fullWidth
                style={{ marginBottom: "10px" }}
                disablePortal
                id="departmentHeadDelegateName"
                options={Employees}
                onChange={(e, value) => {
                  // const delegateName = value ? value.label : "";
                  // handleChange({
                  //   target: {
                  //     name: "departmentHeadDelegateName",
                  //     value: delegateName,
                  //   },
                  // });
                }}
                isOptionEqualToValue={(option, value) =>
                  option.label === value.label
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add Department head delegate name"
                  />
                )}
              />
              <Button
                fullWidth={false}
                variant="contained"
                className="w-[100px] content-center text-white m-auto"
                type="submit"
                style={{ backgroundColor: "#1d6eb7", color: "white" }}
              >
                Submit
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </Button>
              <Button
                onClick={() => {
                  handleUpdateDepartment(editIndex);
                }}
                color="primary"
              >
                {editIndex !== null ? (
                  <FormattedMessage
                    id="saveChanges"
                    defaultMessage="Save Changes"
                  />
                ) : (
                  <FormattedMessage
                    id="addLocation"
                    defaultMessage="Add Location"
                  />
                )}
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this department?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteDepartment(deleteIndex)}
                color="primary"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      </IntlProvider>
    </div>
  );
};

export default DepartmentList;
