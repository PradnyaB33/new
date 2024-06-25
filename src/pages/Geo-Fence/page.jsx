import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useState } from "react";
import ReusableModal from "../../components/Modal/component";
import HeaderBackComponent from "../../components/header/component";
import AddGeoFencing from "./components/AddGeoFencing";
import GeoFencingCard from "./components/GeoFenceCard";

const GeoFencing = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <HeaderBackComponent
        heading={"Geo Fencing"}
        oneLineInfo={`You can activate geofencing for a specific zone`}
      />
      <div className="px-6 text-Brand-washed-blue/brand-washed-blue-10">
        <div className="flex justify-between items-center">
          {" "}
          <div className="py-4">Added Geo-Fenced Zones</div>
          <Button
            className="!h-fit gap-2 !w-fit"
            variant="contained"
            size="medium"
            onClick={() => {
              setOpen(true);
            }}
          >
            <Add /> Add
          </Button>
        </div>
        <div className="flex gap-4 overflow-auto">
          {[1, 2, 3].map((item) => (
            <GeoFencingCard key={item} />
          ))}
        </div>
        <ReusableModal
          open={open}
          heading={"Add Geo Fencing"}
          subHeading={"You can activate geofencing for a specific zone"}
          onClose={() => setOpen(false)}
        >
          <AddGeoFencing />
        </ReusableModal>
      </div>
    </>
  );
};

export default GeoFencing;
