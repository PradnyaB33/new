import { TextField } from "@mui/material";
import React from "react";
import useSearchTrainingZustandStore from "./zustand-store";

const MiniForm = () => {
  const { setTrainingName } = useSearchTrainingZustandStore();

  return (
    <TextField
      fullWidth
      id="outlined-basic"
      label="  Search Training"
      variant="outlined"
      size="small"
      InputProps={{
        className: "!rounded-full",
      }}
      onChange={(e) => setTrainingName(e.target.value)}
    />
  );
};

export default MiniForm;
