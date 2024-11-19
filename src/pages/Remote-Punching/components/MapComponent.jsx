// import React from "react";
// import {
//   GoogleMap, MarkerF, PolylineF
// } from "@react-google-maps/api";

// const MapComponent = ({ isLoaded, data, locationArray }) => {
//   return isLoaded ? (
//     <GoogleMap
//       key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//       mapContainerStyle={{
//         width: "100%",
//         height: "91.8vh",
//       }}
//       center={{ lat: data?.latitude, lng: data?.longitude }}
//       zoom={18}
//     >
//       {/*used for mark position*/}
//       <MarkerF
//         position={{ lat: data?.latitude, lng: data?.longitude }}
//         label={"Start Position"}
//       />
//       {locationArray?.length > 0 && (
//         <PolylineF
//           path={locationArray}
//           options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
//         />
//       )}
//       {locationArray?.length > 0 && (
//         <MarkerF
//           position={{
//             lat: locationArray[0]?.latitude,
//             lng: locationArray[0]?.longitude,
//           }}
//           label={"Starting Position"}
//         />
//       )}
//     </GoogleMap>
//   ) : (
//     <></>
//   );
// };

// export default MapComponent;




// import React from "react";
// import {
//   GoogleMap, MarkerF, PolylineF
// } from "@react-google-maps/api";

// const MapComponent = ({ isLoaded, data, locationArray }) => {
//   return isLoaded ? (
//     <GoogleMap
//       key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//       mapContainerStyle={{
//         width: "100%",
//         height: "91.8vh",
//       }}
//       center={{ lat: data?.latitude, lng: data?.longitude }}
//       zoom={18}
//     >
//       {/*used for mark position*/}
//       <MarkerF
//         position={{ lat: data?.latitude, lng: data?.longitude }}
//         label={"Start Position"}
//       />
//       {locationArray?.length > 0 && (
//         <PolylineF
//           path={locationArray}
//           options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
//         />
//       )}
//       {locationArray?.length > 0 && (
//         <MarkerF
//           position={{
//             lat: locationArray[0]?.latitude,
//             lng: locationArray[0]?.longitude,
//           }}
//           label={"Starting Position"}
//         />
//       )}
//     </GoogleMap>
//   ) : (
//     <></>
//   );
// };

// export default MapComponent;




// import React from "react";
// import { GoogleMap, MarkerF, PolylineF } from "@react-google-maps/api";

// const MapComponent = ({ isLoaded, data, locationArray }) => {
//   // Construct the path array for the Polyline
//   const routePath = locationArray?.map((location) => ({
//     lat: location.latitude,
//     lng: location.longitude,
//   }));

//   // Function to create custom arrow markers
//   const getArrowIcon = (rotationAngle) => ({
//     path: "M 0,0 L 1,2 L -1,2 Z", // A simple triangle (arrow)
//     fillColor: "blue",  // Color of the arrow
//     fillOpacity: 1,
//     strokeWeight: 0,
//     scale: 4,  // Scale the size of the arrow
//     rotation: rotationAngle,  // Rotate the arrow based on direction
//     anchorPoint: new window.google.maps.Point(0, 0), // Center the arrow marker
//   });

//   return isLoaded ? (
//     <GoogleMap
//       key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//       mapContainerStyle={{
//         width: "100%",
//         height: "91.8vh",
//       }}
//       center={{ lat: data?.latitude, lng: data?.longitude }}
//       zoom={18}
//     >
//       {/* Marker for the current position */}
//       <MarkerF
//         position={{ lat: data?.latitude, lng: data?.longitude }}
//         label={"Start Position"}
//       />

//       {/* Starting position marker from locationArray */}
//       {locationArray?.length > 0 && (
//         <MarkerF
//           position={{
//             lat: locationArray[0]?.latitude,
//             lng: locationArray[0]?.longitude,
//           }}
//           label={"Starting Position"}
//         />
//       )}

//       {/* Route line */}
//       {routePath && routePath.length > 1 && (
//         <PolylineF
//           path={routePath}
//           options={{
//             strokeColor: "blue",
//             strokeOpacity: 0.8,
//             strokeWeight: 3,
//           }}
//         />
//       )}

//       {/* Adding forward arrow markers along the path */}
//       {routePath?.map((location, index) => {
//         if (index < routePath.length - 1) {
//           // Calculate direction between current and next position
//           const nextLocation = routePath[index + 1];
//           const angle = Math.atan2(
//             nextLocation.lat - location.lat,
//             nextLocation.lng - location.lng
//           ) * (180 / Math.PI); // Convert to degrees

//           return (
//             <MarkerF
//               key={index}
//               position={location}
//               icon={getArrowIcon(angle)}
//             />
//           );
//         }
//         return null;
//       })}
//     </GoogleMap>
//   ) : (
//     <></>
//   );
// };

// export default MapComponent;






























import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, Marker, Polyline, MarkerF } from "@react-google-maps/api";

const MapComponent = ({ isLoaded, data, locationArray }) => {
  console.log("data", data);

  const [fullPath, setFullPath] = useState(locationArray || []); // Store the full polyline path
  const [coveredPath, setCoveredPath] = useState([]); // Store the covered distance path

  const mapStyles = {
    height: "100%",
    width: "100%",
  };

  const center = {
    lat: data?.latitude || 0,
    lng: data?.longitude || 0,
  };

  // Function to add new location to full path
  const updateFullPath = useCallback(
    (newLocation) => {
      setFullPath((prevPath) => [...prevPath, newLocation]);
      setCoveredPath((prevCoveredPath) => [...prevCoveredPath, newLocation]);
    },
    [setFullPath, setCoveredPath]
  );

  useEffect(() => {
    if (data) {
      updateFullPath({ lat: data.latitude, lng: data.longitude });
    }
  }, [data, updateFullPath]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapStyles}
      center={center}
      zoom={15}
    >
      {/* Marker for the current location */}
      <Marker position={center} />
      <MarkerF
        position={{ lat: data?.latitude, lng: data?.longitude }}
        label={"Start Position"}
      />
      {/* Polyline for the full path */}
      <Polyline
        path={fullPath}
        options={{
          strokeColor: "#FF0000", // Red color for the full path
          strokeOpacity: 0.6,
          strokeWeight: 3,
        }}
      />
      {/* Polyline for the covered path */}
      <Polyline
        path={coveredPath}
        options={{
          strokeColor: "#00FF00", // Green color for the covered path
          strokeOpacity: 0.8,
          strokeWeight: 4,
        }}
      />
    </GoogleMap>
  );
};

export default MapComponent;
