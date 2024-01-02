import axios from "axios";
import { useEffect, useState } from "react";
import useAuthToken from "../Token/useAuth";

const useLocationStore = () => {
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    speed: null,
    accuracy: null,
  });
  const [count, setCount] = useState(0);
  const [locationWatcherId, setLocationWatcherId] = useState(null);
  const authToken = useAuthToken();

  const startLocationTracking = () => {
    if ("geolocation" in navigator) {
      const id = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude, speed, accuracy } = position.coords;
          try {
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
            const response = await axios.post(
              `${process.env.REACT_APP_API}/route/punch/create`,
              payload,
              { headers: { Authorization: authToken } }
            );
            console.log(`🚀 ~ file: useLocation.jsx:32 ~ response:`, response);
            if (response.status === 200) {
              console.log("Data posted successfully");
            } else {
              console.error("Failed to post data to the backend");
            }
          } catch (error) {
            console.error("Error posting data to the backend", error);
          }
          setLocationData((prevLocationData) => ({
            ...prevLocationData,
            latitude,
            longitude,
            speed,
            accuracy,
          }));
          setCount((prevCount) => prevCount + 1);
        },
        (error) => {
          console.error(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
      setLocationWatcherId(id);
    } else {
      console.error("Geolocation is not supported in this browser.");
    }
  };

  const stopLocationTracking = () => {
    if (locationWatcherId !== null) {
      navigator.geolocation.clearWatch(locationWatcherId);
      setLocationWatcherId(null);
      setLocationData({
        latitude: null,
        longitude: null,
        speed: null,
        accuracy: null,
      });
    }
  };

  useEffect(() => {
    return () => {
      stopLocationTracking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    locationData,
    count,
    startLocationTracking,
    stopLocationTracking,
  };
};

export default useLocationStore;
