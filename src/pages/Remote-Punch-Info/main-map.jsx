// import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
// import React, { useEffect, useState } from "react";

// const MainMap = ({ punchData, isLoaded, geofencingCircleData }) => {
//   const [waypoints, setWaypoints] = useState([]);
//   console.log("geofencingCircleData", geofencingCircleData);

//   useEffect(() => {
//     if (punchData && punchData.data && punchData.data.length > 0) {
//       const newWaypoints = punchData.data.map((punch) => ({
//         lat: parseFloat(punch.lat),
//         lng: parseFloat(punch.lng),
//       }));
//       setWaypoints(newWaypoints);
//     } else {
//       setWaypoints([]);
//     }
//   }, [punchData]);

//   return (
//     <GoogleMap
//       key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//       mapContainerStyle={{
//         width: "70%",
//         height: "91.8vh",
//       }}
//       center={{
//         lat: waypoints[0]?.lat,
//         lng: waypoints[0]?.lng,
//       }}
//       zoom={18}
//     >
//       {isLoaded && (
//         <>
//           {waypoints.length > 0 && (
//             <>
//               <Marker
//                 position={{
//                   lat: waypoints[0]?.lat,
//                   lng: waypoints[0]?.lng,
//                 }}
//                 label={"Source"}
//               />
//               <Polyline
//                 path={waypoints}
//                 options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
//               />
//               <Marker
//                 position={{
//                   lat: waypoints[waypoints.length - 1]?.lat,
//                   lng: waypoints[waypoints.length - 1]?.lng,
//                 }}
//                 label={"End Position"}
//               />
//             </>
//           )}
//         </>
//       )}
//     </GoogleMap>
//   );
// };

// export default MainMap;


import { GoogleMap, Marker, Polyline, CircleF } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";

const MainMap = ({ punchData, isLoaded, geofencingCircleData }) => {
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
