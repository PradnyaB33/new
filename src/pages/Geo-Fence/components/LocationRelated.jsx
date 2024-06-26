import {
  CircleF,
  DrawingManagerF,
  GoogleMap,
  MarkerF,
} from "@react-google-maps/api";
import React from "react";
import useGeoFencingMap from "./useGeoFencingMap";
const LocationRelated = ({ watch, data }) => {
  const { circleRef, circleComplete, mapRef, drawingRef, circle } =
    useGeoFencingMap({
      watch,
    });
  console.log(
    `🚀 ~ file: LocationRelated.jsx:31 ~ circleRef?.current === undefined:`,
    circleRef?.current
  );
  return (
    <div className="h-full w-full">
      <GoogleMap
        mapContainerClassName="h-[400px] rounded-lg shadow-lg relative"
        center={data}
        options={{
          disableDefaultUI: true,
        }}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        zoom={12}
      >
        {watch("location") !== undefined &&
          watch("location")?.position !== undefined && (
            <MarkerF position={watch("location")?.position} />
          )}
        {circle === null && (
          <DrawingManagerF
            drawingMode={"circle"}
            onCircleComplete={circleComplete}
            options={{
              drawingControlOptions: {
                position: window.google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ["circle"],
              },
              circleOptions: {
                fillColor: `#2198f3`,
                strokeColor: "#2196f3",
                fillOpacity: 0.5,
                strokeWeight: 2,
                clickable: true,
                editable: true,
                zIndex: 1,
                draggable: true,
              },

              drawingControl: true,
            }}
            onLoad={(drawingManager) => {
              console.log(
                `🚀 ~ file: GeoMaps.jsx:39 ~ drawingManager`,
                drawingManager
              );
              drawingRef.current = drawingManager;
            }}
          />
        )}

        {circle && (
          <CircleF
            center={circle?.center}
            radius={circle?.radius}
            options={{
              fillColor: `#2198f3`,
              strokeColor: "#2196f3",
              fillOpacity: 0.5,
              strokeWeight: 2,
              clickable: true,
              editable: true,
              zIndex: 1,
              draggable: true,
            }}
            onLoad={(circle) => {
              circleRef.current = circle;
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default LocationRelated;
