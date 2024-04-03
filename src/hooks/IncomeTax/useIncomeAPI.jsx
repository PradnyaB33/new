import axios from "axios";
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
    editStatus,
    setEditStatus,
    declarationData,
    handleCloseConfirmation,
  } = useIncomeTax();
  // const [declarationData, setDeclarationData] = useState({});
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

  const handleSaveClick = async (index) => {
    let tdsfile = declarationData?.proof;
    console.log(`🚀 ~ declarationData:`, declarationData);

    try {
      let uploadproof = "";

      if (tdsfile) {
        uploadproof = await uploadProof(tdsfile);
      }

      if (declarationData.amount <= 0) {
        handleAlert(true, "error", "Amount cannot be 0");
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
      await axios.post(
        `${process.env.REACT_APP_API}/route/tds/createInvestment/2023-2024`,
        requestData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", `Data uploaded successfully`);
      queryClient.invalidateQueries({ queryKey: [`${queryKey}`] });
    } catch (error) {
      console.log(error);
    }

    setEditStatus({ ...editStatus, [index]: null });
  };

  const handleDelete = async (index) => {
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
        `${process.env.REACT_APP_API}/route/tds/createInvestment/2023-2024`,
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

    handleCloseConfirmation();
  };

  return { handleSaveClick, handleDelete, declarationData };
};

export default useIncomeAPI;
