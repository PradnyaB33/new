import axios from "axios";
import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";

const useLeaveData = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  const [newAppliedLeaveEvents, setNewAppliedLeaveEvents] = useState([]);
  const queryclient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [selectEvent, setselectEvent] = useState(false);

  const { data, isLoading, isError, error } = useQuery(
    "employee-leave-table-without-default",
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/leave/getEmployeeCurrentYearLeave`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    }
  );
  const createLeaves = async () => {
    newAppliedLeaveEvents.forEach(async (value) => {
      try {
        await axios.post(
          `${process.env.REACT_APP_API}/route/leave/create`,
          value,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
      } catch (error) {
        console.error(`🚀 ~ error:`, error);
        handleAlert(
          true,
          "error",
          error?.response?.data?.message || "Leaves not created succcesfully"
        );
      }
    });
  };
  const leaveMutation = useMutation(createLeaves, {
    onSuccess: () => {
      queryclient.invalidateQueries("employee-leave-table");
      queryclient.invalidateQueries("employee-leave-table");
      queryclient.invalidateQueries("employee-summary-table");
      queryclient.invalidateQueries("employee-leave-table-without-default");
      setNewAppliedLeaveEvents([]);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    setCalendarOpen(false);

    leaveMutation.mutate();
  };
  const handleInputChange = () => {
    setCalendarOpen(true);
    setSelectedLeave(null);
  };

  const handleUpdateFunction = (e) => {
    console.log(
      `🚀 ~ file: useLeaveData.jsx:88 ~ selectedLeave._id:`,
      selectedLeave
    );
    setselectEvent(true);
    // newAppliedLeaveEvents
    console.log(
      `🚀 ~ file: useLeaveData.jsx:87 ~ data:`,
      data?.currentYearLeaves
    );
    let array = data?.currentYearLeaves.filter((item) => {
      return item._id !== selectedLeave?._id;
    });
    console.log(
      `🚀 ~ file: useLeaveData.jsx:93 ~ data?.currentYearLeaves:`,
      data?.currentYearLeaves
    );
    console.log(`🚀 ~ file: useLeaveData.jsx:84 ~ array:`, array);
    // setAppliedLeaveEvents(array);
    queryclient.setQueryData("employee-leave-table-without-default", (old) => {
      console.log(`🚀 ~ file: useLeaveData.jsx:100 ~ old:`, old);
      old.currentYearLeaves = old?.currentYearLeaves.filter((item) => {
        return item._id !== selectedLeave?._id;
      });
      console.log(`🚀 ~ file: useLeaveData.jsx:104 ~ old:`, old);
      return { ...old };
    });
  };
  return {
    data,
    isLoading,
    isError,
    error,
    handleSubmit,
    isCalendarOpen,
    setCalendarOpen,
    newAppliedLeaveEvents,
    setNewAppliedLeaveEvents,
    handleInputChange,
    selectedLeave,
    setSelectedLeave,
    handleUpdateFunction,
    selectEvent,
    setselectEvent,
  };
};

export default useLeaveData;
