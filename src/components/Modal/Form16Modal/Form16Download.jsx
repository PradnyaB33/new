import { Box, Button, Modal } from "@mui/material";
import React from "react";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};
const Form16Download = ({ handleClose, open, employeeId, organizationId }) => {
  let pdfPath =
    "https://aegis-dev.s3.ap-south-1.amazonaws.com/65d86909299bc72288c0b994-salaryslip%20%289%29.pdf";
  const handleDownload = () => {
    // You can use any method to trigger the download, such as creating an invisible link and clicking it
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = "Form16.pdf";
    link.click();
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
              Download Form 16
            </h1>
          </div>
          <object
            type="application/pdf"
            width="100%"
            height="500px"
            data="https://aegis-dev.s3.ap-south-1.amazonaws.com/65d86909299bc72288c0b994-salaryslip%20%289%29.pdf"
            className="w-full "
            title="main"
          >
            pdf
          </object>

          <div className="px-5 space-y-4 mt-4">
            <div className="flex gap-4  mt-4 mr-4 justify-end mb-4 ">
              <Button onClick={handleClose} color="error" variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={handleDownload}
                variant="contained"
                color="primary"
              >
                Form 16
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Form16Download;
