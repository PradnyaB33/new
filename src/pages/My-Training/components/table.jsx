import { Button } from "@mui/material";
import React from "react";
import TrainingCard from "./card";
import CardLoader from "./card-loader";

const EmployeeTable = ({ data, setPage, isLoading, totalResult, page }) => {
  console.log(`🚀 ~ file: table.jsx:7 ~ data:`, data);
  console.log(`🚀 ~ file: table.jsx:7 ~ totalResult:`, totalResult);
  return (
    <div className="pt-16 flex flex-col w-full px-8 gap-4">
      {isLoading && [1, 2].map((item) => <CardLoader key={item} />)}
      {data?.map((item) => (
        <TrainingCard key={item.id} doc={item} />
      ))}
      <div className="flex justify-between ">
        <Button
          onClick={() => {
            setPage((prev) => prev - 1);
          }}
          variant="contained"
          disabled={totalResult > page * 2}
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
