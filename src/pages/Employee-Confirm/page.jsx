import CheckIcon from "@mui/icons-material/Check";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { GoogleMap } from "@react-google-maps/api";
import { format } from "date-fns";
import React, { useState } from "react";
import useEmpConfirmation from "../../hooks/QueryHook/Remote-Punch/hook";
import MappedPunches from "./components/mapped-punches";

const EmployeeConfirmation = () => {
  const { data } = useEmpConfirmation();
  const [Id, setId] = useState(null);
  return (
    <div className="w-full h-[100vh] flex justify-between relative">
      <div className=" z-50 p-6 flex flex-col mt-7 w-[25vw] bg-white gap-4 ">
        <div className="w-full bg-white">
          <h1 className="text-slate-400 mb-1">Select Date For Application</h1>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Select Date</InputLabel>
            <Select
              labelId="date-select-label"
              id="date-select"
              label="Select Date"
              onChange={(event) => {
                setId(event.target.value);
              }}
            >
              {data?.allPunchData?.length > 0 ? (
                data?.allPunchData?.map((doc, idx) => {
                  return (
                    <MenuItem key={idx} value={doc._id}>
                      {format(new Date(doc.createdAt), "dd-MM-yyyy")}
                    </MenuItem>
                  );
                })
              ) : (
                <MenuItem value="">No Data Found</MenuItem>
              )}
            </Select>
          </FormControl>
          <div>
            <p className=" z-[99999999]  mt-4 font-semibold  mb-3">
              Total Approximate Distance : Kilometers
            </p>
          </div>
          {Id !== null && <MappedPunches {...{ Id }} />}
          {Id ? (
            <div className=" mt-5 w-full flex justify-end">
              <button className="bg-[#2463ea] text-white pr-4 pl-4 pt-2 pb-2 text-sm">
                <span className="mr-3">
                  <CheckIcon />
                </span>{" "}
                Apply for remote punching
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <GoogleMap {...{ Id }} />
    </div>
  );
};

export default EmployeeConfirmation;
