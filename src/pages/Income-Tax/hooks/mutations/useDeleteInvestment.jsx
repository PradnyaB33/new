import axios from "axios";
import { useContext } from "react";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";
import { TestContext } from "../../../../State/Function/Main";
import useFunctions from "../../components/useFunctions";
import useGetSalaryByFY from "../queries/useGetSalaryByFY";

const useDeleteInvestment = () => {
  const { getFinancialCurrentYear } = useGetSalaryByFY();
  const user = UserProfile().getCurrentUser();
  const authToken = useAuthToken();
  // const queryClient = useQueryClient();
  const { deleteConfirm } = useFunctions();
  const { handleAlert } = useContext(TestContext);
  const handleDelete = async () => {
    const { start, end } = getFinancialCurrentYear();
    const requestData = {
      empId: user._id,
      financialYear: `${start}-${end}`,
      name: deleteConfirm,
    };

    try {
      await axios.patch(
        `${process.env.REACT_APP_API}/route/tds/deleteInvestment`,
        requestData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", `Declaration deleted successfully`);
      //   queryClient.invalidateQueries({ queryKey: [queryKey] });
    } catch (error) {
      console.log(error);
    }
  };

  return { handleDelete };
};

export default useDeleteInvestment;
