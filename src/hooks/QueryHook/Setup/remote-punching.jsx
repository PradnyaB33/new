import axios from "axios";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useAuthToken from "../../Token/useAuth";

const useSetupRemotePunching = (organisationId) => {
  const authToken = useAuthToken();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  console.log(`🚀 ~ file: remote-punching.jsx:11 ~ handleAlert:`, handleAlert);

  const { data, isLoading } = useQuery(
    `remote-fetch-${organisationId}`,
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/remote-punch/${organisationId}`,
          {
            headers: { Authorization: authToken },
          }
        );
        return response.data;
      } catch (err) {
        console.log(err.message);
      }
    },
    {
      onSuccess: (data) => {
        console.log(`🚀 ~ file: remote-punching.jsx:29 ~ data:`, data);
      },
    }
  );
  const updateRemotePunching = async (data) => {
    await axios.post(
      `${process.env.REACT_APP_API}/route/remote-punch/${organisationId}`,
      data,
      {
        headers: { Authorization: authToken },
      }
    );
  };
  const { mutate } = useMutation(updateRemotePunching, {
    onSuccess: async (data) => {
      console.log(`🚀 ~ file: remote-punching.jsx:56 ~ data:`, data);
      await queryClient.invalidateQueries(`remote-fetch-${organisationId}`);
      handleAlert(true, "success", "Changes Updated Successfully");
    },
  });
  return { data, isLoading, mutate };
};

export default useSetupRemotePunching;
