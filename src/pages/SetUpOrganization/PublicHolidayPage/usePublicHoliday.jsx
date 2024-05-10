import axios from "axios";
import moment from "moment";
import { useContext, useState } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";

const usePublicHoliday = (id) => {
  const { setAppAlert } = useContext(UseContext);
  const [allPublicHoliday, setAllPublicHoliday] = useState([]);

  const { data, isLoading, isError } = useQuery(
    "holidays",
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/holiday/get/${id}`
        );
        return response.data.holidays;
      } catch (error) {
        console.error("Error fetching holidays:", error);
        setAppAlert({
          alert: true,
          type: "error",
          msg: "An Error occurred while fetching holidays",
        });
      }
    },
    {
      onSuccess: (data) => {
        console.log(`🚀 ~ file: usePublicHoliday.jsx:30 ~ data:`, data);
        setAllPublicHoliday(data);
      },
    }
  );
  const filteredHolidayWithStartAndEnd = data?.map((holiday) => {
    return {
      ...holiday,
      start: moment(holiday.date),
      end: moment(holiday.date),
      title: holiday.name,
    };
  });
  return {
    data,
    isLoading,
    isError,
    filteredHolidayWithStartAndEnd,
    allPublicHoliday,
  };
};

export default usePublicHoliday;
