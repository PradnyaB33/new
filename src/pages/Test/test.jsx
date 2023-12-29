import React, { useEffect, useState } from "react";

export default function Test() {
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    speed: null,
    accuracy: null,
  });
  const [watchId, setWatchId] = useState(null);
  let map, polyline, mappls; // Reference to the Google Map
  let map, polyline, mappls; // Reference to the Google Map

  const startWatching = () => {
    if ("geolocation" in navigator) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed, accuracy } = position.coords;
          setLocationData({
            latitude,
            longitude,
            speed,
            accuracy,
          });

          // Update Google Map marker position
          if (map) {
            const currentPosition = new window.google.maps.LatLng(
              latitude,
              longitude
            );
            map.panTo(currentPosition);
          }
        },
        (error) => {
          console.error(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
      setWatchId(id);
    } else {
      console.error("Geolocation is not supported in this browser.");
    }
  };

  const stopWatching = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  useEffect(() => {
    // Load Google Maps API script
    const script = document.createElement("script");
    script.src = `https://apis.mappls.com/advancedmaps/api/dfb06668ce660987cc7008f8175a6720/map_sdk?layer=vector&v=3.0&callback=initMap1`;
    script.async = true;
    script.onload = () => {
      console.log(`🚀 ~ file: test.jsx:67 ~ window:`, window);
      mappls = window.mappls;
      // map = new mappls.Map("map", {
      //   center: { lat: 28.612964, lng: 77.229463 },
      // });
      initMap1();
    };
    document.head.appendChild(script);

    // Location update interval
    const intervalId = setInterval(() => {
      console.log("Updating state after one minute");
      setLocationData((prevLocationData) => ({
        ...prevLocationData,
        speed: Math.random() * 100,
      }));
    }, 60000);

    return () => {
      stopWatching();
      clearInterval(intervalId);
    };
    // eslint-disable-next-line
  }, []);
  function initMap1() {
    map = new mappls.Map("map", {
      center: [28.544, 77.5454],
      zoomControl: true,
      location: true,
    });
    map.addListener("load", function () {
      var pts = [
        {
          lat: 28.55108,
          lng: 77.26913,
        },
        {
          lat: 28.55106,
          lng: 77.26906,
        },
        {
          lat: 28.55105,
          lng: 77.26897,
        },
        {
          lat: 28.55101,
          lng: 77.26872,
        },
        {
          lat: 28.55099,
          lng: 77.26849,
        },
        {
          lat: 28.55097,
          lng: 77.26831,
        },
        {
          lat: 28.55093,
          lng: 77.26794,
        },
        {
          lat: 28.55089,
          lng: 77.2676,
        },
        {
          lat: 28.55123,
          lng: 77.26756,
        },
        {
          lat: 28.55145,
          lng: 77.26758,
        },
        {
          lat: 28.55168,
          lng: 77.26758,
        },
        {
          lat: 28.55175,
          lng: 77.26759,
        },
        {
          lat: 28.55177,
          lng: 77.26755,
        },
        {
          lat: 28.55179,
          lng: 77.26753,
        },
      ];
      new mappls.Polyline({
        map: map,
        paths: pts,
        strokeColor: "#333",
        strokeOpacity: 1.0,
        strokeWeight: 5,
        fitbounds: true,
        dasharray: [2, 2],
      });
    });
  }
  function initMap1() {
    map = new mappls.Map("map", {
      center: [28.544, 77.5454],
      zoomControl: true,
      location: true,
    });
    map.addListener("load", function () {
      var pts = [
        {
          lat: 28.55108,
          lng: 77.26913,
        },
        {
          lat: 28.55106,
          lng: 77.26906,
        },
        {
          lat: 28.55105,
          lng: 77.26897,
        },
        {
          lat: 28.55101,
          lng: 77.26872,
        },
        {
          lat: 28.55099,
          lng: 77.26849,
        },
        {
          lat: 28.55097,
          lng: 77.26831,
        },
        {
          lat: 28.55093,
          lng: 77.26794,
        },
        {
          lat: 28.55089,
          lng: 77.2676,
        },
        {
          lat: 28.55123,
          lng: 77.26756,
        },
        {
          lat: 28.55145,
          lng: 77.26758,
        },
        {
          lat: 28.55168,
          lng: 77.26758,
        },
        {
          lat: 28.55175,
          lng: 77.26759,
        },
        {
          lat: 28.55177,
          lng: 77.26755,
        },
        {
          lat: 28.55179,
          lng: 77.26753,
        },
      ];
      polyline = new mappls.Polyline({
        map: map,
        paths: pts,
        strokeColor: "#333",
        strokeOpacity: 1.0,
        strokeWeight: 5,
        fitbounds: true,
        dasharray: [2, 2],
      });
    });
  }
  return (
    <div className="pt-32">
      <div>
        <strong>Latitude:</strong> {locationData.latitude}
      </div>
      <div>
        <strong>Longitude:</strong> {locationData.longitude}
      </div>
      <div>
        <strong>Speed:</strong> {locationData.speed}
      </div>
      <div>
        <strong>Accuracy:</strong> {locationData.accuracy}
      </div>
      <button onClick={startWatching}>Start Watching</button>
      <button onClick={stopWatching}>Stop Watching</button>

      <div id="map" style={{ height: "400px", width: "100%" }}></div>
    </div>
  );
}
