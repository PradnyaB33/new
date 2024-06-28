import axios from "axios";
import { useContext } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";

const useOrgGeo = () => {
  const { organisationId } = useParams();
  const { handleAlert } = useContext(TestContext);
  const getOrgCircle = async () => {
    const result = await axios.get(
      `${process.env.REACT_APP_API}/route/geo-fence/${organisationId}`
    );
    return result.data;
  };

  const { data, error } = useQuery({
    queryKey: ["geo-fenced-areas", organisationId],
    queryFn: getOrgCircle,
    enabled: organisationId !== undefined,
    onSuccess: (data) => {
      console.log(`🚀 ~ file: useOrgGeo.jsx:24 ~ data`, data);
    },
    onError: (error) => {
      console.log(`🚀 ~ file: useOrgGeo.jsx:27 ~ error`, error);
      handleAlert(true, "error", error?.response?.data?.message || "Error");
    },
  });
  return { data, error };
};

export default useOrgGeo;
