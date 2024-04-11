import { Button } from "@mui/material";
import React from "react";
import useSearchTrainingZustandStore from "../../components/zustand-store";

const Bottom = () => {
  const { totalResult, page, incrementPage, decrementPage } =
    useSearchTrainingZustandStore();
  console.log(`🚀 ~ file: bottom.jsx:7 ~ totalResult:`, totalResult);
  return (
    <div className="w-full flex-1 flex-row-reverse flex justify-between">
      <Button
        variant="contained"
        onClick={() => {
          incrementPage();
        }}
        disabled={totalResult < page * 10}
      >
        Next
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          decrementPage();
        }}
        disabled={page === 1}
      >
        Previous
      </Button>
    </div>
  );
};

export default Bottom;
