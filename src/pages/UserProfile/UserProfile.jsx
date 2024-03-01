import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  Paper,
  TextField,
} from "@mui/material";
import axios from "axios";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import UserProfile from "../../hooks/UserData/useUser";
import { getSignedUrl, uploadFile } from "../../services/api";

const EmployeeProfile = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const userId = user._id;
  const [url, setUrl] = useState();
  const [additionalPhoneNumber, setAdditionalPhoneNumber] = useState("");
  const [chatId, setChatId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [file, setFile] = useState();
  const fileInputRef = useRef();
  const [availableUserProfileData, setAvailableProfileData] = useState({});



  useEffect(() => {
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
    fetchAvailableUserProfileData();
  }, [handleAlert, token, userId]);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      handleAlert(true, "error", "Please select a valid image file.");
    }
  };

  const handleAddAdditionalDetails = async () => {
    try {
      let imageUrl
      if (file) {
        const signedUrlResponse = await getSignedUrl();
        const signedUrl = signedUrlResponse.url;
        imageUrl =  await uploadFile(signedUrl, file);
      }
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/profile/add/${userId}`,
        {
          additional_phone_number: additionalPhoneNumber,
          chat_id: chatId,
          status_message: statusMessage,
          user_logo_url: imageUrl.Location.split('?')[0],
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
        <div style={{ textAlign: "center" }}>
          <h1 className="text-lg font-semibold md:text-xl">Account Setting</h1>
        </div>
        <div className=" mb-8">
          <p className="text-xs text-gray-600  text-center">
            Manage your account here.
          </p>
        </div>

        <div className="flex justify-around items-center w-full h-[25vh]">
          <div className="w-[50%]">
            <div>
              <input
                style={{ display: "none" }}
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className="w-full h-full flex flex-col justify-center items-center">
                {(url || availableUserProfileData?.user_logo_url) && (
                  <img
                    src={url || availableUserProfileData?.user_logo_url}
                    alt="Selected"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                    }}
                  />
                )}
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="flex justify-center h-full bg-[#0050A6] pt-1 pb-1 pr-4 pl-4 rounded-3xl font-semibold mt-2 text-white"
                >
                 {availableUserProfileData.user_logo_url ? "Update Profile Picture" : "Select Profile Picture"}
                </button>
              </div>
            </div>
          </div>

          <div className="w-[50%]">
            <div className="w-full h-full flex flex-col justify-center items-center">
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
          </div>
        </div>

        <div className="w-full py-6">
          <Divider variant="fullWidth" orientation="horizontal" />
        </div>


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
