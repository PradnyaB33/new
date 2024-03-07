import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Modal,
  OutlinedInput,
  FormLabel,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

const EditLoanTypeModal = ({ handleClose, open, organisationId, loanId }) => {
  const queryClient = useQueryClient();
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const [error, setError] = useState("");
  const [loanName, setLoanName] = useState("");
  const [loanValue, setLoanValue] = useState("");
  const [rateOfInterestApplied, setRateOfInterestApplied] = useState("No");
  const [rateOfInterest, setRateOfInterest] = useState("");

  //for  Get Query
  const { data: getLoanTypeById } = useQuery(
    ["loanType", organisationId, loanId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/${loanId}/get-loan-type`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );
  console.log(getLoanTypeById);
  useEffect(() => {
    if (getLoanTypeById?.loanName) {
      setLoanName(getLoanTypeById?.loanName);
    }
    if (getLoanTypeById?.loanValue) {
      setLoanValue(getLoanTypeById?.loanValue);
    }
    if (getLoanTypeById?.rateOfInterest) {
      setRateOfInterest(getLoanTypeById?.rateOfInterest);
    }
    if (getLoanTypeById?.rateOfInterestApplied) {
      setRateOfInterestApplied(getLoanTypeById?.rateOfInterestApplied);
    }
  }, [getLoanTypeById]);

  console.log({ loanName, loanValue, rateOfInterest, rateOfInterestApplied });
  const EditLoanType = useMutation(
    (data) =>
      axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/${loanId}/update-loan-type`,
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
        handleAlert(true, "success", "Loan type updated successfully.");
      },
      onError: () => {
        setError("An Error occurred while loan type.");
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
      await EditLoanType.mutateAsync(data);
    } catch (error) {
      console.error(error);
      setError("An error occurred while creating a new loan type.");
    }
  };
  console.log(error);
  return (
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
            Edit Loan Type
          </h1>
        </div>
        <div className="px-5 space-y-4 mt-4">
          <div className="space-y-2 ">
            <FormLabel className="text-md" htmlFor="demo-simple-select-label">
              Add Loan Name
            </FormLabel>
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
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
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
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
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
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
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
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
        </div>
        <div className="flex gap-4 mt-4 mr-4  mb-4 justify-end ">
          <Button onClick={handleClose} color="error" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Apply
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default EditLoanTypeModal;
