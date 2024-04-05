import axios from "axios";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import useAuthToken from "../../../../../hooks/Token/useAuth";
import useTrainingStore from "./zustand-store";

const useTrainingCreationMutation = () => {
  const authToken = useAuthToken();
  const { setOpen } = useTrainingStore();

  const { organisationId } = useParams();
  const getTrainingImageUrl = async (fullObject) => {
    const result = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/training-banner`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    );
    await axios.put(result?.data?.url, fullObject?.trainingImage, {
      headers: {
        "Content-Type": fullObject?.trainingImage?.type,
      },
    });
    fullObject.trainingImage = result?.data?.url?.split("?")[0];
    return fullObject;
  };
  const createTrainingObject = async (data) => {
    await axios.post(
      `${process.env.REACT_APP_API}/route/training/${organisationId}/create`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    );
  };
  const { mutate: createTraining, isLoading: isCreateTrainingLoading } =
    useMutation(createTrainingObject, {
      onSuccess: async (data) => {
        setOpen(false);
      },
      onError: (error) => {
        console.error("onError", error);
      },
    });

  const { mutate, isLoading } = useMutation(getTrainingImageUrl, {
    onSuccess: async (data) => {
      createTraining(data);
    },
    onError: (error) => {
      console.error("onError", error);
    },
  });
  return { mutate, isCreateTrainingLoading, isLoading };
};

export default useTrainingCreationMutation;
