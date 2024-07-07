import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal } from "@mui/material";
import React from "react";

const ReusableModal = ({ open, onClose, children, heading, subHeading }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      keepMounted={false}
    >
      <Box className="border-none gap-2 shadow-md outline-none h-[300px] md:min-h-[80vh] rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:w-[400px] sm:w-fit w-[95%] z-10 p-4 bg-white flex flex-col">
        {heading && (
          <div className="pb-2 border-b-2 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold font-sans">{heading}</h1>
              {subHeading && (
                <p className="text-xs text-gray-500">{subHeading}</p>
              )}
            </div>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </div>
        )}
        {children}
      </Box>
    </Modal>
  );
};

export default ReusableModal;
