import { Button } from "@mui/material";

import React, { useContext, useEffect, useRef, useState } from "react";
import { TestContext } from "../../State/Function/Main";
import useLocationStore from "../../hooks/Location/useLocation";

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

export default function TestNaresh() {
  //   const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  //   const authToken = cookies["aeigs"];
  const [watchId, setWatchId] = useState(null);
  const { startLocationTracking, stopLocationTracking, locationData, count } =
    useLocationStore();
  console.log(`🚀 ~ file: testNaresh.jsx:34 ~ count:`, count);
  console.log(`🚀 ~ file: testNaresh.jsx:34 ~ locationData:`, locationData);

  const postDataToBackend = async () => {
    // const { latitude, longitude } = latestLocationData.current;
    // Create the payload in the required format
    // const payload = {
    //   start: new Date().toISOString(),
    //   locations: [
    //     {
    //       lat: latitude.toString(),
    //       lng: longitude.toString(),
    //       time: new Date().toISOString(),
    //     },
    //   ],
    // };
    // try {
    //   const response = await axios.post(
    //     `${process.env.REACT_APP_API}/route/punch/create`,
    //     payload,
    //     { headers: { Authorization: authToken } }
    //   );
    //   if (response.status === 200) {
    //     console.log("Data posted successfully");
    //   } else {
    //     console.error("Failed to post data to the backend");
    //   }
    // } catch (error) {
    //   console.error("Error posting data to the backend", error);
    // }
  };

  return (
    <>
      <div className="w-full h-full bg-slate-200">
        <div className="flex  items-center justify-center h-[92vh]">
          <div className=" shadow-md rounded-xl bg-[white] gap-4 p-10 flex flex-col w-[200px] items-center justify-center">
            <Button
              color="success"
              onClick={startLocationTracking}
              variant="contained"
              size="small"
              disabled={locationData?.latitude}
            >
              Punch IN
            </Button>
            <Button
              size="small"
              color="error"
              onClick={stopLocationTracking}
              variant="contained"
              disabled={!locationData?.latitude}
            >
              Punch OUT
            </Button>
            <div>{count}</div>
            <div>lattitude is {locationData?.latitude}</div>
            <div>longiture is{locationData?.longitude}</div>
          </div>
        </div>
      </div>
    </>
  );
}
