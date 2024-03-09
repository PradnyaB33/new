import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Modal,
  OutlinedInput,
  FormLabel,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import axios from "axios";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

const AddLoanTypeModal = ({ handleClose, open, organisationId }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const [loanName, setLoanName] = useState("");
  const [loanValue, setLoanValue] = useState("");
  const [rateOfInterestApplied, setRateOfInterestApplied] = useState("No");
  const [rateOfInterest, setRateOfInterest] = useState("");
  const [error, setError] = useState("");
  const [rateOfInterestError, setRateOfInterestError] = useState("");

  useEffect(() => {
    if (parseInt(loanValue) > 20000) {
      setRateOfInterestApplied("Yes");
    } else {
      setRateOfInterestApplied("No");
    }
  }, [loanValue]);

  const AddLoanType = useMutation(
    (data) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/add-loan-type`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),

    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["loanType"] });
        handleClose();
        setLoanName("");
        setLoanValue("");
        setRateOfInterestApplied("No");
        setRateOfInterest("");
        handleAlert(true, "success", "Loan Type added succssfully");
      },
      onError: () => {
        setError("An Error occurred while creating a loan type.");
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        loanName: loanName,
        loanValue: loanValue,
        rateOfInterestApplied: rateOfInterestApplied,
        rateOfInterest: rateOfInterest,
      };
      if (loanName.length <= 0) {
        setError("Loan name field is Mandatory");
        return false;
      }
      await AddLoanType.mutateAsync(data);
    } catch (error) {
      console.error(error);
      setError("An error occurred while creating a laon type");
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
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (!newValue.trim()) {
                      setError("Loan Name field is mandatory");
                    } else {
                      setError("");
                    }
                    setLoanName(newValue);
                  }}
                />
              </FormControl>
              {error && <p className="text-red-500">*{error}</p>}
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
                  onChange={(e) => {
                    const newValue = e.target.value;
                    // Check if the input value is a valid number and greater than or equal to 0
                    if (!isNaN(newValue) && newValue >= 0) {
                      setLoanValue(newValue);
                    }
                  }}
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
                  label="Rate of Interest in %"
                  value={rateOfInterest}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (!isNaN(newValue) && newValue >= 0) {
                      setRateOfInterest(newValue);
                      setRateOfInterestError("");
                    } else {
                      setRateOfInterestError(
                        "Rate of interest should be a non-negative number"
                      );
                    }
                    // Check if the input value follows the percentage format (e.g., 5.5, 7.5)
                    if (!/^\d+(\.\d+)?$/.test(newValue)) {
                      setRateOfInterestError(
                        "Rate of interest should follow the percentage format (e.g., 5.5, 7.5)"
                      );
                    } else {
                      setRateOfInterestError("");
                    }
                  }}
                />
              </FormControl>
              {rateOfInterestError && (
                <p className="text-red-500">*{rateOfInterestError}</p>
              )}
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
