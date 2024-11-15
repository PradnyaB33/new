// import { Add } from "@mui/icons-material";
// import { Button } from "@mui/material";
// import React, { useState } from "react";
// import BoxComponent from "../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import ReusableModal from "../../components/Modal/component";
// import useGetCurrentLocation from "../../hooks/Location/useGetCurrentLocation";
// import AddGeoFencing from "./components/AddGeoFencing";
// import GeoFencingCard from "./components/GeoFenceCard";
// import useOrgGeo from "./useOrgGeo";

// const GeoFencing = () => {
//   const [open, setOpen] = useState(false);
//   const { data } = useOrgGeo();
//   const { data: locationData } = useGetCurrentLocation();

//   return (
//     <>
//       <BoxComponent>
//         <div className="flex justify-between items-center">
//           {/* <div className="py-4">Added Geo-Fenced Zones</div> */}
//           <HeadingOneLineInfo
//             heading={"Geo Fencing"}
//             info={"You can activate geofencing for a specific zone"}
//           />
//           <Button
//             className="!h-fit gap-2 !w-fit"
//             variant="contained"
//             size="medium"
//             disabled={!!!data}
//             onClick={() => {
//               setOpen(true);
//             }}
//           >
//             <Add /> Add
//           </Button>
//         </div>
//         <div className="flex gap-4 overflow-auto py-4">
//           {data
//             ? data?.area?.map((item) => (
//               <GeoFencingCard key={item} item={item} />
//             ))
//             : "Sorry but you have not enable geo fencing checkbox from setup page."}
//         </div>
//         <ReusableModal
//           open={open}
//           heading={"Add Geo Fencing"}
//           subHeading={"here you can activate geofencing for a specific zone"}
//           onClose={() => setOpen(false)}
//         >
//           <AddGeoFencing onClose={() => setOpen(false)} data={locationData} />
//         </ReusableModal>
//       </BoxComponent>
//     </>
//   );
// };

// export default GeoFencing;

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
import FullskapeCard from "./Fullskape/FullskapeCard";
import AddFullskapeZone from "./Fullskape/AddFullskapeZone";

const GeoFencing = () => {
  const [openGeoFencing, setOpenGeoFencing] = useState(false);
  const [openFullskape, setOpenFullskape] = useState(false);
  const { data } = useOrgGeo();
  const { data: locationData } = useGetCurrentLocation();

  return (
    <>
      <BoxComponent>
        {/* Geo Fencing Section */}
        <div className="flex justify-between items-center">
          <HeadingOneLineInfo
            heading={"Geo Fencing"}
            info={"You can activate geofencing for a specific zone"}
          />
          <Button
            className="!h-fit gap-2 !w-fit"
            variant="contained"
            size="medium"
            disabled={!data}
            onClick={() => setOpenGeoFencing(true)}
          >
            <Add /> Add
          </Button>
        </div>
        <div className="flex gap-4 overflow-auto py-4">
          {data?.area?.length > 0
            ? data.area.map((item) => <GeoFencingCard key={item._id} item={item} />)
            : "Sorry, but you have not enabled the geo-fencing checkbox from the setup page."}
        </div>

        <ReusableModal
          open={openGeoFencing}
          heading={"Add Geo Fencing"}
          subHeading={"Here you can activate geofencing for a specific zone"}
          onClose={() => setOpenGeoFencing(false)}
        >
          <AddGeoFencing onClose={() => setOpenGeoFencing(false)} data={locationData} />
        </ReusableModal>

        {/* Fullskape Section */}
        <div className="flex justify-between items-center mt-8">
          <HeadingOneLineInfo
            heading={"Fullskape"}
            info={"You can activate Fullskape zones for additional control"}
          />
          <Button
            className="!h-fit gap-2 !w-fit"
            variant="contained"
            size="medium"
            disabled={!data} // Optionally disable if no data
            onClick={() => setOpenFullskape(true)}
          >
            <Add /> Add
          </Button>
        </div>
        <div className="flex gap-4 overflow-auto py-4">
          {data?.fullskapeArea?.length > 0
            ? data.fullskapeArea.map((item) => <FullskapeCard key={item._id} item={item} />)
            : "No Fullskape zones have been added yet."}
        </div>

        <ReusableModal
          open={openFullskape}
          heading={"Add Fullskape"}
          subHeading={"Here you can activate Fullskape zones for additional control"}
          onClose={() => setOpenFullskape(false)}
        >
          <AddFullskapeZone onClose={() => setOpenFullskape(false)} data={locationData} />
        </ReusableModal>
      </BoxComponent>
    </>
  );
};

export default GeoFencing;
