import { MoreVert, MyLocation } from "@mui/icons-material";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";

const GeoFenceCard = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="flex flex-col justify-start items-center">
        <div className="flex p-4 justify-between gap-8 border-b w-full">
          <div className="flex gap-2 items-center">
            <MyLocation className="text-Brand-washed-blue/brand-washed-blue-10" />
            <h4 className="text-xl underline text-black">Mumbai,Pune</h4>
          </div>
          <IconButton onClick={() => setOpen(true)}>
            <MoreVert />
          </IconButton>
          <Menu open={open}>
            <MenuItem>Delete</MenuItem>
          </Menu>
        </div>
        <div className="p-4 w-full flex flex-col gap-4">
          <div className="">
            <p className="text-xl w-full text-black">Employee Count: 08</p>
            <p className="text-sm w-full">Employee Count: 08</p>
          </div>
          <div className="flex gap-6 justify-between">
            <Button variant="contained" size="small">
              Add Employee
            </Button>
            <Button color="error" variant="contained" size="small">
              Remove Employee
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoFenceCard;
