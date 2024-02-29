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

  const handleSaveClick = (index) => {
    setEditStatus({ ...editStatus, [index]: null });
  };

  const handleClose = (index) => {
    setEditStatus({ [index]: null });
  };

  return (
    <div className="mt-2 space-y-2">
      {tableData.map((item, itemIndex) => (
        <div className="bg-white " key={itemIndex}>
          <div className="border-[.25px] border-b-0 border-gray-300  p-4">
            <h1 className="text-xl"> {Object.keys(item)[0]}</h1>
          </div>
          <table className="table-auto border border-collapse min-w-full bg-white  text-left   !text-sm font-light">
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
                <th scope="col" className="px-2 py-3 border">
                  Proof submitted
                </th>
                <th scope="col" className="px-2 py-3 border">
                  Status
                </th>
                <th scope="col" className="px-2 py-3 border">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {item[Object.keys(item)[0]].map((ele, id) => (
                <tr className="!font-medium h-14 border-b" key={id}>
                  <td className="!text-left pl-8 border w-[100px]">{id + 1}</td>
                  <td className=" truncate text-left w-[500px] border px-2">
                    {ele.name}
                  </td>

                  <td className=" text-left  !p-0 w-[200px] border ">
                    {editStatus[itemIndex] === id &&
                    editStatus[itemIndex] === id ? (
                      <div className="flex gap-2 ">
                        <h1 className="text-lg bg-gray-300 border h-14 px-4 flex items-center ">
                          INR
                        </h1>
                        <input
                          type="number"
                          className="border-none w-max  h-14 outline-none"
                          value={ele.amount}
                          onChange={(e) => handleAmountChange(e, itemIndex, id)}
                        />
                      </div>
                    ) : (
                      <h1 className="px-2">INR {ele.amount}</h1>
                    )}
                  </td>
                  <td className="text-left  w-[200px]  border">
                    {editStatus[itemIndex] === id &&
                    editStatus[itemIndex] === id ? (
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
                  <td className=" text-left border px-2 w-[200px]">
                    {ele.status}
                  </td>
                  <td className="whitespace-nowrap px-2  w-[220px]">
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
