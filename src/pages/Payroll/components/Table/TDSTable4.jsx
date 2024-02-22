import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import React, { useState } from "react";

const TDSTable4 = () => {
  const [tableData, setTableData] = useState([
    {
      "Section 80 C": [
        {
          name: "Life insurance",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "Provident Fund",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "Public Provident Fund",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "NSC investment + Accrued interest",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "Housing loan principal repayment",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "Sukanya Samriddhi Account",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "Tuition fees for 2 children",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "Tax Saving Fixed deposit in Bank (5 years)",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "Tax Saving Bonds",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "E.L.S.S (Tax Saving Mutual Fund)",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
      ],
    },
    {
      "Section 80 CCC": [
        {
          name: "Pension Plan from Insurance Companies/Mutual Funds (u/s 80CCC)",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
      ],
    },
    {
      "Section 80 CCD": [
        {
          name: "Contribution to NPS notified by the Central Government",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
      ],
    },
    {
      "Section 80 CCH": [
        {
          name: "All contributions to Agniveer Corpus Fund",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
      ],
    },
    {
      "Less: Additional Deduction under Sec 80CCD NPS (Max. ₹ 50,000/-)": [
        {
          name: "80D - Mediclaim Insurance (Self & dependent)",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "80D - Mediclaim Insurance (Parents)",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "80E - Interest on education loan",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "80EE - Interest on Home Loan as per conditions mentioned therein",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "80DD - Medical Treatment of handicapped Dependent",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "80DDB - 80DDB Expenditure on Selected Medical Treatment",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "80G, 80GGA, 80GGC Donation to approved funds",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "80GG For Rent to an Individual, not receiving HRA (File Form 10BA)",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "80TTA - SB interest received by Normal Citizen",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "80TTB - Interest on SB Act. & deposits received by Sr. & very Sr. Citizen",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "80U - Physically Disable Assess",
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

                  <td className=" text-left ">
                    {editStatus[itemIndex] === id &&
                    editStatus[itemIndex] === id ? (
                      <div className="border-gray-200 w-max flex border-[.5px]">
                        <h1 className="text-lg bg-gray-300 py-2  h-full px-2">
                          INR
                        </h1>
                        <input
                          type="number"
                          className="border-none py-2   outline-none px-2 "
                          value={ele.amount}
                          onChange={(e) => handleAmountChange(e, itemIndex, id)}
                        />
                      </div>
                    ) : (
                      <h1 className="">INR {ele.amount}</h1>
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

export default TDSTable4;
