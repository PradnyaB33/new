import { Button } from "@mui/material";
import {
  CircleF,
  DrawingManagerF,
  GoogleMap,
  MarkerF,
} from "@react-google-maps/api";
import React from "react";
import useGeoFencingMap from "./useGeoFencingMap";
const LocationRelated = ({ watch, data, onClose }) => {
  const {
    circleRef,
    circleComplete,
    mapRef,
    drawingRef,
    circle,
    addCircleMutate,
  } = useGeoFencingMap({
    watch,
    onClose,
  });

  return (
    <div className="h-full w-full flex flex-col items-center">
      <GoogleMap
        mapContainerClassName="h-[400px] w-full rounded-lg shadow-lg relative"
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
            drawingMode={null}
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
            onCenterChanged={(center) => {
              console.log(
                "center",
                circleRef.current?.center?.lat(),
                circleRef.current?.center?.lng(),
                circleRef.current?.radius
              );
              console.log(
                "getCenter",
                circle?.center?.center?.lat(),
                circle?.center?.center?.lng()
              );
            }}
            onRadiusChanged={(radius) => {
              console.log("radius", radius);
            }}
            onLoad={(circle) => {
              console.log(
                `🚀 ~ file: LocationRelated.jsx:86 ~ circle:`,
                circle
              );
              circleRef.current = circle;
            }}
          />
        )}
      </GoogleMap>
      <Button
        onClick={addCircleMutate}
        disabled={circle?.center?.lat === undefined}
        variant="contained"
      >
        ADD
      </Button>
    </div>
  );
};

export default LocationRelated;
