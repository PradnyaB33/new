import {
  CheckCircle,
  DeleteOutlined,
  EditOutlined,
  Error,
} from "@mui/icons-material";
import { Button, CircularProgress, IconButton } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../../State/Function/Main";
import useOther from "../../../../hooks/IncomeTax/useOther";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";

const TDSTable3 = () => {
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const queryClient = useQueryClient();
  const { setTotalHeads } = useOther();

  const { handleAlert } = useContext(TestContext);
  const [tableData, setTableData] = useState([
    {
      name: "Bank interest (SB account)",
      amount: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "Bank Interest (Term Deposit)",
      amount: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "NSC Interest for the year",
      amount: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "Post office deposit",
      amount: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "Dividend",
      amount: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "Family Pension",
      amount: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "Less : Deduction on Family Pension Income Sec. 57(IIA)",
      amount: 0,
      proof: "-",
      status: "Auto",
    },
    {
      name: "Less : Gifts up to Rs. 50,000/- Dec. 56(2)",
      amount: 0,
      proof: "",
      status: "Not Submitted",
    },
    {
      name: "Income taxable under the head Other Sources",
      amount: 0,
      proof: "",
      status: "",
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
          `${process.env.REACT_APP_API}/route/tds/OtherIncome/2023-2024`,
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
      const updatedTableData = tableData.map((item) => {
        const matchingItem = res.incomeFromOther.investmentType.find(
          (investment) => investment.name === item.name
        );

        if (item.name === "Income taxable under the head Other Sources") {
          return {
            ...item,
            amount: res.totalAddition,
            status: "",
            proof: "",
          };
        }
        if (matchingItem) {
          return {
            ...item,
            amount: matchingItem.declaration,
            status: matchingItem.status,
            proof: matchingItem.proof,
          };
        } else {
          return item;
        }
      });

      setTotalHeads(res.totalAddition);
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
    if (e.target.value > 0) {
      newData[itemIndex].amount = e.target.value;
      setTableData(newData);
    }
  };

  const handleProofChange = (e, itemIndex) => {
    const newData = [...tableData];
    newData[itemIndex].proof = e.target.files[0];
    setTableData(newData);
  };

  const handleSaveClick = async (index) => {
    const newData = [...tableData];
    const value = newData[index];
    const requestData = {
      empId: user._id,
      financialYear: "2023-2024",
      name: value.name,
      requestData: {
        status: "Pending",
        declaration: value.amount,
        proof: "",
      },
    };
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/route/tds/OtherIncome`,
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

  const handleDelete = async (index, id) => {
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
      queryClient.invalidateQueries({ queryKey: ["incomeOther"] });
    } catch (error) {
      console.log(error);
    }
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
    <div className="mt-2 space-y-2">
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
                  SR NO
                </th>
                <th scope="col" className="py-3 px-2 border">
                  Deduction Name
                </th>

                <th scope="col" className="py-3 px-2 border">
                  Declaration
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
                  <td className="!text-left pl-8  w-max border ">
                    {item.name === "Income taxable under the head Other Sources"
                      ? ""
                      : itemIndex + 1}
                  </td>
                  <td
                    className={`
                  ${
                    item.name ===
                      "Income taxable under the head Other Sources" &&
                    "!text-bold"
                  } 
                  truncate text-left border px-2`}
                  >
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
                        <h1 className="text-lg bg-gray-300 border h-auto px-4  flex items-center ">
                          INR
                        </h1>
                        <input
                          type="number"
                          className="border-none w-[90px] h-auto outline-none  "
                          value={item.amount}
                          onChange={(e) => handleAmountChange(e, itemIndex)}
                        />
                      </div>
                    ) : (
                      <p
                        className={`
                        ${
                          item.name ===
                            "Income taxable under the head Other Sources" &&
                          "!font-bold text-lg"
                        } 
                        px-2`}
                      >
                        INR {item.amount.toFixed(2)}
                      </p>
                    )}
                  </td>
                  <td className="text-left  w-[200px]  border">
                    {item.name ===
                    "Income taxable under the head Other Sources" ? (
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
                      item.proof
                    ) : (
                      <p className="px-2">No proof found</p>
                    )}
                  </td>

                  <td className=" text-left border px-2">
                    {item.name ===
                    "Income taxable under the head Other Sources" ? (
                      ""
                    ) : item.status === "Pending" ? (
                      <div className="flex items-center  gap-2">
                        <Error className="text-yellow-400 " />
                        {item.status}
                      </div>
                    ) : item.status === "Auto" ? (
                      <div className="flex items-center  gap-2">
                        <CheckCircle className="text-green-400 " />
                        {item.status}
                      </div>
                    ) : (
                      <p>{item.status}</p>
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
                          onClick={() => handleDelete(itemIndex)}
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
    </div>
  );
};

export default TDSTable3;
