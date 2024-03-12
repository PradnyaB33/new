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
import React from "react";
import useLaonState from "../../../hooks/LoanManagemet/useLaonState";
import useLoanQuery from "../../../hooks/LoanManagemet/useLoanQuery";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
const CreateLoanMgtModal = ({ handleClose, open, organisationId }) => {
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
    setPrincipalAmount,
    setInteresetAmount,
    setTotalDeduction,
  } = useLaonState();

  const { getEmployeeLoanType } = useLoanQuery(organisationId);

  // calculate the loan completion datea
  const handleNoOfEmiChange = (e) => {
    const value = e.target.value;
    setNoOfEmi(value);
    calculateCompletionDate(loanDisbursementDate, value);
  };

  const calculateCompletionDate = (disbursementDate, emiCount) => {
    const monthsToAdd = parseInt(emiCount);
    if (!isNaN(monthsToAdd)) {
      const completionDate = dayjs(disbursementDate)
        .add(monthsToAdd - 1, "month")
        .format("MM-DD-YYYY");
      setCompletedDate(completionDate);
    }
  };

  // calculate the no of years
  let emiCount = parseInt(noOfEmi);
  const calculateNumberOfYears = () => {
    let numberOfYears = emiCount / 12;
    return numberOfYears;
  };
  //  calculate the  simple interest per month
  const simpleInterest =
    loanAmount * rateOfIntereset * calculateNumberOfYears();
  console.log(simpleInterest);

  // calculate interest amount monthly
  const interestAmountPerMonth = simpleInterest / emiCount;
  console.log(interestAmountPerMonth);

  // calculate the total amount
  const totalAmountRs = simpleInterest + parseInt(loanAmount);
  console.log(totalAmountRs);

  // calculate the principal amount monthly
  const principalAmountPerMonth = totalAmountRs / emiCount;
  console.log(principalAmountPerMonth);

  // calculate the total deduction per month
  const totalDeductionPerMonth =
    interestAmountPerMonth + principalAmountPerMonth;
  console.log(totalDeductionPerMonth);
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
              <FormLabel className="text-md mb-2" htmlFor="name">
                Select loan type
              </FormLabel>
              <FormControl size="small" fullWidth>
                <InputLabel id="demo-simple-select-label">Loan type</InputLabel>
                <Select
                  id="demo-simple-select"
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
            </div>
            <div className="space-y-2 ">
              <FormLabel className="text-md" htmlFor="demo-simple-select-label">
                Rate of interest
              </FormLabel>
              <FormControl
                size="small"
                sx={{ width: "100%" }}
                variant="outlined"
              >
                <OutlinedInput
                  value={rateOfIntereset}
                  id="outlined-adornment-password"
                />
              </FormControl>
            </div>
            <div className="space-y-2">
              <FormLabel className="text-md" htmlFor="demo-simple-select-label">
                Loan amount Rs
              </FormLabel>
              <FormControl
                size="small"
                sx={{ width: "100%" }}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Loan amount Rs
                </InputLabel>
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
              <FormLabel className="text-md" htmlFor="demo-simple-select-label">
                No of EMIs for loan prepayment
              </FormLabel>
              <FormControl
                size="small"
                sx={{ width: "100%" }}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  No of EMIs
                </InputLabel>
                <OutlinedInput
                  value={noOfEmi}
                  onChange={handleNoOfEmiChange}
                  id="outlined-adornment-password"
                  label="No of EMIs"
                />
              </FormControl>
            </div>
            <div className="space-y-2 ">
              <FormLabel className="text-md" htmlFor="demo-simple-select-label">
                Date
              </FormLabel>
              <FormControl
                size="small"
                sx={{ width: "100%" }}
                variant="outlined"
              >
                <OutlinedInput
                  value={loanCompletedDate}
                  id="outlined-adornment-password"
                />
              </FormControl>
            </div>
            <div className=" flex  gap-2 w-full">
              <div className="space-y-2  w-[50%]">
                <FormLabel
                  className="text-md"
                  htmlFor="demo-simple-select-label"
                >
                  Loan principal amount monthly deducted
                </FormLabel>
                <FormControl
                  size="small"
                  sx={{ width: "100%" }}
                  variant="outlined"
                >
                  <OutlinedInput
                    value={principalAmountPerMonth}
                    onChange={(e) => setPrincipalAmount(e.target.value)}
                    id="outlined-adornment-password"
                  />
                </FormControl>
              </div>
              <div className="space-y-2 w-[50%]">
                <FormLabel
                  className="text-md"
                  htmlFor="demo-simple-select-label"
                >
                  Loan interest amount monthly deducted
                </FormLabel>
                <FormControl
                  size="small"
                  sx={{ width: "100%" }}
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Loan interest amount
                  </InputLabel>
                  <OutlinedInput
                    value={interestAmountPerMonth}
                    onChange={(e) => setInteresetAmount(e.target.value)}
                    id="outlined-adornment-password"
                    label="Loan interest amount"
                  />
                </FormControl>
              </div>
            </div>
            <div className="space-y-2 ">
              <FormLabel className="text-md" htmlFor="demo-simple-select-label">
                Total deduction monthly
              </FormLabel>
              <FormControl
                size="small"
                sx={{ width: "100%" }}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Total deduction monthly
                </InputLabel>
                <OutlinedInput
                  value={totalDeductionPerMonth}
                  onChange={(e) => setTotalDeduction(e.target.value)}
                  id="outlined-adornment-password"
                  label="Total deduction monthly"
                />
              </FormControl>
            </div>
          </div>
          <DialogActions sx={{ justifyContent: "end" }}>
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>

            <Button variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLoanMgtModal;
