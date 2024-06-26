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

  const addEmployeeToCircle = async ({ circleId, employeeId, onClose }) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/geo-fence/${circleId}/employee`,
      { employeeId }
    );
    return response.data;
  };

  const { mutate: addEmployeeToCircleMutate } = useMutation(
    addEmployeeToCircle,
    {
      onSuccess: (data, { onClose }) => {
        console.log(`🚀 ~ file: useGeoMutation.jsx:25 ~ data`, data);
        queryClient.invalidateQueries(`employee-get-org`);
        queryClient.invalidateQueries(`geo-fenced-areas`);

        onClose();
      },
    }
  );

  const removeEmployeeToCircle = async ({ circleId, employeeId }) => {
    const response = await axios.put(
      `${process.env.REACT_APP_API}/route/geo-fence/${circleId}/employee/`,
      { employeeId }
    );
    return response.data;
  };

  const { mutate: removeEmployeeToCircleMutate } = useMutation(
    removeEmployeeToCircle,
    {
      onSuccess: (data) => {
        console.log(`🚀 ~ file: useGeoMutation.jsx:25 ~ data`, data);
        queryClient.invalidateQueries(`employee-get-org`);
        queryClient.invalidateQueries(`geo-fenced-areas`);
      },
    }
  );

  return { mutate, addEmployeeToCircleMutate, removeEmployeeToCircleMutate };
};

export default useGeoMutation;
