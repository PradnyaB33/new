import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { Button, IconButton, Pagination, Stack } from "@mui/material";
import React, { useState } from "react";

const TDSTable4Tab1 = () => {
  const rowsPerPage = 10; // Define the number of rows per page
  const [tableData, setTableData] = useState([
    {
      Section: [
        {
          section: "80 C",
          name: "Life insurance",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 C",
          name: "Provident Fund",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 C",
          name: "Public Provident Fund",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 C",
          name: "NSC investment + Accrued interest",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 C",
          name: "Housing loan principal repayment",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 C",
          name: "Sukanya Samriddhi Account",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 C",
          name: "Tuition fees for 2 children",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 C",
          name: "Tax Saving Fixed deposit in Bank (5 years)",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 C",
          name: "Tax Saving Bonds",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 C",
          name: "E.L.S.S (Tax Saving Mutual Fund)",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 CCC",
          name: "Pension Plan from Insurance Companies/Mutual Funds (u/s 80CCC)",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 CCD",
          name: "Contribution to NPS notified by the Central Government",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 CCH",
          name: "All contributions to Agniveer Corpus Fund",
          amount: 0,
          proof: "",
          status: "Not Submitted",
        },
      ],
    },
  ]);

  const [page, setPage] = useState(1);
  const totalRowCount = tableData.reduce(
    (acc, curr) => acc + curr.Section.length,
    0
  );

  const pages = Math.ceil(totalRowCount / rowsPerPage);
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
    <div className=" bg-white ">
      {/* <div
        className={`outline-none border-gray-300 border-x-[.5px] flex items-center px-4   border-y-0 bg-white `}
      >
        <div className="flex border-gray-300 h-full border-r-[.5px] items-center w-[20%]">
          <input
            type={"text"}
            name="search"
            placeholder={"Section"}
            className={` placeholder:text-lg border-none bg-white w-full py-3 outline-none px-2  `}
          />
        </div>
        <div className="flex px-2 items-center w-[80%]">
          <Search className="text-gray-700 md:text-lg " />
          <input
            type={"text"}
            name="search"
            placeholder={"Search"}
            className={` placeholder:text-lg border-none bg-white w-full py-2 outline-none px-2  `}
          />
        </div>
      </div> */}
      {tableData.map((item, itemIndex) => (
        <div className="bg-white" key={itemIndex}>
          {Object.keys(item)[0] !== "Section" && (
            <div className="border-[.25px] border-b-0 border-gray-300  p-4">
              <h1 className="text-xl"> {Object.keys(item)[0]}</h1>
            </div>
          )}
          <table className="table-auto border border-collapse min-w-full bg-white  text-left   !text-sm font-light">
            <thead className="border-b bg-gray-100 font-bold">
              <tr className="!font-semibold ">
                <th scope="col" className="!text-left pl-8 w-max py-3 border">
                  Section
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
              {item[Object.keys(item)[0]]
                .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                .map((ele, id) => (
                  <tr className="!font-medium h-14 border-b" key={id}>
                    <td className="leading-7 text-[16px] !text-left pl-8 border w-[100px]">
                      {ele?.section && ele?.section}
                    </td>
                    <td className="leading-7 text-[16px] truncate text-left w-[500px] border px-2">
                      {ele.name}
                    </td>

                    <td className="leading-7 text-[16px] h-14 text-left  !p-0 w-[220px] border ">
                      {editStatus[itemIndex] === id &&
                      editStatus[itemIndex] === id ? (
                        <div className="flex gap-2 !py-0 h-full ">
                          <h1 className="text-lg h-full !py-0 text-center w-[30%] bg-gray-200 border justify-center   flex items-center ">
                            INR
                          </h1>
                          <input
                            type="number"
                            className="border-none w-[70%]   outline-none"
                            value={ele.amount}
                            onChange={(e) =>
                              handleAmountChange(e, itemIndex, id)
                            }
                          />
                        </div>
                      ) : (
                        <h1 className="px-2">INR {ele.amount}</h1>
                      )}
                    </td>
                    <td className="text-left h-14 leading-7 text-[16px] w-[200px]  border">
                      {editStatus[itemIndex] === id &&
                      editStatus[itemIndex] === id ? (
                        <div className="px-2">
                          <label className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 text-sm rounded cursor-pointer">
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
                    <td className=" text-left leading-7 text-[16px] border px-2 w-[200px]">
                      {ele.status}
                    </td>
                    <td className="whitespace-nowrap leading-7 text-[16px] px-2   w-[220px]">
                      {editStatus[itemIndex] === id ? (
                        <div className="space-x-1 w-[200px]">
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
                        <div className="space-x-2 w-[200px]">
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
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
      <Stack
        direction={"row"}
        className="border-[.5px] border-gray-200 border-t-0 px-4 py-2 h-full  items-center w-full justify-between "
      >
        <div>
          <h1>
            Showing {page} to 2 of {totalRowCount} entries
          </h1>
        </div>
        <Pagination
          count={pages}
          page={page}
          color="primary"
          shape="rounded"
          onChange={(event, value) => setPage(value)}
        />
      </Stack>
    </div>
  );
};

export default TDSTable4Tab1;
