import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { UseContext } from "../../State/UseState/UseContext";


// Custom hook to manage intervals
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function TestYash() {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const [watchId, setWatchId] = useState(null);
  const [isWatching, setIsWatching] = useState(false);
  let map ;

  const latestLocationData = useRef({
    latitude: null,
    longitude: null,
    speed: null,
    accuracy: null,
  });

  // Custom interval hook to handle posting data every 10 seconds
  useInterval(() => {
    if (isWatching && watchId) {
      console.log("Posting data to the backend after 10 seconds");
      postDataToBackend();
    }
  }, 10000);

  const startWatching = () => {
    stopWatching();

    if ("geolocation" in navigator) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed, accuracy } = position.coords;

          if (map) {
            const currentPosition = new window.google.maps.LatLng(
              latitude,
              longitude
            );
            map.panTo(currentPosition);
          }

          latestLocationData.current = {
            latitude,
            longitude,
            speed,
            accuracy,
          };
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
      setIsWatching(true);
    } else {
      console.error("Geolocation is not supported in this browser.");
    }
  };

  const stopWatching = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsWatching(false);
    }
  };

  const postDataToBackend = async () => {
    const { latitude, longitude } = latestLocationData.current;

    // Create the payload in the required format
    const payload = {
      start: new Date().toISOString(),
      locations: [
        {
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          time: new Date().toISOString(),
        },
      ],
      employeeId: "658cfa086ef8e46be2e41fb2", // Replace with the actual employee ID
    };

    try {
      // Make a POST request to the backend API using Axios
      const response = await axios.post(
        "http://localhost:4000/route/punch/create",
        payload,
        {
          headers:{
            Authorization:authToken,
          }
        }
      );

      if (response.status === 200) {
        console.log("Data posted successfully");
      } else {
        console.error("Failed to post data to the backend");
      }
    } catch (error) {
      console.error("Error posting data to the backend", error);
    }
  };

  useEffect(() => {
    // Load Google Maps API script
    // const script = document.createElement("script");
    // script.src = `https://apis.mappls.com/advancedmaps/api/dfb06668ce660987cc7008f8175a6720/map_sdk?layer=vector&v=3.0&callback=initMap1`;
    // script.async = true;
    // script.onload = () => {
    //   mappls = window.mappls;
    //   initMap1();
    // };
    // document.head.appendChild(script);

    return () => {
      stopWatching();
    };
    // eslint-disable-next-line
  }, []);

  // function initMap1() {
  //   // Your map initialization logic
  //   map = new mappls.Map("map", {
  //     center: [28.544, 77.5454],
  //     zoomControl: true,
  //     location: true,
  //   });
  //   map.addListener("load", function () {
  //     var pts = [
  //       {
  //         lat: 28.55108,
  //         lng: 77.26913,
  //       },
  //       // ... (rest of your polyline points)
  //     ];
  //     polyline = new mappls.Polyline({
  //       map: map,
  //       paths: pts,
  //       strokeColor: "#333",
  //       strokeOpacity: 1.0,
  //       strokeWeight: 5,
  //       fitbounds: true,
  //       dasharray: [2, 2],
  //     });
  //   });
  // }

  return (
    <>

    <div className="w-full h-full bg-slate-200">
<div className="flex  items-center justify-center h-[92vh]">
    <div className=" shadow-md rounded-xl bg-[white] gap-4 p-10 flex flex-col w-[200px] h-[200px] items-center justify-center" >

        <Button color="success" onClick={startWatching} variant="contained">Punch IN</Button>
        <Button color="error" onClick={stopWatching} variant="contained">Punch OUT</Button>
    </div>
    </div>

    </div>
    
    </>
   
     

   
  );
}
