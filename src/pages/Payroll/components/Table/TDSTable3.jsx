import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import React, { useState } from "react";

const TDSTable3 = () => {
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
      name: "Less : Gifts up to Rs. 50,000/- Dec. 56(2)",
      amount: 0,
      proof: "",
      status: "Not Submitted",
    },
  ]);

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

  const handleSaveClick = (index) => {
    setEditStatus({ ...editStatus, [index]: null });
  };

  const handleClose = (index) => {
    setEditStatus({ [index]: null });
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="bg-white border-[.5px] border-gray-200">
        {/* <div className=" my-2 p-4">
            <h1 className="text-xl"> {Object.keys(item)[0]}</h1>
          </div> */}
        <table className="min-w-full bg-white  text-left !text-sm font-light">
          <thead className="border-b bg-gray-100 font-bold">
            <tr className="!font-semibold ">
              <th scope="col" className="!text-left pl-8 py-3">
                SR NO
              </th>
              <th scope="col" className="py-3">
                Deduction Name
              </th>

              <th scope="col" className="py-3">
                Declaration
              </th>
              <th scope="col" className="px-6 py-3">
                Proof submitted
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, itemIndex) => (
              <tr className="!font-medium h-20 border-b" key={itemIndex}>
                <td className="!text-left pl-8 ">{itemIndex + 1}</td>
                <td className=" truncate text-left">{item.name}</td>

                <td className=" text-left ">
                  {editStatus[itemIndex] && editStatus[itemIndex] ? (
                    <div className="border-gray-200 w-max  flex border-[.5px]">
                      <h1 className="text-lg bg-gray-300 py-2  h-full px-2">
                        INR
                      </h1>
                      <input
                        type="number"
                        className="border-none py-2  outline-none px-2 "
                        value={item.amount}
                        onChange={(e) => handleAmountChange(e, itemIndex)}
                      />
                    </div>
                  ) : (
                    "INR " + item.amount
                  )}
                </td>
                <td className=" text-left">
                  {editStatus[itemIndex] && editStatus[itemIndex] ? (
                    <input
                      type="file"
                      value={item.proof}
                      onChange={(e) => handleProofChange(e, itemIndex)}
                    />
                  ) : item.proof ? (
                    item.proof
                  ) : (
                    "No proof found"
                  )}
                </td>
                <td className=" text-left">{item.status}</td>
                <td className="whitespace-nowrap px-6 ">
                  {editStatus[itemIndex] && editStatus[itemIndex] ? (
                    <div className="space-x-2">
                      <Button
                        color="primary"
                        aria-label="save"
                        onClick={() => handleSaveClick(itemIndex)}
                      >
                        Save
                      </Button>
                      <Button
                        color="error"
                        aria-label="save"
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
                        onClick={() => handleEditClick(itemIndex)}
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
    </div>
  );
};

export default TDSTable3;
