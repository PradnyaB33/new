import { useContext } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { UseContext } from "../../State/UseState/UseContext";
import UserProfile from "../UserData/useUser";

const useRecruitmentQuery = (organisationId) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  console.log(role);

  //for  Get Query to get loan type
  const { data: getJobPosition } = useQuery(
    ["get-job-position", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-job-position/${role}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  return {
    getJobPosition,
  };
};

export default useRecruitmentQuery;
