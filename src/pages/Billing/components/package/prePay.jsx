import { Box, Button, Modal } from "@mui/material";
import React from "react";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
  width: 350,
  height: "fit-content",
  overflow: "auto",
};
const PrepaidCard = ({ handleClose, open, organisation }) => {
  function onSubmit() {
    console.log(`🚀 ~ file: manage-package-form.jsx:34 ~ data:`, data);
  }
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
        className="border-none !z-10 shadow-md outline-none rounded-md flex flex-col gap-2"
      >
        <h1 className="text-md font-semibold font-sans">
          Your Price for next month wil be &nbsp;
          {getPrice(organisation?.packageInfo) * organisation?.memberCount}
        </h1>

        <Button onSubmit={onSubmit} variant="contained" type="submit">
          Pay Now
        </Button>
      </Box>
    </Modal>
  );
};

export default PrepaidCard;
const getPrice = (plan) => {
  if (plan === "Basic Plan") {
    return Math.round(0.611 * 90);
  } else if (plan === "Intermediate Plan") {
    return Math.round(0.944 * 90);
  } else {
    return 115;
  }
};
