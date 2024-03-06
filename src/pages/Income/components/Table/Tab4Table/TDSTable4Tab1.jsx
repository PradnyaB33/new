import {
  CheckCircle,
  DeleteOutlined,
  EditOutlined,
  Error,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  IconButton,
  Pagination,
  Stack,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../../../State/Function/Main";
import useAuthToken from "../../../../../hooks/Token/useAuth";
import UserProfile from "../../../../../hooks/UserData/useUser";

const TDSTable4Tab1 = () => {
  const rowsPerPage = 10; // Define the number of rows per page
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const user = getCurrentUser();
  const [tableData, setTableData] = useState([
    {
      Section80: [
        {
          section: "80 C",
          name: "Life insurance",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 C",
          name: "Provident Fund",
          declaration: 0,
          proof: "",
          status: "Auto",
        },
        {
          section: "80 C",
          name: "Public Provident Fund",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 C",
          name: "NSC investment + Accrued interest",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 C",
          name: "Housing loan principal repayment",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 C",
          name: "Sukanya Samriddhi Account",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 C",
          name: "Tuition fees for 2 children",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 C",
          name: "Tax Saving Fixed deposit in Bank (5 years)",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 C",
          name: "Tax Saving Bonds",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 C",
          name: "E.L.S.S (Tax Saving Mutual Fund)",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 CCC",
          name: "Pension Plan from Insurance Companies/Mutual Funds (u/s 80CCC)",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 CCD",
          name: "Contribution to NPS notified by the Central Government",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          section: "80 CCH",
          name: "All contributions to Agniveer Corpus Fund",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
      ],
    },
  ]);

  const {
    isLoading: incomeHouseLoading,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: ["sectionDeduction"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/tds/getSectionDeduction/2023-2024`,
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
      // Extracting relevant data from the backend response
      const sectionData = res?.sectionData?.section;

      // Updating the tableData state based on the backend response
      const updatedTableData = tableData.map((section) => {
        const sectionName = Object.keys(section)[0];
        const matchingSection = sectionData?.find(
          (item) => item.sectionName === sectionName
        );

        if (matchingSection) {
          section[sectionName].forEach((item) => {
            const matchingItem = matchingSection.investmentType.find(
              (originalItem) => originalItem.name === item.name
            );

            if (matchingItem) {
              Object.assign(item, matchingItem);
            }
          });
        }

        return section;
      });

      const tableDataWithMaximumAllowable = updatedTableData.map((data) => ({
        ...data,
      }));

      // Update state with tableData including maximumAllowable
      setTableData(tableDataWithMaximumAllowable);
    },
  });

  console.log(tableData);

  const [page, setPage] = useState(1);
  const allSection80s = tableData.flatMap((data) => data.Section80);

  // Now, calculate the total number of rows using reduce
  const totalRowCount = allSection80s.reduce((total, section) => total + 1, 0);

  const pages = Math.ceil(totalRowCount / rowsPerPage);
  const [editStatus, setEditStatus] = useState({});

  const handleEditClick = (itemIndex, fieldIndex) => {
    setEditStatus({ ...editStatus, [itemIndex]: fieldIndex });
  };

  const handleAmountChange = (e, itemIndex, id) => {
    const newData = [...tableData];
    newData[itemIndex][Object.keys(newData[itemIndex])[0]][id].declaration =
      e.target.value;
    setTableData(newData);
  };

  const handleProofChange = (e, itemIndex, id) => {
    const newData = [...tableData];
    newData[itemIndex][Object.keys(newData[itemIndex])[0]][id].proof =
      e.target.files[0];
    setTableData(newData);
  };

  const handleSaveClick = async (index, id) => {
    const newData = [...tableData];
    const value = newData[index][Object.keys(newData[index])[0]][id];
    const requestData = {
      empId: user._id,
      financialYear: "2023-2024",
      sectionName: Object.keys(newData[index])[0],
      investmentTypeName: value.name,
      requestData: {
        section: value.section,
        status: "Pending",
        declaration: value.declaration,
        proof: "",
      },
    };
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/route/tds/createSectionDeduction`,
        requestData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", `Data uploaded successfully`);
      queryClient.invalidateQueries({ queryKey: ["incomeHouse"] });
    } catch (error) {
      console.log(error);
    }

    setEditStatus({
      ...editStatus,
      [index]: null,
    });
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
      {incomeHouseLoading || isFetching || !isFetched ? (
        <div className="flex items-center justify-center w-full">
          <CircularProgress />
        </div>
      ) : (
        <>
          {tableData.map((item, itemIndex) => (
            <div className="bg-white" key={itemIndex}>
              {/* {Object.keys(item)[0] !== "Section" && (
            <div className="border-[.25px] border-b-0 border-gray-300  p-4">
              <h1 className="text-xl"> {Object.keys(item)[0]}</h1>
            </div>
          )} */}
              <table className="table-auto border border-collapse min-w-full bg-white  text-left   !text-sm font-light">
                <thead className="border-b bg-gray-100 font-bold">
                  <tr className="!font-semibold ">
                    <th
                      scope="col"
                      className="!text-left pl-8 w-max py-3 border"
                    >
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
                                value={ele.declaration}
                                onChange={(e) =>
                                  handleAmountChange(e, itemIndex, id)
                                }
                              />
                            </div>
                          ) : (
                            <h1 className="px-2">INR {ele.declaration}</h1>
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
                                  onChange={(e) =>
                                    handleProofChange(e, itemIndex)
                                  }
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
                          {ele.status === "Pending" ? (
                            <div className="flex items-center  gap-2">
                              <Error className="text-yellow-400 " />
                              {ele.status}
                            </div>
                          ) : ele.status === "Auto" ? (
                            <div className="flex items-center  gap-2">
                              <CheckCircle className="text-green-400 " />
                              {ele.status}
                            </div>
                          ) : (
                            <p>{ele.status}</p>
                          )}
                        </td>
                        <td className="whitespace-nowrap leading-7 text-[16px] px-2   w-[220px]">
                          {ele.name === "Provident Fund" ? (
                            ""
                          ) : editStatus[itemIndex] === id ? (
                            <div className="space-x-1 w-[200px]">
                              <Button
                                color="primary"
                                aria-label="save"
                                onClick={() => handleSaveClick(itemIndex, id)}
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
        </>
      )}
    </div>
  );
};

export default TDSTable4Tab1;
