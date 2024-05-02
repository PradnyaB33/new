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
  Typography,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
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
  const [loanAmountError, setLoanAmountError] = useState("");
  const [loanValue, setLoanValue] = useState(0);
  const [maxLoanValue, setMaxLoanValue] = useState(0);
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
    setNoOfEmi,
    setCompletedDate,
  } = useLaonState();

  const {
    principalPerMonth,
    totalDeductionPerMonth,
    totalAmountWithSimpleInterest,
    interestPerMonths,
  } = useCalculation();

  const { getEmployeeLoanType, getTotalSalaryEmployee } =
    useLoanQuery(organisationId);

  console.log("get emp laon data", getEmployeeLoanType);

  useEffect(() => {
    if (loanType) {
      const selectedLoanType = getEmployeeLoanType.find(
        (item) => item._id === loanType
      );
      if (selectedLoanType) {
        setLoanValue(selectedLoanType.loanValue);
        setMaxLoanValue(selectedLoanType.maxLoanValue);
      }
    }
  }, [loanType, getEmployeeLoanType]);

  useEffect(() => {
    if (loanDisbursementDate && noOfEmi) {
      calculateCompletionDate(loanDisbursementDate, noOfEmi);
    }
    // eslint-disable-next-line
  }, [loanDisbursementDate, noOfEmi]);

  const handleNoOfEmiChange = (e) => {
    const value = e.target.value;
    setNoOfEmi(value);
    if (loanDisbursementDate) {
      calculateCompletionDate(loanDisbursementDate, value);
    }
  };

  const calculateCompletionDate = (disbursementDate, emiCount) => {
    const monthsToAdd = parseInt(emiCount);
    if (!isNaN(monthsToAdd)) {
      const completionDate = dayjs(disbursementDate)
        .add(monthsToAdd, "month")
        .format("MM-DD-YYYY");
      setCompletedDate(completionDate);
    }
  };

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
        handleAlert(
          true,
          "success",
          "Your loan application has been submitted successfully. It is now awaiting approval from HR"
        );
        handleClose();
        window.location.reload();
      },
      onError: () => {
        setErrors("An Error occurred while creating a loan data.");
      },
    }
  );

  const createLoanData = async (loanData) => {
    const totalSalary = getTotalSalaryEmployee;
    const fiftyPercentOfSalary = totalSalary * 0.5;
    console.log("fiftyPercentOfSalary", fiftyPercentOfSalary);

    if (loanData?.totalDeduction > fiftyPercentOfSalary) {
      handleAlert(
        true,
        "error",
        "Total deduction amount should be 50% of your total monthly salary"
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
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const selectedDisbursementDate = new Date(loanDisbursementDate);
      if (
        selectedDisbursementDate.getFullYear() < currentYear ||
        (selectedDisbursementDate.getFullYear() === currentYear &&
          selectedDisbursementDate.getMonth() + 1 < currentMonth)
      ) {
        setError("You can only apply for loans for future dates and years.");
        return;
      }

      const data = {
        loanType: loanType,
        rateOfIntereset: rateOfIntereset,
        loanAmount: loanAmount,
        loanDisbursementDate: loanDisbursementDate,
        loanCompletedDate: loanCompletedDate,
        noOfEmi: noOfEmi,
        loanPrincipalAmount: principalPerMonth,
        loanInteresetAmount: interestPerMonths,
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
  console.log(loanValue);
  console.log("total salary ", getTotalSalaryEmployee);

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
        <h1 className="text-xl pl-6 font-semibold font-sans">
          Apply For Loans
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

            <div className="space-y-2">
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
                    setLoanAmount(amount); 
                    if (amount <= maxLoanValue) {
                      if (amount >= loanValue) {
                        setLoanAmountError("");
                      } else {
                        setLoanAmountError(
                          "You cannot take the loan amount less than the minimum loan value."
                        );
                      }
                    } else {
                      setLoanAmountError(
                        "You cannot take the loan amount greater than maximum loan value."
                      );
                    }
                  }}
                  id="outlined-adornment-password"
                  label="Loan amount Rs"
                  type="number"
                  inputProps={{ min: "0" }}
                />
              </FormControl>
              {loanAmountError && <p className="text-red-500">*{loanAmountError}</p>}
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
                    setError("");
                  }}
                  slotProps={{
                    textField: { size: "small", fullWidth: true },
                  }}
                  disablePast
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

            <div>Rate of Interest : {rateOfIntereset || ""}</div>
            <div>Min loan value : {loanValue ?? "0"}</div>
            <div>Max loan value : {maxLoanValue ?? "0"}</div>
            <div>Loan completion date : {loanCompletedDate || ""}</div>
            <div>Principal amount monthly : {principalPerMonth ?? "0.00"}</div>
            <div>Interest amount monthly : {interestPerMonths ?? "0.00"}</div>
            <div>
              Total amount monthly deducted : {totalDeductionPerMonth ?? "0.00"}
            </div>
            <div>
              Total amount with simple interest :{" "}
              {totalAmountWithSimpleInterest || "0.00"}
            </div>
          </div>

          <DialogContent className="w-full">
            <Typography variant="body2">Declaration by Employee :</Typography>
            <Typography variant="body2" color="textSecondary">
              I declare that I have not availed any other loan during this year
              and also confirm that there are no dues standing to my credit
              towards loan drawan by me during last year . I agree to pay loan
              amount as per above information
            </Typography>
          </DialogContent>

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
