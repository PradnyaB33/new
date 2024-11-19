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

//   useEffect(() => {
//     const requestLocation = () => {
//       if (navigator.geolocation) {
//         navigator.geolocation.watchPosition(
//           (position) => {
//             setCurrentLocation({
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             });
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
//                 console.error("The request to get user location timed out.");
//                 break;
//               default:
//                 console.error("An unknown error occurred.");
//                 break;
//             }
//           },
//           { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
//         );
//       } else {
//         console.error("Geolocation is not supported by this browser.");
//         alert("Your browser does not support geolocation.");
//       }
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

const MapComponent = ({ isLoaded, data, locationArray }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    const requestLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            setCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                console.error("User denied the request for Geolocation.");
                alert("Please enable location permissions for accurate tracking.");
                break;
              case error.POSITION_UNAVAILABLE:
                console.error("Location information is unavailable.");
                break;
              case error.TIMEOUT:
                console.warn("Location request timed out. Retrying...");
                fallbackLocationRequest();
                break;
              default:
                console.error("An unknown error occurred.");
                break;
            }
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
        );

      } else {
        console.error("Geolocation is not supported by this browser.");
        alert("Your browser does not support geolocation.");
      }
    };

    const fallbackLocationRequest = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Fallback location request failed", error);
        },
        { enableHighAccuracy: false, timeout: 10000 }
      );
    };


    const handlePermission = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({ name: "geolocation" });

        if (permissionStatus.state === "granted") {
          requestLocation();
        } else if (permissionStatus.state === "prompt") {
          requestLocation();
        } else {
          console.error("Geolocation permission denied.");
          alert("Please grant location permissions in your browser settings.");
        }

        // Listen for changes in geolocation permission status
        permissionStatus.onchange = () => {
          if (permissionStatus.state === "granted") {
            requestLocation();
          } else {
            setCurrentLocation(null);
          }
        };
      } catch (error) {
        console.error("Error checking geolocation permission:", error);
        requestLocation(); // Attempt to fetch location directly in case permissions API fails
      }
    };

    handlePermission();
  }, []);

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
        // Enable the user's current location on the map.
        fullscreenControl: true,
        mapTypeControl: true,
        streetViewControl: true,
        currentLocationControl: true,  // This enables showing user's current location (works in mobile)
      }}
    >
      {/* Marker for the user's live position */}
      {currentLocation && (
        <MarkerF
          position={{
            lat: currentLocation.latitude,
            lng: currentLocation.longitude,
          }}
          label={"Current Position"}
        />
      )}

      {directions ? (
        // Render the polyline using DirectionsRenderer
        <PolylineF
          path={directions.routes[0].overview_path.map((point) => ({
            lat: point.lat(),
            lng: point.lng(),
          }))}
          options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
        />
      ) : (
        locationArray?.length > 0 && (
          <PolylineF
            path={locationArray.map((loc) => ({
              lat: loc.latitude,
              lng: loc.longitude,
            }))}
            options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
          />
        )
      )}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default MapComponent;
