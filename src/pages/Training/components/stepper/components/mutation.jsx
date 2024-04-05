import axios from "axios";
import { useMutation } from "react-query";
import useAuthToken from "../../../../../hooks/Token/useAuth";

const useTrainingCreationMutation = () => {
  const authToken = useAuthToken();
  const getTrainingImageUrl = async (fullObject) => {
    console.log(`🚀 ~ file: mutation.jsx:8 ~ fullObject:`, fullObject);
    console.log("getTrainingImageUrl");
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
  const { mutate } = useMutation(getTrainingImageUrl, {
    onSuccess: (data) => {
      console.log("onSuccess", data);
    },
    onError: (error) => {
      console.error("onError", error);
    },
  });
  return { mutate };
};

export default useTrainingCreationMutation;
