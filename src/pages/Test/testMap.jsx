import React, { useState, useEffect, useContext } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import axios from 'axios';
import { UseContext } from '../../State/UseState/UseContext';

const containerStyle = {
  width: '100%',
  height: '92vh',
};

const TestMap = () => {
  const [waypoints, setWaypoints] = useState([]);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/route/punch/getone`, {
          headers: {
            Authorization: authToken,
          },
        });
        const newWaypoints = response.data.punch.map((punch) => ({
          lat: parseFloat(punch.lat),
          lng: parseFloat(punch.lng),
        }));

        // Smooth the waypoints using a simple moving average
        const smoothedWaypoints = smoothWaypoints(newWaypoints, 3);
        setWaypoints(smoothedWaypoints);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [authToken]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  const totalDistance = waypoints.reduce((total, waypoint, index) => {
    if (index < waypoints.length - 1) {
      const nextWaypoint = waypoints[index + 1];
      return total + calculateDistance(waypoint.lat, waypoint.lng, nextWaypoint.lat, nextWaypoint.lng);
    }
    return total;
  }, 0);
  

const smoothWaypoints = (waypoints, windowSize) => {
  return waypoints?.map((waypoint, index, array) => {
    const start = Math.max(0, index - windowSize + 1);
    const end = index + 1;
    const subset = array.slice(start, end);
    const smoothedLat = subset.reduce((sum, point) => sum + point.lat, 0) / subset.length;
    const smoothedLng = subset.reduce((sum, point) => sum + point.lng, 0) / subset.length;

    return {
      lat: smoothedLat,
      lng: smoothedLng,
    };
  });
};

  const center = {
    lat: parseFloat(waypoints[0]?.lat),
    lng: parseFloat(waypoints[0]?.lng),
  };

  const destination = {
    lat: waypoints[waypoints.length - 1]?.lat,
    lng: waypoints[waypoints.length - 1]?.lng,
  };

  return (
    <div>
      <LoadScript googleMapsApiKey="AIzaSyCBuMhbAtoJI32mTmcVytH_4x-R9VUZn4k">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={20}
          options={{ zoomControl: false, streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
        >
          {waypoints?.length > 0 && <Marker position={center} icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' }} />}
          {waypoints?.length > 0 && <Marker position={destination} icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }} />}
          {waypoints?.length > 0 && <Polyline path={waypoints} options={{ strokeColor: 'blue' }} />}
        </GoogleMap>
      </LoadScript>

      {waypoints?.length > 0 && <p className='absolute top-24 z-[99999999] bg-black text-gray-50'>Total Distance Traveled: {totalDistance.toFixed(2)} kilometers</p>}
    </div>
  );
};


export default TestMap;
