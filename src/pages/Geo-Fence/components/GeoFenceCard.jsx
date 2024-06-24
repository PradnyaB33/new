import { MoreVert, MyLocation } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";

const GeoFenceCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="flex flex-col justify-start items-center">
        <div className="flex p-4 justify-between gap-8 border-b w-full">
          <div className="flex gap-2">
            <MyLocation className="text-Brand-washed-blue/brand-washed-blue-10" />
            <h4 className="text-xl underline text-black">Mumbai,Pune</h4>
          </div>
          <MoreVert />
        </div>
        <div className="p-4 w-full">
          <p className="text-xl w-full text-black">Employee Count: 08</p>
          <p className="text-sm w-full">Employee Count: 08</p>
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
