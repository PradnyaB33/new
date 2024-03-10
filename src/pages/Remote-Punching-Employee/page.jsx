import { Chip } from "@mui/material";
import { useJsApiLoader } from "@react-google-maps/api";
import React from "react";
import SelfieForm from "../../components/Modal/Selfi-Image/Selfie";
import useLocationHook from "../../hooks/QueryHook/Location/hook";
import useSelfieStore from "../../hooks/QueryHook/Location/zustand-store";
import MapComponent from "./components/Map-Component";
import BasicSpeedDial from "./components/speed-dial";

const EmployeeRemotePunch = () => {
  const { data } = useLocationHook();

  const { locationArray } = useSelfieStore();
  console.log(
    `🚀 ~ file: page.jsx:21 ~ process.env.REACT_APP_MAP_API_KEY:`,
    process.env.REACT_APP_MAP_API_KEY
  );

  const { isLoaded } = useJsApiLoader({
    id: process.env.REACT_APP_MAP_API_KEY,
    googleMapsApiKey: process.env.REACT_APP_MAP_API_KEY,
  });
  return (
    <div className="w-full h-full bg-slate-200">
      <div className="flex  items-center justify-center h-[92vh]">
        {/* {data?.latitude && (
          <GoogleMap
            googleMapsApiKey={process.env.REACT_APP_MAP_API_KEY}
            mapContainerStyle={{
              width: "100%",
              height: "91.8vh",
            }}
            onLoad={() => console.log("Map loaded")}
            zoom={18}
            center={{ lat: data?.latitude, lng: data?.longitude }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {data?.latitude && (
              <Marker
                label={{ text: "current location" }}
                position={{ lat: data?.latitude, lng: data?.longitude }}
              />
            )}

            {locationArray?.length && (
              <Marker
                label={{
                  text: "Source",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
                position={{
                  lat: locationArray[0]?.lat,
                  lng: locationArray[0]?.lng,
                }}
                icon={{
                  url: "https://maps.gstatic.com/mapfiles/ms2/micons/blue.png",
                  scaledSize: new window.google.maps.Size(40, 40),
                  fillColor: "blue",
                  fillOpacity: 1,
                  strokeColor: "blue",
                  strokeWeight: 4,
                }}
              />
            )}
            {locationArray?.length > 0 && (
              <Polyline
                path={locationArray}
                options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
              />
            )}
            {data?.latitude && (
              <Marker
                label={{
                  text: "Destination",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
                position={{ lat: data?.latitude, lng: data?.longitude }}
                icon={{
                  url: "https://maps.gstatic.com/mapfiles/ms2/micons/red.png",
                  scaledSize: new window.google.maps.Size(40, 40),
                  fillColor: "red",
                  fillOpacity: 1,
                  strokeColor: "blue",
                  strokeWeight: 2,
                }}
              />
            )}
          </GoogleMap>
        )} */}
        {<MapComponent {...{ isLoaded, data, locationArray }} />}
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
