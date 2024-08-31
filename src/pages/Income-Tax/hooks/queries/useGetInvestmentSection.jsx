import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../../../../hooks/Token/useAuth";

const useGetInvestmentSection = (search, page) => {
  const authToken = useAuthToken();
  const getInvestmentSection = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/route/tds/getInvestment?search=${search}&page=${page}`,
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
  const { data: investments, isFetching } = useQuery({
    queryKey: ["getInvestments", search, page],
    queryFn: getInvestmentSection,
  });

  return { investments, isFetching };
};

export default useGetInvestmentSection;
