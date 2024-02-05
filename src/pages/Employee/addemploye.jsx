import {
  Box,
  Button,
  Checkbox,
  Chip,
  InputLabel,
  ListItemText,
  OutlinedInput,
  TextField,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import { Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import useAddEmpForm from "../../hooks/useAddEmpForm";

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
const EmployeeAdd = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const { organisationId } = useParams();
  const [userId, setUserId] = useState(null);
  const [showFields, setShowFields] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [shift_allocation, setShiftAllocation] = useState("");
  const handleDatePickerChange = (newDate) => {
    const formattedDate = dayjs(newDate).format("YYYY-MM-DD");
    setDateOfBirth(formattedDate);

    // Check age
    const age = calculateAge(newDate);
    if (age < 18) {
      setAgeError(true);
    } else {
      setAgeError(false);
    }
  };

  const calculateAge = (birthdate) => {
    const today = dayjs();
    const birthDate = dayjs(birthdate);
    return today.diff(birthDate, "year");
  };

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
    adhar_card_number,
    setAdharCardNumber,
    pan_card_number,
    setPanCardNumber,
    dept_cost_center_no,
    setDeptCostCenterNo,
  } = useAddEmpForm();

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [bank_account_no, setBankAccountNo] = useState("");
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

  const handlePhoneNumberChange = (e) => {
    const inputValue = e.target.value;
    const sanitizedInput = inputValue.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(sanitizedInput);
  };

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
  const handleDeptName = (event) => {
    setDeptName(event.target.value);
  };

  const handleSalaryStructure = (event) => {
    setSalaryStructure(event.target.value);
  };
  const [availabelDesignation, setAvailableDesignation] = useState([]);
  const fetchAvailableDesignation = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/designation/create/${organisationId}`
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
      `${process.env.REACT_APP_API}/route/salary-template-org/${organisationId}`,
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
        `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setAvailableLocation(response.data.locationsData);
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
        `${process.env.REACT_APP_API}/route/employment-types-organisation/${organisationId}`,
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

  const [availableDepartment, setAvailableDepartment] = useState([]);
  const fetchAvailabeDepartment = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/department/get/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      setAvailableDepartment(response.data.department);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Department");
    }
  };
  useEffect(() => {
    fetchAvailabeDepartment();
    // eslint-disable-next-line
  }, []);
  const [availaleCostCenterId, setAvailableCostCenter] = useState([]);
  const fetchAvailableCostCenter = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/department/get/cost-center-id/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setAvailableCostCenter(response.data.data.departments);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchAvailableCostCenter();
    // eslint-disable-next-line
  }, []);
  const [availaleShiftAllocation, setAvailableShiftAllocation] = useState([]);
  const fetchAvailableShiftAllocation = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/shifts/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setAvailableShiftAllocation(response.data.shifts);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchAvailableShiftAllocation();
    // eslint-disable-next-line
  }, []);

  //  generate employee id
  const [employeeId, setEmployeeId] = useState([]);
  const [empId, setEmpId] = useState("");
  const [counter, setCounter] = useState(1);

  const fetchEmployeeId = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get/employee-code/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setEmployeeId(response.data.getEmployeeCode);
      // Assuming there's only one prefix in the response
      const fetchedPrefix = response.data.getEmployeeCode[0]?.code || "";
      setEmpId(generateEmployeeId(fetchedPrefix, counter));
    } catch (error) {
      console.error(error);
    }
  };

  const generateEmployeeId = (prefix, count) => {
    return `${prefix}${count}`;
  };

  const handleEmpIdChange = (e) => {
    setEmpId(e.target.value);
  };

  const incrementCounter = () => {
    setCounter((prevCounter) => prevCounter + 1);
    setEmpId(generateEmployeeId(employeeId[0]?.code || "", counter + 1));
  };

  useEffect(() => {
    fetchEmployeeId();
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
        `${process.env.REACT_APP_API}/route/profile/role/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      const rolesArray = Object.entries(response.data.roles ?? {})
        .filter(([role, obj]) => obj.isActive === true)
        .map(([role, obj]) => ({
          roleName: role,
          isApprover: obj.isApprover,
          isActive: obj.isActive,
        }));

      setAvailableProfiles(rolesArray);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch available profiles");
    }
  };

  useEffect(() => {
    fetchAvailableProfiles();
    // eslint-disable-next-line
  }, [organisationId]);

  const [availableInputField, setAvailableInputField] = useState([]);
  const fetchAvailbleInputField = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/inputfield/${organisationId}`,
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
  }, [organisationId]);

  const [availableMgrId, setAvailableMgrId] = useState([]);
  const fetchAvailabeMgrId = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get-manager/${organisationId}`,
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
    middalName: "",
    martial_state: "",
    primary_nationality: "",
    education: "",
    permanant_address: "",
    relative_info: "",
    emer_contact: "",
  });

  const handleDynamicFieldChange = (name, value) => {
    setDynamicFields({
      ...dynamicFields,
      [name]: value,
    });
  };

  const toggleFields = () => {
    setShowFields((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
        empId,
        bank_account_no,
        adhar_card_number,
        pan_card_number,
        dept_cost_center_no,
        shift_allocation,
        ...dynamicFields,
        organizationId: organisationId,
        creatorId: userId,
      };
      console.log(user);
      // Check if the selected profile exists
      const checkProfileResponse = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/check-profile-exists/${organisationId}`,
        { profile },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      if (
        checkProfileResponse.status === 200 &&
        checkProfileResponse.data.profileExists
      ) {
        const createProfileConfirmation = window.confirm(
          `${profile} profile already exists. Do you want to create it again?`
        );

        if (createProfileConfirmation) {
          // Proceed with profile creation
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
        } else {
          // User declined creating the profile again
          handleAlert(true, "info", "Profile creation canceled.");
        }
      } else {
        // Profile does not exist, proceed with creation
        const response = await axios.post(
          `${process.env.REACT_APP_API}/route/employee/add-employee`,
          user,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        if (response.status === 200) {
          // Display a message to the user indicating that a manager ID is required
          alert(
            "Manager ID is required for an employee profile. Please provide a valid manager ID."
          );
        } else if (response.data && response.data.success) {
          handleAlert(true, "error", "Invalid authorization");
        } else {
          // Reset dynamicFields and profile state
          setDynamicFields({
            middalName: "",
            martial_state: "",
            primary_nationality: "",
            education: "",
            permanant_address: "",
            relative_info: "",
            emer_contact: "",
          });
          setProfile([]);
          // Reset other state variables as needed
          setFirstName("");
          setLastName("");
          setEmail("");
          setCompanyEmail("");
          setPassword("");
          setConfirmPassword("");
          setCitizenShip("");
          setPhoneNumber("");
          setDeptName("");
          setMgrEmpId("");
          setAddress("");
          setBankAccountNo("");
          setSalaryStructure("");
          setDesignation("");
          setWorkLocation("");
          setDateOfBirth("");
          setJoiningDate("");
          setDeptCostCenterNo("");
          setShiftAllocation("");
          setAdharCardNumber("");
          setPanCardNumber("");
          setGender("");
          handleAlert(true, "success", response.data.message);
        }
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
          flexDirection: "column",
          alignItems: "center",
          padding: "50px 0 0",
          boxSizing: "border-box",
        }}
        className="!min-h-screen"
      >
        <div className="content-center flex justify-center my-0 p-0">
          <div className="w-full md:w-[700px] shadow-lg rounded-lg border py-3 px-8">
            <Typography
              sx={{
                color: "#1D6EB7",
                fontWeight: "600",
                marginTop: "1rem",
                textAlign: "center",
              }}
              variant="h4"
            >
              Add Employee
            </Typography>

            <form onSubmit={handleSubmit} className="gap-6">
              <div className="flex items-center gap-14">
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <TextField
                      required
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
                            "First Name must only contain letters."
                          );
                        } else {
                          setFirstNameError(""); // Clear error message when criteria are met
                        }
                      }}
                      error={!!firstNameError}
                      helperText={
                        <div style={{ height: "5px", width: "280px" }}>
                          {firstNameError}
                        </div>
                      }
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
                            "Last Name must only contain letters."
                          );
                        } else {
                          setLastNameError(""); // Clear error message when criteria are met
                        }
                      }}
                      error={!!lastNameError}
                      helperText={
                        <div style={{ height: "5px", width: "280px" }}>
                          {lastNameError}
                        </div>
                      }
                      fullWidth
                      margin="normal"
                      required
                    />
                  </FormControl>
                </div>
              </div>

              <div className="flex items-center gap-14">
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
                      helperText={
                        <div style={{ height: "5px", width: "280px" }}>
                          {emailError}
                        </div>
                      }
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
                      helperText={
                        <div style={{ height: "5px", width: "280px" }}>
                          {companyEmailError}
                        </div>
                      }
                    />
                  </FormControl>
                </div>
              </div>

              <div className="flex items-center gap-14 mb-4">
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
                      helperText={
                        <div style={{ height: "5px", width: "280px" }}>
                          {passwordError}
                        </div>
                      }
                      InputProps={{
                        inputProps: {
                          pattern: passwordRegex.source,
                        },
                        onPaste: (e) => e.preventDefault(),
                        onCopy: (e) => e.preventDefault(),
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
                      helperText={
                        <div style={{ height: "5px", width: "280px" }}>
                          {confirmPasswordError}
                        </div>
                      }
                      InputProps={{
                        onPaste: (e) => e.preventDefault(),
                        onCopy: (e) => e.preventDefault(),
                      }}
                    />
                  </FormControl>
                </div>
              </div>
              <div className="w-full">
                <FormControl sx={{ width: 625 }}>
                  <TextField
                    size="small"
                    type="number"
                    label="Phone Number"
                    name="phone_number"
                    id="phone_number"
                    value={phone_number}
                    onChange={handlePhoneNumberChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                </FormControl>
              </div>

              <div className="flex items-center gap-14">
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <TextField
                      size="small"
                      type="text"
                      label="Emp Id"
                      name="Emp Id"
                      id="empId"
                      value={empId}
                      onChange={handleEmpIdChange}
                      fullWidth
                      margin="normal"
                      required
                    />
                  </FormControl>
                </div>
                <div sx={{ width: 280 }}>
                  <button
                    onClick={incrementCounter}
                    style={{
                      width: 200,
                      marginRight: "100px",
                      padding: "5px",
                      backgroundColor: "#4CAF50", // Green color
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Generate Next Employee ID
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-14">
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <TextField
                      size="small"
                      type="number"
                      label="Adhar Card Number"
                      name="adhar_card_number"
                      id="adhar_card_number"
                      value={adhar_card_number}
                      onChange={(e) => setAdharCardNumber(e.target.value)}
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
                      label="Pan Card Number"
                      name="pan_card_number"
                      id="pan_card_number"
                      value={pan_card_number}
                      onChange={(e) => setPanCardNumber(e.target.value)}
                      fullWidth
                      margin="normal"
                      required
                    />
                  </FormControl>
                </div>
              </div>

              <div className="w-full">
                <FormControl sx={{ width: 625 }}>
                  <TextField
                    size="small"
                    type="text"
                    label="Citizenship Status"
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

              <div className="flex items-center gap-14">
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <Select
                      value={deptname}
                      onChange={handleDeptName}
                      displayEmpty
                      inputProps={{ "aria-label": "Dept Name" }}
                    >
                      <MenuItem value="" disabled>
                        Select Department Name
                      </MenuItem>
                      {availableDepartment?.map((deptname) => (
                        <MenuItem key={deptname?._id} value={deptname?._id}>
                          {deptname?.departmentName}
                        </MenuItem>
                      ))}
                    </Select>
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
                        Select Manager Name
                      </MenuItem>

                      {availableMgrId?.map(
                        (manager) =>
                          manager.managerId && ( // Render only if managerId exists
                            <MenuItem
                              key={manager._id}
                              value={manager.managerId._id}
                            >
                              {/* {manager.managerId} */}
                              {`${manager?.managerId?.first_name} ${manager?.managerId?.last_name}`}
                            </MenuItem>
                          )
                      )}
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
                sx={{ width: 625 }}
              />

              <div className="flex items-center gap-14 mb-4">
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
                      {availableProfiles?.length === 0 ? (
                        <MenuItem disabled>
                          No roles available. Please add roles for your
                          organization.
                        </MenuItem>
                      ) : (
                        availableProfiles?.map((name) => {
                          return (
                            <MenuItem
                              key={name?.roleName}
                              value={name?.roleName}
                            >
                              <Checkbox
                                checked={profile.indexOf(name?.roleName) > -1}
                              />
                              <ListItemText primary={name?.roleName} />
                            </MenuItem>
                          );
                        })
                      )}
                    </Select>
                  </FormControl>
                </div>

                <div className="w-full">
                  <FormControl sx={{ width: 280 }} required>
                    <Select
                      value={employmentType}
                      onChange={handleEmploymentTypeChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Employment Type" }}
                    >
                      <MenuItem value="" disabled>
                        Select Employment Type
                      </MenuItem>
                      {availabelEmpTypes?.map((type) => (
                        <MenuItem key={type?._id} value={type?._id}>
                          {type?.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div className="flex items-center gap-14 mb-4">
                <div className="w-full">
                  <FormControl sx={{ width: 280 }} required>
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
                        <MenuItem key={item?._id} value={item?._id}>
                          {item?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <TextField
                      size="small"
                      type="text"
                      label="Bank Account Number"
                      name="bank_account_no"
                      id="bank_account_no"
                      value={bank_account_no}
                      onChange={(e) => setBankAccountNo(e.target.value)}
                      fullWidth
                      margin="normal"
                      required
                    />
                  </FormControl>
                </div>
              </div>

              <div className="flex items-center gap-14 mb-4">
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
                      {availabelDesignation?.map((type) => (
                        <MenuItem key={type?._id} value={type?._id}>
                          {type?.designationName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="w-full">
                  <FormControl sx={{ width: 280 }} required>
                    <Select
                      value={worklocation}
                      onChange={handleLocationChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Employment Type" }}
                    >
                      <MenuItem value="" disabled>
                        Select Work Location
                      </MenuItem>
                      {availabelLocation?.map((type) => (
                        <MenuItem key={type?._id} value={type?._id}>
                          {type?.city}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div className="flex items-center gap-14 mb-4">
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <Select
                      value={dept_cost_center_no}
                      onChange={(e) => setDeptCostCenterNo(e.target.value)}
                      displayEmpty
                      inputProps={{ "aria-label": "Department Cost Center No" }}
                    >
                      <MenuItem value="" disabled>
                        Department Cost Center No
                      </MenuItem>
                      {Array.isArray(availaleCostCenterId) &&
                        availaleCostCenterId.map((costno) => (
                          <MenuItem
                            key={costno?._id}
                            value={costno?.dept_cost_center_id}
                          >
                            {costno?.dept_cost_center_id}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <Select
                      value={shift_allocation}
                      onChange={(e) => setShiftAllocation(e.target.value)}
                      displayEmpty
                      inputProps={{ "aria-label": "Shift Allocation" }}
                    >
                      <MenuItem value="" disabled>
                        Shift Allocation
                      </MenuItem>
                      {Array.isArray(availaleShiftAllocation) &&
                        availaleShiftAllocation?.map((shift) => (
                          <MenuItem key={shift?._id} value={shift?.shiftName}>
                            {shift?.shiftName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div className="flex items-center gap-14">
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
                          onChange={handleDatePickerChange}
                          onAccept={() => {
                            // Check age again when the user accepts the date
                            const age = calculateAge(date_of_birth);
                            if (age < 18) {
                              setAgeError(true);
                            } else {
                              setAgeError(false);
                            }
                          }}
                          slotProps={{
                            textField: { size: "small", fullWidth: true },
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>

                    {ageError && (
                      <Typography
                        variant="caption"
                        color="error"
                        style={{ height: "5px", width: "280px" }}
                      >
                        Age must be 18 or above.
                      </Typography>
                    )}
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
              <div>
                {showFields && (
                  <div className="flex flex-wrap gap-8">
                    {availableInputField?.map((item) => (
                      <TextField
                        key={item?._id}
                        size="small"
                        type={item?.inputType}
                        label={item?.label}
                        name={item?.label}
                        id={item?.label}
                        value={dynamicFields?.[item?.label] || ""}
                        onChange={(e) =>
                          handleDynamicFieldChange(item?.label, e.target.value)
                        }
                        fullWidth
                        margin="normal"
                        sx={{
                          flexBasis: "45%", // Commenting out or reducing flexBasis
                          marginBottom: "16px",
                          marginRight: "15px",
                        }}
                      />
                    ))}
                  </div>
                )}

                <Button
                  onClick={toggleFields}
                  variant="outlined"
                  sx={{ marginTop: "20px" }}
                >
                  {showFields ? "Read Less" : "Read More"}
                </Button>
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

export default EmployeeAdd;
