import { CircleF, GoogleMap, MarkerF, PolylineF } from "@react-google-maps/api";
import React from "react";
import useGetGeoFencing from "../useGetGeoFencing";

const MapComponent = ({ isLoaded, data, locationArray }) => {
  console.log(`🚀 ~ file: Map-Component.jsx:5 ~ data:`, data);
  const { employeeGeoArea } = useGetGeoFencing();
  console.log(
    `🚀 ~ file: Map-Component.jsx:8 ~ employeeGeoArea:`,
    employeeGeoArea
  );
  const [map, setMap] = React.useState(null);
  return isLoaded ? (
    <GoogleMap
      key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      mapContainerStyle={{
        width: "100%",
        height: "91.8vh",
      }}
      center={{ lat: data?.latitude, lng: data?.longitude }}
      zoom={18}
      onLoad={(map) => {
        console.log(`🚀 ~ file: Map-Component.jsx:21 ~ map:`, map);
        setMap(map);
      }}
    >
      <MarkerF
        position={{ lat: data?.latitude, lng: data?.longitude }}
        label={"Start Position"}
      />
      {locationArray?.length > 0 && (
        <PolylineF
          path={locationArray}
          options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
        />
      )}
      {locationArray?.length > 0 && (
        <MarkerF
          position={{
            lat: locationArray[0]?.latitude,
            lng: locationArray[0]?.longitude,
          }}
          label={"Starting Position"}
        />
      )}
      {employeeGeoArea &&
        employeeGeoArea?.area?.map((area) => {
          console.log(
            `🚀 ~ file: Map-Component.jsx:42 ~ area:`,
            area?.center?.coordinates[0],
            area?.center?.coordinates[1]
          );
          return (
            <CircleF
              key={area?._id}
              center={{
                lat: area?.center?.coordinates[0],
                lng: area?.center?.coordinates[1],
              }}
              radius={area?.radius}
              onLoad={(circle) => {
                console.log(
                  `🚀 ~ file: Map-Component.jsx:50 ~ circle:`,
                  circle
                );
                circle.setMap(map);
              }}
              // options={{
              //   strokeColor: "#0033ff",
              //   strokeOpacity: 0.8,
              //   strokeWeight: 2,
              //   fillColor: "#0033ff",
              //   fillOpacity: 0.35,
              // }}
            />
          );
        })}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default MapComponent;
