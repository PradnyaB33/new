import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useGeoMutation = () => {
  const queryClient = useQueryClient();
  const deleteGeoCard = async ({ id }) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_API}/route/geo-fence/area/${id}`
    );
    return response.data;
  };
  const { mutate } = useMutation(deleteGeoCard, {
    onSuccess: (data) => {
      console.log(`🚀 ~ file: useGeoMutation.jsx:8 ~ data`, data);
      queryClient.invalidateQueries("geo-fenced-areas");
    },
  });
  return { mutate };
};

export default useGeoMutation;
