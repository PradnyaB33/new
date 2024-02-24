import axios from "axios";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import useGetUser from "../../Token/useUser";

const useSubscriptionGet = ({ organisationId }) => {
  console.log(`🚀 ~ file: hook.jsx:7 ~ organisationId:`, organisationId);
  const { authToken } = useGetUser();
  const getSubscription = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/organization/subscription/${organisationId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: [`subscription-${organisationId}`],
    queryFn: getSubscription,

    onError: (error) => {
      toast.error("Something went wrong");
    },
  });
  return { data, isLoading };
};

export default useSubscriptionGet;
