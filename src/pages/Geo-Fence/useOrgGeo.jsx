import axios from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const useOrgGeo = () => {
  const { organisationId } = useParams();
  const getOrgCircle = async () => {
    const result = await axios.get(
      `${process.env.REACT_APP_API}/route/geo-fence/${organisationId}`
    );
    return result.data;
  };

  const { data } = useQuery({
    queryKey: ["geo-fenced-areas", organisationId],
    queryFn: getOrgCircle,
    enabled: organisationId !== undefined,
  });
  return { data };
};

export default useOrgGeo;
