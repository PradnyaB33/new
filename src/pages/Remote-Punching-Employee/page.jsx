import { Chip } from "@mui/material";
import React from "react";
import SelfieForm from "../../components/Modal/Selfi-Image/Selfie";
import useLocationHook from "../../hooks/QueryHook/Location/hook";
import BasicSpeedDial from "./components/speed-dial";

const EmployeeRemotePunch = () => {
  const { data } = useLocationHook();

  return (
    <div className="w-full h-full bg-slate-200">
      <div className="flex  items-center justify-center h-[92vh]">
        <div id="map" style={{ height: "100%", width: "100%" }}></div>;
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
