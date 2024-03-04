import axios from "axios";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useGetUser from "../../Token/useUser";

const useSubscriptionMutation = () => {
  const { authToken } = useGetUser();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  const updateSubscription = async ({ subscriptionId, data }) => {
    console.log(`🚀 ~ file: mutation.jsx:9 ~ data:`, data);
    console.log(`🚀 ~ file: mutation.jsx:9 ~ subscriptionId:`, subscriptionId);
    const response = await axios.patch(
      `${process.env.REACT_APP_API}/route/subscription-status/${subscriptionId}`,
      { data },
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const pauseSubscription = async (subscriptionId) => {
    console.log(`🚀 ~ file: mutation.jsx:9 ~ subscriptionId:`, subscriptionId);
    const response = await axios.delete(
      `${process.env.REACT_APP_API}/route/subscription-status/${subscriptionId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const resumeSubscription = async (subscriptionId) => {
    console.log(`🚀 ~ file: mutation.jsx:9 ~ subscriptionId:`, subscriptionId);
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/subscription-status/${subscriptionId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const updateSubscriptionMutation = useMutation({
    mutationFn: updateSubscription,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: [`subscription-${data.organisation._id}`],
      });
      handleAlert(true, "success", `Subscription updated successfully`);
    },
    onError: (data) => {
      console.log(data);
      handleAlert(true, "error", `Subscription not updated successfully`);
    },
  });
  const pauseSubscriptionMutation = useMutation({
    mutationFn: pauseSubscription,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: [`subscription-${data.organisation._id}`],
      });
    },
    onError: (data) => {
      console.log(data);
    },
  });
  const resumeSubscriptionMutation = useMutation({
    mutationFn: resumeSubscription,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: [`subscription-${data.organisation._id}`],
      });
    },
    onError: (data) => {
      console.log(data);
    },
  });
  return {
    updateSubscriptionMutation,
    pauseSubscriptionMutation,
    resumeSubscriptionMutation,
  };
};

export default useSubscriptionMutation;
