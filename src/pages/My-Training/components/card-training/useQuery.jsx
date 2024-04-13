import axios from "axios";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useGetUser from "../../../../hooks/Token/useUser";

const useCardQuery = ({ trainingId }) => {
  const [open, setOpen] = React.useState(false);

  const { authToken } = useGetUser();
  const queryClient = useQueryClient();
  const getEmployeeTrainingInfo = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/training/get-employee-training-info/${trainingId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const { data, isLoading, error } = useQuery({
    queryKey: [`get-employee-training-info-${trainingId}`],
    queryFn: getEmployeeTrainingInfo,
    onSuccess: (data) => {
      //   console.log("onSuccess", data);
    },
    refetchOnMount: false,
  });
  const createTrainingEmployee = async (data) => {
    const response = await axios.put(
      `${process.env.REACT_APP_API}/route/training/create-training-employee/${trainingId}`,
      data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const { mutate, isLoading: isFetching } = useMutation(
    createTrainingEmployee,
    {
      onSuccess: async () => {
        console.log("onSuccess");
        setOpen(false);
        await queryClient.invalidateQueries({
          queryKey: [`get-employee-training-info-${trainingId}`],
        });
      },
      onError: (error) => {
        console.error("onError", error);
      },
    }
  );

  return { data, isLoading, error, mutate, isFetching, open, setOpen };
};

export default useCardQuery;
