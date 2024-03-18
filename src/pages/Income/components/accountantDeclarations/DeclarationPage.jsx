import {
  Cancel,
  CheckCircle,
  Info,
  RequestQuote,
  Search,
  West,
} from "@mui/icons-material";
import { Avatar, CircularProgress, IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import useAuthToken from "../../../../hooks/Token/useAuth";
import TDSDeclarationModel from "./components/TDSDeclarationModel";

const DeclarationPage = () => {
  const authToken = useAuthToken();
  const { id } = useParams();
  const [investment, setInvestment] = useState({});
  const [isReject, setIsReject] = useState(false);
  console.log(`🚀 ~ investment:`, investment);

  const [searchEmp, setSearchEmp] = useState("");
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setInvestment({});
  };

  const { data: empData, isLoading: empLoading } = useQuery({
    queryKey: ["AccoutantEmp"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/tds/getAllEmployeesUnderAccoutant`,
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
  });

  const { data: empTDSData, isLoading: empDataLoading } = useQuery({
    queryKey: ["EmpData", id],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/tds/getTDSWorkflow/${id}/2023-2024`,
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
    enabled: id !== undefined,
  });

  return (
    <div>
      <header className="text-xl w-full pt-6 border bg-white shadow-md   p-4">
        <Link to={"/income-tax"}>
          <West className="mx-4 !text-xl" />
        </Link>
        Employee TDS Request
      </header>
      <section className="min-h-[90vh] flex  ">
        <article className="w-[25%] overflow-auto max-h-[90vh] h-full bg-white  border-gray-200">
          <div className="p-6 !py-2  ">
            <div className="space-y-2">
              <div
                // onFocus={() => {
                //   handleFocus(name);
                // }}
                // onBlur={() => setFocusedInput(null)}
                className={
                  //  ${
                  //   focusedInput === name
                  //     ? "outline-blue-500 outline-3 border-blue-500 border-[2px]"
                  //     : "outline-none border-gray-200 border-[.5px]"
                  //                   }
                  `
                flex  rounded-md items-center px-2 outline-none border-gray-200 border-[.5px]  bg-white py-1 md:py-[6px]`
                }
              >
                <Search className="text-gray-700 md:text-lg !text-[1em]" />

                <input
                  type={"test"}
                  onChange={(e) => setSearchEmp(e.target.value)}
                  placeholder={"Search Employee by name"}
                  className={`border-none bg-white w-full outline-none px-2  `}
                />
              </div>
            </div>
          </div>

          {empLoading ? (
            <div className="flex items-center justify-center my-2">
              <CircularProgress />
            </div>
          ) : empData?.length < 1 ? (
            <h1 className="px-6 text-lg text-center">No declarations</h1>
          ) : (
            empData?.length > 0 &&
            empData
              ?.filter((item) => {
                return searchEmp
                  ? item.empId?.first_name
                      .toLowerCase()
                      .includes(searchEmp.toLowerCase()) ||
                      item.empId?.last_name
                        .toLowerCase()
                        .includes(searchEmp.toLowerCase())
                  : item.empId;
              })
              .map((ele) => (
                <Link
                  to={`/income-tax/accountant-declarations/${ele.empId._id}`}
                  className={` px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50
                ${
                  ele.empId._id === id &&
                  "bg-blue-500 text-white hover:!bg-blue-300 "
                }
                `}
                >
                  <Avatar />
                  <div>
                    <h1 className="text-[1.2rem]">
                      {ele.empId?.first_name} {ele?.empId.last_name}
                    </h1>
                    <h1
                      className={`text-sm text-gray-500  ${
                        ele.empId._id === id && "text-white"
                      }`}
                    >
                      {ele.empId.email}
                    </h1>
                  </div>
                </Link>
              ))
          )}
        </article>

        <article className="w-[75%] min-h-[90vh] border-l-[.5px]  bg-gray-50">
          {empDataLoading ? (
            <div className="flex items-center justify-center my-2">
              <CircularProgress />
            </div>
          ) : id ? (
            empTDSData?.length <= 0 || empTDSData?.investment?.length <= 0 ? (
              <div className="flex px-4 w-full items-center my-4">
                <h1 className="text-lg w-full  text-gray-700 border bg-blue-200 p-4 rounded-md">
                  <Info /> No declarations found
                </h1>
              </div>
            ) : (
              <>
                <div className="p-4 space-y-1 flex items-center gap-3">
                  <Avatar className="text-white !bg-blue-500">
                    <RequestQuote />
                  </Avatar>
                  <div>
                    <h1 className=" text-xl">Employee Declarations</h1>
                    <p className="text-sm">
                      Here accoutant can able to view employee declarations and
                      approvals
                    </p>
                  </div>
                </div>
                <div className=" px-4 ">
                  <table className=" table-auto border  border-collapse min-w-full bg-white  text-left  !text-sm font-light">
                    <thead className="border-b bg-blue-200  font-bold">
                      <tr className="!font-semibold ">
                        <th
                          scope="col"
                          className="!text-center px-2 leading-7 text-[16px] w-max py-3 border"
                        >
                          Sr. No
                        </th>
                        <th
                          scope="col"
                          className="py-3 leading-7 text-[16px] px-2 border"
                        >
                          Declaration Name
                        </th>

                        <th
                          scope="col"
                          className="py-3 leading-7 text-[16px] px-2 border"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="py-3 leading-7 text-[16px] px-2 border"
                        >
                          Proofs
                        </th>
                        <th
                          scope="col"
                          className="py-3 px-2 leading-7 text-[16px] border"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {empTDSData?.investment?.map((item, itemIndex) => (
                        <tr
                          className={`!font-medium h-14 border-b 
                
                `}
                          key={itemIndex}
                        >
                          <td className="!text-center px-2 leading-7 text-[16px] w-[80px] border ">
                            {itemIndex + 1}
                          </td>
                          <td className="leading-7 text-[16px] truncate text-left w-[500px] border px-2">
                            <p>{item.name}</p>
                          </td>

                          <td className=" text-left !p-0 w-[200px] border ">
                            <p
                              className={`
                     
                        px-2 leading-7 text-[16px]`}
                            >
                              INR {parseFloat(item.declaration).toFixed(2)}
                            </p>
                          </td>
                          <td className=" text-left !p-0 w-[200px] border ">
                            <p
                              className={`
                     
                        px-2 leading-7 text-[16px]`}
                            >
                              {item.proof ? item.proof : "No Proof Found"}
                            </p>
                          </td>
                          <td className=" text-left !px-2 w-[200px] border ">
                            <Tooltip title="Accept declaration">
                              <IconButton
                                onClick={() => {
                                  setInvestment(item);
                                  setOpen(true);
                                  setIsReject(false);
                                }}
                              >
                                <CheckCircle color="success" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject declaration">
                              <IconButton
                                onClick={() => {
                                  setInvestment(item);
                                  setOpen(true);
                                  setIsReject(true);
                                }}
                              >
                                <Cancel color="error" />
                              </IconButton>
                            </Tooltip>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )
          ) : (
            <div className="flex px-4 w-full items-center my-4">
              <h1 className="text-lg w-full  text-gray-700 border bg-blue-200 p-4 rounded-md">
                <Info /> Select Employee First to view his declarations
              </h1>

              {/* <img
                src="https://aegis-dev.s3.ap-south-1.amazonaws.com/remote-punching/65d86569d845df6738f87646/5f0cbf6977b8cc2f3661247706171db7"
                alt="none"
                height={500}
              /> */}
            </div>
          )}
        </article>
      </section>
      <TDSDeclarationModel
        open={open}
        handleClose={handleClose}
        isReject={isReject}
        investment={investment}
      />
    </div>
  );
};

export default DeclarationPage;
