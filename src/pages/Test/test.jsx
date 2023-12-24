import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function Test() {
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    speed: null,
    accuracy: null,
  });
  const [watchId, setWatchId] = useState(null);

  const startWatching = () => {
    if ("geolocation" in navigator) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed, accuracy } = position.coords;
          setLocationData({
            latitude,
            longitude,
            speed,
            accuracy,
          });
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
      setWatchId(id);
    } else {
      console.error("Geolocation is not supported in this browser.");
    }
  };

  const stopWatching = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, []); // Cleanup on component unmount

  return (
    <div className="pt-32">
      <div>
        <strong>Latitude:</strong> {locationData.latitude}
      </div>
      <div>
        <strong>Longitude:</strong> {locationData.longitude}
      </div>
      <div>
        <strong>Speed:</strong> {locationData.speed}
      </div>
      <div>
        <strong>Accuracy:</strong> {locationData.accuracy}
      </div>
      <Button onClick={startWatching}>Start Watching</Button>
      <Button onClick={stopWatching}>Stop Watching</Button>
    </div>
  );
}
