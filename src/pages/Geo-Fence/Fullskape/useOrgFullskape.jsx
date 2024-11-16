import axios from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const useOrgFullskape = (orgId) => {
  console.log("orgId for Fullskape:", orgId);

  const { organisationId: paramsOrgId } = useParams();
  const organisationId = orgId || paramsOrgId;
  console.log("Resolved organisationId for Fullskape:", organisationId);

  const getOrgFullskape = async () => {
    const result = await axios.get(
      `${process.env.REACT_APP_API}/route/fullskape/${organisationId}`
    );
    return result.data;
  };

  const { data, error } = useQuery({
    queryKey: ["fullskape-details", organisationId],
    queryFn: getOrgFullskape,
    enabled: organisationId !== undefined,

    onError: (error) => {
      console.error(`Error fetching Fullskape data:`, error);
      //handleAlert(true, "error", error?.response?.data?.message || "Error");
    },
  });

  return { data, error };
};

export default useOrgFullskape;
