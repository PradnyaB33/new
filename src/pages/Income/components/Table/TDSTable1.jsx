import {
  Article,
  Cancel,
  CheckCircle,
  DeleteOutlined,
  EditOutlined,
  Error,
  Pending,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../../State/Function/Main";
import useTDS from "../../../../hooks/IncomeTax/useTDS";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";
import ProofModel from "../ProofModel";

const TDSTable1 = () => {
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const queryClient = useQueryClient();
  // const { setTotalHeads } = useOther();
  const { setGrossTotal, grossTotal, setDeclared } = useTDS();

  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [pdf, setPdf] = useState(null);

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };
  const handlePDF = (id) => {
    setPdf(id);
  };

  const handleClosePDF = () => {
    setPdf(null);
  };

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
    {
      name: "Less : Professional Tax",
      amount: 0,
      proof: "",
      status: "Not Submitted",

      amountAccepted: 0,
    },
    // {
    //   name: "Income taxable under the head Salaries",
    //   amount: 0,
    //   proof: "",
    // status: "Not Submitted",

    //
    // amountAccepted: 0,
    // },
  ]);

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
      queryClient.invalidateQueries({ queryKey: ["finacialYearData"] });

      const declaredAmount = res.reduce((i, a) => {
        return (i += a.declaration);
      }, 0);

      const amountPending = res.reduce((i, a) => {
        if (a.status === "Pending") {
          return (i += a.declaration);
        }
        return i;
      }, 0);

      const amountReject = res.reduce((i, a) => {
        if (a.status === "Reject") {
          return (i += a.declaration);
        }
        return i;
      }, 0);

      const amountAccepted = res.reduce((i, a) => {
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

        // if (item.name === "Income taxable under the head Salaries") {
        //   return {
        //     ...item,
        //     amount: deduction,
        //     status: "",
        //     proof: "",
        //   };
        // }

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
    },
  });

  const [editStatus, setEditStatus] = useState({});

  const handleEditClick = (itemIndex) => {
    setEditStatus((prevEditStatus) => ({
      ...prevEditStatus,
      [itemIndex]: !prevEditStatus[itemIndex],
    }));
  };

  const handleAmountChange = (e, itemIndex) => {
    const newData = [...tableData];
    newData[itemIndex].amount = e.target.value;
    setTableData(newData);
  };

  const handleProofChange = (e, itemIndex) => {
    const newData = [...tableData];
    newData[itemIndex].proof = e.target.files[0];
    setTableData(newData);
  };

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

    console.log(data.data);

    await axios.put(data?.data?.url, tdsfile, {
      headers: {
        "Content-Type": tdsfile.type,
      },
    });

    return data?.data?.url?.split("?")[0];
  };

  const handleSaveClick = async (index) => {
    const newData = [...tableData];
    const value = newData[index];
    let tdsfile = newData[index].proof;
    console.log(`🚀 ~ tdsfile:`, tdsfile);

    try {
      let uploadproof = "";

      if (tdsfile) {
        console.log("runs");
        uploadproof = await uploadProof(tdsfile);
      }
      console.log(`🚀 ~ uploadproof:`, uploadproof);

      let requestData = {
        empId: user._id,
        financialYear: "2023-2024",
        requestData: {
          name: value.name,
          sectionname: "Salary",
          status: "Pending",
          declaration: value.amount,
        },
      };

      if (uploadProof) {
        requestData = {
          empId: user._id,
          financialYear: "2023-2024",
          requestData: {
            name: value.name,
            sectionname: "Salary",
            status: "Pending",
            declaration: value.amount,
            proof: uploadproof,
          },
        };
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
      queryClient.invalidateQueries({ queryKey: ["Salary"] });
    } catch (error) {
      console.log(error);
    }

    setEditStatus({ ...editStatus, [index]: null });
  };

  const handleDelete = async (index) => {
    console.log(index);
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

  const handleClose = (index) => {
    const newData = [...tableData];
    newData[index].amount = 0;
    setTableData(newData);
    setEditStatus({
      [index]: null,
    });
  };

  return (
    <div>
      {salaryFetching ? (
        <div className="flex items-center justify-center w-full">
          <CircularProgress />
        </div>
      ) : (
        <div className="bg-white w-full overflow-x-auto">
          <table className=" table-auto border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
            <thead className="border-b bg-gray-100 font-bold">
              <tr className="!font-semibold ">
                <th
                  scope="col"
                  className="!text-left px-2 w-max py-3 leading-7 text-[16px] border"
                >
                  Sr. No
                </th>
                <th
                  scope="col"
                  className="py-3 leading-7 text-[16px] px-2 border"
                >
                  Deduction Name
                </th>

                <th
                  scope="col"
                  className="py-3 leading-7 text-[16px] px-2 border"
                >
                  Declaration
                </th>
                <th
                  scope="col"
                  className="py-3 leading-7 text-[16px] px-2 border"
                >
                  Approved Amount
                </th>
                <th
                  scope="col"
                  className=" py-3 leading-7 text-[16px] px-2 border"
                >
                  Proof submitted
                </th>
                <th
                  scope="col"
                  className=" py-3 leading-7 text-[16px] px-2 border"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className=" py-3 leading-7 text-[16px] px-2 border"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, itemIndex) => (
                <tr
                  className={`!font-medium w-[70px] h-14 border-b 
                
                `}
                  key={itemIndex}
                >
                  <td className="!text-left  px-2 leading-7 text-[16px] w-[70px] border ">
                    {item.name === "Income taxable under the head Salaries"
                      ? ""
                      : itemIndex + 1}
                  </td>
                  <td className="leading-7 text-[16px] truncate text-left w-[500px] border px-2">
                    <p
                      className={`
                  ${
                    item.name === "Income taxable under the head Salaries" &&
                    "!font-bold text-lg"
                  } 
                 `}
                    >
                      {item.name}
                    </p>
                  </td>

                  <td className=" text-left !p-0 !w-[250px] border ">
                    {editStatus[itemIndex] && editStatus[itemIndex] ? (
                      <div className="flex gap-2 w-full !py-0 h-full ">
                        <h1 className="text-lg h-full !py-0 text-center w-[30%] bg-gray-200 border justify-center   flex items-center ">
                          INR
                        </h1>
                        <input
                          type="number"
                          className="border-none w-[70%]   outline-none"
                          value={parseFloat(item.amount)}
                          onChange={(e) => handleAmountChange(e, itemIndex)}
                        />
                      </div>
                    ) : (
                      <p
                        className={`
                        ${
                          item.name ===
                            "Income taxable under the head Salaries" &&
                          "!font-bold text-lg w-full"
                        } 
                        px-2 md:w-full w-max leading-7 text-[16px]`}
                      >
                        INR {parseFloat(item.amount).toFixed(2)}
                      </p>
                    )}
                  </td>
                  {item.name !== "Gross Salary" ? (
                    <td className=" text-left !p-0 w-[200px] border ">
                      <p
                        className={`
                        ${
                          item.name ===
                            "Income taxable under the head Salaries" &&
                          "!font-bold text-lg "
                        } 
                        px-2 leading-7 text-[16px]`}
                      >
                        INR{" "}
                        {item.amountAccepted
                          ? parseFloat(item.amountAccepted).toFixed(2)
                          : 0}
                      </p>
                    </td>
                  ) : (
                    <td className=" text-left !p-0 w-[200px] ">
                      <p
                        className={`
                        ${
                          item.name ===
                            "Income taxable under the head Salaries" &&
                          "!font-bold text-lg "
                        } 
                        px-2 leading-7 text-[16px]  md:w-full w-max`}
                      >
                        Auto Accepted
                      </p>
                    </td>
                  )}
                  <td className="text-left leading-7 text-[16px] w-[200px]  border">
                    {item.name === "Gross Salary" ? (
                      ""
                    ) : editStatus[itemIndex] && editStatus[itemIndex] ? (
                      <div className="px-2  md:w-full w-max">
                        <label className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                          Upload File
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleProofChange(e, itemIndex)}
                          />
                        </label>
                      </div>
                    ) : item.proof ? (
                      typeof item.proof === "string" && (
                        <div
                          onClick={() => handlePDF(item.proof)}
                          className="px-2 flex gap-2 items-center h-max w-max  cursor-pointer"
                        >
                          <Article className="text-blue-500" />
                          <h1>View Proof</h1>
                        </div>
                      )
                    ) : (
                      <p className="px-2  md:w-full w-max">No proof found</p>
                    )}
                  </td>

                  <td className=" text-left  leading-7 text-[16px] w-[200px]  border px-2">
                    {item.name === "Income taxable under the head Salaries" ? (
                      ""
                    ) : item.status === "Pending" ? (
                      <div className="flex items-center  md:w-full w-max  gap-2">
                        <Pending className="text-yellow-400 " />
                        {item.status}
                      </div>
                    ) : item.status === "Auto" || item.status === "Approved" ? (
                      <div className="flex items-center  md:w-full w-max  gap-2">
                        <CheckCircle className="text-green-400 " />
                        {item.status}
                      </div>
                    ) : item.status === "Reject" ? (
                      <div className="flex items-center  md:w-full w-max  gap-2">
                        <Cancel className="text-red-400 " />
                        {item.status}
                      </div>
                    ) : (
                      <div className="flex items-center  md:w-full w-max gap-2">
                        <Error className="text-gray-400 " />
                        <p>{item.status}</p>
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-2  w-[220px]">
                    {item.name ===
                      "Less : Deduction on Family Pension Income Sec. 57(IIA)" ||
                    item.name === "Income taxable under the head Salaries" ||
                    item.status === "Auto" ||
                    item.status === "Approved" ? (
                      ""
                    ) : editStatus[itemIndex] && editStatus[itemIndex] ? (
                      <div className="space-x-2">
                        <Button
                          color="primary"
                          aria-label="save"
                          size="small"
                          onClick={() => handleSaveClick(itemIndex)}
                        >
                          Save
                        </Button>
                        <Button
                          color="error"
                          aria-label="save"
                          size="small"
                          onClick={() => handleClose(itemIndex)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <IconButton
                          color="primary"
                          aria-label="edit"
                          onClick={() => handleEditClick(itemIndex)}
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton
                          color="error"
                          aria-label="delete"
                          onClick={() => handleDeleteConfirmation(itemIndex)}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProofModel pdf={pdf} handleClosePDF={handleClosePDF} />

      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this salary template, as this
            action cannot be undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmation}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDelete(deleteConfirmation)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TDSTable1;
