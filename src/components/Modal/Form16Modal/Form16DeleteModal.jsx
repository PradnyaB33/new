import React, { useContext } from "react";
import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import { TestContext } from "../../../State/Function/Main";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};
const Form16DeleteModal = ({
  handleClose,
  open,
  employeeId,
  organizationId,
}) => {
  const { handleAlert } = useContext(TestContext);
  const handleDelete = async () => {
    try {
      // Make API request to delete Form 16
      await axios.delete(
        `${process.env.REACT_APP_API}/route/delete/form16/${organizationId}/${employeeId}`
      );
      handleAlert(true, "success", "Form 16 deleted succesfully.");
      // Close the modal after successful deletion
      handleClose();
    } catch (error) {
      console.error("Error deleting Form 16:", error);
      // Handle error here (e.g., show error message to user)
    }
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
            <h1 className="text-xl pl-2 font-semibold font-sans">
              Delete Form 16
            </h1>
          </div>

          <div className="px-5 space-y-4 mt-4">
            <div className="flex gap-4  mt-4 mr-4 justify-end mb-4 ">
              <Button onClick={handleClose} color="error" variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                variant="contained"
                color="primary"
              >
                Delete Form 16
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Form16DeleteModal;
