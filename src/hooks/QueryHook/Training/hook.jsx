import axios from "axios";
import { useQuery } from "react-query";
import useGetUser from "../../Token/useUser";
import useDebounce from "./hook/useDebounce";

const useTrainingHook = (name) => {
  console.log(`🚀 ~ file: hook.jsx:7 ~ name:`, name);
  const { decodedToken, authToken } = useGetUser();
  const debouncedSearchTerm = useDebounce(name, 500);

  const getTrainingDetailsWithNameLimit10WithCreatorId = async () => {
    console.log("I am searching for training with name: ", name);
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/training/getTrainingDetailsWithNameLimit10WithCreatorId/${decodedToken?.user?._id}?name=${name}`,
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
  });
  return { data, isLoading, error };
};

export default useTrainingHook;
