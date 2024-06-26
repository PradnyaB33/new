import { useEffect, useRef, useState } from "react";
const useGeoFencingMap = ({ watch }) => {
  const mapRef = useRef();
  const circleRef = useRef();
  const [circle, setCircle] = useState(null);

  const drawingRef = useRef();

  const centerLocation = watch("location")?.position || undefined;
  useEffect(() => {
    if (centerLocation !== undefined && mapRef.current !== undefined) {
      mapRef?.current?.setCenter(centerLocation);
      mapRef?.current?.panTo(centerLocation);
    }
  }, [centerLocation]);

  const circleComplete = (circle) => {
    circleRef.current = {
      center: {
        lat: circle.center.lat(),
        lng: circle.center.lng(),
      },
      radius: circle.radius,
    };
    setCircle({
      center: {
        lat: circle.center.lat(),
        lng: circle.center.lng(),
      },
      radius: circle.radius,
    });
    circle.setMap(null);
  };
  return {
    mapRef,
    circleRef,
    circleComplete,
    drawingRef,
    circle,
  };
};

export default useGeoFencingMap;
