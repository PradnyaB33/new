import {
  Article,
  Cancel,
  CheckCircle,
  DeleteOutlined,
  EditOutlined,
  Error,
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
import useOther from "../../../../hooks/IncomeTax/useOther";
import useTDS from "../../../../hooks/IncomeTax/useTDS";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";

const TDSTable1 = () => {
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const queryClient = useQueryClient();
  const { setTotalHeads } = useOther();
  console.log(`🚀 ~ file: TDSTable1.jsx:33 ~ setTotalHeads:`, setTotalHeads);
  const { setGrossTotal, grossTotal } = useTDS();

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
      proof: "",
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
      proof: "-",
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
      status: "",

      amountAccepted: 0,
    },
    {
      name: "Less : Professional Tax",
      amount: 0,
      proof: "",
      status: "",
      amountAccepted: 0,
    },
    // {
    //   name: "Income taxable under the head Salaries",
    //   amount: 0,
    //   proof: "",
    //   status: "",
    //
    // amountAccepted: 0,
    // },
  ]);

  let deduction = 0;

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
      let data = res.reduce((total, item) => {
        return total + parseFloat(item.totalGrossSalary);
      }, 0);

      setGrossTotal(data);
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
      // deduction = grossTotal - res.totalDeductions;
      console.log(res);
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
            amount: grossTotal,
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

  const handleDownload = (pdf) => {
    // You can use any method to trigger the download, such as creating an invisible link and clicking it
    const link = document.createElement("a");
    link.href = pdf;
    link.download = "File1.pdf";
    link.click();
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
    const tdsfile = newData[index].proof;

    try {
      const uploadproof = await uploadProof(tdsfile);

      const requestData = {
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
      await axios.post(
        `${process.env.REACT_APP_API}/route/tds/createInvestment/2023-2024`,
        requestData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      console.log(uploadproof);

      handleAlert(true, "success", `Data uploaded successfully`);
      queryClient.invalidateQueries({ queryKey: ["salary"] });
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
      investmentTypeName: value.name,
      requestData: {
        status: "Pending",
        declaration: 0,
        proof: "",
      },
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_API}/route/tds/deleteOtherIncome`,
        requestData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", `Data deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ["incomeSalary"] });
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
    <div className="">
      {salaryFetching ? (
        <div className="flex items-center justify-center w-full">
          <CircularProgress />
        </div>
      ) : (
        <div className="bg-white ">
          <table className="table-auto border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
            <thead className="border-b bg-gray-100 font-bold">
              <tr className="!font-semibold ">
                <th scope="col" className="!text-left pl-8 w-max py-3 border">
                  Sr. No
                </th>
                <th scope="col" className="py-3 px-2 border">
                  Deduction Name
                </th>

                <th scope="col" className="py-3 px-2 border">
                  Declaration
                </th>
                <th scope="col" className="py-3 px-2 border">
                  Approved Amount
                </th>
                <th scope="col" className=" py-3 px-2 border">
                  Proof submitted
                </th>
                <th scope="col" className=" py-3 px-2 border">
                  Status
                </th>
                <th scope="col" className=" py-3 px-2 border">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, itemIndex) => (
                <tr
                  className={`!font-medium h-14 border-b 
                
                `}
                  key={itemIndex}
                >
                  <td className="!text-left pl-8 leading-7 text-[16px] w-[100px] border ">
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

                  <td className=" text-left !p-0 w-[200px] border ">
                    {editStatus[itemIndex] && editStatus[itemIndex] ? (
                      <div className="flex gap-2 h-14">
                        <h1 className="leading-7 text-[16px] bg-gray-300 border h-auto px-4  flex items-center ">
                          INR
                        </h1>
                        <input
                          type="number"
                          className="border-none w-[90px] h-auto outline-none  "
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
                          "!font-bold text-lg "
                        } 
                        px-2 leading-7 text-[16px]`}
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
                        px-2 leading-7 text-[16px]`}
                      >
                        Auto Accepted
                      </p>
                    </td>
                  )}
                  <td className="text-left leading-7 text-[16px] w-[200px]  border">
                    {item.name === "Income taxable under the head Salaries" ? (
                      ""
                    ) : editStatus[itemIndex] && editStatus[itemIndex] ? (
                      <div className="px-2">
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
                      <p className="px-2">No proof found</p>
                    )}
                  </td>

                  <td className=" text-left  leading-7 text-[16px] w-[200px]  border px-2">
                    {item.name === "Income taxable under the head Salaries" ? (
                      ""
                    ) : item.status === "Pending" ? (
                      <div className="flex items-center  gap-2">
                        <Error className="text-yellow-400 " />
                        {item.status}
                      </div>
                    ) : item.status === "Auto" || item.status === "Approved" ? (
                      <div className="flex items-center  gap-2">
                        <CheckCircle className="text-green-400 " />
                        {item.status}
                      </div>
                    ) : item.status === "Reject" ? (
                      <div className="flex items-center  gap-2">
                        <Cancel className="text-red-400 " />
                        {item.status}
                      </div>
                    ) : (
                      <p>{item.status}</p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-2  w-[220px]">
                    {item.name ===
                      "Less : Deduction on Family Pension Income Sec. 57(IIA)" ||
                    item.name === "Income taxable under the head Salaries" ||
                    item.status === "Auto" ? (
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

      <Dialog open={pdf !== null} onClose={handleClosePDF}>
        <DialogTitle>Document</DialogTitle>
        <DialogContent>
          <div className="scrollt ">
            <object
              type="application/pdf"
              data={`${pdf}`}
              alt="none"
              aria-label="pdfSalary"
              className="min-h-[60vh] !w-[400px] "
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => handleDownload(pdf)}>
            Download
          </Button>
        </DialogActions>
      </Dialog>

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
