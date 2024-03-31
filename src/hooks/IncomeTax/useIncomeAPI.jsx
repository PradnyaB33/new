import axios from "axios";

const useIncomeAPI = (
  tableData,
  user,
  authToken,
  handleAlert,
  queryClient,
  setEditStatus,
  handleCloseConfirmation,
  editStatus,
  declarationData,
  sectionname
) => {
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
    const newData = [...tableData];
    let tdsfile = declarationData?.proof;
    console.log(`🚀 ~ declarationData:`, declarationData);

    // try {
    //   let uploadproof = "";

    //   if (tdsfile) {
    //     uploadproof = await uploadProof(tdsfile);
    //   }

    //   let requestData = {
    //     empId: user._id,
    //     financialYear: "2023-2024",
    //     requestData: {
    //       name: declarationData.name,
    //       sectionname: sectionname,
    //       status: "Pending",
    //       declaration: declarationData.amount,
    //     },
    //   };

    //   if (uploadProof) {
    //     requestData = {
    //       empId: user._id,
    //       financialYear: "2023-2024",
    //       requestData: {
    //         name: declarationData.name,
    //         sectionname: "Salary",
    //         status: "Pending",
    //         declaration: declarationData.amount,
    //         proof: uploadproof,
    //       },
    //     };
    //   }
    //   await axios.post(
    //     `${process.env.REACT_APP_API}/route/tds/createInvestment/2023-2024`,
    //     requestData,
    //     {
    //       headers: {
    //         Authorization: authToken,
    //       },
    //     }
    //   );

    //   handleAlert(true, "success", `Data uploaded successfully`);
    //   queryClient.invalidateQueries({ queryKey: ["Salary"] });
    // } catch (error) {
    //   console.log(error);
    // }

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
        sectionname: "Salary",
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
      queryClient.invalidateQueries({ queryKey: ["Salary"] });
    } catch (error) {
      console.log(error);
    }

    handleCloseConfirmation();
  };

  return { handleSaveClick, handleDelete };
};

export default useIncomeAPI;
