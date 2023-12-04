import React, { useContext, useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import useAddEmpForm from "../../hooks/useAddEmpForm";
import axios from "axios";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { Checkbox, ListItemText } from "@mui/material";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Tooltip from "@mui/material/Tooltip";
import { useQuery } from "react-query";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const AddEmployee = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const { id } = useParams();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    try {
      const decodedToken = jwtDecode(authToken);
      if (decodedToken && decodedToken.user._id) {
        setUserId(decodedToken.user._id);
      } else {
        setUserId("");
      }
    } catch (error) {
      console.error("Failed to decode the token:", error);
    }
  }, [authToken]);

  const {
    first_name,
    setFirstName,
    last_name,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    companyemail,
    setCompanyEmail,
    address,
    setAddress,
    phone_number,
    setPhoneNumber,
    deptname,
    setDeptName,
    mgrempid,
    setMgrEmpId,
    citizenship,
    setCitizenShip,
    joining_date,
    setJoiningDate,
    date_of_birth,
    setDateOfBirth,
    salarystructure,
    setSalaryStructure,
    gender,
    setGender,
    worklocation,
    setWorkLocation,
    designation,
    setDesignation,
    employmentType,
    setEmploymentType,
    firstNameError,
    lastNameError,
    emailError,
    passwordError,
    setFirstNameError,
    setLastNameError,
    setEmailError,
    setPasswordError,
    companyEmailError,
    setCompanyEmailError,
  } = useAddEmpForm();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const validDomain =
      email.endsWith(".com") || email.endsWith(".net") || email.endsWith(".in");
    return emailRegex.test(email) && validDomain && email.includes("@");
  };

  const handlePasswordChange = (enteredPassword) => {
    setPassword(enteredPassword);
    if (!enteredPassword) {
      setPasswordError("Password is required");
    } else if (!enteredPassword.match(passwordRegex)) {
      setPasswordError(
        "Password must contain at least one number, one special character, and be at least 8 characters long"
      );
    } else {
      setPasswordError("");
    }
  };
  const handleConfirmPasswordChange = (enteredConfirmPassword) => {
    setConfirmPassword(enteredConfirmPassword);
    if (!enteredConfirmPassword) {
      setConfirmPasswordError("Confirm Password is required");
    } else if (enteredConfirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const staticTitle =
    "This form is used to add relavant information of employee ";

  const handleEmploymentTypeChange = (event) => {
    setEmploymentType(event.target.value);
  };
  const handleDesignationChange = (event) => {
    setDesignation(event.target.value);
  };
  const handleLocationChange = (event) => {
    setWorkLocation(event.target.value);
  };
  const handleRadioChange = (event) => {
    setGender(event.target.value);
  };
  const handleMgrEmpId = (event) => {
    setMgrEmpId(event.target.value);
  };

  const handleSalaryStructure = (event) => {
    setSalaryStructure(event.target.value);
  };
  const [availabelDesignation, setAvailableDesignation] = useState([]);
  const fetchAvailableDesignation = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/designation/create`
      );

      setAvailableDesignation(response.data.designations);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Available Designation");
    }
  };

  useEffect(() => {
    fetchAvailableDesignation();
    // eslint-disable-next-line
  }, []);

  const { data: salaryInput } = useQuery(["empType"], async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/salary-template`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  });

  const [availabelLocation, setAvailableLocation] = useState([]);
  const fetchAvailableLocation = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/location/getOrganizationLocations`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      setAvailableLocation(response.data);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Available Work Location");
    }
  };
  useEffect(() => {
    fetchAvailableLocation();
    // eslint-disable-next-line
  }, []);

  const [availabelEmpTypes, setAvailableEmpTypes] = useState([]);
  const fetchAvailabeEmpTypes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employment-types`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setAvailableEmpTypes(response.data.empTypes);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Available Employement Type");
    }
  };
  useEffect(() => {
    fetchAvailabeEmpTypes();
    // eslint-disable-next-line
  }, []);

  const [profile, setProfile] = React.useState([]);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setProfile(typeof value === "string" ? value.split(",") : value);
  };

  const [availableProfiles, setAvailableProfiles] = useState([]);
  const fetchAvailableProfiles = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/profile/role/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      if (response.data && response.data.roles) {
        if (response.data.roles.length > 0) {
          const filteredProfiles = response.data.roles.filter((role) => {
            return role.isActive;
          });

          if (filteredProfiles.length > 0) {
            setAvailableProfiles(filteredProfiles);
          } else {
            handleAlert(
              true,
              "error",
              "No active profiles available. Please add active profiles for your organization."
            );
          }
        }
      }
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch available profiles");
    }
  };

  useEffect(() => {
    fetchAvailableProfiles();
    // eslint-disable-next-line
  }, [id]);

  const [availableInputField, setAvailableInputField] = useState([]);
  const fetchAvailbleInputField = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/inputfield/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      if (response.data && response.data.inputField.inputDetail) {
        if (response.data.inputField.inputDetail.length > 0) {
          const filteredInputField =
            response.data.inputField.inputDetail.filter((inputField) => {
              return inputField.isActive;
            });

          if (filteredInputField.length > 0) {
            setAvailableInputField(filteredInputField);
          } else {
            handleAlert(
              true,
              "error",
              "No active Input Field available. Please add active input field for your organization."
            );
          }
        }
      }
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch input feild");
    }
  };

  useEffect(() => {
    fetchAvailbleInputField();
    // eslint-disable-next-line
  }, [id]);

  const [availableMgrId, setAvailableMgrId] = useState([]);
  const fetchAvailabeMgrId = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get-manager`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      setAvailableMgrId(response.data.manager);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Available Manager Id");
    }
  };
  useEffect(() => {
    fetchAvailabeMgrId();
    // eslint-disable-next-line
  }, []);

  const [dynamicFields, setDynamicFields] = useState({
    shifts_allocation: "",
    dept_cost_no: "",
    middalName: "",
    martial_state: "",
    primary_nationality: "",
    education: "",
    permanant_address: "",
    relative_info: "",
    manager_name: "",
    emer_contact: "",
  });

  const handleDynamicFieldChange = (name, value) => {
    setDynamicFields({
      ...dynamicFields,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = {
      first_name,
      last_name,
      email,
      password,
      companyemail,
      address,
      phone_number,
      deptname,
      mgrempid,
      citizenship,
      employmentType,
      date_of_birth,
      joining_date,
      designation,
      worklocation,
      gender,
      salarystructure,
      profile,
      ...dynamicFields,
      organizationId: id,
      creatorId: userId,
    };
    console.log("user", user);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/add-employee`,
        user,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      if (response.data.success) {
        handleAlert(true, "error", "Invalid authorization");
      } else {
        handleAlert(true, "success", response.data.message);
      }
    } catch (error) {
      handleAlert(
        true,
        "error",
        error.response ? error.response.data.message : error.message
      );
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "50px 0 0",
          boxSizing: "border-box",
        }}
        className="!min-h-screen"
      >
        <div className="content-center  flex justify-center my-0 p-0 bg-[#F8F8F8]">
          <div className="w-[700px] shadow-lg rounded-lg border py-3 px-8">
            <div className="flex items-center justify-center gap-4">
              <Tooltip title={`${staticTitle}`}>
                <Button>Add Employee</Button>
              </Tooltip>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-wrap gap-6">
              <div className="flex items-center gap-20">
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <TextField
                      size="small"
                      type="text"
                      label="First Name"
                      name="first_name"
                      id="first_name"
                      value={first_name}
                      onChange={(e) => {
                        const enteredFirstName = e.target.value;
                        setFirstName(enteredFirstName);
                        if (!enteredFirstName.trim()) {
                          setFirstNameError("First Name is required");
                        } else if (
                          enteredFirstName.length < 2 ||
                          enteredFirstName.length > 30 ||
                          /[^a-zA-Z]/.test(enteredFirstName)
                        ) {
                          setFirstNameError(
                            "First Name must be between 2 and 30 characters and should only contain letters."
                          );
                        } else {
                          setFirstNameError(""); // Clear error message when criteria are met
                        }
                      }}
                      error={!!firstNameError}
                      helperText={firstNameError}
                    />
                  </FormControl>
                </div>
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <TextField
                      size="small"
                      type="text"
                      label="Last Name"
                      name="last_name"
                      id="last_name"
                      value={last_name}
                      onChange={(e) => {
                        const enteredLastName = e.target.value;
                        setLastName(enteredLastName);
                        if (!enteredLastName.trim()) {
                          setLastNameError("Last Name is required");
                        } else if (
                          enteredLastName.length < 2 ||
                          enteredLastName.length > 30 ||
                          /[^a-zA-Z]/.test(enteredLastName)
                        ) {
                          setLastNameError(
                            "Last Name must be between 2 and 30 characters and should only contain letters."
                          );
                        } else {
                          setLastNameError(""); // Clear error message when criteria are met
                        }
                      }}
                      error={!!lastNameError}
                      helperText={lastNameError}
                      fullWidth
                      margin="normal"
                      required
                    />
                  </FormControl>
                </div>
              </div>

              <div className="flex items-center gap-20">
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <TextField
                      size="small"
                      type="email"
                      label="Personal Email ID"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        const enteredEmail = e.target.value;
                        setEmail(enteredEmail);
                        if (!enteredEmail.trim()) {
                          setEmailError("Email is required");
                        } else if (!isValidEmail(enteredEmail)) {
                          setEmailError("Invalid Email Format");
                        } else {
                          setEmailError(""); // Clear error message when criteria are met
                        }
                      }}
                      error={!!emailError}
                      helperText={emailError}
                      fullWidth
                      margin="normal"
                      required
                    />
                  </FormControl>
                </div>
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <TextField
                      size="small"
                      type="email"
                      label="Company email ID"
                      name="companyemail"
                      id="companyemail"
                      value={companyemail}
                      onChange={(e) => {
                        const enteredCompanyEmail = e.target.value;
                        setCompanyEmail(enteredCompanyEmail);
                        if (!enteredCompanyEmail.trim()) {
                          setCompanyEmailError("Email is required");
                        } else if (!isValidEmail(enteredCompanyEmail)) {
                          setCompanyEmailError("Invalid Email Format");
                        } else {
                          setCompanyEmailError(""); // Clear error message when criteria are met
                        }
                      }}
                      fullWidth
                      margin="normal"
                      required
                      error={!!companyEmailError}
                      helperText={companyEmailError}
                    />
                  </FormControl>
                </div>
              </div>

              <div className="flex items-center gap-20">
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <TextField
                      size="small"
                      type="password"
                      label="Password"
                      name="password"
                      id="password"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      required
                      fullWidth
                      margin="normal"
                      error={!!passwordError}
                      helperText={passwordError}
                      InputProps={{
                        inputProps: {
                          pattern: passwordRegex.source,
                        },
                      }}
                    />
                  </FormControl>
                </div>
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <TextField
                      size="small"
                      type="password"
                      label="Confirm Password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) =>
                        handleConfirmPasswordChange(e.target.value)
                      }
                      required
                      fullWidth
                      margin="normal"
                      error={!!confirmPasswordError}
                      helperText={confirmPasswordError}
                    />
                  </FormControl>
                </div>
              </div>

              <div className="flex items-center gap-20">
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <TextField
                      size="small"
                      type="text"
                      label="Citizenship status"
                      name="citizenship"
                      id="citizenship"
                      value={citizenship}
                      onChange={(e) => setCitizenShip(e.target.value)}
                      fullWidth
                      margin="normal"
                      required
                    />
                  </FormControl>
                </div>
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <TextField
                      size="small"
                      type="text"
                      label="Phone Number"
                      name="phone_number"
                      id="phone_number"
                      value={phone_number}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      fullWidth
                      margin="normal"
                      required
                    />
                  </FormControl>
                </div>
              </div>

              <div className="flex items-center gap-20">
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <TextField
                      size="small"
                      type="text"
                      label="Department name"
                      name="deptname"
                      id="deptname"
                      value={deptname}
                      onChange={(e) => setDeptName(e.target.value)}
                      fullWidth
                      margin="normal"
                      required
                    />
                  </FormControl>
                </div>
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <Select
                      value={mgrempid}
                      onChange={handleMgrEmpId}
                      displayEmpty
                      inputProps={{ "aria-label": "Manager Id" }}
                    >
                      <MenuItem value="" disabled>
                        Select Manager Id
                      </MenuItem>
                      {availableMgrId.map((manager) => (
                        <MenuItem
                          key={manager._id}
                          value={manager.managerId ? manager.managerId._id : ""}
                        >
                          {manager.managerId
                            ? manager.managerId._id
                            : "No Manager ID"}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <TextField
                size="small"
                multiline
                rows={4} // Adjust the number of rows to fit your design
                label="Address"
                name="address"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                fullWidth
                margin="normal"
              />

              <div className="flex items-center gap-20">
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <InputLabel id="demo-multiple-checkbox-label">
                      Profile
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={profile}
                      onChange={handleChange}
                      input={<OutlinedInput label="profile" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={
                                <>
                                  {value}
                                  <span
                                    style={{
                                      cursor: "pointer",
                                      marginLeft: "4px",
                                    }}
                                    onClick={() => {
                                      const updatedProfile = profile.filter(
                                        (item) => item !== value
                                      );
                                      setProfile(updatedProfile);
                                    }}
                                  ></span>
                                </>
                              }
                            />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {availableProfiles.length === 0 ? (
                        <MenuItem disabled>
                          No roles available. Please add roles for your
                          organization.
                        </MenuItem>
                      ) : (
                        availableProfiles.map((name) => (
                          <MenuItem key={name._id} value={name.roleName}>
                            <Checkbox
                              checked={profile.indexOf(name.roleName) > -1}
                            />
                            <ListItemText primary={name.roleName} />
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </div>

                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <Select
                      value={employmentType}
                      onChange={handleEmploymentTypeChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Employment Type" }}
                    >
                      <MenuItem value="" disabled>
                        Select Employment Type
                      </MenuItem>
                      {availabelEmpTypes.map((type) => (
                        <MenuItem key={type._id} value={type._id}>
                          {type.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="w-full">
                <FormControl sx={{ width: 640 }}>
                  <Select
                    value={salarystructure}
                    onChange={handleSalaryStructure}
                    displayEmpty
                    inputProps={{ "aria-label": "Employment Type" }}
                  >
                    <MenuItem value="" disabled>
                      Select Salary Type
                    </MenuItem>
                    {salaryInput?.salaryTemplates?.map((item) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="flex items-center gap-20">
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <Select
                      value={designation}
                      onChange={handleDesignationChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Employment Type" }}
                    >
                      <MenuItem value="" disabled>
                        Select Designation
                      </MenuItem>
                      {availabelDesignation.map((type) => (
                        <MenuItem key={type._id} value={type._id}>
                          {type.designationName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <Select
                      value={worklocation}
                      onChange={handleLocationChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Employment Type" }}
                    >
                      <MenuItem value="" disabled>
                        Select Work Location
                      </MenuItem>
                      {availabelLocation.map((type) => (
                        <MenuItem key={type._id} value={type._id}>
                          {type.city}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="flex items-center gap-20">
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer
                        className="w-full"
                        components={["DatePicker"]}
                        required
                      >
                        <DatePicker
                          label="Date of Birth"
                          value={date_of_birth}
                          onChange={(newDate) => {
                            const formattedDate =
                              dayjs(newDate).format("YYYY-MM-DD");
                            setDateOfBirth(formattedDate);
                          }}
                          slotProps={{
                            textField: { size: "small", fullWidth: true },
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </FormControl>
                </div>

                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer
                        className="w-full"
                        components={["DatePicker"]}
                        required
                      >
                        <DatePicker
                          label="Joining Date"
                          value={joining_date}
                          onChange={(newDate) => {
                            const formattedDate =
                              dayjs(newDate).format("YYYY-MM-DD");
                            setJoiningDate(formattedDate);
                          }}
                          slotProps={{
                            textField: { size: "small", fullWidth: true },
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </FormControl>
                </div>
              </div>
              <div className="flex flex-wrap gap-8">
                {availableInputField.map((item) => (
                  <TextField
                    key={item._id}
                    size="small"
                    type={item.inputType}
                    label={item.label}
                    name={item.label}
                    id={item.label}
                    value={dynamicFields[item.label] || ""} // Set value from state
                    onChange={(e) =>
                      handleDynamicFieldChange(item.label, e.target.value)
                    } // Update state on change
                    fullWidth
                    margin="normal"
                    required
                    sx={{
                      flexBasis: "45%",
                      marginBottom: "16px",
                      marginRight: "15px",
                    }}
                  />
                ))}
              </div>
              <div className="w-full">
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    Gender
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={gender}
                    onChange={handleRadioChange}
                  >
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="transgender"
                      control={<Radio />}
                      label="Transgender"
                    />
                  </RadioGroup>
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
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEmployee;
