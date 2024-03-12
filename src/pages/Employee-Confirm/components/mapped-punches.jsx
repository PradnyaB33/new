import React from "react";
import useGetSinglePunch from "../../../hooks/QueryHook/Remote-Punch/components/hook";

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

const MappedPunches = ({
  Id,
  setPunchObjectId,
  className = "",
  punchObjectId,
}) => {
  const { data } = useGetSinglePunch({ Id });

  return (
    <div className={`w-full h-80 ${className} overflow-y-auto cursor-pointer`}>
      {data?.punchData?.punchData?.map((doc, idx) => {
        let distance = 0;
        let totalDistance = 0;
        if (doc.data && idx < doc.data.length - 1) {
          const currentData = doc.data[idx];
          const nextData = doc.data[idx + 1];
          distance =
            calculateDistance(
              currentData.lat,
              currentData.lng,
              nextData.lat,
              nextData.lng
            ).toFixed(2) + " km";
          totalDistance += distance;
        }
        console.log("totalDistance", totalDistance);

        return (
          <div
            key={idx}
            className={`w-full rounded-lg h-auto bg-[#e2f1ff] flex flex-col mb-3 ${
              punchObjectId === doc._id ? "border border-primary" : ""
            }`}
            onClick={() => setPunchObjectId(doc._id)}
          >
            <div className="flex w-full items-center h-full p-5">
              <div className="mr-3">
                <img
                  src={doc?.image}
                  height={55}
                  width={55}
                  className="w-[55px] h-[55px] bg-black rounded-full object-cover"
                  alt="op"
                ></img>
              </div>
              <div className="pl-5 flex flex-col ">
                <h1>
                  Start Time:{" "}
                  {new Date(doc.data[0]?.createdAt).toLocaleTimeString()}
                </h1>
                <h1>
                  End Time:{" "}
                  {doc.data &&
                  doc.data.length > 0 &&
                  doc.data[doc.data.length - 1]?.createdAt
                    ? new Date(
                        doc.data[doc.data.length - 1]?.createdAt
                      ).toLocaleTimeString()
                    : "N/A"}
                </h1>
                <h1>Distance Travelled: {distance}</h1>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MappedPunches;