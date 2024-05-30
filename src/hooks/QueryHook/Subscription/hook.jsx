import axios from "axios";
import { useQuery } from "react-query";
import useGetUser from "../../Token/useUser";

const useSubscriptionGet = ({ organisationId }) => {
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

  const { data, isLoading } = useQuery(
    {
      queryKey: [`subscription-${organisationId}`],
      queryFn: getSubscription,

    onError: (error) => {
      // toast.error("Something went wrong");
    },
      enabled: false,
    }
  );
  return { data, isLoading };
};

export default useSubscriptionGet;
