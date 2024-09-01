import { DeleteOutlined, EditOutlined, Search } from "@mui/icons-material";
import { IconButton, Pagination, Stack } from "@mui/material";
import React, { useState } from "react";
import useFunctions from "../hooks/useFunctions";
import InvestmentTableSkeleton from "./InvestmentTableSkeleton";

const InvestmentTable = ({ setOpen, investments, isFetching }) => {
  const { setSearch, setPage, page, setDeleteConfirm, setEditOpen } =
    useFunctions();
  const [focusedInput, setFocusedInput] = useState("");

  return (
    <>
      <div className="flex gap-4">
        {/* input field */}

        <div className={`space-y-1  min-w-[300px] md:min-w-[40vw] w-max `}>
          <div
            onFocus={() => {
              setFocusedInput("search");
            }}
            onBlur={() => setFocusedInput(null)}
            className={` ${
              focusedInput === "search"
                ? "outline-blue-500 outline-3 border-blue-500 border-[2px] "
                : "outline-none border-gray-200 border-[.5px]"
            } flex  rounded-md items-center px-2   bg-white py-3 md:py-[6px]`}
            // className="flex  rounded-md items-center px-2   bg-white py-3 md:py-[6px] outline-none border-gray-200 border-[.5px]"
          >
            <Search className="text-gray-700 md:text-lg !text-[1em]" />
            <input
              type={"text"}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={"Search goals"}
              className={`border-none bg-white w-full outline-none px-2  `}
              formNoValidate
            />
          </div>
        </div>

        <div className="gap-2 flex  w-full justify-end">
          <button
            type="button"
            className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-2 mr-4 text-md font-semibold text-white bg-gray-500 hover:bg-gray-500 focus-visible:outline-gray-500"
          >
            Change Regime
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-2 mr-4 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            Create Declaration
          </button>
        </div>
      </div>

      <div className=" w-full my-2 overflow-x-auto">
        {isFetching ? (
          <InvestmentTableSkeleton />
        ) : (
          <div className="overflow-auto ">
            <table className="w-full table-auto  border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
              <thead className="border-b bg-gray-100 font-bold">
                <tr className="!font-semibold ">
                  <th
                    scope="col"
                    className="!text-left px-2 w-max py-3 text-sm "
                  >
                    Sr. No
                  </th>
                  <th scope="col" className="py-3 text-sm px-2 ">
                    Investment Name
                  </th>

                  <th scope="col" className="py-3 text-sm px-2 ">
                    Declaration
                  </th>

                  <th scope="col" className="py-3 text-sm px-2 ">
                    Approved Amount
                  </th>

                  <th scope="col" className="py-3 text-sm px-2 ">
                    Proofs
                  </th>

                  <th scope="col" className=" py-3 text-sm px-2 ">
                    Status
                  </th>

                  <th scope="col" className=" py-3 text-sm px-2 ">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {investments?.investments?.map((inv, id) => (
                  <tr
                    className={` hover:bg-gray-50 bg-white  !font-medium  w-max border-b `}
                  >
                    <td className="!text-left   py-4    px-2 text-sm w-[70px]  ">
                      {id + 1}
                    </td>

                    <td className="  text-left !p-0 !w-[250px]  ">
                      <p
                        className={`
                        px-2 md:w-full w-max text-sm`}
                      >
                        {inv?.name}
                      </p>
                    </td>

                    <td className=" px-2 text-left text-sm w-[200px]  ">
                      {inv.declaration}
                    </td>
                    <td className=" px-2 text-left text-sm w-[200px]  ">
                      {inv.amountAccepted}
                    </td>
                    <td className=" text-left text-sm w-[200px]  ">
                      <div
                        onClick={() => handlePDF(item.proof)}
                        className="px-2 flex gap-2 items-center h-max w-max  cursor-pointer"
                      >
                        <Article className="text-blue-500" />
                        <h1>View Proof </h1>
                      </div>
                    </td>
                    <td className=" text-left text-sm w-[200px]  ">
                      {inv?.status}
                    </td>
                    <td className="flex gap-2 text-left text-sm mt-2">
                      <IconButton
                        color="primary"
                        size="small"
                        aria-label="edit"
                        onClick={() => setEditOpen(inv)}
                      >
                        <EditOutlined />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        aria-label="delete"
                        onClick={() => setDeleteConfirm(inv?.name)}
                      >
                        <DeleteOutlined />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Stack
              direction={"row"}
              className="border-[.5px] border-gray-200 bg-white  border-t-0 px-4 py-2 h-full  items-center w-full justify-between "
            >
              <div>
                <h1>
                  Showing {page} to {investments?.totalPages} of{" "}
                  {investments?.totalGoals} entries
                </h1>
              </div>
              <Pagination
                count={investments?.totalPages}
                page={page}
                color="primary"
                shape="rounded"
                onChange={(event, value) => setPage(value)}
              />
            </Stack>
          </div>
        )}
      </div>
    </>
  );
};

export default InvestmentTable;
