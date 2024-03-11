import { Polyline } from "@mui/icons-material";
import { GoogleMap, Marker } from "@react-google-maps/api";
import React from "react";
import useGetSinglePunchEntry from "../../hooks/QueryHook/Remote-Punch/components/get-sing-entry";

const MapComponent = ({ punchObjectId, isLoaded }) => {
  const { data } = useGetSinglePunchEntry({ Id: punchObjectId });
  return isLoaded && data?.punchData ? (
    <GoogleMap
      key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
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
