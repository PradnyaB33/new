import { Button, Checkbox, ListItemText, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import useProfileForm from "../../../hooks/useProfileForm";
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
const AddProfile = () => {
  const locations = useLocation();
  const { orgName } = locations.state;
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const [userId, setUserId] = useState(null);
  const { id } = useParams();
  const {
    first_name,
    last_name,
    email,
    password,
    phone_number,
    emergency_contact,
    address,
    firstNameError,
    lastNameError,
    emailError,
    passwordError,
    setFirstName,
    setLastName,
    setEmail,
    setPassword,
    setEmailError,
    setFirstNameError,
    setLastNameError,
    setPasswordError,
    setPhoneNumber,
    setEmergencyContact,
    setAddress,
    joining_date,
    setJoiningDate,
  } = useProfileForm();
  const [middle_name, setMiddleName] = useState("");
  const [middleNameError, setMiddleNameError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const validDomain =
      email.endsWith(".com") || email.endsWith(".net") || email.endsWith(".in");
    return emailRegex.test(email) && validDomain && email.includes("@");
  };

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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

  const [gender, setGender] = useState("");
  const handleRadioChange = (event) => {
    setGender(event.target.value);
  };

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
      console.log(`🚀 ~ file: addprofile.jsx:145 ~ response:`, response);

      if (response.data && Array.isArray(response.data.roles)) {
        const filteredProfiles = response.data.roles.filter(
          (role) => role && role.isActive
        );

        if (filteredProfiles.length > 0) {
          setAvailableProfiles(filteredProfiles);
        } else {
          handleAlert(
            true,
            "error",
            "No active profiles available. Please add active profiles for your organization."
          );
        }
      } else {
        handleAlert(true, "error", "Invalid data received from the server");
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
  console.log(availableProfiles);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = {
        first_name,
        last_name,
        middle_name,
        email,
        password,
        phone_number,
        emergency_contact,
        address,
        gender,
        joining_date,
        profile,
        organizationId: id,
        creatorId: userId,
      };

      // Check if the selected profile exists
      const checkProfileResponse = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/check-profile-exists`,
        { profile },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      if (
        checkProfileResponse.status === 200 &&
        checkProfileResponse.data.profileExist
      ) {
        const createProfileConfirmation = window.confirm(
          `${profile} profile already exists. Do you want to create it again?`
        );

        if (createProfileConfirmation) {
          // Proceed with profile creation
          const response = await axios.post(
            `${process.env.REACT_APP_API}/route/employee/create-profile`,
            user,
            {
              headers: {
                Authorization: authToken,
              },
            }
          );

          if (response.status === 201) {
            handleAlert(true, "success", response.data.message);
          } else {
            handleAlert(true, "error", "Profile creation failed.");
          }
        } else {
          // User declined creating the profile again
          handleAlert(true, "info", "Profile creation canceled.");
        }
      } else {
        // Profile does not exist, proceed with creation
        const response = await axios.post(
          `${process.env.REACT_APP_API}/route/employee/create-profile`,
          user,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        if (response.status === 201) {
          handleAlert(true, "success", response.data.message);
        } else {
          handleAlert(true, "error", "Profile creation failed.");
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

  const staticTitle =
    "This form is used to add relavant information of employee for";
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "50px 0 0",
          boxSizing: "border-box",
        }}
      >
        <div className="content-center flex justify-center my-0 p-0 bg-[#F8F8F8]">
          <div className="w-[700px] shadow-lg rounded-lg border py-3 px-8">
            <div className="flex items-center justify-center gap-4">
              <Tooltip title={`${staticTitle} ${orgName}`}>
                <Button>Add Profile</Button>
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
                            "First Name should only contain letters."
                          );
                        } else {
                          setFirstNameError(""); // Clear error message when criteria are met
                        }
                      }}
                      required
                      fullWidth
                      margin="normal"
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
                      label="Middle Name"
                      name="middle_name"
                      id="middle_name"
                      value={middle_name}
                      onChange={(e) => {
                        const enteredMiddleName = e.target.value;
                        setMiddleName(enteredMiddleName);
                        if (
                          enteredMiddleName.length > 0 &&
                          (enteredMiddleName.length < 2 ||
                            enteredMiddleName.length > 30 ||
                            /[^a-zA-Z]/.test(enteredMiddleName))
                        ) {
                          setMiddleNameError(
                            "Middle Name should only contain letters."
                          );
                        } else {
                          setMiddleNameError(""); // Clear error message when criteria are met
                        }
                      }}
                      fullWidth
                      margin="normal"
                      error={!!middleNameError}
                      helperText={
                        <div style={{ height: "5px", width: "280px" }}>
                          {middleNameError}
                        </div>
                      }
                    />
                  </FormControl>
                </div>
              </div>

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
                    setLastNameError("Last Name  should only contain letters.");
                  } else {
                    setLastNameError(""); // Clear error message when criteria are met
                  }
                }}
                error={!!lastNameError}
                helperText={
                  <div style={{ height: "5px", width: "500px" }}>
                    {lastNameError}
                  </div>
                }
                required
                fullWidth
                margin="normal"
              />

              <TextField
                size="small"
                type="email"
                label="Email"
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
                required
                fullWidth
                margin="normal"
                error={!!emailError}
                helperText={
                  <div style={{ height: "5px", width: "500px" }}>
                    {emailError}
                  </div>
                }
              />

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
                      helperText={
                        <div style={{ height: "5px", width: "280px" }}>
                          {passwordError}
                        </div>
                      }
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
                      helperText={
                        <div style={{ height: "5px", width: "280px" }}>
                          {confirmPasswordError}
                        </div>
                      }
                    />
                  </FormControl>
                </div>
              </div>

              <div className="flex items-center gap-20">
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <TextField
                      size="small"
                      type="number"
                      label="Phone Number"
                      name="phone_number"
                      id="phone_number"
                      value={phone_number}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      fullWidth
                      margin="normal"
                    />
                  </FormControl>
                </div>
                <div className="w-full">
                  <FormControl sx={{ width: 280 }}>
                    <TextField
                      size="small"
                      type="number"
                      label="Emergency Contact"
                      name="emergency_contact"
                      id="emergency_contact"
                      value={emergency_contact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
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
                      value="other"
                      control={<Radio />}
                      label="Other"
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

export default AddProfile;
