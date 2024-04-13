import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import useGetUser from "../../hooks/Token/useUser";

const useTrainingFormEmployee = () => {
  const [page, setPage] = React.useState(1);
  const { decodedToken, authToken } = useGetUser();

  const getEmployee = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/training/get-training/${decodedToken?.user?._id}?page=${page}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response.data;
  };
  const { data, isLoading, error } = useQuery({
    queryKey: [`get-employee-data`, page],
    queryFn: getEmployee,
    onSuccess: (data) => {
      console.log("onSuccess", data);
    },
  });
  return { data, isLoading, error, setPage, page };
};

export default useTrainingFormEmployee;
