import { Close } from "@mui/icons-material";
import { Box, Button, IconButton, Modal } from "@mui/material";
import React from "react";

const TDSDeclarationModel = ({ open, handleClose }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    p: 4,
  };
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%] shadow-md outline-none rounded-md"
        >
          <div className="flex justify-between py-4 items-center  px-4">
            <h1 id="modal-modal-title" className="text-xl pl-2 font-semibold">
              Create Declaration Investments
            </h1>
            <IconButton onClick={handleClose}>
              <Close className="!text-[16px]" />
            </IconButton>
          </div>
          <div className="flex gap-4  mt-4 mr-4 justify-end">
            <Button color="error" variant="outlined">
              Cancel
            </Button>
            <Button variant="contained" color="primary">
              Apply
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default TDSDeclarationModel;
