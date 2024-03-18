import { Info, Search, West } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import useAuthToken from "../../../../hooks/Token/useAuth";

const DeclarationPage = () => {
  const authToken = useAuthToken();
  const { id } = useParams();

  const [searchEmp, setSearchEmp] = useState("");
  const { data: empData } = useQuery({
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

  const { data: empTDSData } = useQuery({
    queryKey: ["EmpData", id],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/tds/getAllEmployeesUnderAccoutant/${id}/2023-2024`,
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

  console.log(empTDSData);

  return (
    <div>
      <header className="text-xl w-full pt-6 border bg-white shadow-md   p-4">
        <Link to={"/income-tax"}>
          <West className="mx-4 !text-xl" />
        </Link>
        Employee TDS Request
      </header>
      <section className="min-h-[90vh] flex  ">
        <article className="w-[25%] overflow-auto max-h-[90vh] h-full bg-white border-r-[.5px] border-gray-200">
          <div className="p-6 !py-2 ">
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

          {empData
            ?.filter((item) => {
              return searchEmp
                ? item?.employeeData?.first_name
                    .toLowerCase()
                    .includes(searchEmp.toLowerCase()) ||
                    item?.employeeData?.last_name
                      .toLowerCase()
                      .includes(searchEmp.toLowerCase())
                : item;
            })
            .map((ele) => (
              <Link
                to={`/income-tax/accountant-declarations/${ele?.employeeData._id}`}
                className={` px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center 
                ${
                  ele?.employeeData._id === id &&
                  "bg-blue-400 text-white hover:bg-blue-300 "
                }
                `}
              >
                <Avatar />
                <div>
                  <h1 className="text-[1.1rem]">
                    {ele?.employeeData?.first_name}{" "}
                    {ele?.employeeData?.last_name}
                  </h1>
                  <h1
                    className={`text-sm text-gray-500  ${
                      ele?.employeeData._id === id && "text-white"
                    }`}
                  >
                    {ele?.employeeData.email}
                  </h1>
                </div>
              </Link>
            ))}
        </article>

        <article className="w-[75%] min-h-[90vh]  bg-gray-50">
          {id ? (
            !empTDSData?.investments ? (
              <div className="flex px-4 w-full items-center my-4">
                <h1 className="text-lg w-full  text-gray-700 border bg-red-200 p-4 rounded-md">
                  <Info /> No declarations found
                </h1>
              </div>
            ) : (
              <>
                <h1 className="bg-white border-b  p-4 text-xl">
                  Employee Declarations
                </h1>
                <div className="bg-white ">
                  <table className="table-auto border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
                    <thead className="border-b bg-gray-100 font-bold">
                      <tr className="!font-semibold ">
                        <th
                          scope="col"
                          className="!text-center px-2 w-max py-3 border"
                        >
                          Sr. No
                        </th>
                        <th scope="col" className="py-3 px-2 border">
                          Declaration Name
                        </th>

                        <th scope="col" className="py-3 px-2 border">
                          Amount
                        </th>
                        <th scope="col" className="py-3 px-2 border">
                          Proofs
                        </th>
                        <th scope="col" className="py-3 px-2 border">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {empTDSData?.investments?.map((item, itemIndex) => (
                        <tr
                          className={`!font-medium h-14 border-b 
                
                `}
                          key={itemIndex}
                        >
                          <td className="!text-center px-2 leading-7 text-[16px] w-[50px] border ">
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
                          <td className=" text-left !p-0 w-[200px] border ">
                            <p
                              className={`
                     
                        px-2 leading-7 text-[16px]`}
                            >
                              test
                            </p>
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
            </div>
          )}
        </article>
      </section>
    </div>
  );
};

export default DeclarationPage;
