import axios from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import useSearchTrainingZustandStore from "../../../pages/Training/components/zustand-store";
import useGetUser from "../../Token/useUser";
import useDebounce from "./hook/useDebounce";

const useTrainingHook = () => {
  const { trainingName, setTrainingData } = useSearchTrainingZustandStore();
  const { authToken } = useGetUser();
  const debouncedSearchTerm = useDebounce(trainingName, 500);
  const { organisationId } = useParams();

  const getTrainingDetailsWithNameLimit10WithCreatorId = async () => {
    console.log(
      "I am searching for training with trainingName: ",
      trainingName
    );
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/training/getTrainingDetailsWithNameLimit10WithCreatorId/${organisationId}?name=${trainingName}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "getTrainingDetailsWithNameLimit10WithCreatorId",
      debouncedSearchTerm,
    ],
    queryFn: getTrainingDetailsWithNameLimit10WithCreatorId,
    onSuccess: (data) => {
      console.log("onSuccess", data);
      setTrainingData(data.data);
    },
  });
  return { data, isLoading, error };
};

export default useTrainingHook;
