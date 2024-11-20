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







// import React, { useEffect, useState } from "react";
// import {
//   GoogleMap,
//   MarkerF,
//   PolylineF
// } from "@react-google-maps/api";

// const MapComponent = ({ isLoaded, data, locationArray }) => {
//   const [directions, setDirections] = useState(null);

//   useEffect(() => {
//     if (locationArray?.length > 1) {
//       const fetchDirections = async () => {
//         const waypoints = locationArray.slice(1, -1).map((loc) => ({
//           location: { lat: loc.latitude, lng: loc.longitude },
//           stopover: true,
//         }));

//         const origin = locationArray[0];
//         const destination = locationArray[locationArray.length - 1];

//         const directionsService = new window.google.maps.DirectionsService();

//         directionsService.route(
//           {
//             origin: { lat: origin.latitude, lng: origin.longitude },
//             destination: { lat: destination.latitude, lng: destination.longitude },
//             waypoints: waypoints,
//             travelMode: window.google.maps.TravelMode.DRIVING,
//           },
//           (result, status) => {
//             if (status === window.google.maps.DirectionsStatus.OK) {
//               setDirections(result);
//             } else {
//               console.error(`Error fetching directions ${status}`);
//             }
//           }
//         );
//       };

//       fetchDirections();
//     }
//   }, [locationArray]);

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
//       {/* Marker for the starting position */}
//       <MarkerF
//         position={{ lat: data?.latitude, lng: data?.longitude }}
//         label={"Start Position"}
//       />
//       {directions ? (
//         // Render the polyline using DirectionsRenderer
//         <PolylineF
//           path={directions.routes[0].overview_path.map((point) => ({
//             lat: point.lat(),
//             lng: point.lng(),
//           }))}
//           options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
//         />
//       ) : (
//         locationArray?.length > 0 && (
//           <PolylineF
//             path={locationArray.map((loc) => ({
//               lat: loc.latitude,
//               lng: loc.longitude,
//             }))}
//             options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
//           />
//         )
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



// import React, { useEffect, useState } from "react";
// import {
//   GoogleMap,
//   MarkerF,
//   PolylineF
// } from "@react-google-maps/api";

// const MapComponent = ({ isLoaded, data, locationArray }) => {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [directions, setDirections] = useState(null);
//   const [coveredPath, setCoveredPath] = useState([]); // To store the route covered by the user

//   useEffect(() => {
//     const requestLocation = () => {
//       if (navigator.geolocation) {
//         navigator.geolocation.watchPosition(
//           (position) => {
//             const newLocation = {
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             };

//             setCurrentLocation(newLocation);

//             // Update covered path
//             setCoveredPath((prevPath) => [
//               ...prevPath,
//               { lat: newLocation.latitude, lng: newLocation.longitude },
//             ]);
//           },
//           (error) => {
//             switch (error.code) {
//               case error.PERMISSION_DENIED:
//                 console.error("User denied the request for Geolocation.");
//                 alert("Please enable location permissions for accurate tracking.");
//                 break;
//               case error.POSITION_UNAVAILABLE:
//                 console.error("Location information is unavailable.");
//                 break;
//               case error.TIMEOUT:
//                 console.warn("Location request timed out. Retrying...");
//                 fallbackLocationRequest();
//                 break;
//               default:
//                 console.error("An unknown error occurred.");
//                 break;
//             }
//           },
//           { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
//         );
//       } else {
//         console.error("Geolocation is not supported by this browser.");
//         alert("Your browser does not support geolocation.");
//       }
//     };

//     const fallbackLocationRequest = () => {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setCurrentLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//         },
//         (error) => {
//           console.error("Fallback location request failed", error);
//         },
//         { enableHighAccuracy: false, timeout: 10000 }
//       );
//     };

//     const handlePermission = async () => {
//       try {
//         const permissionStatus = await navigator.permissions.query({ name: "geolocation" });

//         if (permissionStatus.state === "granted") {
//           requestLocation();
//         } else if (permissionStatus.state === "prompt") {
//           requestLocation();
//         } else {
//           console.error("Geolocation permission denied.");
//           alert("Please grant location permissions in your browser settings.");
//         }

