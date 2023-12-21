import { jwtDecode } from "jwt-decode";
import React, { useContext, useState } from "react";
import { UseContext } from "../../State/UseState/UseContext";
import { Paper, Divider, FormControl, Button } from "@mui/material";
import { TextField, InputLabel } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { TestContext } from "../../State/Function/Main";
const UserProfile = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);

  const token = cookies["aeigs"];
  const decodedToken = jwtDecode(token);
  const user = decodedToken.user;
  console.log(user);

  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleDeletePhoto = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this photo?"
    );
    if (confirmDelete) {
      setSelectedImage(null);
    }
  };
  const userId = user._id;

  // State to hold changes in additional details
  const [additionalPhoneNumber, setAdditionalPhoneNumber] = useState("");
  const [chatId, setChatId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  console.log("info", { additionalPhoneNumber, chatId, statusMessage });

  // Function to handle updating additional details
  const handleUpdateAdditionalDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/route/employee/update/profile/${userId}`,
        {
          method: "PATCH",
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
        handleAlert(
          true,
          "success",
          "Additional details updated successfully!"
        );
        console.log("Additional details updated successfully!");
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
  // Function to handle updating additional details
  const handleDeleteAdditionalDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/route/employee/delete/profile/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            additional_phone_number: true,
            status_message: true,
            chat_id: true,
            profile_photo: true,
          }),
        }
      );

      if (response.status === 200) {
        handleAlert(
          true,
          "success",
          "Additional details deleted successfully!"
        );
        console.log("Additional details deleted successfully!");
        // Handle any necessary UI updates or state changes after deletion
      } else {
        console.error("Failed to delete additional details");
      }
    } catch (error) {
      console.error("Error deleting additional details:", error);
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
          <div className="w-full py-4">
            <h1 className="text-lg pl-2 font-semibold">Account Setting</h1>
            <h1 className="text-lg pl-2 ">Here You Can Manage Your Account</h1>
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
                          width: "100px",
                          height: "100px",
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

                    <h1>{user?.profile.join(" ,")}</h1>
                    <h1>{user?.phone_number}</h1>
                    <h1>{user?.email}</h1>
                    <div style={{ display: "flex", marginTop: "20px" }}>
                      <button
                        onClick={handleDeletePhoto}
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
              <Button
                onClick={handleDeleteAdditionalDetails}
                variant="outlined"
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  padding: "5px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Delete
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleUpdateAdditionalDetails}
                style={{
                  backgroundColor: "green",
                  color: "white",
                  padding: "5px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Update
              </Button>
            </div>
          </Paper>
        </Paper>
      </div>
    </>
  );
};

export default UserProfile;
