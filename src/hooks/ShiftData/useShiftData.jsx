import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { UseContext } from "../../State/UseState/UseContext";

const useShiftData = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [id, setId] = useState(null);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [newAppliedLeaveEvents, setNewAppliedLeaveEvents] = useState([]);
  const queryclient = useQueryClient();
  const { setAppAlert } = useContext(UseContext);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [disabledShiftId, setDisabledShiftId] = useState(null);
  // const [isUpdating, setIsUpdating] = useState(false);
  const [selectEvent, setselectEvent] = useState(false);

  useEffect(() => {
    console.log("names array", newAppliedLeaveEvents);
  }, [newAppliedLeaveEvents]);

  const { data, isLoading, isError, error } = useQuery(
    "employee-leave-table-without-default",
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/shiftApply/get`,
        {
          headers: { Authorization: authToken },
        }
      );
      queryclient.invalidateQueries("employee-leave-table");
      queryclient.invalidateQueries("employee-summary-table");
      queryclient.invalidateQueries("employee-leave-table-without-default");
      return response.data;
    }
  );

  const { data: leaveData } = useQuery(
    "employee-leave-table-without-default-leave",
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
  const createShifts = async () => {
    console.log("This is final selected leave", selectedLeave);
    newAppliedLeaveEvents.forEach(async (value, idx) => {
      console.log("value", value);
      try {
        if (selectedLeave) {
          await axios.post(
            `${process.env.REACT_APP_API}/route/shiftApply/create`,
            {
              title: value?.name,
              start: value?.start,
              end: value?.end,
            },
            {
              headers: {
                Authorization: authToken,
              },
            }
          );
        }
        // Invalidate queries and reset state after successful mutation
        queryclient.invalidateQueries("employee-leave-table");
        queryclient.invalidateQueries("employee-summary-table");
        queryclient.invalidateQueries("employee-leave-table-without-default");
        setNewAppliedLeaveEvents([]);
        setDisabledShiftId(selectedLeave ? selectedLeave._id : id);
      } catch (error) {
        console.error("Error creating or updating shifts:", error);
      }
    });
  };

  const leaveMutation = useMutation(createShifts, {
    onSuccess: () => {
      queryclient.invalidateQueries("table");
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
    queryclient.invalidateQueries("table");
    setCalendarOpen(false);
    leaveMutation.mutate();
    setAppAlert({
      alert: true,
      type: "success",
      msg: "Request Raised Successfully",
    });
  };
  const handleInputChange = () => {
    setCalendarOpen(true);
  };

  const handleUpdateFunction = (e) => {
    console.log(
      `🚀 ~ file: useLeaveData.jsx:88 ~ selectedLeave._id:`,
      selectedLeave
    );
    setselectEvent(true);
    setSelectedLeave(null);
    // setIsUpdating(true);
    setId(selectedLeave._id);

    let array = data?.requests.filter((item) => {
      return item._id !== selectedLeave?._id;
    });
    queryclient.setQueryData("employee-leave-table-without-default", (old) => {
      old.currentYearLeaves = old?.requests.filter((item) => {
        return item._id !== selectedLeave?._id;
      });
      return { ...old };
    });
    setDisabledShiftId(selectedLeave._id);
    setSelectedLeave(array);
    console.log(selectedLeave);
  };
  return {
    data,
    leaveData,
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
    disabledShiftId,
  };
};

export default useShiftData;