//         // Listen for changes in geolocation permission status
//         permissionStatus.onchange = () => {
//           if (permissionStatus.state === "granted") {
//             requestLocation();
//           } else {
//             setCurrentLocation(null);
//           }
//         };
//       } catch (error) {
//         console.error("Error checking geolocation permission:", error);
//         requestLocation(); // Attempt to fetch location directly in case permissions API fails
//       }
//     };

//     handlePermission();
//   }, []);

//   useEffect(() => {
//     if (locationArray?.length > 1) {
//       const fetchDirections = async () => {
//         const waypoints = locationArray.slice(1, -1).map((loc) => ({
//           location: { lat: loc.latitude, lng: loc.longitude },
//           stopover: true,
//         }));

//         const origin = locationArray[0];
//         const destination = locationArray[locationArray.length - 1];

//         const directionsService = new window.google.maps.DirectionsService();

//         directionsService.route(
//           {
//             origin: { lat: origin.latitude, lng: origin.longitude },
//             destination: { lat: destination.latitude, lng: destination.longitude },
//             waypoints: waypoints,
//             travelMode: window.google.maps.TravelMode.DRIVING,
//           },
//           (result, status) => {
//             if (status === window.google.maps.DirectionsStatus.OK) {
//               setDirections(result);
//             } else {
//               console.error(`Error fetching directions ${status}`);
//             }
//           }
//         );
//       };

//       fetchDirections();
//     }
//   }, [locationArray]);

//   return isLoaded ? (
//     <GoogleMap
//       key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//       mapContainerStyle={{
//         width: "100%",
//         height: "91.8vh",
//       }}
//       center={
//         currentLocation
//           ? { lat: currentLocation.latitude, lng: currentLocation.longitude }
//           : { lat: data?.latitude, lng: data?.longitude }
//       }
//       zoom={18}
//       options={{
//         fullscreenControl: true,
//         mapTypeControl: true,
//         streetViewControl: true,
//       }}
//     >
//       {/* Marker for the user's live position */}
//       {currentLocation && (
//         <MarkerF
//           position={{
//             lat: currentLocation.latitude,
//             lng: currentLocation.longitude,
//           }}
//           label={"Current Position"}
//         />
//       )}

//       {/* Draw the polyline for the covered route */}
//       {coveredPath.length > 1 && (
//         <PolylineF
//           path={coveredPath}
//           options={{ strokeColor: "#00FF00", strokeWeight: 5 }}
//         />
//       )}

//       {/* Draw the complete route */}
//       {directions ? (
//         <PolylineF
//           path={directions.routes[0].overview_path.map((point) => ({
//             lat: point.lat(),
//             lng: point.lng(),
//           }))}
//           options={{ strokeColor: "#109be6", strokeWeight: 5 }}
//         />
//       ) : (
//         locationArray?.length > 0 && (
//           <PolylineF
//             path={locationArray.map((loc) => ({
//               lat: loc.latitude,
//               lng: loc.longitude,
//             }))}
//             options={{ strokeColor: "#109be6", strokeWeight: 5 }}
//           />
//         )
//       )}
//     </GoogleMap>
//   ) : (
//     <></>
//   );
// };

// export default MapComponent;






import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  PolylineF
} from "@react-google-maps/api";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";

