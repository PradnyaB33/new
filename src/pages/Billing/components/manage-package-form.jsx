import { Box, Modal } from "@mui/material";
import React from "react";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};
const PackageForm = ({ handleClose, open, packages }) => {
  console.log(`🚀 ~ file: manage-package-form.jsx:12 ~ packages:`, packages);
  return (
    <Modal
      keepMounted={false}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="border-none !z-10 shadow-md outline-none rounded-md gap-2 flex flex-col"
      >
        <h1 className="text-xl pl-2 font-semibold font-sans">Add leave type</h1>
        {/* <form onSubmit={handleSubmit(onSubmit)} noValidate>
       
        </form> */}
      </Box>
    </Modal>
  );
};

export default PackageForm;
