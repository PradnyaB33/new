import { Button } from "@mui/material";
import React, { useState } from "react";
import PackageInfo from "./package-info";
// Assuming you have a schema for Step 3 data
export function convertCamelToTitle(packageName) {
  return packageName.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
    return str.toUpperCase();
  });
}
const Step2 = ({ nextStep }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div className="item-center flex flex-col" noValidate>
        <Button
          onClick={() => setConfirmOpen(true)}
          type="submit"
          variant="contained"
          className="!w-max !mx-auto"
        >
          Confirm & Pay
        </Button>
        <PackageInfo
          open={confirmOpen}
          handleClose={() => {
            setConfirmOpen(false);
            handleClose();
          }}
        />
      </div>
    </div>
  );
};

export default Step2;
