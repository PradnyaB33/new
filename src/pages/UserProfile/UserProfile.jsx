import { zodResolver } from "@hookform/resolvers/zod";
import { ContactEmergency } from "@mui/icons-material";
import ChatIcon from "@mui/icons-material/Chat";
import InfoIcon from "@mui/icons-material/Info";
import { Button, Divider, Paper, Skeleton } from "@mui/material";
import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import useLoadModel from "../../hooks/FaceMode/useFaceModal";
import UserProfile from "../../hooks/UserData/useUser";
import useHook from "../../hooks/UserProfile/useHook";
import { getSignedUrl, uploadFile } from "../../services/api";

const EmployeeProfile = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const userId = user._id;
  const queryClient = useQueryClient();
  const { UserInformation } = useHook();
  const [url, setUrl] = useState();
  const fileInputRef = useRef();
  const [file, setFile] = useState();
  const { detectFaceOnlyMutation, uploadImageToBackendMutation } =
    useLoadModel();

  const UserProfileSchema = z.object({
    additional_phone_number: z
      .string()
      .max(10, { message: "Phone Number must be 10 digits" })
      .refine((value) => value.length === 10, {
        message: "Phone Number must be exactly 10 digits",
      })
      .optional(),
    chat_id: z.string().optional(),
    status_message: z.string().optional(),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      additional_phone_number: undefined,
      chat_id: undefined,
      status_message: undefined,
    },
    resolver: zodResolver(UserProfileSchema),
  });

  // Fetch user profile data using useQuery
  const { data: profileData, isLoading } = useQuery(
    ["employeeProfile", userId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get/profile/${userId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        setValue("chat_id", data?.employee?.chat_id);
        setValue(
          "additional_phone_number",
          String(data?.employee?.additional_phone_number)
        );
        setValue("status_message", data?.employee?.status_message);
      },
      onError: () => {},
    }
  );
  console.log(
    `🚀 ~ file: UserProfile.jsx:97 ~ profileData, isLoading:`,
    profileData,
    isLoading
  );

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const img = new Image();
        img.src = reader.result;
        const faces = await detectFaceOnlyMutation({
          img,
        });
        console.log(`🚀 ~ file: UserProfile.jsx:112 ~ faces:`, faces);

        if (faces.length === 1) {
          setUrl(() => reader.result);
        } else {
          setUrl(UserInformation?.user_logo_url);
        }
      };
      reader.readAsDataURL(selectedFile);
    } else {
      handleAlert(true, "error", "Please select a valid image file.");
    }
  };

  const AddAdditionalInformation = useMutation(
    (data) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/employee/profile/add/${userId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["additionalField"] });
        handleAlert(true, "success", "Additional details added successfully!");
        reset();
      },
      onError: () => {},
    }
  );

  const onSubmit = async (data) => {
    try {
      let imageUrl;
      if (file) {
        const signedUrlResponse = await getSignedUrl();
        const signedUrl = signedUrlResponse.url;
        imageUrl = await uploadFile(signedUrl, file);
      }
      await uploadImageToBackendMutation();

      const requestData = {
        ...data,
        user_logo_url: imageUrl?.Location.split("?")[0],
      };
      await AddAdditionalInformation.mutateAsync(requestData);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Error updating additional details");
    }
  };

  return (
    <div>
      <Paper
        sx={{
          width: "100%",
          maxWidth: "800px",
          margin: "6% auto",
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

        <form onSubmit={handleSubmit(onSubmit)}>
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
                  {url || UserInformation?.user_logo_url ? (
                    <img
                      id="image-1"
                      src={url || UserInformation?.user_logo_url}
                      alt="profile-pic"
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <Skeleton variant="circular" width="150px" height="150px" />
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="flex justify-center h-full bg-[#1976d2] shadow-md pt-1 pb-1 pr-4 pl-4 rounded-md font-semibold mt-2 text-white"
                  >
                    {UserInformation?.user_logo_url
                      ? "Update Profile Picture"
                      : "Select Profile Picture"}
                  </button>
                </div>
              </div>
            </div>

            <div className="w-[50%] ml-20">
              <div className="w-full h-full flex flex-col items-start">
                <h1
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#333",
                    textAlign: "center",
                  }}
                  className="text-left"
                >
                  {`${user?.first_name} ${user?.last_name}`}
                </h1>
                <h1 className="text-lg font-semibold text-left">
                  {user?.profile.join(", ")}
                </h1>

                <div className="w-full">
                  <h1 className="text-lg text-left" style={{ color: "#000" }}>
                    {!UserInformation?.status_message ? (
                      <div className="w-full">
                        <Skeleton
                          variant="text"
                          width="200px"
                          className="flex m-auto"
                          sx={{ fontSize: "1rem" }}
                        />
                      </div>
                    ) : (
                      <>
                        <span>
                          <strong>Status:</strong>{" "}
                          {UserInformation?.status_message || ""}
                        </span>
                      </>
                    )}
                  </h1>
                  <h1 className="text-lg text-left" style={{ color: "#000" }}>
                    {!UserInformation?.chat_id ? (
                      <div className="w-full">
                        <Skeleton
                          variant="text"
                          width="200px"
                          className="flex m-auto"
                          sx={{ fontSize: "1rem" }}
                        />
                      </div>
                    ) : (
                      <>
                        <span>
                          <strong>Chat ID:</strong>{" "}
                          {UserInformation?.chat_id || ""}
                        </span>
                      </>
                    )}
                  </h1>
                  <h1 className="text-lg text-left" style={{ color: "#000" }}>
                    {!UserInformation?.additional_phone_number ? (
                      <div className="w-full">
                        <Skeleton
                          variant="text"
                          width="200px"
                          className="flex m-auto"
                          sx={{ fontSize: "1rem" }}
                        />
                      </div>
                    ) : (
                      <>
                        <span>
                          <strong>Contact:</strong>{" "}
                          {UserInformation?.additional_phone_number || ""}
                        </span>
                      </>
                    )}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full py-6">
            <Divider variant="fullWidth" orientation="horizontal" />
          </div>

          <div className="px-5 space-y-4 mt-4">
            <div className="space-y-2 ">
              <AuthInputFiled
                name="additional_phone_number"
                icon={ContactEmergency}
                control={control}
                type="text"
                placeholder="Contact"
                label="Contact"
                errors={errors}
                error={errors.additional_phone_number}
              />
            </div>
            <div className="space-y-2 ">
              <AuthInputFiled
                name="chat_id"
                icon={ChatIcon}
                control={control}
                type="text"
                placeholder="Chat Id"
                label="Chat Id"
                errors={errors}
                error={errors.chat_id}
              />
            </div>
            <div className="space-y-2 ">
              <AuthInputFiled
                name="status_message"
                icon={InfoIcon}
                control={control}
                type="text"
                placeholder="status"
                label="status"
                errors={errors}
                error={errors.status_message}
              />
            </div>

            <div className="flex gap-4 mt-4 justify-center">
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default EmployeeProfile;
