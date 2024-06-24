import { Add } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";
import HeaderBackComponent from "../../components/header/component";
import GeoFencingCard from "./components/GeoFenceCard";

const GeoFencing = () => {
  return (
    <>
      <HeaderBackComponent
        heading={"Geo Fencing"}
        oneLineInfo={`You can activate geofencing for a specific zone`}
      />
      <div className="px-6 text-Brand-washed-blue/brand-washed-blue-10">
        <div className="py-4">Added Geo-Fenced Zones</div>
        <div className="grid grid-cols-12">
          <div className="flex col-span-11 gap-4">
            {[1, 2, 3].map((item) => (
              <GeoFencingCard key={item} />
            ))}
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <IconButton size="large">
              <Add />
            </IconButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeoFencing;
