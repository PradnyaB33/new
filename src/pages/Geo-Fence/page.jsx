import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useState } from "react";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import ReusableModal from "../../components/Modal/component";
import useGetCurrentLocation from "../../hooks/Location/useGetCurrentLocation";
import AddGeoFencing from "./components/AddGeoFencing";
import GeoFencingCard from "./components/GeoFenceCard";
import useOrgGeo from "./useOrgGeo";

const GeoFencing = () => {
  const [open, setOpen] = useState(false);
  const { data } = useOrgGeo();
  const { data: locationData } = useGetCurrentLocation();

  return (
    <>
      <BoxComponent>
        <div className="flex justify-between items-center">
          {/* <div className="py-4">Added Geo-Fenced Zones</div> */}
          <HeadingOneLineInfo
            heading={"Geo Fencing"}
            info={"You can activate geofencing for a specific zone"}
          />
          <Button
            className="!h-fit gap-2 !w-fit"
            variant="contained"
            size="medium"
            disabled={!!!data}
            onClick={() => {
              setOpen(true);
            }}
          >
            <Add /> Add
          </Button>
        </div>
        <div className="flex gap-4 overflow-auto py-4">
          {data
            ? data?.area?.map((item) => (
                <GeoFencingCard key={item} item={item} />
              ))
            : "Sorry but you have not enable geo fencing checkbox from setup page."}
        </div>
        <ReusableModal
          open={open}
          heading={"Add Geo Fencing"}
          subHeading={"You can activate geofencing for a specific zone"}
          onClose={() => setOpen(false)}
        >
          <AddGeoFencing onClose={() => setOpen(false)} data={locationData} />
        </ReusableModal>
      </BoxComponent>
    </>
  );
};

export default GeoFencing;
