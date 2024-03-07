import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetUser from "../../hooks/Token/useUser";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const containerStyle = {
  width: "70%",
  height: "91.8vh",
  border: "2px solid gray",
};

const TestMap = () => {
  const [waypoints, setWaypoints] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const { authToken } = useGetUser();
  const [selectedDayLocation, setSelectedDayLocation] = useState();
  const [dates, setDates] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [allEmp, setAllEmp] = useState([]);

  const fetchReportees = async () => {
    try {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/countofEmployees`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setAllEmp(resp.data.data[0].reporteeIds);
      console.log(resp.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchReportees();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/punch/getone`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        // Handle potential data fetching errors
        if (response.data.error) {
          console.error("Error fetching waypoints:", response.data.error);
          return; // Prevent setting invalid waypoints
        }

        const newWaypoints = response.data.data?.map((punch) => ({
          lat: parseFloat(punch.lat),
          lng: parseFloat(punch.lng),
        }));

        const smoothedWaypoints = smoothWaypoints(newWaypoints, 3);
        setWaypoints(smoothedWaypoints);
      } catch (error) {
        console.error("Error:", error);
      }
    })();
  }, [authToken]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  const totalDistance = waypoints.reduce((total, waypoint, index) => {
    if (index < waypoints.length - 1) {
      const nextWaypoint = waypoints[index + 1];
      return (
        total +
        calculateDistance(
          waypoint.lat,
          waypoint.lng,
          nextWaypoint.lat,
          nextWaypoint.lng
        )
      );
    }
    return total;
  }, 0);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const smoothWaypoints = (waypoints, windowSize) => {
    return waypoints?.map((waypoint, index, array) => {
      const start = Math.max(0, index - windowSize + 1);
      const end = index + 1;
      const subset = array.slice(start, end);
      const smoothedLat =
        subset.reduce((sum, point) => sum + point.lat, 0) / subset.length;
      const smoothedLng =
        subset.reduce((sum, point) => sum + point.lng, 0) / subset.length;

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

  const handleChange = (event, type) => {
    if (type === "employee") {
      const employeeId = event.target.value;
      console.log(employeeId);
      setSelectedEmpId(employeeId);
      getEmp(employeeId);
    } else if (type === "date") {
      const date = event.target.value;
      console.log(date);
      setSelectedDate(date);
      getLocation(date);
    }
  };

  const getEmp = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/punch/getForEmp/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      setSelectedDayLocation(response?.data.punch.days);
      const formattedDates = response?.data.punch.days.map((data) => {
        const date = new Date(data.createdAt);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      });
      setDates(formattedDates);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getLocation = (id) => {
    const selectedPath = selectedDayLocation[id];
    console.log(selectedDayLocation);
    const newWaypoints = selectedPath.location.map((punch) => ({
      lat: parseFloat(punch.lat),
      lng: parseFloat(punch.lng),
    }));

    const smoothedWaypoints = smoothWaypoints(newWaypoints, 3);
    setWaypoints(smoothedWaypoints);
    setCurrentLocation({
      lat: waypoints[waypoints.length - 1].lat,
      lng: waypoints[waypoints.length - 1].lng,
    });
  };

  return (
    <div className="w-full flex justify-between">
      <div className=" z-50 p-10 flex flex-col mt-6 w-[30vw] bg-white gap-4 ">
        <div className="w-full bg-white">
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">
              Select Employee
            </InputLabel>
            <Select
              labelId="employee-select-label"
              id="employee-select"
              value={selectedEmpId}
              label="Select Employee"
              onChange={(event) => handleChange(event, "employee")}
            >
              {allEmp.length > 0 ? (
                allEmp.map((item, idx) => (
                  <MenuItem key={idx} value={item._id}>
                    {item.first_name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No Employee Found</MenuItem>
              )}
            </Select>
          </FormControl>
        </div>
        <div className="w-full bg-white">
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Select Date</InputLabel>
            <Select
              labelId="date-select-label"
              id="date-select"
              value={selectedDate}
              label="Select Date"
              onChange={(event) => handleChange(event, "date")}
            >
              {dates.length > 0 ? (
                dates.map((date, idx) => (
                  <MenuItem key={idx} value={idx}>
                    {date}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No Data Found</MenuItem>
              )}
            </Select>
          </FormControl>
          <div>
            {waypoints?.length > 0 && (
              <p className=" z-[99999999]  mt-4 font-semibold">
                Total Distance Travelled : {totalDistance.toFixed(2)} Kilometers
              </p>
            )}
          </div>
        </div>
      </div>
      <GoogleMap
        googleMapsApiKey="AIzaSyDaA2q3L--j40-GgojdeFSJ4RywKGtFQ2k"
        mapContainerStyle={containerStyle}
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
        {currentLocation && !waypoints?.length && (
          <Marker
            label={{ text: "current location" }}
            position={currentLocation}
          />
        )}

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
      </GoogleMap>
    </div>
  );
};

export default TestMap;
