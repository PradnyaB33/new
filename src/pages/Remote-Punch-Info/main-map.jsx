import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";

const MainMap = ({ punchData, isLoaded }) => {
  const [waypoints, setWaypoints] = useState([]);

  useEffect(() => {
    if (punchData && punchData.data && punchData.data.length > 0) {
      const newWaypoints = punchData.data.map((punch) => ({
        lat: parseFloat(punch.lat),
        lng: parseFloat(punch.lng),
      }));
      setWaypoints(newWaypoints);
    } else {
      setWaypoints([]);
    }
  }, [punchData]);

  return (
    <GoogleMap
      key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      mapContainerStyle={{
        width: "70%",
        height: "91.8vh",
      }}
      center={{
        lat: waypoints[0]?.lat,
        lng: waypoints[0]?.lng,
      }}
      zoom={18}
    >
      {isLoaded && (
        <>
          {waypoints.length > 0 && (
            <>
              <Marker
                position={{
                  lat: waypoints[0]?.lat,
                  lng: waypoints[0]?.lng,
                }}
                label={"Source"}
              />
              <Polyline
                path={waypoints}
                options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
              />
              <Marker
                position={{
                  lat: waypoints[waypoints.length - 1]?.lat,
                  lng: waypoints[waypoints.length - 1]?.lng,
                }}
                label={"End Position"}
              />
            </>
          )}
        </>
      )}
    </GoogleMap>
  );
};

export default MainMap;
