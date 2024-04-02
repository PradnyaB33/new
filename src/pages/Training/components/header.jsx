import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import Stepper from "./stepper/page";

const Header = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <h1 className=" font-bold text-2xl">Training</h1>
        <p className="text-xl text-Brand-neutrals/brand-neutrals-3">
          Click on add new button to create trainings
        </p>
      </div>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        size="large"
        className="h-fit "
        variant="contained"
      >
        <Add />
        New Training
      </Button>
      <Stepper open={open} setOpen={setOpen} />
    </div>
  );
};

export default Header;
