import { GoogleMap, Marker, Polyline, CircleF } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";

const MainMap = ({ punchData, isLoaded, geofencingCircleData, taskData }) => {
  const [waypoints, setWaypoints] = useState([]);
  const [acceptedByLocations, setAcceptedByLocations] = useState([]);
  console.log("acceptedByLocations", acceptedByLocations);

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

  useEffect(() => {
    if (taskData && taskData.length > 0) {
      // Log taskData to inspect its structure
      console.log("taskData", taskData);

      const locations = taskData.flatMap((task) =>
        task.taskName.flatMap((taskName) =>
          taskName.acceptedBy.map((entry) => ({
            lat: entry.location.lat,
            lng: entry.location.long,
          }))
        )
      );


      // Log the extracted locations
      console.log("locations", locations);

      setAcceptedByLocations(locations);
    } else {
      setAcceptedByLocations([]);
    }
  }, [taskData]);

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

          {acceptedByLocations.map((location, index) => (
            <Marker
              key={index}
              position={{
                lat: location?.lat,
                lng: location?.lng,
              }}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
              }}
              label={"Accepted"}
            />
          ))}
          {/* Add CircleF component to show the geofencing circle */}
          {geofencingCircleData && (
            <CircleF
              center={{
                lat: geofencingCircleData?.center?.coordinates[0],
                lng: geofencingCircleData?.center?.coordinates[1],
              }}
              radius={geofencingCircleData?.radius}
              options={{
                strokeColor: "#0033ff",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#0033ff",
                fillOpacity: 0.35,
              }}
            />
          )}
        </>
      )}
    </GoogleMap>
  );
};

export default MainMap;
