import axios from "axios";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useAuthToken from "../../Token/useAuth";

const useSetupTraining = (organisationId) => {
  const authToken = useAuthToken();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  const { data, isLoading, isFetching } = useQuery(
    `training-fetch-${organisationId}`,
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/setup/training/${organisationId}`,
          {
            headers: { Authorization: authToken },
          }
        );
        return response.data;
      } catch (err) {
        console.error(err.message);
      }
    },
    {
      onSuccess: (data) => {
        console.log(`🚀 ~ file: remote-punching.jsx:29 ~ data:`, data);
      },
      onError: (error) => {
        console.error(`🚀 ~ file: remote-punching.jsx:29 ~ error:`, error);
      },
    }
  );
  const updateRemotePunching = async (data) => {
    console.log(`🚀 ~ file: training.jsx:37 ~ data:`, data);
    await axios.put(
      `${process.env.REACT_APP_API}/route/setup/training/${organisationId}`,
      data,
      {
        headers: { Authorization: authToken },
      }
    );
  };
  const { mutate } = useMutation(updateRemotePunching, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(`training-fetch-${organisationId}`);
      handleAlert(true, "success", "Changes Updated Successfully");
    },
    onError: (error) => {
      console.error(`🚀 ~ file: remote-punching.jsx:29 ~ error:`, error);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    },
  });
  return { data, isLoading, mutate, isFetching };
};

export default useSetupTraining;
