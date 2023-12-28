import React, { useEffect, useState } from "react";

const TrackingMap = () => {
  const [map, setMap] = useState(null);
  const [polyline, setPolyline] = useState(null);
  const [path, setPath] = useState([
    { lat: 28.55108, lng: 77.26913 },
    { lat: 28.55106, lng: 77.26906 },
    { lat: 28.55105, lng: 77.26897 },
    { lat: 28.55101, lng: 77.26872 },
    { lat: 28.55099, lng: 77.26849 },
    { lat: 28.55097, lng: 77.26831 },
    { lat: 28.55093, lng: 77.26794 },
    { lat: 28.55089, lng: 77.2676 },
    { lat: 28.55123, lng: 77.26756 },
    { lat: 28.55145, lng: 77.26758 },
    { lat: 28.55168, lng: 77.26758 },
    { lat: 28.55175, lng: 77.26759 },
    { lat: 28.55177, lng: 77.26755 },
    { lat: 28.55179, lng: 77.26753 },
  ]);

  useEffect(() => {
    // Load Google Maps API script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    // Cleanup on component unmount
    return () => {
      if (map) {
        window.google.maps.event.clearInstanceListeners(map);
      }
    };
    // eslint-disable-next-line
  }, [map]);

  const initMap = () => {
    const mapInstance = new window.google.maps.Map(
      document.getElementById("map"),
      {
        center: path[0],
        zoom: 14,
      }
    );

    const polylineInstance = new window.google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
      map: mapInstance,
    });

    setMap(mapInstance);
    setPolyline(polylineInstance);
  };

  // Simulate tracking by updating the path
  useEffect(() => {
    const intervalId = setInterval(() => {
      setPath((prevPath) => [
        ...prevPath,
        {
          lat: prevPath[prevPath.length - 1].lat + 0.0001,
          lng: prevPath[prevPath.length - 1].lng + 0.0001,
        },
      ]);

      if (polyline) {
        const bounds = new window.google.maps.LatLngBounds();
        path.forEach((point) => bounds.extend(point));
        map.fitBounds(bounds);
        polyline.setPath(path);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [path, polyline, map]);

  return <div id="map" style={{ height: "400px", width: "100%" }}></div>;
};

export default TrackingMap;
