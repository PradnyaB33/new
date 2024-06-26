import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import useDebounce from "../../../hooks/QueryHook/Training/hook/useDebounce";
import useGetUser from "../../../hooks/Token/useUser";
import useEmployeeListStore from "./employeeListStore";

const useSearchEmployee = ({ watch, circleId }) => {
  const { authToken } = useGetUser();
  const { setEmployeeList } = useEmployeeListStore();
  const [page, setPage] = useState(0);
  const debouncedFirstName = useDebounce(watch("firstName"), 500);
  const debouncedEmail = useDebounce(watch("email"), 500);

  const { organisationId } = useParams();

  const fetchEmployee = async () => {
    const response = await axios.put(
      `${process.env.REACT_APP_API}/route/geo-fence/${organisationId}?name=${debouncedFirstName}&page=${page}&email=${debouncedEmail}&circleId=${circleId}`,
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
      `employee-get-org`,
      debouncedFirstName,
      debouncedEmail,
      page,
      organisationId,
    ],
    queryFn: fetchEmployee,
    onSuccess: (data) => {
      console.log("onSuccess", data?.employees);
      setEmployeeList(data?.employees);
    },
  });
  return { data, isLoading, error, setPage };
};

export default useSearchEmployee;
