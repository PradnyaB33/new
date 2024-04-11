import { Button } from "@mui/material";
import React from "react";
import useSearchTrainingZustandStore from "../../components/zustand-store";

const Bottom = () => {
  const { totalResult } = useSearchTrainingZustandStore();
  console.log(`🚀 ~ file: bottom.jsx:7 ~ totalResult:`, totalResult);
  return (
    <div className="w-full flex-1 flex-row-reverse flex justify-between">
      <Button variant="contained">Next</Button>
      <Button variant="contained">Previous</Button>
    </div>
  );
};

export default Bottom;
