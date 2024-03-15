import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  FormLabel,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
} from "@mui/material";
import React, { useContext, useState } from "react";
import useLaonState from "../../../hooks/LoanManagemet/useLaonState";
import useLoanQuery from "../../../hooks/LoanManagemet/useLoanQuery";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import useCalculation from "../../../hooks/LoanManagemet/useCalculation";
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
const CreateLoanMgtModal = ({ handleClose, open, organisationId }) => {
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const [error, setError] = useState("");
  const [errors, setErrors] = useState("");
  const {
    loanType,
    rateOfIntereset,
    loanAmount,
    loanDisbursementDate,
    noOfEmi,
    loanCompletedDate,
    setLoanType,
    setLoanAmount,
    setDisbursementDate,
  } = useLaonState();

  const { getEmployeeLoanType, getTotalSalaryEmployee } =
    useLoanQuery(organisationId);

  const {
    interestPerMonth,
    principalPerMonth,
    totalDeductionPerMonth,
    totalAmountWithSimpleInterest,
    handleNoOfEmiChange,
  } = useCalculation();

  const queryClient = useQueryClient();
  const AddLoanData = useMutation(
    (data) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/add-loan-data`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),

    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["loanDatas"] });
        handleAlert(true, "success", "Loan data added successfully");
        window.location.reload();
        handleClose();
      },
      onError: () => {
        setErrors("An Error occurred while creating a loan data.");
      },
    }
  );

  const createLoanData = async (loanData) => {
    const totalSalary = getTotalSalaryEmployee;

    if (totalSalary < 0.5 * loanData.totalDeductionWithSi) {
      handleAlert(
        true,
        "error",
        "Total deduction should be at least 50% of your total monthly salary"
      );
      return;
    }

    try {
      await AddLoanData.mutateAsync(loanData);
    } catch (error) {
      console.error("An error occurred while creating a loan data", error);
      setErrors("An Error occurred while creating a loan data.");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        loanType: loanType,
        rateOfIntereset: rateOfIntereset,
        loanAmount: loanAmount,
        loanDisbursementDate: loanDisbursementDate,
        loanCompletedDate: loanCompletedDate,
        noOfEmi: noOfEmi,
        loanPrincipalAmount: principalPerMonth,
        loanInteresetAmount: interestPerMonth,
        totalDeduction: totalDeductionPerMonth,
        totalDeductionWithSi: totalAmountWithSimpleInterest,
        totalSalary: getTotalSalaryEmployee,
      };
      if (!loanType) {
        setError("Loan type field is Mandatory");
        return false;
      }
      await createLoanData(data);
    } catch (error) {
      console.error(error);
      setErrors("An error occurred while creating a loan data");
    }
  };
  console.log(errors);
  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "800px!important",
          height: "100%",
          maxHeight: "85vh!important",
        },
      }}
      open={open}
      onClose={handleClose}
      className="w-full"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="flex w-full justify-between py-4 items-center  px-4">
        <h1 className="text-xl pl-2 font-semibold font-sans">
          Apply for loans
        </h1>
      </div>

      <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
        <div className="px-5 space-y-4 mt-4">
          <div className="px-5 space-y-4 mt-4">
            <div className="space-y-2 ">
              <FormLabel className="text-md mb-2">Select loan type</FormLabel>
              <FormControl size="small" fullWidth>
                <InputLabel>Loan type</InputLabel>
                <Select
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                  label="loan type"
                >
                  {getEmployeeLoanType?.length > 0 ? (
                    getEmployeeLoanType?.map((item, id) => (
                      <MenuItem key={id} value={item?._id}>
                        {item?.loanName}
                      </MenuItem>
                    ))
                  ) : (
                    <div className="flex w-full items-center justify-center p-2">
                      No data Found
                    </div>
                  )}
                </Select>
              </FormControl>
              {error && <p className="text-red-500">*{error}</p>}
            </div>

            <div className="space-y-2 ">
              <FormLabel className="text-md">Rate of interest</FormLabel>
              <FormControl
                size="small"
                sx={{ width: "100%" }}
                variant="outlined"
              >
                <InputLabel>Rate of interest</InputLabel>
                <OutlinedInput
                  value={rateOfIntereset}
                  label="Rate of interest"
                />
              </FormControl>
            </div>
            <div className="space-y-2">
              <FormLabel className="text-md">Loan amount Rs</FormLabel>
              <FormControl
                size="small"
                sx={{ width: "100%" }}
                variant="outlined"
              >
                <InputLabel>Loan amount Rs</InputLabel>
                <OutlinedInput
                  value={loanAmount}
                  onChange={(e) => {
                    const amount = e.target.value;
                    if (amount >= 0 || amount === "") {
                      setLoanAmount(amount);
                    }
                  }}
                  id="outlined-adornment-password"
                  label="Loan amount Rs"
                  type="number"
                  inputProps={{ min: "0" }}
                />
              </FormControl>
            </div>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                className="w-full"
                components={["DatePicker"]}
                required
              >
                <DatePicker
                  label="Loan Disbursement date"
                  value={loanDisbursementDate}
                  onChange={(newDate) => {
                    const formattedDate = dayjs(newDate).format("YYYY-MM-DD");
                    setDisbursementDate(formattedDate);
                  }}
                  slotProps={{
                    textField: { size: "small", fullWidth: true },
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>

            <div className="space-y-2 ">
              <FormLabel className="text-md">
                No of EMIs for loan prepayment
              </FormLabel>
              <FormControl
                size="small"
                sx={{ width: "100%" }}
                variant="outlined"
              >
                <InputLabel>No of EMIs</InputLabel>
                <OutlinedInput
                  value={noOfEmi}
                  onChange={handleNoOfEmiChange}
                  label="No of EMIs"
                />
              </FormControl>
            </div>
            <div className="space-y-2 ">
              <FormLabel className="text-md">Loan completion date</FormLabel>
              <FormControl
                size="small"
                sx={{ width: "100%" }}
                variant="outlined"
              >
                <InputLabel>Loan completion date</InputLabel>
                <OutlinedInput
                  value={loanCompletedDate}
                  label=" Loan completion date"
                />
              </FormControl>
            </div>
            <div className=" flex  gap-2 w-full">
              <div className="space-y-2  w-[50%]">
                <FormLabel className="text-md">
                  Principal amount monthly deducted
                </FormLabel>

                <FormControl
                  size="small"
                  sx={{ width: "100%" }}
                  variant="outlined"
                >
                  <InputLabel>Principal amount monthly</InputLabel>
                  <OutlinedInput
                    value={principalPerMonth || ""}
                    label="Principal amount monthly"
                  />
                </FormControl>
              </div>
              <div className="space-y-2 w-[50%]">
                <FormLabel
                  className="text-md"
                  htmlFor="demo-simple-select-label"
                >
                  Interest amount monthly deducted
                </FormLabel>
                <FormControl
                  size="small"
                  sx={{ width: "100%" }}
                  variant="outlined"
                >
                  <InputLabel>Interest amount monthly</InputLabel>
                  <OutlinedInput
                    value={interestPerMonth}
                    label="Interest amount monthly"
                  />
                </FormControl>
              </div>
            </div>
            <div className=" flex  gap-2 w-full">
              <div className="space-y-2  w-[50%]">
                <FormLabel
                  className="text-md"
                  htmlFor="demo-simple-select-label"
                >
                  Total amount monthly deducted
                </FormLabel>
                <FormControl
                  size="small"
                  sx={{ width: "100%" }}
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Total amount monthly
                  </InputLabel>
                  <OutlinedInput
                    value={totalDeductionPerMonth}
                    id="outlined-adornment-password"
                    label="Total amount monthly"
                  />
                </FormControl>
              </div>
              <div className="space-y-2 w-[50%]">
                <FormLabel
                  className="text-md"
                  htmlFor="demo-simple-select-label"
                >
                  Total amount with simple interest
                </FormLabel>
                <FormControl
                  size="small"
                  sx={{ width: "100%" }}
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Total amount with simple interest
                  </InputLabel>
                  <OutlinedInput
                    value={totalAmountWithSimpleInterest}
                    id="outlined-adornment-password"
                    label="Total amount with simple interest"
                  />
                </FormControl>
              </div>
            </div>
          </div>
          <DialogActions sx={{ justifyContent: "end" }}>
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>

            <Button onClick={handleSubmit} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLoanMgtModal;
