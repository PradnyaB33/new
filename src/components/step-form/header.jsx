// Header.tsx
import { Button } from "@mui/material";
import React from "react";

const Header = ({ totalSteps, step, goToStep }) => {
  const stepLabels = Array.from({ length: totalSteps }, (_, index) =>
    (index + 1).toString()
  );

  return (
    <div className="!w-full !flex !gap-[1px]">
      {stepLabels.map((label, index) => (
        <React.Fragment key={index}>
          <Button
            onClick={() => goToStep(index + 1)}
            variant={step < index + 1 ? "outlined" : "contained"}
            className="!rounded-full !flex-shrink-0 !w-16 !h-16"
          >
            {label}
          </Button>
          {index < totalSteps - 1 && (
            <div
              className={`!w-full !h-4 ${
                step - 1 < index + 1 ? "!bg-[#91E0FA]" : "!bg-primary"
              } !flex !m-auto !rounded-md`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Header;
