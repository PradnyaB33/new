import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import useAuthToken from "../Token/useAuth";

const useLocationStore = () => {
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    speed: null,
    accuracy: null,
  });
  const [start, setStart] = useState(false);
  const [count, setCount] = useState(0);
  const [locationWatcherId, setLocationWatcherId] = useState(null);
  const authToken = useAuthToken();

  const fetchLocationData = async () => {
    console.log("i am working");

    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    });

    const { latitude, longitude, speed, accuracy } = position.coords;
    const payload = {
      start: new Date(),
      locations: [
        {
          lat: latitude,
          lng: longitude,
          time: new Date(),
        },
      ],
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/punch/create`,
        payload,
        {
          headers: { Authorization: authToken },
        }
      );
      if (response.status === 200) {
        setCount((prevCount) => prevCount + 1);
      } else {
        console.error("Failed to post data to the backend");
      }
    } catch (error) {
      console.error("Error posting data to the backend", error);
    }

    return {
      latitude,
      longitude,
      speed,
      accuracy,
    };
  };

  const { data, refetch } = useQuery("locationData", fetchLocationData, {
    refetchInterval: 2000, // Cache is considered stale after 20 seconds
    refetchOnMount: true, // Disable automatic refetching on mount
    enabled: start,
  });

  const startLocationTracking = () => {
    refetch();
    setStart(true);
  };

  const stopLocationTracking = () => {
    if (locationWatcherId !== null) {
      navigator.geolocation.clearWatch(locationWatcherId);
      setLocationWatcherId(null);
    }
    setCount(0);
    setLocationWatcherId(null);
    setLocationData({
      latitude: null,
      longitude: null,
      speed: null,
      accuracy: null,
    });
    setStart(false);
  };

  return {
    start,
    data,
    count,
    startLocationTracking,
    stopLocationTracking,
  };
};

export default useLocationStore;
