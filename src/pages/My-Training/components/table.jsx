import { Button } from "@mui/material";
import React from "react";
import TrainingCard from "./card";
import CardLoader from "./card-loader";

const EmployeeTable = ({ data, setPage, isLoading, totalResult, page }) => {
  return (
    <div className="pt-16 flex flex-col w-full gap-4">
      <div className="flex gap-4 w-full justify-between">
        <div className={`flex rounded-md px-2 bg-white py-[6px] gap-2`}>
          <input
            placeholder={"Search on keyword"}
            className={`border-ghostwhite bg-white outline-none px-2`}
          />
        </div>
        <input
          type="text"
          placeholder="Search on training type"
          className="p-2"
        />
        <input
          type="text"
          placeholder="Search on departmental training"
          className="p-2"
        />
      </div>
      {isLoading && [1, 2, 3].map((item) => <CardLoader key={item} />)}
      {data?.map((item) => (
        <TrainingCard key={item.id} doc={item} />
      ))}
      <div className="flex justify-between ">
        <Button
          onClick={() => {
            setPage((prev) => prev - 1);
          }}
          variant="contained"
          disabled={totalResult > page * 3}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setPage((prev) => prev + 1);
          }}
          disabled={totalResult <= data?.length ?? false}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default EmployeeTable;
