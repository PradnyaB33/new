import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../../../../hooks/Token/useAuth";

const useGetInvestmentSection = (search) => {
  const authToken = useAuthToken();
  const getInvestmentSection = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/route/tds/getInvestment?search=${search}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  const { data: investments } = useQuery({
    queryKey: ["getInvestments", search],
    queryFn: getInvestmentSection,
  });

  return { investments };
};

export default useGetInvestmentSection;
