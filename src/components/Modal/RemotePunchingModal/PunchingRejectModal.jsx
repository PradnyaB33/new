import { Button } from "@mui/material";
import React from "react";
import useNotificationRemotePunching from "../../../hooks/QueryHook/Remote-Punch/components/mutation";

const calculateDistance = (coords) => {
  let totalDistance = 0;
  const R = 6371; // Earth’s radius in kilometers

  for (let i = 1; i < coords.length; i++) {
    const lat1 = coords[i - 1].lat;
    const lon1 = coords[i - 1].lng;
    const lat2 = coords[i].lat;
    const lon2 = coords[i].lng;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    totalDistance += d;
  }

  return totalDistance.toFixed(2); // rounding to 2 decimal places for simplicity
};

const PunchingRejectModal = ({ items, length }) => {
  const { notifyAccountantMutation } = useNotificationRemotePunching();
  const distanceTraveled =
    items.punchData[0].data && items.punchData[0].data.length > 1
      ? calculateDistance(items.punchData[0].data)
      : 0;
  console.log(items);
  return (
    <div className="w-full">
      <div className="w-full h-auto bg-white flex p-4 pl-8 pr-8 justify-between items-center shadow-md">
        <div className="flex items-center">
          <div className="mr-9">
            <div className="h-[100px] w-[100px] rounded-full">
              <img
                style={{ objectFit: "cover" }}
                src={items.punchData[0].image}
                alt=""
                srcset=""
              />
            </div>
          </div>
          <div>
            <h1>
              Start Time :{" "}
              {new Date(
                items.punchData[0].data[0]?.createdAt
              ).toLocaleTimeString()}
            </h1>
            <h1>
              End Time:{" "}
              {items.punchData[0].data && items.punchData[0].data.length > 0
                ? new Date(
                    items.punchData[0].data[
                      items.punchData[0].data.length - 1
                    ].createdAt
                  ).toLocaleTimeString()
                : "N/A"}
            </h1>
            <h1>Total Distance Traveled: {distanceTraveled} Km </h1>
            <h1>Punching restarted: {length} times</h1>
          </div>
        </div>
        <div>
          <div>
            <Button variant="contained" size="small">
              View Route
            </Button>
          </div>
          <div className="flex gap-3 mt-3">
            <Button
              onClick={() => notifyAccountantMutation.mutate(items._id)}
              variant="contained"
              size="small"
            >
              Accept
            </Button>
            <Button variant="contained" color="error" size="small">
              Reject
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PunchingRejectModal;
