import axios from "axios";
import { useMutation } from "react-query";
import useGetUser from "../../Token/useUser";

const useTrainingMutation = () => {
  const { authToken, decodedToken } = useGetUser();
  console.log(`🚀 ~ file: mutation.jsx:7 ~ decodedToken:`, decodedToken);

  const getTrainingsWithNameLimit10 = async (name) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/getTrainingWithNameLimit10/${decodedToken?.user?._id}/${name}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response.data;
  };
  const { mutate, data } = useMutation(getTrainingsWithNameLimit10, {
    onError: (data) => {
      console.error(data);
    },
  });
  return { mutate, data };
};

export default useTrainingMutation;
