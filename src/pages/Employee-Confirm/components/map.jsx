import React from "react";
import useGetSinglePunch from "../../../hooks/QueryHook/Remote-Punch/components/hook";

const GoogleMap = ({ Id }) => {
  const { data } = useGetSinglePunch(Id);
  return (
    <div>
      {/* <GoogleMap
        googleMapsApiKey="AIzaSyDaA2q3L--j40-GgojdeFSJ4RywKGtFQ2k"
        mapContainerStyle={{
          width: "80%",
          height: "91.8vh",
          border: "2px solid gray",
        }}
        onLoad={() => console.log("Map loaded")}
        zoom={12}
        center={currentLocation}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <Marker
          label={{ text: "current location" }}
          position={currentLocation}
        />

        {waypoints?.length > 0 && (
          <>
            <Marker
              label={{
                text: "Source",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
              position={center}
              icon={{
                url: "https://maps.gstatic.com/mapfiles/ms2/micons/blue.png",
                scaledSize: new window.google.maps.Size(40, 40),
                fillColor: "blue",
                fillOpacity: 1,
                strokeColor: "blue",
                strokeWeight: 2,
              }}
            />
            <Polyline
              path={waypoints}
              options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
            />
            <Marker
              label={{
                text: "Destination",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
              position={destination}
              icon={{
                url: "https://maps.gstatic.com/mapfiles/ms2/micons/red.png",
                scaledSize: new window.google.maps.Size(40, 40),
                fillColor: "red",
                fillOpacity: 1,
                strokeColor: "blue",
                strokeWeight: 2,
              }}
            />
          </>
        )}
      </GoogleMap> */}
      jo
    </div>
  );
};

export default GoogleMap;
