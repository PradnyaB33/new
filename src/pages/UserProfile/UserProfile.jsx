import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  Paper,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
//import EditEmpProfileModal from "../../components/Modal/EditEmpProfileModal/EditEmpProfileModal";
import UserProfile from "../../hooks/UserData/useUser";
const EmployeeProfile = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const token = cookies["aeigs"];
  const [selectedImage, setSelectedImage] = useState(null);
  const [additionalPhoneNumber, setAdditionalPhoneNumber] = useState("");
  const [chatId, setChatId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  // const [editingUserId, setEditingUserId] = useState(null);
  // const [editModalOpen, setEditModalOpen] = useState(false);
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const userId = user._id;
  console.log(userId);
  // const handleEditModalOpen = () => {
  //   setEditModalOpen(true);
  //   console.log(userId);
  //   setEditingUserId(userId);
  // };

  // const handleClose = () => {
  //   setEditModalOpen(false);
  //   setEditingUserId(null);
  // };
  // console.log(editingUserId);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  // Function to handle addd additional details
  const handleAddAdditionalDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/route/employee/profile/add/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            additional_phone_number: additionalPhoneNumber,
            chat_id: chatId,
            status_message: statusMessage,
          }),
        }
      );

      if (response.status === 200) {
        handleAlert(true, "success", "Additional details Added successfully!");
        console.log("Additional details updated successfully!");
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

  // function to handle get additional detail of employee
  const [availableUserProfileData, setAvailableProfileData] = useState([]);
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
      console.error(error);
      handleAlert(true, "error", "Failed to fetch User Profile Data");
    }
  };

  useEffect(() => {
    fetchAvailableUserProfileData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div
        style={{
          margin: "10% auto", // Center the content
          padding: "10px",
          maxWidth: "800px",
          width: "90%",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            height: "100%",
            paddingBottom: "10%",
          }}
          className="w-full"
        >
          <div style={{ display: "flex", marginTop: "20px" }}>
            <div style={{ marginRight: "30%" }}>
              <h1 className="text-lg pl-2 font-semibold">Account Setting</h1>
            </div>
          </div>

          {/* <Paper className="border-none !pt-0 !px-0 shadow-md outline-none rounded-md"> */}
          <div className="w-full py-4">
            <Divider variant="fullWidth" orientation="horizontal" />
          </div>

          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={4}>
                <h1
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {selectedImage && (
                    <img
                      src={selectedImage}
                      alt="User"
                      style={{
                        borderRadius: "50%",
                        width: "180px",
                        height: "180px",
                        display: "block",
                        margin: "auto",
                      }}
                    />
                  )}
                </h1>
              </Grid>
              <Grid item xs={6} md={8}>
                <div>
                  <h1
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    {`${user?.first_name} ${user?.last_name}`}
                  </h1>
                  <h1 className="text-lg font-semibold">
                    {user?.profile.join(" ,")}
                  </h1>
                  <h1 className="text-lg">{user?.email}</h1>
                  <div className="w-full">
                    <h1 className="text-lg" style={{ color: "#000" }}>
                      Status: {availableUserProfileData.status_message}
                    </h1>
                    <h1 className="text-lg" style={{ color: "#000" }}>
                      Chat Id: {availableUserProfileData.chat_id}
                    </h1>
                  </div>

                  <div style={{ display: "flex", marginTop: "20px" }}>
                    <button
                      style={{
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        padding: "5px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginRight: "10px",
                      }}
                    >
                      Delete Photo
                    </button>
                    <input
                      type="file"
                      id="imageInput"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                    <label htmlFor="imageInput">
                      <Button
                        style={{
                          backgroundColor: "#1976D2",
                          color: "#fff",
                          padding: "5px 20px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        component="span"
                      >
                        Change Photo
                      </Button>
                    </label>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Box>

          <div className="w-full py-6">
            <Divider variant="fullWidth" orientation="horizontal" />
          </div>

          <div className="flex items-center gap-20 flex-col md:flex-row">
            <div className="w-full px-4 mb-4 md:mb-0">
              <InputLabel>Additional Phone Number</InputLabel>
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  size="small"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={additionalPhoneNumber}
                  onChange={(e) => {
                    const enteredNumber = e.target.value;
                    // Check if enteredNumber is a valid 10-digit number
                    if (/^\d{0,10}$/.test(enteredNumber)) {
                      setAdditionalPhoneNumber(enteredNumber);
                    }
                  }}
                />
              </FormControl>
            </div>
            <div className="w-full px-4">
              <InputLabel>Add Chat Id</InputLabel>
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  size="small"
                  type="text"
                  fullWidth
                  margin="normal"
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                />
              </FormControl>
            </div>
          </div>

          <div className="w-full px-4">
            <InputLabel>Add Status Message</InputLabel>
            <FormControl sx={{ width: 730 }}>
              <TextField
                size="small"
                type="text"
                fullWidth
                margin="normal"
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
              />
            </FormControl>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: "20px",
              justifyContent: "center",
            }}
          >
            <Button
              type="submit"
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
          {/* </Paper> */}
        </Paper>
      </div>
    </>
  );
};

export default EmployeeProfile;
