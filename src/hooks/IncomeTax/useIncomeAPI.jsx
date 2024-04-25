import axios from "axios";
import { useEffect } from "react";
import { useMutation } from "react-query";
import useIncomeTax from "./useIncomeTax";

const useIncomeAPI = (
  tableData,
  user,
  authToken,
  handleAlert,
  queryClient,
  sectionname,
  queryKey,
  subsectionname
) => {
  const {
    setEditStatus,
    declarationData,
    handleCloseConfirmation,
    isLoading,
    setIsLoading,
  } = useIncomeTax();

  useEffect(() => {
    if (isLoading) {
      // The state has been updated to true, perform your side effects here
      console.log("isLoading is now true", isLoading);
    }
  }, [isLoading]); // This effect runs whenever isLoading changes
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
        "Content-Type": tdsfile.type,
      },
    });

    return data?.data?.url?.split("?")[0];
  };

  const mutation = useMutation(
    (requestData) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/tds/createInvestment`,
        requestData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: (data) => {
        console.log(`🚀 ~ data:`, data);
        handleAlert(true, "success", `Data uploaded successfully`);
        queryClient.invalidateQueries({ queryKey: [`${queryKey}`] });
      },
      onError: (error) => {
        console.log(error);
        // setEditStatus({ ...editStatus, [index]: null });
      },
      onSettled: (data, error, variables, context) => {
        setEditStatus((prevEditStatus) => ({
          ...prevEditStatus,
          [context.index]: null,
        }));
        console.log("Setting isLoading to true");
        setIsLoading(false);
      },
    }
  );

  const handleSaveClick = async (index) => {
    console.log("Setting isLoading to true");
    setIsLoading(true);

    let tdsfile = declarationData?.proof;
    let uploadproof = "";

    if (tdsfile) {
      uploadproof = await uploadProof(tdsfile);
    }

    if (declarationData?.amount <= 0) {
      handleAlert(true, "error", "Amount cannot be zero");
      setIsLoading(false);
      return false;
    }

    let requestData = {
      empId: user._id,
      financialYear: "2023-2024",
      requestData: {
        name: declarationData.name,
        sectionname: sectionname,
        status: "Pending",
        declaration: declarationData.amount,
      },
    };

    if (uploadProof) {
      requestData = {
        empId: user._id,
        financialYear: "2023-2024",
        requestData: {
          name: declarationData.name,
          sectionname: sectionname,
          status: "Pending",
          declaration: declarationData.amount,
          proof: uploadproof,
        },
      };
    }

    if (subsectionname) {
      requestData.requestData.subsectionname = subsectionname;
    }

    mutation.mutate(requestData, { context: { index } });
  };

  const handleDelete = async (index) => {
    handleCloseConfirmation();
    setIsLoading(true);
    const newData = [...tableData];
    const value = newData[index];
    const requestData = {
      empId: user._id,
      financialYear: "2023-2024",
      requestData: {
        name: value.name,
        sectionname,
        subsectionname,
        status: "Not Submitted",
        declaration: 0,
        proof: "",
      },
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_API}/route/tds/createInvestment`,
        requestData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", `Data deleted successfully`);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      console.log(`🚀 ~ queryKey:`, `${queryKey}`);
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return {
    handleSaveClick,
    handleDelete,
    declarationData,
    isLoading,
    mutation,
  };
};

export default useIncomeAPI;
