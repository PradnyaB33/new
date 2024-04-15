import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import useGetUser from "../../../../hooks/Token/useUser";

const useGetOverdueTrainings = () => {
  const { decodedToken, authToken } = useGetUser();
  const [page, setPage] = React.useState(1);

  const getUpcomingTrainings = async () => {
    console.log(
      `🚀 ~ file: use-query-page3.jsx:22 ~ decodedToken:`,
      decodedToken
    );
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/training/get-overdue-trainings/${decodedToken?.user?._id}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const { data, isLoading, error } = useQuery({
    queryKey: [`get-overdue-training`],
    queryFn: getUpcomingTrainings,
    onSuccess: (data) => {
      console.log("onSuccess", data);
    },
    refetchOnMount: false,
  });

  return { data, isLoading, error, setPage, page };
};

export default useGetOverdueTrainings;
