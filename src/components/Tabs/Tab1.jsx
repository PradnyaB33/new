import { DeleteOutlined } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import React, { useState } from "react";
import TDSDeclarationModel from "../Modal/TDSDeclarationModel";

const Tab1 = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="overflow-auto shadow-md !p-0  border-[.5px] border-gray-200">
      <div className="p-4 flex items-center justify-between bg-white">
        <div>
          <h1 className="text-xl font-semibold">My Declarations</h1>
          <p>
            Below are the declarations done so far by you for any modifications
            click on action
          </p>
        </div>
        <Button onClick={() => setOpen(true)} variant="contained">
          Create declarations
        </Button>
      </div>
      <table className="min-w-full bg-white  text-left !text-sm font-light">
        <thead className="border-b bg-gray-100 font-bold">
          <tr className="!font-semibold ">
            <th scope="col" className="!text-left pl-8 py-3 ">
              SR NO
            </th>
            <th scope="col" className="py-3 ">
              My Declarations
            </th>
            <th scope="col" className="py-3 ">
              Amount declared annual calculation
            </th>
            <th scope="col" className="py-3 ">
              Maximum amount allowed annual calculation
            </th>
            <th scope="col" className="px-6 py-3 ">
              Proof submitted
            </th>
            <th scope="col" className="px-6 py-3 ">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="!font-medium border-b">
            <td className="!text-left pl-8 py-3 ">1</td>
            <td className="py-3 text-left">test</td>
            <td className="py-3 text-left">test</td>
            <td className="py-3 text-left">test</td>
            <td className="py-3 text-left">test</td>
            <td className="whitespace-nowrap px-6 py-2">
              <IconButton color="error" aria-label="delete">
                <DeleteOutlined />
              </IconButton>
            </td>
          </tr>
        </tbody>
      </table>
      <TDSDeclarationModel handleClose={handleClose} open={open} />
    </div>
  );
};

export default Tab1;
