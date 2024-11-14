
import axios from "axios";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useAuthToken from "../../Token/useAuth";

const useSetupRemotePunching = (organisationId) => {
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const authToken = useAuthToken();

  // Fetch remote punching data
  const { data: remoteData, isLoading: isLoadingRemote } = useQuery(
    `remote-fetch-${organisationId}`,
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/remote-punch/${organisationId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    },
    {
      onSuccess: (data) => console.info("Fetched remote data:", data),
      onError: (error) => console.error("Error fetching remote data:", error),
    }
  );

  // Fetch Fullskape data
  const { data: fullskapeData, isLoading: isLoadingFullskape } = useQuery(
    `fullskape-fetch-${organisationId}`,
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/fullskape/${organisationId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    },
    {
      onSuccess: (data) => console.info("Fetched Fullskape data:", data),
      onError: (error) => console.error("Error fetching Fullskape data:", error),
    }
  );

  // Update remote punching and Fullskape data
  const updateRemoteAndFullskapeData = async (data) => {
    try {
      // Post to remote punching endpoint
      await axios.post(
        `${process.env.REACT_APP_API}/route/remote-punch/${organisationId}`,
        data,
        { headers: { Authorization: authToken } }
      );
  
      // Post to Fullskape endpoint
      await axios.post(
        `${process.env.REACT_APP_API}/route/fullskape/${organisationId}`,
        data,
        { headers: { Authorization: authToken } }
      );
    } catch (error) {
      console.error("Error in updateRemoteAndFullskapeData:", error.response?.data || error.message);
      throw error; // Rethrow to trigger the mutation error handler
    }
  };
  

  const { mutate } = useMutation(updateRemoteAndFullskapeData, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(`remote-fetch-${organisationId}`);
      await queryClient.invalidateQueries(`fullskape-fetch-${organisationId}`);
      handleAlert(true, "success", "Changes Updated Successfully");
    },
    onError: (error) => {
      console.error("Mutation error:", error.response?.data || error.message);
      handleAlert(
        true,
        "error",
        error.response?.data?.message || "Something went wrong"
      );
    },
  });
  

  return { 
    data: { 
      ...remoteData, 
      geoFencingFullskape: fullskapeData?.geoFencingFullskape || false, 
      ...fullskapeData 
    }, 
    isLoading: isLoadingRemote || isLoadingFullskape, 
    mutate 
  };
  
};

export default useSetupRemotePunching;
