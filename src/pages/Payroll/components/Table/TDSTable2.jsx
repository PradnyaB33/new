import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import React, { useState } from "react";

const TDSTable2 = () => {
  const [tableData, setTableData] = useState([
    {
      "(A) Self Occupied Property (Loss)": [
        {
          name: "Interest on loan / Borrowing taken for Repairs, renewal, or reconstruction",
          property1: 0,
          property2: 0,
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "Before 1/4/99",
          property1: 0,
          property2: 0,
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "After 1/4/99 & completed after 5 years from the end of FY of borrowing",
          property1: 0,
          property2: 0,
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "After 1/4/99 & completed within 5 years from the end of FY of borrowing",
          property1: 0,
          property2: 0,
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
      ],
    },
    {
      "(B) Let out property (Enter name of Property)": [
        {
          name: "Rent of the property for the year",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "Less : Municipal Taxes paid in the year",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "Less : Standard Deduction",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "Less : Interest on Housing Loan",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
      ],
    },
    {
      "(C) Let out property (Enter name of Property)": [
        {
          name: "Rent of the property for the year",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "Less : Municipal Taxes paid in the year",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "Less : Standard Deduction",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "Less : Interest on Housing Loan",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
      ],
    },
  ]);

  const [editStatus, setEditStatus] = useState({});

  const handleEditClick = (itemIndex, fieldIndex) => {
    setEditStatus({ ...editStatus, [itemIndex]: fieldIndex });
  };

  const handleAmountChange = (e, itemIndex, id) => {
    const newData = [...tableData];
    newData[itemIndex][Object.keys(newData[itemIndex])[0]][id].amount =
      e.target.value;
    setTableData(newData);
  };

  const handleProofChange = (e, itemIndex, id) => {
    const newData = [...tableData];
    newData[itemIndex][Object.keys(newData[itemIndex])[0]][id].proof =
      e.target.files[0];
    setTableData(newData);
  };

  const handleProperty1 = (e, itemIndex, id) => {
    const newData = [...tableData];
    newData[itemIndex][Object.keys(newData[itemIndex])[0]][id].property1 =
      e.target.value;
    setTableData(newData);
  };
  const handleProperty2 = (e, itemIndex, id) => {
    const newData = [...tableData];
    newData[itemIndex][Object.keys(newData[itemIndex])[0]][id].property2 =
      e.target.value;
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
      {tableData.map((item, itemIndex) => (
        <div className="bg-white border-[.5px] border-gray-200" key={itemIndex}>
          <div className=" my-2 p-4">
            <h1 className="text-xl"> {Object.keys(item)[0]}</h1>
          </div>
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
                  property 1
                </th>
                <th scope="col" className="py-3">
                  property 2
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
              {item[Object.keys(item)[0]].map((ele, id) => (
                <tr className="!font-medium h-20 border-b" key={id}>
                  <td className="!text-left pl-8 ">{id + 1}</td>
                  <td className=" truncate text-left">{ele.name}</td>
                  <td className=" text-left">
                    {ele.property1 &&
                    editStatus[itemIndex] === id &&
                    editStatus[itemIndex] === id ? (
                      <div className="border-gray-200 w-max  flex border-[.5px]">
                        <h1 className="text-lg bg-gray-300 py-2  h-full px-2">
                          INR
                        </h1>
                        <input
                          type="number"
                          className="border-none py-2  outline-none px-2 "
                          value={ele.property1}
                          onChange={(e) => handleProperty1(e, itemIndex, id)}
                        />
                      </div>
                    ) : (
                      "INR " + ele.property1
                    )}
                  </td>
                  <td className=" text-left">
                    {ele.property2 &&
                    editStatus[itemIndex] === id &&
                    editStatus[itemIndex] === id ? (
                      <div className="border-gray-200 w-max  flex border-[.5px]">
                        <h1 className="text-lg bg-gray-300 py-2  h-full px-2">
                          INR
                        </h1>
                        <input
                          type="number"
                          className="border-none py-2  outline-none px-2 "
                          value={ele.property2}
                          onChange={(e) => handleProperty2(e, itemIndex, id)}
                        />
                      </div>
                    ) : (
                      "INR " + ele.property2
                    )}
                  </td>
                  <td className=" text-left ">
                    {ele.property1 || ele.property2 ? (
                      ele.property1 + ele.property2
                    ) : editStatus[itemIndex] === id &&
                      editStatus[itemIndex] === id ? (
                      <div className="border-gray-200 w-max  flex border-[.5px]">
                        <h1 className="text-lg bg-gray-300 py-2  h-full px-2">
                          INR
                        </h1>
                        <input
                          type="number"
                          className="border-none py-2  outline-none px-2 "
                          value={ele.amount}
                          onChange={(e) => handleAmountChange(e, itemIndex, id)}
                        />
                      </div>
                    ) : (
                      "INR " + ele.amount
                    )}
                  </td>
                  <td className=" text-left">
                    {editStatus[itemIndex] === id &&
                    editStatus[itemIndex] === id ? (
                      <input
                        type="file"
                        value={ele.proof}
                        onChange={(e) => handleProofChange(e, itemIndex, id)}
                      />
                    ) : ele.proof ? (
                      ele.proof
                    ) : (
                      "No proof found"
                    )}
                  </td>
                  <td className=" text-left">{ele.status}</td>
                  <td className="whitespace-nowrap px-6 ">
                    {editStatus[itemIndex] === id ? (
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
                          onClick={() => handleEditClick(itemIndex, id)}
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton
                          color="error"
                          aria-label="delete"
                          onClick={() => handleEditClick(itemIndex, id)}
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
      ))}
    </div>
  );
};

export default TDSTable2;
