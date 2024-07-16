import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import useGetUser from "../../../hooks/Token/useUser";
import { useParams } from "react-router-dom";

const useGetCommunicationPermission = () => {
  const { authToken } = useGetUser();
  const [surveyPermission, setSurveyPermission] = useState(false);

  // const { handleAlert } = useContext(TestContext);
  const { organisationId } = useParams();

  const { data, isLoading, isFetching } = useQuery(
    [`survey-permission`],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-employee-survey-permission`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },

    {
      enabled: !!organisationId ,
      // onError: (error) => {
      //   console.error("Error fetching data:", error?.response?.data?.message);
      //   handleAlert(
      //     true,
      //     "error",
      //     error?.response?.data?.message || "Something went wrong"
      //   );
      // },
    }
  );
  return { data, isLoading, isFetching, surveyPermission, setSurveyPermission };
};

export default useGetCommunicationPermission;
