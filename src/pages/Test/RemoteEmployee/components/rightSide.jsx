import { GoogleMap } from "@react-google-maps/api";
import React from "react";

const RightSide = ({ center }) => {
  return (
    <>
      {" "}
      <GoogleMap
        key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        mapContainerStyle={{
          width: "80%",
          height: "91.8vh",
        }}
        center={center}
        zoom={18}
      ></GoogleMap>
    </>
  );
};

export default RightSide;
