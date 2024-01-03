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
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, speed, accuracy } = position.coords;

          // Initial request to backend
          const initialPayload = {
            start: new Date(),
            locations: [
              {
                lat: latitude,
                lng: longitude,
                time: new Date(),
              },
            ],
          };
          if (locationData.latitude === null) {
            try {
              const initialResponse = await axios.post(
                `${process.env.REACT_APP_API}/route/punch/create`,
                initialPayload,
                { headers: { Authorization: authToken } }
              );
              if (initialResponse.status === 200) {
                console.log("Initial data posted successfully");
                setCount((prev) => prev + 1);
              } else {
                console.error("Failed to post initial data to the backend");
              }
            } catch (initialError) {
              console.error(
                "Error posting initial data to the backend",
                initialError
              );
            }
          }

          // Update locationData state with the initial values
          setLocationData({
            latitude,
            longitude,
            speed,
            accuracy,
          });

          // Set up the interval for subsequent requests every 20 seconds
          const id = setInterval(async () => {
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
                { headers: { Authorization: authToken } }
              );
              if (response.status === 200) {
                console.log("Data posted successfully");
                setCount((prevCount) => prevCount + 1);
              } else {
                console.error("Failed to post data to the backend");
              }
            } catch (error) {
              console.error("Error posting data to the backend", error);
            }
          }, 20000); // 20 seconds in milliseconds

          // Save the interval ID for cleanup
          setLocationWatcherId(id);
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
      setCount(0);
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
