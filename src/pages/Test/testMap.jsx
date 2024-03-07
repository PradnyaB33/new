import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetUser from "../../hooks/Token/useUser";

const containerStyle = {
  width: "100%",
  height: "91.5vh",
};

console.log(window.google.maps);

const TestMap = () => {
  const [waypoints, setWaypoints] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const { authToken } = useGetUser();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/punch/getone`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        console.log(response.data.data);

        // Handle potential data fetching errors
        if (response.data.error) {
          console.error("Error fetching waypoints:", response.data.error);
          return; // Prevent setting invalid waypoints
        }

        const newWaypoints = response.data.data?.map((punch) => ({
          lat: parseFloat(punch.lat),
          lng: parseFloat(punch.lng),
        }));

        const smoothedWaypoints = smoothWaypoints(newWaypoints, 3);
        setWaypoints(smoothedWaypoints);
      } catch (error) {
        console.error("Error:", error);
      }
    })();
  }, [authToken]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  const totalDistance = waypoints.reduce((total, waypoint, index) => {
    if (index < waypoints.length - 1) {
      const nextWaypoint = waypoints[index + 1];
      return (
        total +
        calculateDistance(
          waypoint.lat,
          waypoint.lng,
          nextWaypoint.lat,
          nextWaypoint.lng
        )
      );
    }
    return total;
  }, 0);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const smoothWaypoints = (waypoints, windowSize) => {
    return waypoints?.map((waypoint, index, array) => {
      const start = Math.max(0, index - windowSize + 1);
      const end = index + 1;
      const subset = array.slice(start, end);
      const smoothedLat =
        subset.reduce((sum, point) => sum + point.lat, 0) / subset.length;
      const smoothedLng =
        subset.reduce((sum, point) => sum + point.lng, 0) / subset.length;

      return {
        lat: smoothedLat,
        lng: smoothedLng,
      };
    });
  };

  const center = {
    lat: parseFloat(waypoints[0]?.lat),
    lng: parseFloat(waypoints[0]?.lng),
  };

  const destination = {
    lat: waypoints[waypoints.length - 1]?.lat,
    lng: waypoints[waypoints.length - 1]?.lng,
  };

  console.log(waypoints);

  return (
    <div>
      <GoogleMap
        googleMapsApiKey="AIzaSyDaA2q3L--j40-GgojdeFSJ4RywKGtFQ2k"
        mapContainerStyle={containerStyle}
        onLoad={() => console.log("Map loaded")}
        zoom={15}
        center={currentLocation}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {currentLocation && !waypoints?.length && (
          <Marker
            label={{ text: "current location" }}
            position={currentLocation}
          />
        )}

        {waypoints?.length > 0 && (
          <>
            <Marker
              icon={{
                url: "https://img.icons8.com/ios/50/000000/marker.png",
                scaledSize: new window.google.maps.Size(35, 35),
              }}
              label={{ text: "source" }}
              position={center}
              style={{ filter: "hue-rotate(180deg)" }}
            />
            <Polyline
              path={waypoints}
              options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
            />
            <Marker
              label={{ text: "destination", color: "black" }}
              position={destination}
            />
          </>
        )}
      </GoogleMap>

      {waypoints?.length > 0 && (
        <p className="absolute top-24 z-[99999999] bg-black text-gray-50">
          Total Distance Travelled : {totalDistance.toFixed(2)} Kilometers
        </p>
      )}
    </div>
  );
};

export default TestMap;
