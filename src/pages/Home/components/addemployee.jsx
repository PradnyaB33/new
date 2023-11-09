import { Button, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { TestContext } from "../../../State/Function/Main";
import useProfileForm from "../../../hooks/useProfileForm";
import { UseContext } from "../../../State/UseState/UseContext";
import { useParams } from "react-router-dom";
const AddEmployee = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const { handleAlert } = useContext(TestContext);
  const {
    first_name,
    middle_name,
    last_name,
    email,
    password,
    phone_number,
    emergency_contact,
    address,
    location,
    firstNameError,
    lastNameError,
    emailError,
    passwordError,
    setFirstName,
    setLastName,
    setMiddalName,
    setEmail,
    setPassword,
    setEmailError,
    setFirstNameError,
    setLastNameError,
    setPasswordError,
    setPhoneNumber,
    setEmergencyContact,
    setAddress,
    setLocation,
    joining_date,
    setJoiningDate,
  } = useProfileForm();
  const [selectedValue, setSelectedValue] = useState("");
  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };
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
  const [profile, setProfile] = React.useState([]);

  const handleRoleChange = (event) => {
    const {
      target: { value },
    } = event;

    setProfile(typeof value === "string" ? value.split(",") : value);
  };
  // display the role dynamically depend existing role

  const [availableProfiles, setAvailableProfiles] = useState([]);

  const { id } = useParams();

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
      console.log(response);
      console.log(response.data.roles);
      if (response.data && response.data.roles) {
        if (response.data.roles.length > 0) {
          const filteredProfiles = response.data.roles.filter((role) => {
            return role.isActive;
          });

          console.log(filteredProfiles.length);
          if (filteredProfiles.length > 0) {
            setAvailableProfiles(filteredProfiles);
          } else {
            console.log(availableProfiles);
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
  }, [id]);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      first_name,
      last_name,
      middle_name,
      email,
      password,
      phone_number,
      emergency_contact,
      address,
      location,
      selectedValue,
      joining_date,
      profile: profile.length <= 0 ? "Employee" : profile,
    };
    console.log(user);
    try {
      console.log(process.env.REACT_APP_API);
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/create-profile`,
        user,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(`🚀 ~ response:`, response);
      if (response.data.success) {
        console.log("hii i am called as error");
        handleAlert(true, "error", "Invalid authorization");
      }

      handleAlert(true, "success", response.data.message);
    } catch (error) {
      console.error(error.response.data.message);
      handleAlert(true, "error", error.response.data.message);
    }
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          padding: "20px 0 0",
          boxSizing: "border-box",
        }}
      >
        <div className="content-center flex justify-center my-0 p-0 bg-[#F8F8F8]">
          <div className="w-[400px] shadow-lg rounded-lg border py-3 px-8 grid items-center">
            <h4 className="text-center mb-2 text-lg font-bold text-blue-500">
              Add Employee
            </h4>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center space-y-5"
            >
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

                  if (
                    enteredFirstName.length < 2 ||
                    enteredFirstName.length > 30 ||
                    /[^a-zA-Z]/.test(enteredFirstName)
                  ) {
                    setFirstNameError(
                      "First Name must be between 2 and 30 characters and should only contain letters."
                    );
                  } else {
                    setFirstNameError("");
                  }
                }}
                required
                fullWidth
                margin="normal"
                error={!!firstNameError}
                helperText={firstNameError}
              />
              <TextField
                size="small"
                type="text"
                label="Middal Name"
                name="middle_name"
                id="middle_name"
                value={middle_name}
                onChange={(e) => setMiddalName(e.target.value)}
                fullWidth
                margin="normal"
              />
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
                  if (
                    enteredLastName.length < 2 ||
                    enteredLastName.length > 30 ||
                    /[^a-zA-Z]/.test(enteredLastName)
                  ) {
                    setLastNameError(
                      "Last Name must be between 2 and 30 characters and should only contain letters"
                    );
                  } else {
                    setLastNameError("");
                  }
                }}
                error={!!lastNameError}
                helperText={lastNameError}
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

                  if (!isValidEmail(enteredEmail)) {
                    setEmailError("Invalid email format");
                  } else {
                    setEmailError("");
                  }
                }}
                required
                fullWidth
                margin="normal"
                error={!!emailError}
                helperText={emailError}
              />
              <TextField
                size="small"
                type="password"
                label="Password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (!e.target.value.match(passwordRegex)) {
                    setPasswordError(
                      "Password must contain at least one number , special character.and and min length is 8"
                    );
                  } else {
                    setPasswordError("");
                  }
                }}
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
              <TextField
                size="small"
                type="text"
                label="Phone Number"
                name="phone_number"
                id="phone_number"
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                size="small"
                type="text"
                label="Emergency Contact"
                name="emergency_contact"
                id="emergency_contact"
                value={emergency_contact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                size="small"
                type="text"
                label="Address"
                name="address"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                size="small"
                type="text"
                label="Location"
                name="location"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
              <div className="w-full">
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
                        setJoiningDate(newDate);
                      }}
                      slotProps={{
                        textField: { size: "small", fullWidth: true },
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
              <div className="w-full">
                <FormControl sx={{ width: "100%", mt: 1, mb: 2 }}>
                  <InputLabel id="demo-multiple-checkbox-label">
                    Profile
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={profile}
                    onChange={handleRoleChange}
                    input={<OutlinedInput label="profile" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {availableProfiles.length === 0 ? (
                      // Display an error message if no roles are available
                      <MenuItem disabled>
                        No roles available. Please add roles for your
                        organization.
                      </MenuItem>
                    ) : (
                      availableProfiles.map((name) => (
                        <MenuItem key={name._id} value={name.roleName}>
                          {name.roleName}
                          {/* <Checkbox
                            checked={availableProfiles.indexOf(name) > -1}
                          /> */}
                          {/* <ListItemText primary={name} /> */}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
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
                    value={selectedValue}
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
              <div className="text-center m-6">
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
