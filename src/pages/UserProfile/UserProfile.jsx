import { jwtDecode } from "jwt-decode";
import React, { useContext, useState, useEffect } from "react";
import { UseContext } from "../../State/UseState/UseContext";
import { Paper, Divider, FormControl, Button } from "@mui/material";
import { TextField, InputLabel } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { TestContext } from "../../State/Function/Main";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";

const EmployeeProfile = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const token = cookies["aeigs"];
  const decodedToken = jwtDecode(token);
  const user = decodedToken.user;

  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const userId = user._id;

  // State to hold changes in additional details
  const [additionalPhoneNumber, setAdditionalPhoneNumber] = useState("");
  const [chatId, setChatId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

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
            profile_photo: selectedImage,
          }),
        }
      );

      if (response.status === 200) {
        handleAlert(true, "success", "Additional details Added successfully!");
        console.log("Additional details updated successfully!");
        window.location.reload(); // Reload the page on success
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
          marginTop: "10%",
          marginLeft: "20%",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            maxWidth: "800px!important",
            height: "100%",
            maxHeight: "85vh!important",
          }}
          className="w-full"
        >
          <div style={{ display: "flex", marginTop: "20px" }}>
            <div style={{ marginRight: "30%" }}>
              <h1 className="text-lg pl-2 font-semibold">Account Setting</h1>
              <h1 className="text-lg pl-2">Here You Can Manage Your Account</h1>
            </div>
          </div>

          <Paper className="border-none !pt-0 !px-0 shadow-md outline-none rounded-md">
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
                      <h1 className="text-lg">
                        Status: {availableUserProfileData.status_message}
                      </h1>
                      <h1>Chat Id: {availableUserProfileData.chat_id}</h1>
                    </div>

                    <div style={{ display: "flex", marginTop: "20px" }}>
                      <button
                        style={{
                          backgroundColor: "red",
                          color: "white",
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
                            backgroundColor: "blue",
                            color: "white",
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

            <div className="flex items-center gap-20">
              <div className="w-full px-4">
                <InputLabel>Additional Phone Number</InputLabel>
                <FormControl sx={{ width: 300 }}>
                  <TextField
                    size="small"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={additionalPhoneNumber}
                    onChange={(e) => setAdditionalPhoneNumber(e.target.value)}
                  />
                </FormControl>
              </div>
              <div className="w-full">
                <InputLabel>Add Chat Id</InputLabel>
                <FormControl sx={{ width: 300 }}>
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
              <Tooltip
                title="You can add or update the data here"
                placement="top"
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handleAddAdditionalDetails}
                  style={{
                    backgroundColor: "blue",
                    color: "white",
                    padding: "5px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Add or Update
                </Button>
              </Tooltip>
            </div>
          </Paper>
        </Paper>
      </div>
    </>
  );
};

export default EmployeeProfile;
