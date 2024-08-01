import axios from "axios";
import * as faceApi from "face-api.js";
import { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useFaceStore from "../../../hooks/FaceMode/useFaceStore";
import useGetUser from "../../../hooks/Token/useUser";
import UserProfile from "../../../hooks/UserData/useUser";

const useSelfieFaceDetect = () => {
  const { handleAlert } = useContext(TestContext);
  const { descriptor, setDescriptor } = useFaceStore();
  const { decodedToken, authToken } = useGetUser();
  const [loading, setLoading] = useState(false);
  const role = UserProfile().useGetCurrentRole();

  const loadModels = async () => {
    await faceApi.nets.faceExpressionNet.loadFromUri("/models");
    await faceApi.nets.faceRecognitionNet.loadFromUri("/models");
    await faceApi.nets.ssdMobilenetv1.loadFromUri("/models");
    await faceApi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceApi.nets.mtcnn.loadFromUri("/models");
    await faceApi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceApi.nets.faceLandmark68TinyNet.loadFromUri("/models");
    await faceApi.nets.ageGenderNet.loadFromUri("/models");
    return {
      message: "Models loaded successfully",
      success: true,
    };
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["load-model"],
    queryFn: loadModels,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const detectFaceOnly = async ({ img }) => {
    const faces = await faceApi
      .detectAllFaces(img, new faceApi.SsdMobilenetv1Options())
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withFaceExpressions()
      .withAgeAndGender();
    return faces;
  };

  const getEmployeeRemoteSet = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/remote-punch/get-employee-org-obj/org`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data;
  };
  const { data: employeeOrgId } = useQuery({
    queryFn: getEmployeeRemoteSet,
    queryKey: ["remote-fetch", decodedToken?.user?.organizationId],
    enabled: role !== "Super-Admin" || role !== "Delegate-Super-Admin",
    onSuccess: (data) => {
      console.info(`🚀 ~ file: useFaceModal.jsx:62 ~ data:`, data);
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const {
    mutateAsync: detectFaceOnlyMutation,
    isLoading: isFaceDetectionLoading,
  } = useMutation({
    mutationFn: detectFaceOnly,
    onSuccess: async (data) => {
      if (data?.length === 0) {
        handleAlert(true, "error", "No faces found in the image");
      } else if (data?.length > 1) {
        handleAlert(true, "warning", "More than one face found in the image");
      } else {
        setDescriptor(Object.values(data[0].descriptor));
        handleAlert(true, "success", "Face detected successfully");
      }
    },
    onError: (error) => {
      console.error("Error detecting faces", error);
      handleAlert(true, "error", error?.message);
    },
  });

  const matchFaces = async ({ currentDescriptor, descriptor }) => {
    let matchScore = 0.63;
    let labeledFace = new faceApi.LabeledFaceDescriptors(
      decodedToken?.user?._id,
      [descriptor]
    );
    let faceMatcher = new faceApi.FaceMatcher(labeledFace, matchScore);

    let results = faceMatcher.findBestMatch(currentDescriptor);
    return results;
  };

  const { mutateAsync: matchFacesMutation, isLoading: isMutationLoading } =
    useMutation({
      mutationFn: matchFaces,
      onSuccess: (data) => {
        if (data._label === decodedToken?.user?._id) {
          handleAlert(true, "success", "Face match found");
        } else {
          handleAlert(true, "error", "Face match not found");
        }
      },
      onError: (error) => {
        console.error("Error matching faces", error);
        handleAlert(true, "error", error?.message);
      },
    });

  const getImageAndVerify = async ({ localDescriptor }) => {
    const config = { headers: { "Content-Type": "application/json" } };
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/face-model/face/${decodedToken?.user?._id}`,
      config
    );
    return response.data;
  };

  const { data: faceDetectedData } = useQuery({
    queryKey: ["face-detected"],
    queryFn: getImageAndVerify,
    onSuccess: async (data) => {
      //   setUserDescriptor(data?.descriptor);
    },
    onError: (error) => {
      console.error("Error fetching image from backend", error);
      handleAlert(true, "error", error?.response?.data?.message);
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    matchFacesMutation,
    detectFaceOnlyMutation,
    descriptor,
    setDescriptor,
    faceDetectedData,
    loading,
    setLoading,
    isMutationLoading,
    isFaceDetectionLoading,
    isFetching,
    employeeOrgId,
  };
};

export default useSelfieFaceDetect;