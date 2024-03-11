import { Chip } from "@mui/material";
import { useJsApiLoader } from "@react-google-maps/api";
import React from "react";
import SelfieForm from "../../components/Modal/Selfi-Image/Selfie";
import useLocationHook from "../../hooks/QueryHook/Location/hook";
import useSelfieStore from "../../hooks/QueryHook/Location/zustand-store";
import MapComponent from "./components/Map-Component";
import BasicSpeedDial from "./components/speed-dial";

const EmployeeRemotePunch = () => {
  const { data } = useLocationHook();

  const { locationArray } = useSelfieStore();
  console.log(
    `🚀 ~ file: page.jsx:21 ~ process.env.REACT_APP_GOOGLE_MAPS_API_KEY:`,
    process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  );

  const { isLoaded } = useJsApiLoader({
    id: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  return (
    <div className="w-full h-full bg-slate-200">
      <div className="flex  items-center justify-center h-[92vh]">
        {<MapComponent {...{ isLoaded, data, locationArray }} />}
        <div className="top-12 right-12 rounded-xl absolute gap-4 p-10 flex flex-col items-start justify-center">
          <Chip
            label={`Latitude is ${data?.latitude}`}
            className="!bg-white !text-xl"
            onClick={(e) => console.log(e)}
            variant="filled"
          />
          <Chip
            label={`Longitude is ${data?.longitude}`}
            className="!bg-white !text-xl"
            onClick={(e) => console.log(e)}
            variant="filled"
          />
        </div>
        <BasicSpeedDial />
        <SelfieForm />
      </div>
    </div>
  );
};

export default EmployeeRemotePunch;
