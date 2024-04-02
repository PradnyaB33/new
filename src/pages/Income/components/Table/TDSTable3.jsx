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
import useOther from "../../../../hooks/IncomeTax/useOther";
import useTDS from "../../../../hooks/IncomeTax/useTDS";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";
import ProofModel from "../ProofModel";

const TDSTable3 = () => {
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const queryClient = useQueryClient();
  const { setTotalHeads } = useOther();
  const { setDeclared } = useTDS();
  console.log(`🚀 ~ file: TDSTable3.jsx:30 ~ setTotalHeads:`, setTotalHeads);

  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const { handleAlert } = useContext(TestContext);
  const [tableData, setTableData] = useState([
    {
      name: "Bank interest (SB account)",
      amount: 0,
      amountAccepted: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "Bank Interest (Term Deposit)",
      amount: 0,
      amountAccepted: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "NSC Interest for the year",
      amount: 0,
      amountAccepted: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "Post office deposit",
      amount: 0,
      amountAccepted: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "Dividend",
      amount: 0,
      amountAccepted: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "Family Pension",
      amount: 0,
      amountAccepted: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "Less : Deduction on Family Pension Income Sec. 57(IIA)",
      amount: 0,
      amountAccepted: 0,
      proof: "",
      status: "Auto",
    },
    {
      name: "Less : Gifts up to Rs. 50,000/- Dec. 56(2)",
      amount: 0,
      amountAccepted: 0,
      proof: "",
      status: "Not Submitted",
    },
  ]);

  const {
    isLoading: incomeHouseLoading,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: ["incomeOther"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/tds/getInvestment/2023-2024/Otherincome`,
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
        const updatedTableData = tableData.map((item) => {
          const matchingItem = res.find(
            (investment) => investment.name === item.name
          );

          if (matchingItem) {
            return {
              ...item,
              amount: matchingItem.declaration,
              status: matchingItem.status,
              proof: matchingItem.proof,
              amountAccepted: matchingItem.amountAccepted,
            };
          } else {
            return item;
          }
        });

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
        // setTotalHeads(res.totalAddition.toFixed(2));
        setTableData(updatedTableData);
      }
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

  const [pdf, setPdf] = useState(null);
  const handleClosePDF = () => {
    setPdf(null);
  };
  const handlePDF = (id) => {
    setPdf(id);
  };
  const handleDownload = (pdf) => {
    // You can use any method to trigger the download, such as creating an invisible link and clicking it
    const link = document.createElement("a");
    link.href = pdf;
    link.download = "File1.pdf";
    link.click();
  };

  console.log(`🚀 ~ handleDownload:`, handleDownload);

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
    const tdsfile = newData[index].proof;

    try {
      let uploadproof = "";

      if (tdsfile) {
        uploadproof = await uploadProof(tdsfile);
      }

      let requestData = {
        empId: user._id,
        financialYear: "2023-2024",
        requestData: {
          name: value.name,
          sectionname: "Otherincome",
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
            sectionname: "Otherincome",
            status: "Pending",
            declaration: value.amount,
            proof: uploadproof,
          },
        };
      }

      if (value.name === "Family Pension") {
        const data = {
          empId: user._id,
          financialYear: "2023-2024",
          requestData: {
            name: "Less : Deduction on Family Pension Income Sec. 57(IIA)",
            sectionname: "Otherincome",
            status: "Auto",
            declaration:
              value.amount <= 15000
                ? Math.round(
                    (requestData.requestData.declaration * 33.33) / 100
                  )
                : 15000,
            proof: "",
          },
        };

        await axios.post(
          `${process.env.REACT_APP_API}/route/tds/createInvestment/2023-2024`,
          data,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        console.log("click it");
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
      queryClient.invalidateQueries({ queryKey: ["incomeOther"] });
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
        sectionname: "Otherincome",
        status: "Not Submitted",
        declaration: 0,
        proof: "",
      },
    };

    try {
      await axios.patch(
        `${process.env.REACT_APP_API}/route/tds/createInvestment/2023-2024`,
        requestData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", `Data deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ["incomeOther"] });
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
      {incomeHouseLoading || isFetching || !isFetched ? (
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
                  Amount Accepted
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
                  <td className="!text-left pl-8 leading-7 text-[16px] w-max border ">
                    {item.name === "Income taxable under the head Other Sources"
                      ? ""
                      : itemIndex + 1}
                  </td>
                  <td className="leading-7 text-[16px] truncate text-left w-[500px] border px-2">
                    <p
                      className={`
                  ${
                    item.name ===
                      "Income taxable under the head Other Sources" &&
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
                            "Income taxable under the head Other Sources" &&
                          "!font-bold text-lg "
                        } 
                        px-2 leading-7 text-[16px]`}
                      >
                        INR {parseFloat(item.amount)}
                      </p>
                    )}
                  </td>
                  <td className=" text-left !p-0 w-[200px] border ">
                    <p
                      className={`
                       
                        px-2 leading-7 text-[16px]`}
                    >
                      INR {item.amountAccepted}
                    </p>
                  </td>

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
                    {item.name ===
                    "Income taxable under the head Other Sources" ? (
                      ""
                    ) : item.status === "Pending" ? (
                      <div className="flex items-center  gap-2">
                        <Pending className="text-yellow-400 " />
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
                      <div className="flex items-center  gap-2">
                        <Error className="text-gray-400 " />
                        <p>{item.status}</p>
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-2  w-[220px]">
                    {item.name ===
                      "Less : Deduction on Family Pension Income Sec. 57(IIA)" ||
                    item.name ===
                      "Income taxable under the head Other Sources" ? (
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

export default TDSTable3;
