import React, { useContext } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../State/UseState/UseContext";
import axios from "axios";

const TestNotification = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const { data, isLoading, isError, error } = useQuery(
    "emp-notification",
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/shiftApply/get`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    }
  );

  const newArr = data?.requests.filter((item) => {
    return item.status === "Accepted";
  });

  console.log(newArr);
  return (
    <div className="w-full h-full">
      <div className="w-[60vw] h-full m-auto">
        {newArr?.map((item, idx) => (
          <div>
            <div className="bg-blue-200 p-5">
              Your Request for the Shift {item.title} is {item.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestNotification;
