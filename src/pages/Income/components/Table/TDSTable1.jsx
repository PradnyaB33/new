import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../../State/Function/Main";
import useIncomeAPI from "../../../../hooks/IncomeTax/useIncomeAPI";
import useTDS from "../../../../hooks/IncomeTax/useTDS";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";
import DeclarationTable from "../DeclarationTable";
import DeleteModel from "../DeleteModel";
import ProofModel from "../ProofModel";

const TDSTable1 = () => {
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  const [tableData, setTableData] = useState([
    {
      name: "Gross Salary",
      amount: 0,
      proof: "Auto",
      status: "Auto",
    },
    {
      name: "Exemption on gratuity",
      amount: 0,
      proof: "",
      amountAccepted: 0,
      status: "Not Submitted",
    },
    {
      name: "Exemption on Leave encashment",

      amountAccepted: 0,
      amount: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "Exemption on voluntary retirement",
      amount: 0,
      proof: "",
      status: "Not Submitted",

      amountAccepted: 0,
    },
    {
      name: "Daily Allowance",
      amount: 0,
      proof: "",
      status: "Not Submitted",

      amountAccepted: 0,
    },
    {
      name: "Conveyance Allowance",
      amount: 0,
      proof: "",
      status: "Not Submitted",

      amountAccepted: 0,
    },
    {
      name: "Transport Allowance for a specially-abled person",
      amount: 0,
      proof: "",
      status: "Not Submitted",

      amountAccepted: 0,
    },
    {
      name: "Perquisites for official purposes",
      amount: 0,
      proof: "",
      status: "Not Submitted",

      amountAccepted: 0,
    },
    {
      name: "Taxable Salary",
      amount: 0,
      proof: "",
      status: "Not Submitted",

      amountAccepted: 0,
    },
    // {
    //   name: "Less : Professional Tax",
    //   amount: 0,
    //   proof: "",
    //   status: "Not Submitted",

    //   amountAccepted: 0,
    // },
    // {
    //   name: "Income taxable under the head Salaries",
    //   amount: 0,
    //   proof: "",
    // status: "Not Submitted",

    //
    // amountAccepted: 0,
    // },
  ]);
  const [editStatus, setEditStatus] = useState({});
  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const { setGrossTotal, grossTotal, setDeclared } = useTDS();
  const { handleSaveClick, handleDelete, setDeclarationData, declarationData } =
    useIncomeAPI(
      tableData,
      user,
      authToken,
      handleAlert,
      queryClient,
      setEditStatus,
      handleCloseConfirmation
    );

  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [pdf, setPdf] = useState(null);

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handlePDF = (id) => {
    setPdf(id);
  };

  const handleClosePDF = () => {
    setPdf(null);
  };

  const {
    // isFetched: salaryFetch,
    isFetching: salaryFetching,
  } = useQuery({
    queryKey: ["finacialYearData"],
    queryFn: async () => {
      try {
        const salaryData = await axios.get(
          `${process.env.REACT_APP_API}/route/employeeSalary/getEmployeeSalaryPerFinancialYear?fromDate=5-2023&toDate=3-2024`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return salaryData.data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (res) => {
      console.log(res);

      setGrossTotal(res?.TotalInvestInvestment);
    },
  });

  useQuery({
    queryKey: ["Salary"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/tds/getInvestment/2023-2024/Salary`,
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
    },
    onSuccess: (res) => {
      if (Array.isArray(res)) {
        queryClient.invalidateQueries({ queryKey: ["finacialYearData"] });

        const declaredAmount = res?.reduce((i, a) => {
          return (i += a.declaration);
        }, 0);

        const amountPending = res?.reduce((i, a) => {
          if (a.status === "Pending") {
            return (i += a.declaration);
          }
          return i;
        }, 0);

        const amountReject = res?.reduce((i, a) => {
          if (a.status === "Reject") {
            return (i += a.declaration);
          }
          return i;
        }, 0);

        const amountAccepted = res?.reduce((i, a) => {
          return (i += a.amountAccepted);
        }, 0);

        let data = {
          declared: declaredAmount,
          pending: amountPending,
          accepted: amountAccepted,
          rejected: amountReject,
        };
        setDeclared(data);
        const updatedTableData = tableData?.map((item) => {
          const matchingItem = res?.find(
            (investment) => investment.name === item.name
          );

          if (item.name === "Gross Salary") {
            return {
              ...item,
              amount: isNaN(Number(grossTotal)) ? 0 : Number(grossTotal),
              status: "Auto",
              proof: "",
            };
          }
          if (matchingItem) {
            return {
              ...item,
              amount: matchingItem.declaration,
              amountAccepted: matchingItem.amountAccepted,
              status: matchingItem.status,
              proof: matchingItem.proof,
            };
          } else {
            return item;
          }
        });

        // setTotalHeads(res.totalAddition);
        setTableData(updatedTableData);
      }
    },
  });

  const handleEditClick = (itemIndex) => {
    setEditStatus((prevEditStatus) => ({
      ...prevEditStatus,
      [itemIndex]: !prevEditStatus[itemIndex],
    }));
  };

  const handleAmountChange = (e, itemIndex) => {
    const newData = [...tableData];

    setDeclarationData({
      ...newData[itemIndex],
      amount: e.target.value,
    });
  };

  const handleProofChange = (e, itemIndex) => {
    const file = e.target.files[0];

    if (file.type !== "application/pdf") {
      handleAlert(true, "error", "Uploaded file is not a PDF");
      return;
    }
    const newData = [...tableData];
    setDeclarationData({
      ...newData[itemIndex],
      proof: file,
    });
  };

  const handleClose = (index) => {
    setEditStatus({
      [index]: null,
    });
  };

  return (
    <div>
      <DeclarationTable
        tableData={tableData}
        // isLoading={salaryFetching}
        handleAmountChange={handleAmountChange}
        handleProofChange={handleProofChange}
        handleSaveClick={handleSaveClick}
        handleClose={handleClose}
        handleEditClick={handleEditClick}
        handleDeleteConfirmation={handleDeleteConfirmation}
        handlePDF={handlePDF}
        editStatus={editStatus}
        declarationData={declarationData}
        setDeclarationData={setDeclarationData}
        salaryFetching={salaryFetching}
      />
      <ProofModel pdf={pdf} handleClosePDF={handleClosePDF} />
      <DeleteModel
        deleteConfirmation={deleteConfirmation}
        handleCloseConfirmation={handleCloseConfirmation}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default TDSTable1;
