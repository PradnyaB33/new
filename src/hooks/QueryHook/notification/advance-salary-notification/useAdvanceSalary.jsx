import axios from "axios";
import { useContext } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";

const useAdvanceSalaryData = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const {
    data: getAdvanceSalaryData,
    isFetching,
    isLoading,
  } = useQuery(["getAdvanceSalaryData"], async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/pending-advance-salary-data`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    console.log(`🚀 ~ file: useAdvanceSalary.jsx:21 ~ response:`, response);
    return response.data.data;
  });

  const { data: advanceSalaryNotification } = useQuery(
    ["advance-salary-notification"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/send-notification-to-emp`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(`🚀 ~ file: useAdvanceSalary.jsx:38 ~ response:`, response);
      return response.data.data;
    }
  );

  return {
    getAdvanceSalaryData,
    advanceSalaryNotification,
    isLoading,
    isFetching,
  };
};

export default useAdvanceSalaryData;
