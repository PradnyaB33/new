import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useContext, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import { useQuery } from "react-query";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";

const TrackingMap = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  function LocationMarker() {
    const [position, setPosition] = useState(null);
    const markerIcon = new L.Icon({
      iconUrl: "marker-icon-2x.png",
      iconSize: [35, 45],
    });
    const map = useMapEvents({
      click() {
        map.locate();
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return position === null ? null : (
      <Marker icon={markerIcon} position={position}>
        <Tooltip direction="bottom" offset={[0, 20]} opacity={1} permanent>
          You Location is here
        </Tooltip>
      </Marker>
    );
  }
  const fetchPts = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/punch/getone`,
      {
        headers: { Authorization: authToken },
      }
    );

    return response.data;
  };
  const { data, isError } = useQuery("pts", fetchPts);
  console.log(`🚀 ~ file: test3.jsx:57 ~ data:`, data);
  if (isError) {
    console.log(`🚀 ~ file: test3.jsx:50 ~ error:`, isError);
    handleAlert(true, "error", "error in getting the you location track");
  }

  const pts = [
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

  return (
    <div>
      <MapContainer
        style={{
          height: "400px",
        }}
        center={{ lat: 18.0780808, lng: 74.0226549 }}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data && (
          <Polyline
            positions={data.punch}
            // positions={pts}
            color="blue"
          />
        )}
        <LocationMarker />
      </MapContainer>
      ,
    </div>
  );
};

export default TrackingMap;
