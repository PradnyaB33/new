import {
  Checkbox,
  Container,
  FormControlLabel,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import UserSelf from "../UserSelfLearning/UserSelf";
const AddDepartments = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const [dept_name, setDepartmentName] = useState("");
  const [dept_description, setDepartmentDescription] = useState("");
  const [dept_location, setDepartmentLocation] = useState("");
  const [dept_cost_center_name, setDepartmentCostCenterName] = useState("");
  const [dept_cost_center_description, setDepartmentCostCenterDescription] =
    useState("");
  const [dept_id, setDepartmentId] = useState("");
  const [dept_cost_center_id, setDepartmentCostCenterId] = useState("");
  const [dept_head_name, setDepartmentHeadName] = useState("");
  const [dept_delegate_head_name, setDepartmenDelegateHeadName] = useState("");
  const { organisationId } = useParams();
  const [enterDepartmentId, setEnterDepartmentId] = useState(false);
  const [enterDeptCostCenterId, setDeptCostCenterId] = useState(false);
  const [numCharacters, setNumCharacters] = useState(1);
  const [numberCharacters, setNumberCharacters] = useState(1);
  const [departmentNameError, setDepartmentNameError] = useState("");

  // fetch the location
  const [locationsData, setLocationsData] = useState([]);
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
        setLocationsData(response.data.locationsData);
      })
      .catch((error) => console.error("Error fetching locations:", error));
  }, [authToken, organisationId]);

  //fetch the department head
  const [departmentHeadData, setDepartmentHeadData] = useState([]);
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API}/route/employee/get-department-head/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      )
      .then((response) => {
        setDepartmentHeadData(response.data.employees);
      })
      .catch((error) => console.error("Error fetching Data:", error));
  }, [authToken, organisationId]);

  //fetch the department delegate head
  const [deptDelegateHeadData, setDeptDelegateHeadData] = useState([]);
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API}/route/employee/get-department-delegate-head/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      )
      .then((response) => {
        setDeptDelegateHeadData(response.data.employees);
      })
      .catch((error) => console.error("Error fetching Data:", error));
  }, [authToken, organisationId]);

  //  store department id
  const handleDepartmentIdChange = (e) => {
    const input = e.target.value;
    const charactersOnly = input.replace(/\d/g, "");
    if (charactersOnly.length <= numCharacters) {
      setDepartmentId(input);
    }
  };
  //  store department cost center id
  const handleDeptCostCenterIdChange = (e) => {
    const input = e.target.value;
    const charactersOnly = input.replace(/\d/g, "");
    if (charactersOnly.length <= numberCharacters) {
      setDepartmentCostCenterId(input);
    }
  };
  // add validaion while enter the departname name
  const handleDepartmentNameChange = (e) => {
    const enteredValue = e.target.value;
    // Validation logic
    const isValid =
      enteredValue.length >= 3 && // At least 3 characters
      enteredValue.split(/\s+/).length <= 5 && // Max 5 words
      !/[!@#$%^&*(),.?":{}|<>]/.test(enteredValue); // No special characters
    setDepartmentName(enteredValue);
    if (enteredValue.length === 0) {
      setDepartmentNameError(""); // Clear error message when the field is empty
    } else if (isValid) {
      setDepartmentNameError(""); // Clear error message when criteria are met
    } else {
      setDepartmentNameError(
        "Department Name must be unique. No special characters, Max 5 words."
      );
    }
  };

  //   add the department data
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const departmentData = {
        departmentName: dept_name,
        departmentDescription: dept_description,
        departmentLocation: dept_location,
        costCenterName: dept_cost_center_name,
        costCenterDescription: dept_cost_center_description,
        departmentId: dept_id,
        dept_cost_center_id,
        departmentHeadName: dept_head_name
          ? `${dept_head_name.first_name || ""} ${
              dept_head_name.last_name || ""
            }`
          : "",
        departmentHeadDelegateName: dept_delegate_head_name
          ? `${dept_delegate_head_name?.first_name || ""} ${
              dept_delegate_head_name?.last_name || ""
            }`
          : "",

        organizationId: organisationId,
      };

      await axios.post(
        `${process.env.REACT_APP_API}/route/department/create/${organisationId}`,
        departmentData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setDepartmentName("");
      setDepartmentDescription("");
      setDepartmentLocation("");
      setDepartmentCostCenterName("");
      setDepartmentCostCenterDescription("");
      setDepartmentId("");
      setDepartmentHeadName("");
      setDepartmenDelegateHeadName("");
      setNumCharacters("");
      setNumberCharacters("");
      setEnterDepartmentId("");
      setDepartmentCostCenterId("");
      setDeptCostCenterId("");
      handleAlert(
        true,
        "success",
        `${dept_name} Department Added Successfully..`
      );
    } catch (error) {
      console.error("Error creating department:", error);
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "An error occurred while Adding Department";

      handleAlert(true, "error", errorMessage);
    }
  };
  useEffect(() => {
    const clearAlertTimeout = setTimeout(() => {
      handleAlert(false, "", "");
    }, 5000);

    return () => clearTimeout(clearAlertTimeout);
  }, [handleAlert]);

  return (
    <>
      <UserSelf message="After Adding Department Go to Add Employee Page" />
      <div className="w-full h-[auto] bg-white">
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
          }}
          action="submit"
        >
          <Container
            sx={{
              display: "flex",
              backgroundColor: "#fefdff",
              paddingTop: "20px",
              paddingBottom: "30px",
              paddingLeft: "20px",
              paddingRight: "20px",
              borderRadius: "10px",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              height: "100%",
              border: "2px solid #dedede",
              margin: "auto",
            }}
            className="shadow-md gap-3"
            maxWidth="sm"
          >
            <Typography
              sx={{
                color: "#1D6EB7",
                fontWeight: "600",
                marginTop: "1rem",
              }}
              variant="h4"
            >
              Add Department
            </Typography>

            {/* Input Fields */}
            <FormControl sx={{ width: "100%", marginTop: "1rem" }}>
              <TextField
                required
                size="small"
                type="text"
                label="Department Name"
                name="dept_name"
                id="dept_name"
                value={dept_name}
                onChange={handleDepartmentNameChange}
                error={!!departmentNameError}
                helperText={departmentNameError}
              />
            </FormControl>
            <FormControl sx={{ width: "100%", marginTop: "1rem" }}>
              <TextField
                size="small"
                type="text"
                label="Department Description"
                name="dept_description"
                id="dept_description"
                value={dept_description}
                onChange={(e) => setDepartmentDescription(e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ width: "100%", marginTop: "1rem" }}>
              <Select
                value={dept_location}
                onChange={(e) => setDepartmentLocation(e.target.value)}
                displayEmpty
                inputProps={{ "aria-label": "Department Location" }}
              >
                <MenuItem value="" disabled>
                  Select Department Work Location
                </MenuItem>
                {Array.isArray(locationsData) &&
                  locationsData.map((location) => (
                    <MenuItem key={location?._id} value={location?._id}>
                      {location?.city || ""}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: "100%", marginTop: "1rem" }}>
              <TextField
                size="small"
                type="text"
                label="Department Cost Center Name"
                name="dept_cost_center_name"
                id="dept_cost_center_name"
                value={dept_cost_center_name}
                onChange={(e) => setDepartmentCostCenterName(e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ width: "100%", marginTop: "1rem" }}>
              <TextField
                size="small"
                type="text"
                label="Department Cost Center Description"
                name="dept_cost_center_description"
                id="dept_cost_center_description"
                value={dept_cost_center_description}
                onChange={(e) =>
                  setDepartmentCostCenterDescription(e.target.value)
                }
              />
            </FormControl>

            <FormControl sx={{ width: "100%", marginTop: "1rem" }}>
              <Autocomplete
                value={dept_head_name || null}
                onChange={(e, value) => {
                  // Check if value is truthy before setting it
                  setDepartmentHeadName(value || null);
                }}
                options={
                  Array.isArray(departmentHeadData) ? departmentHeadData : []
                }
                getOptionLabel={(deptHead) => {
                  if (deptHead) {
                    return `${deptHead.first_name || ""} ${
                      deptHead.last_name || ""
                    } - ${deptHead.email || ""}`;
                  }
                  return "";
                }}
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id ||
                  option?.first_name === value?.first_name ||
                  option?.last_name === value?.last_name ||
                  option?.email === value?.email
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Department Head Name"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </FormControl>
            <FormControl sx={{ width: "100%", marginTop: "1rem" }}>
              <Autocomplete
                value={dept_delegate_head_name || null}
                onChange={(e, value) => setDepartmenDelegateHeadName(value)}
                options={
                  Array.isArray(deptDelegateHeadData) ? departmentHeadData : []
                }
                getOptionLabel={(deptDelegateHead) =>
                  `${deptDelegateHead?.first_name || ""} ${
                    deptDelegateHead?.last_name || ""
                  }- ${deptDelegateHead?.email || ""}`
                }
                isOptionEqualToValue={(option, value) =>
                  option._id === value?._id ||
                  option.first_name === value?.first_name ||
                  option.last_name === value?.last_name ||
                  option.email === value?.email
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Department Delegate Head Name"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </FormControl>

            <div
              style={{
                width: "100%",
                display: "flex",
                marginTop: "8px",
                marginRight: "20px",
              }}
            >
              <FormControlLabel
                style={{
                  width: "200px",
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

              {enterDepartmentId && (
                <TextField
                  inputProps={{
                    min: 1,
                  }}
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
            </div>

            {enterDepartmentId && (
              <p style={{ alignSelf: "start" }} className="font-extralight">
                Note: Please adjust the character length to prefix .
              </p>
            )}
            {!enterDepartmentId && (
              <p className="font-extralight" style={{ alignSelf: "start" }}>
                Note: No prefix added to Department ID.
              </p>
            )}

            <div className="w-full">
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  required
                  name="dept_id"
                  size="small"
                  className="w-full"
                  label="Department ID"
                  id="dept_id"
                  value={dept_id}
                  onChange={handleDepartmentIdChange}
                />
              </FormControl>
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                marginTop: "8px",
                marginRight: "20px",
              }}
            >
              <FormControlLabel
                style={{
                  width: "200px",
                  alignItems: "center",
                }}
                control={
                  <Checkbox
                    checked={enterDeptCostCenterId}
                    onChange={() => setDeptCostCenterId(!enterDeptCostCenterId)}
                  />
                }
                label="Use prefix in ID"
              />

              {/* Make departmentIdRequired And prefixRequired variable and not string. */}

              {enterDeptCostCenterId && (
                <TextField
                  inputProps={{
                    min: 1,
                  }}
                  required
                  name="numCharacters"
                  size="small"
                  className="w-full"
                  label="no of Characters"
                  type="number"
                  value={numberCharacters}
                  onChange={(e) => setNumberCharacters(e.target.value)}
                />
              )}
            </div>
            {enterDeptCostCenterId && (
              <p style={{ alignSelf: "start" }} className="font-extralight">
                Note: Please adjust the character length to prefix .
              </p>
            )}
            {!enterDeptCostCenterId && (
              <p className="font-extralight" style={{ alignSelf: "start" }}>
                Note : No prefix added to Department ID.
              </p>
            )}

            <div className="w-full">
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  required
                  name="dept_cost_center_id"
                  size="small"
                  className="w-full"
                  label="Department Cost Center Id"
                  id="dept_cost_center_id"
                  value={dept_cost_center_id}
                  onChange={handleDeptCostCenterIdChange}
                />
              </FormControl>
            </div>

            <div className="flex justify-center">
              <Button
                className="px-4 py-2 text-base bg-blue-500 text-white rounded-lg"
                type="submit"
                variant="contained"
                color="primary"
                fullWidth={false}
                margin="normal"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </Container>
        </form>
      </div>
    </>
  );
};

export default AddDepartments;
