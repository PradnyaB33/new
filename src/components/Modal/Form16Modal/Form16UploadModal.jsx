import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

const Form16UploadModal = ({ handleClose, open }) => {
  const [selectedYear, setSelectedYear] = useState("current");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  console.log(selectedFile);

  const handleUpload = () => {
    handleClose();
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
              Upload Form 16
            </h1>
          </div>
          <div className=" ml-6">
            <p>Which year form16 do you want to upload?</p>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="year"
                name="year"
                value={selectedYear}
                onChange={handleYearChange}
              >
                <FormControlLabel
                  value="current"
                  control={<Radio />}
                  label="Current Year"
                />
                <FormControlLabel
                  value="previous"
                  control={<Radio />}
                  label="Previous Year"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className=" ml-6">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              style={{ marginTop: "10px" }}
            />
          </div>

          <div className="px-5 space-y-4 mt-4">
            <div className="flex gap-4  mt-4 mr-4 justify-end mb-4 ">
              <Button onClick={handleClose} color="error" variant="outlined">
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
              >
                Upload Form 16
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Form16UploadModal;
