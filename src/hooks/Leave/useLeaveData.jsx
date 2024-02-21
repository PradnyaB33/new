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
      handleAlert(true, "success", "Applied for leave successfully");
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
    setselectEvent(true);

    let array = data?.currentYearLeaves.filter((item) => {
      return item._id !== selectedLeave?._id;
    });
    console.log(`🚀 ~ file: useLeaveData.jsx:82 ~ array:`, array);
    queryclient.setQueryData("employee-leave-table-without-default", (old) => {
      old.currentYearLeaves = old?.currentYearLeaves.filter((item) => {
        return item._id !== selectedLeave?._id;
      });
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
