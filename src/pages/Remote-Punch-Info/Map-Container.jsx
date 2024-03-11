import { Polyline } from "@mui/icons-material";
import { Autocomplete, GoogleMap, Marker } from "@react-google-maps/api";
import React from "react";
import useGetSinglePunchEntry from "../../hooks/QueryHook/Remote-Punch/components/get-sing-entry";
console.log(`🚀 ~ file: Map-Component.jsx:2 ~ Autocomplete:`, Autocomplete);

const MapComponent = ({ punchObjectId, isLoaded }) => {
  const { data } = useGetSinglePunchEntry({ Id: punchObjectId });
  console.log(`🚀 ~ file: Map-Container.jsx:18 ~ data:`, data);
  console.log(
    `🚀 ~ file: Map-Container.jsx:21 ~ data?.punchData[0]?.lat:`,
    data?.punchData
  );
  return isLoaded && data?.punchData ? (
    <GoogleMap
      key={process.env.REACT_APP_MAP_API_KEY}
      mapContainerStyle={{
        width: "70%",
        height: "91.8vh",
      }}
      center={{
        lat: data?.punchData?.data[0]?.lat,
        lng: data?.punchData?.data[0]?.lng,
      }}
      zoom={18}
    >
      <Marker
        position={{
          lat: data?.punchData?.data[0]?.lat,
          lng: data?.punchData?.data[0]?.lng,
        }}
        label={"Current Position"}
      />
      {data?.punchData?.data?.length > 0 && (
        <Polyline
          path={data?.punchData?.data}
          options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
        />
      )}
      {data?.punchData?.data?.length > 0 && (
        <Marker
          position={{
            lat: data?.punchData?.data[0]?.lat,
            lng: data?.punchData?.data[0]?.lng,
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
