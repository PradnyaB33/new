import { GoogleMap } from "@react-google-maps/api";
import React from "react";

const RightSide = () => {
  return (
    <>
      {" "}
      <GoogleMap
        key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        mapContainerStyle={{
          width: "60%",
          height: "91.8vh",
        }}
        center={{
          lat: 18.6229332,
          lng: 73.7360171,
        }}
        zoom={18}
      ></GoogleMap>
    </>
  );
};

export default RightSide;
