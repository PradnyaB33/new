import axios from "axios";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../../../State/Function/Main";
import useGetUser from "../../../../hooks/Token/useUser";

const useTrainingDetailsMutation = () => {
  const { authToken } = useGetUser();
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  const deleteTrainingFunction = async (id) => {
    console.log(
      `🚀 ~ file: mutation.jsx ~ line 6 ~ deleteTrainingFunction ~ id`,
      id
    );
    const response = await axios.delete(
      `${process.env.REACT_APP_API}/route/training/${id}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const { mutate, isLoading } = useMutation(deleteTrainingFunction, {
    onSuccess: () => {
      console.log(`🚀 ~ file: mutation.jsx ~ line 10 ~ onSuccess: ~ onSuccess`);

      handleAlert(true, "success", "Training Deleted Successfully");
      queryClient.invalidateQueries(
        "getTrainingDetailsWithNameLimit10WithCreatorId"
      );
    },
    onError: (error) => {
      console.error("onError", error);
      handleAlert("Training Deletion Failed", "error");
    },
  });
  return { mutate, isLoading };
};

export default useTrainingDetailsMutation;
