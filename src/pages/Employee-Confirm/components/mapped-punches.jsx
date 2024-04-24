import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import useGetSinglePunch from "../../../hooks/QueryHook/Remote-Punch/components/hook";
import useGetUser from "../../../hooks/Token/useUser";
import UserProfile from "../../../hooks/UserData/useUser";

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
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const { authToken } = useGetUser();
  console.log("this is the user", user);
  const { data: EmpData } = useQuery(`remote-punching-${Id}`, async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get/profile/${user._id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  });

  return (
    <div className={`w-full h-80 ${className} cursor-pointer`}>
      {data?.punchData?.punchData?.map((doc, idx) => {
        console.log("this is doc", doc);
        let distance = 0;
        let totalDistance = 0;
        console.log(
          `🚀 ~ file: mapped-punches.jsx:33 ~ totalDistance:`,
          totalDistance
        );

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

        return (
          <div
            key={idx}
            className={`w-full rounded-lg h-auto bg-[#e2f1ff] md:flex flex-none flex-col mb-3 ${
              punchObjectId === doc._id ? "border border-primary" : ""
            }`}
            onClick={() => setPunchObjectId(doc._id)}
          >
            <div className="md:flex flex-none w-full items-center h-full md:p-5 p-2">
              <div className="md:mr-3 mr-0">
                {doc?.image === "" ? (
                  <img
                    src={EmpData?.punchData.employeeId.user_logo_url}
                    height={55}
                    width={55}
                    className="md:w-[55px] w-[40px] h-[40px] md:h-[55px] bg-black rounded-full object-cover"
                    alt="op"
                  ></img>
                ) : (
                  <img
                    src={doc?.image}
                    height={55}
                    width={55}
                    className="md:w-[55px] w-[40px] h-[40px] md:h-[55px] bg-black rounded-full object-cover"
                    alt="op"
                  ></img>
                )}
              </div>
              <div className="md:pl-5 pl-2 flex flex-col ">
                <h1 className="text-xs md:text-base">
                  Start Time:{" "}
                  {new Date(doc?.data[0]?.time).toLocaleTimeString()}
                </h1>
                {console.log("this is the doc", doc)}
                <h1 className="text-xs md:text-base">
                  End Time:{" "}
                  {doc.data && doc.data.length > 0 && doc?.createdAt
                    ? new Date(
                        doc?.data[doc.data.length - 1]?.time
                      ).toLocaleTimeString()
                    : "N/A"}
                </h1>
                <h1 className="text-xs md:text-base">
                  Distance Travelled: {distance}
                </h1>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MappedPunches;