const MapComponent = ({ isLoaded, data, locationArray }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [coveredPath, setCoveredPath] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const { setDistance } = useSelfieStore();
  // Haversine formula
  const calculateDistance = (point1, point2) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const R = 6371; // Earth's radius in km

    const lat1 = toRadians(point1.lat);
    const lon1 = toRadians(point1.lng);
    const lat2 = toRadians(point2.lat);
    const lon2 = toRadians(point2.lng);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
  };

  // useEffect(() => {
  //   const requestLocation = () => {
  //     if (navigator.geolocation) {
  //       navigator.geolocation.watchPosition(
  //         (position) => {
  //           const newLocation = {
  //             latitude: position.coords.latitude,
  //             longitude: position.coords.longitude,
  //           };

  //           if (
  //             Number.isFinite(newLocation.latitude) &&
  //             Number.isFinite(newLocation.longitude)
  //           ) {
  //             setCurrentLocation(newLocation);

  //             setCoveredPath((prevPath) => {
  //               const updatedPath = [
  //                 ...prevPath,
  //                 { lat: newLocation.latitude, lng: newLocation.longitude },
  //               ];

  //               if (updatedPath.length > 1) {
  //                 const lastPoint = updatedPath[updatedPath.length - 2];
  //                 const newPoint = updatedPath[updatedPath.length - 1];
  //                 const distance = calculateDistance(lastPoint, newPoint);
  //                 setTotalDistance((prevDistance) => prevDistance + distance);
  //               }

  //               return updatedPath;
  //             });
  //           }
  //         },
  //         (error) => {
  //           console.error("Error getting location", error);
  //         },
  //         { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
  //       );
  //     } else {
  //       console.error("Geolocation not supported");
  //     }
  //   };

  //   requestLocation();
  // }, []);


  useEffect(() => {
    const requestLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            const newLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            if (
              Number.isFinite(newLocation.latitude) &&
              Number.isFinite(newLocation.longitude)
            ) {
              setCurrentLocation(newLocation);

              setCoveredPath((prevPath) => {
                const updatedPath = [
                  ...prevPath,
                  { lat: newLocation.latitude, lng: newLocation.longitude },
                ];

                if (updatedPath.length > 1) {
                  const lastPoint = updatedPath[updatedPath.length - 2];
                  const newPoint = updatedPath[updatedPath.length - 1];
                  const distance = calculateDistance(lastPoint, newPoint);
                  setTotalDistance((prevDistance) => {
                    const newTotalDistance = prevDistance + distance;
                    // Update the Zustand store with the new total distance
                    setDistance(newTotalDistance);  // Storing distance in the Zustand store
                    return newTotalDistance;
                  });
                }

                return updatedPath;
              });
            }
          },
          (error) => {
            console.error("Error getting location", error);
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
        );
      } else {
        console.error("Geolocation not supported");
      }
    };

    requestLocation();
  }, [setDistance]);

  useEffect(() => {
    if (locationArray?.length > 1) {
      const fetchDirections = async () => {
        const waypoints = locationArray.slice(1, -1).map((loc) => ({
          location: { lat: loc.latitude, lng: loc.longitude },
          stopover: true,
        }));

        const origin = locationArray[0];
        const destination = locationArray[locationArray.length - 1];

        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
          {
            origin: { lat: origin.latitude, lng: origin.longitude },
            destination: { lat: destination.latitude, lng: destination.longitude },
            waypoints: waypoints,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              setDirections(result);
            } else {
              console.error(`Error fetching directions ${status}`);
            }
          }
        );
      };

      fetchDirections();
    }
  }, [locationArray]);

  return isLoaded ? (
    <GoogleMap
      key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      mapContainerStyle={{
        width: "100%",
        height: "91.8vh",
      }}
      center={
        currentLocation
          ? { lat: currentLocation.latitude, lng: currentLocation.longitude }
          : { lat: data?.latitude, lng: data?.longitude }
      }
      zoom={18}
      options={{
        fullscreenControl: true,
        mapTypeControl: true,
        streetViewControl: true,
      }}
    >
      {currentLocation &&
        Number.isFinite(currentLocation.latitude) &&
        Number.isFinite(currentLocation.longitude) && (
          <MarkerF
            position={{
              lat: currentLocation.latitude,
              lng: currentLocation.longitude,
            }}
            label={"Current Position"}
          />
        )}

      {coveredPath.length > 1 && (
        <PolylineF
          path={coveredPath.filter(
            (point) =>
              Number.isFinite(point.lat) && Number.isFinite(point.lng)
          )}
          options={{ strokeColor: "#00FF00", strokeWeight: 5 }}
        />
      )}

      {directions ? (
        <PolylineF
          path={directions.routes[0].overview_path.map((point) => ({
            lat: point.lat(),
            lng: point.lng(),
          }))}
          options={{ strokeColor: "#109be6", strokeWeight: 5 }}
        />
      ) : (
        locationArray?.length > 0 && (
          <PolylineF
            path={locationArray.map((loc) => ({
              lat: loc.latitude,
              lng: loc.longitude,
            }))}
            options={{ strokeColor: "#109be6", strokeWeight: 5 }}
          />
        )
      )}

      <div
        style={{
          position: "absolute",
          bottom: "130px",
          right: "10px",
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        }}
      >
        Distance Covered: {totalDistance.toFixed(2)} km
      </div>
    </GoogleMap>
  ) : (
    <></>
  );
};

export default MapComponent;
