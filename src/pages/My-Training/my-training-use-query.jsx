import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import useGetUser from "../../hooks/Token/useUser";

const useTrainingFormEmployee = () => {
  const [page, setPage] = React.useState(1);
  const { decodedToken, authToken } = useGetUser();
  console.log(
    `🚀 ~ file: my-training-use-query.jsx:9 ~ decodedToken:`,
    decodedToken
  );

  const getEmployee = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/training/get-recent-training/${decodedToken?.user?.organizationId}?page=${page}`,
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
