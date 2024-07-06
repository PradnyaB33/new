import axios from "axios";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../../State/Function/Main";

const usePublicHoliday = () => {
  const { organisationId } = useParams();
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();

  const AddPublicHoliday = async ({ data, onClose }) => {
    console.log(data);
    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/holiday/create`,
      {
        ...data,
        organizationId: organisationId,
      }
    );
    return response.data;
  };

  const { mutate: addPublicHoliday } = useMutation(AddPublicHoliday, {
    onSuccess: (data, { onClose }) => {
      console.log("Public Holiday Added");
      queryClient.invalidateQueries(["getHoliday"]);
      onClose();
    },
    onError: (error) => {
      console.error("Error adding public holiday", error);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message || "Error adding public holiday"
      );
    },
  });
  const getHoliday = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/holiday/get/${organisationId}`
    );
    return response.data.holidays;
  };

  const { data } = useQuery({
    queryKey: ["getHoliday", organisationId],
    queryFn: getHoliday,
    onError: (error) => {
      console.error("Error getting public holiday", error);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message || "Error getting public holiday"
      );
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  return { addPublicHoliday, data };
};

export default usePublicHoliday;
