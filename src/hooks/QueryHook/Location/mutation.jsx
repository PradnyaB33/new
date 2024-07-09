import axios from "axios";
import { useContext } from "react";
import { useMutation } from "react-query";
import useGetGeoFencing from "../../../pages/Remote-Punching-Employee/useGetGeoFencing";
import { TestContext } from "../../../State/Function/Main";
import useGetUser from "../../Token/useUser";
import useSelfieStore from "./zustand-store";

const useLocationMutation = () => {
  const { handleAlert } = useContext(TestContext);
  const { authToken } = useGetUser();
  const { setOpen, setMedia, setPunchObjectId, media, setStart } =
    useSelfieStore();
  const { employeeGeoArea } = useGetGeoFencing();
  console.log(`🚀 ~ file: mutation.jsx:15 ~ employeeGeoArea:`, employeeGeoArea);

  const fetchLocationData = async () => {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    });
    const { latitude, longitude, speed, accuracy } = position.coords;
    return {
      latitude,
      longitude,
      speed,
      accuracy,
    };
  };

  const getUserLocation = useMutation({
    mutationFn: fetchLocationData,
    onSuccess: (data) => {
      console.info(`🚀 ~ file: mutation.jsx:34 ~ data:`, data);
    },
    onError: (data) => {
      console.error(data);
      handleAlert(true, "error", data.message);
    },
  });

  const fetchUserImage = async () => {
    const stream = await new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then(resolve)
        .catch(reject);
    });

    return stream;
  };

  const getUserImage = useMutation({
    mutationFn: fetchUserImage,
    onSuccess: async (data) => {
      setOpen(true);
      setMedia(data);
    },
    onError: (data) => {
      console.error(data);
      setOpen(false);
      handleAlert(true, "error", data.message);
    },
  });
  const fetchUrl = async () => {
    const data1 = await getUserLocation?.mutateAsync();
    // const locationIsInGeoFence = await checkUserInGeoFenceMutationAs({
    //   latitude: data1?.latitude,
    //   longitude: data1?.longitude,
    // });
    // console.log(
    //   `🚀 ~ file: mutation.jsx:74 ~ locationIsInGeoFence:`,
    //   locationIsInGeoFence
    // );
    const data = await axios.get(
      `${process.env.REACT_APP_API}/route/punch-main/create-image-url?lat=${data1?.latitude}&lng=${data1?.longitude}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    );
    return data.data;
  };

  const getImageUrl = useMutation({
    mutationFn: fetchUrl,
    onSuccess: async (data) => {
      try {
        let photo = document.getElementById("client-photo");
        const blob = await new Promise((resolve) => photo.toBlob(resolve));
        const file = new File([blob], "captured_image.png", {
          type: blob.type,
        });
        await axios.put(data.url, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        getPunchObject.mutate(data?.url?.split("?")[0]);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    },
    onError: (data) => {
      handleAlert(true, "error", data?.response?.data?.message);
    },
  });
  const fetchPunchObject = async (image) => {
    const data = await axios.post(
      `${process.env.REACT_APP_API}/route/punch`,
      { image },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    );
    return data.data;
  };

  const getPunchObject = useMutation({
    mutationFn: fetchPunchObject,
    onSuccess: async (data) => {
      setPunchObjectId(data?.punchObjectId);
      const tracks = media.getTracks();
      tracks.forEach((track) => {
        track.stop(); // Stop each track in the media stream
      });
      setMedia(null);
      setOpen(false);
      setStart(true);
    },
    onError: (data) => {
      console.error(`🚀 ~ file: mutation.jsx:167 ~ data:`, data?.response);
      handleAlert(true, "error", data?.response?.data?.message);
    },
  });

  const checkUserIsInGeoFence = async ({ latitude, longitude }) => {
    const isInGeoFence = employeeGeoArea?.area?.some(async (area) => {
      const distance = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${latitude},${longitude}&destinations=${area?.latitude},${area?.longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      return distance.data.rows[0].elements[0].distance.value < area?.radius;
    });
    return isInGeoFence;
  };

  const { mutateAsync: checkUserInGeoFenceMutationAs } = useMutation({
    mutationFn: checkUserIsInGeoFence,
    onSuccess: (data) => {
      if (data) {
        handleAlert(true, "success", "User is in geo-fence");
      } else {
        handleAlert(true, "error", "User is not in geo-fence");
      }
    },
    onError: (data) => {
      handleAlert(true, "error", data.message);
    },
  });

  return {
    getUserLocation,
    getUserImage,
    getImageUrl,
    checkUserInGeoFenceMutationAs,
  };
};

export default useLocationMutation;
