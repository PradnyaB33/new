import { DeleteOutlined, EditOutlined, Error, Info } from "@mui/icons-material";
import { Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../../State/Function/Main";
import useIncomeHouse from "../../../../hooks/IncomeTax/useIncomeHouse";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";

const TDSTable2 = () => {
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const queryClient = useQueryClient();
  const { setTotalHeads } = useIncomeHouse();

  const [tableData, setTableData] = useState([
    {
      "(A) Self Occupied Property (Loss)": [
        {
          name: "Interest on loan / Borrowing taken for Repairs, renewal, or reconstruction",
          property1: 0,
          property2: 0,
          declaration: 0,
          proof: "",
          maxAmount: 200000,
          status: "Not Submitted",
        },
        {
          name: "Before 1/4/99",
          property1: 0,
          property2: 0,
          declaration: 0,
          maxAmount: 30000,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "After 1/4/99 & completed after 5 years from the end of FY of borrowing",
          maxAmount: 30000,
          property1: 0,
          property2: 0,
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "After 1/4/99 & completed within 5 years from the end of FY of borrowing",
          property1: 0,
          maxAmount: 200000,
          property2: 0,
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
      ],
      maximumAllowable: 0,
    },
    {
      "(B) Let out property (Enter name of Property)": [
        {
          name: "Rent of the property for the year",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "Less : Municipal Taxes paid in the year",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "Less : Interest on Housing Loan",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
      ],

      secondData2: {
        netValue1: 0,
        standard1: 0,
        netHouseTotal1: 0,
      },
    },
    {
      "(C) Let out property (Enter name of Property)": [
        {
          name: "Rent of the property for the year",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
        {
          name: "Less : Municipal Taxes paid in the year",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },

        {
          name: "Less : Interest on Housing Loan",
          declaration: 0,
          proof: "",
          status: "Not Submitted",
        },
      ],
      secondData3: {
        netValue1: 0,
        standard1: 0,
        netHouseTotal1: 0,
      },
    },
  ]);

  const { isLoading: incomeHouseLoading, isFetching } = useQuery({
    queryKey: ["incomeHouse"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/tds/getHouseProperty/2023-2024`,
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
      const sectionData = res?.incomeFromHouse?.section;

      setTotalHeads(res?.totalHeads);
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

      const tableDataWithMaximumAllowable = updatedTableData?.map((data) => ({
        ...data,
        maximumAllowable: res?.firstSectionDeclarationSum,
        secondData2: {
          netValue1: res?.secondData2?.netValue,
          standard1: res?.secondData2?.deductedAmount,
          netHouseTotal1: res?.secondData2?.ActualDeductedValue,
        },
        secondData3: {
          netValue1: res?.secondData3?.netValue,
          standard1: res?.secondData3?.deductedAmount,
          netHouseTotal1: res?.secondData3?.ActualDeductedValue,
        },
      }));

      // Update state with tableData including maximumAllowable
      setTableData(tableDataWithMaximumAllowable);
    },
  });

  const { handleAlert } = useContext(TestContext);
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

  const handleDelete = async (index, id) => {
    const newData = [...tableData];
    const requestData = {
      empId: user._id,
      financialYear: "2023-2024",
      sectionName: Object.keys(newData[index])[0],
      investmentTypeName:
        newData[index][Object.keys(newData[index])[0]][id].name,
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_API}/route/tds/deleteHouseProperty`,
        requestData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", `Data deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ["incomeHouse"] });
    } catch (error) {
      console.log(error);
    }
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
        property1: value.property1,
        property2: value.property2,
        status: "Pending",
        declaration:
          Object.keys(newData[index])[0] !== "(A) Self Occupied Property (Loss)"
            ? value.declaration > value?.maxAmount
              ? value?.maxAmount
              : value.declaration
            : Number(value.property1) + Number(value.property2) >
              value?.maxAmount
            ? value?.maxAmount
            : Number(value.property1) + Number(value.property2),
        proof: "",
      },
    };
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/route/tds/createHouseProperty`,
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
    <div className="mt-2 space-y-4">
      {incomeHouseLoading ? (
        <div className="flex items-center justify-center w-full">
          <CircularProgress />
        </div>
      ) : (
        tableData.map((item, itemIndex) => (
          <div
            className="bg-white border-[.5px] border-gray-200"
            key={itemIndex}
          >
            <div className="w-full overflow-x-auto">
              <div className="inline-block min-w-full  ">
                <div className="overflow-x-auto">
                  <div className=" my-2 p-4">
                    <h1 className="text-xl"> {Object.keys(item)[0]}</h1>
                  </div>
                  {itemIndex === 1 && (
                    <div className="grid bg-white border-[.5px] border-gray-200 grid-cols-6 gap-4 p-4">
                      <div>
                        <h1 className="text-gray-600">Net Annual Value :</h1>
                        <p className="text-xl">
                          {/* INR {item?.secondData2?.netValue1?.toFixed(2)} */}
                        </p>
                      </div>
                      <div>
                        <h1 className="text-gray-600">
                          Less : Standard Deduction :{" "}
                        </h1>
                        <p className="text-xl">
                          INR{" "}
                          {item?.secondData2?.standard1 !== undefined
                            ? item?.secondData2?.standard1?.toFixed(2)
                            : 0}
                        </p>
                      </div>
                      <div className="w-max">
                        <h1 className="text-gray-600">
                          Net Income / (Loss) from this House
                        </h1>
                        <p className="text-xl">
                          INR{" "}
                          {item?.secondData2?.netHouseTotal1 !== undefined
                            ? item?.secondData2?.netHouseTotal1?.toFixed(2)
                            : 0}
                        </p>
                      </div>
                    </div>
                  )}
                  {itemIndex === 2 && (
                    <div className="grid bg-white border-[.5px] border-gray-200 grid-cols-6 gap-4 p-4">
                      <div>
                        <h1 className="text-gray-600">Net Annual Value :</h1>
                        <p className="text-xl">
                          {/* INR {item?.secondData3?.netValue1?.toFixed(2)} */}
                        </p>
                      </div>
                      <div>
                        <h1 className="text-gray-600">
                          Less : Standard Deduction :{" "}
                        </h1>
                        <p className="text-xl">
                          {/* INR {item?.secondData3?.standard1?.toFixed(2)} */}
                        </p>
                      </div>
                      <div className="w-max">
                        <h1 className="text-gray-600">
                          Net Income / (Loss) from this House
                        </h1>
                        <p className="text-xl">
                          INR{" "}
                          {item?.secondData3?.netHouseTotal1 !== undefined
                            ? item?.secondData3?.netHouseTotal1?.toFixed(2)
                            : 0}
                        </p>
                      </div>
                    </div>
                  )}
                  <table className="table-auto border border-collapse min-w-full bg-white  text-left   !text-sm font-light">
                    <thead className="border-b bg-gray-100 font-bold">
                      <tr className="!font-semibold ">
                        <th scope="col" className="!text-left pl-8 py-3 border">
                          SR NO
                        </th>
                        <th scope="col" className="py-3 border">
                          Deduction Name
                        </th>
                        {Object.keys(item)[0] ===
                          "(A) Self Occupied Property (Loss)" && (
                          <>
                            <th scope="col" className="px-2 py-3 border">
                              property 1
                            </th>
                            <th scope="col" className="px-2 border *:py-3">
                              property 2
                            </th>
                          </>
                        )}
                        <th scope="col" className="py-3 px-2 border">
                          Declaration
                        </th>
                        <th scope="col" className="py-3 border">
                          Proof submitted
                        </th>
                        <th scope="col" className="py-3 border">
                          Status
                        </th>
                        <th scope="col" className=" py-3 border">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {item[Object.keys(item)[0]].map((ele, id) => (
                        <tr className="!font-medium  h-14 border-b" key={id}>
                          <td className="leading-7 text-[16px] !text-left pl-8 border w-[100px]">
                            {id + 1}
                          </td>
                          <td className="leading-7 text-[16px] truncate text-left w-[500px] border px-2">
                            <div className=" flex px-2 items-center gap-2">
                              {ele.name}

                              <Tooltip
                                title="this is a helper text"
                                className="  h-max hover:cursor-pointer rounded-full"
                              >
                                <Info className=" !text-blue-500" />
                              </Tooltip>
                            </div>
                          </td>
                          {Object.keys(item)[0] ===
                            "(A) Self Occupied Property (Loss)" && (
                            <>
                              <td className="leading-7 text-[16px] h-14 text-left px-2  w-[220px] border ">
                                {editStatus[itemIndex] === id ? (
                                  <div className="flex gap-2 px-2 !py-0 h-full ">
                                    <h1 className="text-lg h-full !py-0 text-center w-[30%] bg-gray-200 border justify-center   flex items-center ">
                                      INR
                                    </h1>
                                    <input
                                      type="number"
                                      className="border-none w-[70%]   outline-none"
                                      value={ele.property1}
                                      onChange={(e) =>
                                        handleProperty1(e, itemIndex, id)
                                      }
                                    />
                                  </div>
                                ) : (
                                  ele.property1 && "INR " + ele?.property1
                                )}
                              </td>
                              <td className="leading-7 text-[16px] h-14 text-left  px-2  w-[220px] border ">
                                {editStatus[itemIndex] === id ? (
                                  <div className="border-gray-200 w-max  flex border-[.5px]">
                                    <h1 className=" bg-gray-300 py-2  h-full px-2">
                                      INR
                                    </h1>
                                    <input
                                      type="number"
                                      className="border-none py-2  outline-none px-2 "
                                      value={ele.property2}
                                      onChange={(e) =>
                                        handleProperty2(e, itemIndex, id)
                                      }
                                    />
                                  </div>
                                ) : (
                                  ele.property2 && "INR " + ele.property2
                                )}
                              </td>
                            </>
                          )}
                          <td className="leading-7 text-[16px] h-14 text-left  !p-0 w-[220px] border ">
                            {Object.keys(item)[0] !==
                              "(A) Self Occupied Property (Loss)" &&
                            editStatus[itemIndex] === id ? (
                              <div className="border-gray-200 w-max  flex border-[.5px]">
                                <h1 className=" bg-gray-300 py-2  h-full px-2">
                                  INR
                                </h1>
                                <input
                                  type="number"
                                  className="border-none py-2  outline-none px-2 "
                                  value={ele.declaration}
                                  onChange={(e) =>
                                    handleAmountChange(e, itemIndex, id)
                                  }
                                />
                              </div>
                            ) : (
                              <div className="px-2">
                                {/* INR {ele?.declaration?.toFixed(2)} */}
                              </div>
                            )}
                          </td>
                          <td className="text-left h-14 px-2 leading-7 text-[16px] w-[200px]  border ">
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
                            ) : ele.proof ? (
                              ele.proof
                            ) : (
                              "No proof found"
                            )}
                          </td>
                          <td className="text-left w-[200px] border px-2">
                            {ele.status === "Pending" ? (
                              <div className="flex items-center  gap-2">
                                <Error className="text-yellow-400 " />
                                {ele.status}
                              </div>
                            ) : (
                              <h1 className=" ">{ele.status}</h1>
                            )}
                          </td>
                          <td className="whitespace-nowrap leading-7 text-[16px] px-2   w-[220px]">
                            {editStatus[itemIndex] === id ? (
                              <div className="space-x-2">
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
                                  onClick={() => {
                                    handleDelete(itemIndex, id);
                                  }}
                                >
                                  <DeleteOutlined />
                                </IconButton>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                      {/* {itemIndex === 0 && item.maximumAllowable && (
                        <tr
                          className="!font-medium bg-gray-100  h-12 border-b"
                          key="max-allowable"
                        >
                          <td className="!text-left  pl-8"></td>
                          <td className=" truncate text-left text-lg  ">
                            Maximum Allowable
                          </td>
                          <td className="px-2 text-left "></td>
                          <td className="px-2 text-left "></td>
                          <td className="px-2 text-left "></td>
                          <td className="px-2 text-left "></td>
                          <td className="px-2 text-left text-lg font-semibold ">
                            INR {item.maximumAllowable?.toFixed(2)}
                          </td>
                          <td className="px-2 text-left "></td>
                        </tr>
                      )} */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TDSTable2;
