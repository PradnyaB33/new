import axios from "axios";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../../../State/Function/Main";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";
import useGetSalaryByFY from "../queries/useGetSalaryByFY";
import useFunctions from "../useFunctions";

const useCreateDeclaration = () => {
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const empId = UserProfile().getCurrentUser();
  const authToken = useAuthToken();
  const { usersalary, getFinancialCurrentYear } = useGetSalaryByFY();
  const { setEditOpen, setOpen } = useFunctions();

  const uploadProof = async (tdsfile) => {
    const data = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/TDS`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    );

    await axios.put(data?.data?.url, tdsfile, {
      headers: {
        "Content-Type": tdsfile?.type,
      },
    });

    return data?.data?.url?.split("?")[0];
  };

  const createDeclarationMutation = useMutation(
    async (data) => {
      const { start, end } = getFinancialCurrentYear();

      let uploadproof;
      if (data?.proof) {
        uploadproof = await uploadProof(data?.proof);
      }
      let updatedData;

      if (data?.proof === null || data?.proof === undefined) {
        updatedData = {
          empId: empId._id,
          financialYear: `${start}-${end}`,
          usersalary: usersalary?.TotalInvestInvestment,
          requestData: {
            ...data,
            name: data.name.value,
            proof: "",
            sectionname: data.sectionname.value,
            subsectionname: data.subsectionname.value ?? "",
          },
        };
      } else {
        updatedData = {
          empId: empId._id,
          financialYear: `${start}-${end}`,
          usersalary: usersalary?.TotalInvestInvestment,
          requestData: {
            ...data,
            name: data.name.value,
            proof: uploadproof,
            sectionname: data.sectionname.value,
          },
        };
      }

      axios.post(
        `${process.env.REACT_APP_API}/route/tds/createInvestment`,
        updatedData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: (data) => {
        handleAlert(true, "success", `Declaration submitted successfully`);
        setEditOpen(null);
        queryClient.invalidateQueries({ queryKey: [`getInvestments`] });
        setOpen(false);
      },
      onError: (error) => {
        console.log(error);
        handleAlert(
          true,
          "error",
          error?.response?.data?.error || "Something went wrong"
        );
      },
    }
  );

  return { createDeclarationMutation };
};

export default useCreateDeclaration;