import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <h1 className=" font-bold text-2xl">Training</h1>
        <p className="text-xl text-Brand-neutrals/brand-neutrals-3">
          Click on add new button to create trainings
        </p>
      </div>
      <Button size="large" className="h-fit " variant="contained">
        <Add />
        New Training
      </Button>
    </div>
  );
};

export default Header;
