import axios from "axios";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import { TestContext } from "../../../State/Function/Main";
import useCustomStates from "./useCustomStates";

const useCreateLeaveRequest = (empId) => {
  const { newAppliedLeaveEvents, emptyAppliedLeaveEvents } = useCustomStates();
  const role = UserProfile().useGetCurrentRole();
  const { handleAlert } = useContext(TestContext);
  const authToken = useAuthToken();
  const queryClient = useQueryClient();
  const createLeaveRequest = async () => {
    newAppliedLeaveEvents.forEach(async (value) => {
      try {
        await axios.post(
          `${process.env.REACT_APP_API}/route/leave/create?role=${role}&empId=${empId}`,
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

  const leaveMutation = useMutation(createLeaveRequest, {
    onSuccess: async () => {
      handleAlert(true, "success", "Leaves created succcesfully");
      await queryClient.invalidateQueries("manager-employee-leave");
      emptyAppliedLeaveEvents();
    },
  });

  return { leaveMutation };
};

export default useCreateLeaveRequest;
