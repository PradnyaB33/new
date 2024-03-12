import axios from "axios";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../../../State/Function/Main";
import useGetUser from "../../../Token/useUser";

const useNotificationRemotePunching = () => {
  const { authToken, decodedToken } = useGetUser();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  const notifyToManager = async (punchId) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/punch/manager/${punchId}`,
      { status: "Pending" },
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const notifyManagerMutation = useMutation({
    mutationFn: notifyToManager,
    onSuccess: async (data) => {
      console.log(data);
      await queryClient.invalidateQueries({
        queryKey: [`remote-punching-${decodedToken?.user?._id}`],
      });
      handleAlert(true, "success", `Subscription updated successfully`);
    },
    onError: (data) => {
      console.error(data);
      handleAlert(true, "error", `Subscription not updated successfully`);
    },
  });
  const notifyToAccountant = async (punchId) => {
    const response = await axios.patch(
      `${process.env.REACT_APP_API}/route/punch/accountant/${punchId}`,
      { status: "M-Approved" },
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const notifyAccountantMutation = useMutation({
    mutationFn: notifyToAccountant,
    onSuccess: async (data) => {
      console.log(data);
      await queryClient.invalidateQueries({
        queryKey: [`punch-request`],
      });
      handleAlert(true, "success", `Subscription updated successfully`);
    },
    onError: (data) => {
      console.error(data);
      handleAlert(true, "error", `Subscription not updated successfully`);
    },
  });

  return {
    notifyManagerMutation,
    notifyAccountantMutation,
  };
};

export default useNotificationRemotePunching;
