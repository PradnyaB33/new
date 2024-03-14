import { GoogleMap, Marker } from "@react-google-maps/api";
import React, { useState } from "react";

const MainMap = ({ punchData, isLoaded }) => {
  console.log(`🚀 ~ file: main-map.jsx:6 ~ punchData:`, punchData);
  console.log(`🚀 ~ file: main-map.jsx:5 ~ isLoaded:`, isLoaded);
  let lat = punchData?.data[0]?.lat;
  let lng = punchData?.data[0]?.lng;
  const [center, setCenter] = useState({
    lat: punchData?.data[0]?.lat,
    lng: punchData?.data[0]?.lng,
  });

  console.log(`🚀 ~ file: main-map.jsx:15 ~ center:`, center);
  return (
    isLoaded && (
      <GoogleMap
        key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        mapContainerStyle={{
          width: "70%",
          height: "91.8vh",
        }}
        center={center}
        // zoom={18}
        zoom={12}
      >
        {/* <Polyline
          path={punchData?.data}
          options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
        /> */}
        {/*  <Marker
          position={{
            lat: punchData?.data[0]?.lat,
            lng: punchData?.data[0]?.lng,
          }}
          label={"Starting Position"}
        /> */}
        <>
          <Marker
            // icon={<Check />}
            center={center}
            label={"Start Position"}
          />
        </>
      </GoogleMap>
    )
  );
};

export default MainMap;
