import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Modal,
  OutlinedInput,
  FormLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

const AddLoanTypeModal = ({ handleClose, open, organisationId }) => {
  const [loanName, setLoanName] = useState("");
  const [loanValue, setLoanValue] = useState("");
  const [rateOfInterestApplied, setRateOfInterestApplied] = useState("No");
  const [rateOfInterest, setRateOfInterest] = useState("");
  useEffect(() => {
    if (parseInt(loanValue) > 20000) {
      setRateOfInterestApplied("Yes");
    } else {
      setRateOfInterestApplied("No");
    }
  }, [loanValue]);
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  console.log(organisationId);
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
              Add Loan Type
            </h1>
          </div>

          <div className="px-5 space-y-4 mt-4">
            <div className="space-y-2 ">
              <FormLabel className="text-md" htmlFor="demo-simple-select-label">
                Add Loan Name
              </FormLabel>
              <FormControl
                size="small"
                sx={{ width: "100%" }}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Add Loan Name
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  label="Add Loan Name"
                  value={loanName}
                  onChange={(e) => setLoanName(e.target.value)}
                />
              </FormControl>
            </div>
            <div className="space-y-2 ">
              <FormLabel className="text-md" htmlFor="demo-simple-select-label">
                Add Loan Value
              </FormLabel>
              <FormControl
                size="small"
                sx={{ width: "100%" }}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Add Loan Value
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  label="Add Loan Value"
                  value={loanValue}
                  onChange={(e) => setLoanValue(e.target.value)}
                />
              </FormControl>
            </div>
            <div className="space-y-2 ">
              <FormLabel className="text-md" htmlFor="demo-simple-select-label">
                Rate of Interest applied
              </FormLabel>
              <FormControl
                size="small"
                sx={{ width: "100%" }}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Rate of Interest applied
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  label="Rate of Interest applied"
                  value={rateOfInterestApplied}
                  onChange={(e) => setRateOfInterestApplied(e.target.value)}
                />
              </FormControl>
            </div>
            <div className="space-y-2 ">
              <FormLabel className="text-md" htmlFor="demo-simple-select-label">
                Rate of Interest in %
              </FormLabel>
              <FormControl
                size="small"
                sx={{ width: "100%" }}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Rate of Interest in %
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  label="Add Loan Name"
                  value={rateOfInterest}
                  onChange={(e) => setRateOfInterest(e.target.value)}
                />
              </FormControl>
            </div>
            <div className="flex gap-4  mt-4  justify-end">
              <Button onClick={handleClose} color="error" variant="outlined">
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default AddLoanTypeModal;
