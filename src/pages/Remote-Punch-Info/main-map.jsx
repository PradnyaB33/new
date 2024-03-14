import { Check } from "@mui/icons-material";
import { GoogleMap, Marker } from "@react-google-maps/api";
import React from "react";

const MainMap = ({ punchData, isLoaded }) => {
  console.log(`🚀 ~ file: main-map.jsx:5 ~ isLoaded:`, isLoaded);
  let lat = punchData?.data[0]?.lat;
  let lng = punchData?.data[0]?.lng;

  return (
    isLoaded && (
      <GoogleMap
        key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        mapContainerStyle={{
          width: "70%",
          height: "91.8vh",
        }}
        center={{
          lat: 18.6169974,
          lng: 73.7724616,
        }}
        zoom={18}
      >
        {/* <Polyline
          path={punchData?.data}
          options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
        />
        <Marker
          position={{
            lat: punchData?.data[0]?.lat,
            lng: punchData?.data[0]?.lng,
          }}
          label={"Starting Position"}
        /> */}
        <>
          <Marker
            icon={<Check />}
            center={{
              lat: 18.6169974,
              lng: 73.7724616,
            }}
            label={"Start Position"}
          />
        </>
      </GoogleMap>
    )
  );
};

export default MainMap;
