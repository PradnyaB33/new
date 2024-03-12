import axios from "axios";
import { useContext } from "react";
import { useMutation, useQuery } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useGetUser from "../../Token/useUser";
import useLocationMutation from "./mutation";
import useSelfieStore from "./zustand-store";

const useStartPunch = () => {
  const { authToken } = useGetUser();
  const {
    punchObjectId,
    start,
    setLocation,
    setTemporaryArray,
    temporaryArray,
    setId,
    clearTemporaryArray,
  } = useSelfieStore();
  console.log(
    `🚀 ~ file: independant-use-query.jsx:18 ~ temporaryArray:`,
    temporaryArray
  );
  const { getUserLocation } = useLocationMutation();
  const { data: objectData, mutate } = getUserLocation;
  const { handleAlert } = useContext(TestContext);
  const fetchLocationData = async () => {
    mutate();
    startGeoLocationWatch.mutate();
    const { latitude, longitude } = objectData;
    setLocation({ lat: latitude, lng: longitude });
    const payload = {
      temporaryArray,
      punchObjectId,
    };
    const response = await axios.patch(
      `${process.env.REACT_APP_API}/route/punch`,
      payload,
      {
        headers: { Authorization: authToken },
      }
    );

    return response.data;
  };

  const { data, refetch } = useQuery("location-push", fetchLocationData, {
    refetchInterval: 10000,
    enabled: start,
    refetchIntervalInBackground: true,
    onSuccess: (data) => {
      clearTemporaryArray();
    },
  });
  const getNavigatorData = async () => {
    const id = navigator.geolocation.watchPosition(
      (positionCallback) => {
        const { latitude, longitude } = positionCallback.coords;
        console.log(
          `🚀 ~ file: independant-use-query.jsx:45 ~ latitude, longitude :`,
          latitude,
          longitude
        );
        setTemporaryArray(latitude, longitude);
        setLocation({ lat: latitude, lng: longitude });
      },
      () => {
        handleAlert(
          true,
          "error",
          "Error Getting GeoLocation please reload webpage"
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
    return id;
  };

  const startGeoLocationWatch = useMutation({
    mutationFn: getNavigatorData,
    onSuccess: (data) => {
      console.log(`🚀 ~ file: independant-use-query.jsx:58 ~ data:`, data);
      setId(data);
    },
    onError: (data) => {
      console.error(data);
    },
  });
  console.log("startGeoLocationWatch", startGeoLocationWatch);

  return { data, refetch };
};

export default useStartPunch;
