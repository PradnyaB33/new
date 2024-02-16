import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Paper,
  TextField,
} from "@mui/material";
import axios from "axios";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import UserProfile from "../../hooks/UserData/useUser";

const EmployeeProfile = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const userId = user._id;
  const [additionalPhoneNumber, setAdditionalPhoneNumber] = useState("");
  const [chatId, setChatId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // Function to fetch additional details of the employee
  const [availableUserProfileData, setAvailableProfileData] = useState({});
  const fetchAvailableUserProfileData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get/profile/${userId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setAvailableProfileData(response.data.employee);
    } catch (error) {
      handleAlert(true, "error", "Failed to fetch User Profile Data");
      console.error("Error fetching user profile data:", error);
    }
  };

  useEffect(() => {
    fetchAvailableUserProfileData();
    // eslint-disable-next-line
  }, []);

  // Function to handle adding additional details
  const handleAddAdditionalDetails = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/profile/add/${userId}`,
        {
          additional_phone_number: additionalPhoneNumber,
          chat_id: chatId,
          status_message: statusMessage,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        handleAlert(true, "success", "Additional details added successfully!");
        window.location.reload();
      } else {
        console.error("Failed to update additional details");
      }
    } catch (error) {
      console.error("Error updating additional details:", error);
      handleAlert(
        true,
        "error",
        error.response ? error.response.data.message : error.message
      );
    }
  };

  return (
    <div>
      <Paper
        sx={{
          width: "100%",
          maxWidth: "800px",
          margin: "10% auto",
          padding: "20px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1 className="text-lg font-semibold md:text-xl">Account Setting</h1>
        </div>

        <Grid container spacing={2}>
          {/* Profile Picture */}
          <Grid item xs={12} md={4}></Grid>

          {/* Additional Details */}
          <Grid item xs={12} md={8}>
            <div>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#333",
                  textAlign: "center",
                }}
              >
                {`${user?.first_name} ${user?.last_name}`}
              </h1>
              <h1 className="text-lg font-semibold text-center">
                {user?.profile.join(", ")}
              </h1>
              <div className="w-full">
                <h1
                  className="text-lg"
                  style={{ color: "#000", textAlign: "center" }}
                >
                  Status: {availableUserProfileData?.status_message || ""}
                </h1>
                <h1
                  className="text-lg"
                  style={{ color: "#000", textAlign: "center" }}
                >
                  Chat Id: {availableUserProfileData?.chat_id || ""}
                </h1>
              </div>
            </div>
          </Grid>
        </Grid>

        <div className="w-full py-6">
          <Divider variant="fullWidth" orientation="horizontal" />
        </div>

        {/* Additional Information Fields */}
        <div className="w-full px-4">
          <InputLabel htmlFor="additionalPhoneNumber">
            Additional Phone Number
          </InputLabel>
          <FormControl sx={{ width: "100%" }}>
            <TextField
              id="additionalPhoneNumber"
              size="small"
              type="number"
              fullWidth
              margin="normal"
              value={additionalPhoneNumber}
              onChange={(e) => {
                const enteredNumber = e.target.value;
                if (/^\d{0,10}$/.test(enteredNumber)) {
                  setAdditionalPhoneNumber(enteredNumber);
                }
              }}
            />
          </FormControl>
        </div>

        <div className="w-full px-4">
          <InputLabel htmlFor="chatId">Add Chat Id</InputLabel>
          <FormControl sx={{ width: "100%" }}>
            <TextField
              id="chatId"
              size="small"
              type="text"
              fullWidth
              margin="normal"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
            />
          </FormControl>
        </div>

        <div className="w-full px-4">
          <InputLabel htmlFor="statusMessage">Add Status Message</InputLabel>
          <FormControl sx={{ width: "100%" }}>
            <TextField
              id="statusMessage"
              size="small"
              type="text"
              fullWidth
              margin="normal"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
            />
          </FormControl>
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddAdditionalDetails}
            style={{
              backgroundColor: "#1976D2",
              color: "#fff",
              padding: "5px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default EmployeeProfile;
