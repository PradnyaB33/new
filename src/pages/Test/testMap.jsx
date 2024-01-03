import React, { useState, useEffect, useContext } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import axios from 'axios';
import { UseContext } from '../../State/UseState/UseContext';

const containerStyle = {
  width: '100vw',
  height: '100vh',
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

        setWaypoints(newWaypoints);
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

  const center = {
    lat: parseFloat(waypoints[0]?.lat),
    lng: parseFloat(waypoints[0]?.lng),
  };
  
  const destination = {
    lat:waypoints[waypoints.length-1]?.lat,
    lng: waypoints[waypoints.length-1]?.lng,
  };
  

  return (
    <div>
      <LoadScript googleMapsApiKey="AIzaSyCy2S5NpkS6rB5EG06d0OJy690SAU8tRuk">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          options={{ zoomControl: false, streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
        >
          {waypoints.length > 0 && <Marker position={center} />}
          {waypoints.length > 0 && <Marker position={destination} />}
          {waypoints.length > 0 && <Polyline path={waypoints} options={{ strokeColor: 'blue', strokeOpacity:0.5,  }} />}
        </GoogleMap>
      </LoadScript>

      {waypoints.length > 0 && <p className='absolute top-24 z-[99999999] bg-black text-gray-50'>Total Distance Traveled: {totalDistance.toFixed(2)} kilometers</p>}
    </div>
  );
};

export default TestMap;
