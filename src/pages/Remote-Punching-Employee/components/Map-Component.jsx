import {
  Autocomplete,
  GoogleMap,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import React from "react";
console.log(`🚀 ~ file: Map-Component.jsx:2 ~ Autocomplete:`, Autocomplete);

const MapComponent = ({ isLoaded, data, locationArray }) => {
  console.log(
    `🚀 ~ file: Map-Component.jsx:15 ~ process.env.REACT_APP_GOOGLE_MAPS_API_KEY:`,
    process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  );
  return isLoaded ? (
    <GoogleMap
      key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      mapContainerStyle={{
        width: "100%",
        height: "91.8vh",
      }}
      center={{ lat: data?.latitude, lng: data?.longitude }}
      zoom={18}
    >
      <Marker
        position={{ lat: data?.latitude, lng: data?.longitude }}
        label={"Current Position"}
      />
      {locationArray?.length > 0 && (
        <Polyline
          path={locationArray}
          options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
        />
      )}
      {locationArray?.length > 0 && (
        <Marker
          position={{
            lat: locationArray[0]?.latitude,
            lng: locationArray[0]?.longitude,
          }}
          label={"Starting Position"}
        />
      )}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default MapComponent;
