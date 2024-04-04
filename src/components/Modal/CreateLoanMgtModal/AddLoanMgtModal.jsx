import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React from "react";
import useLaonState from "../../../hooks/LoanManagemet/useLaonState";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";
const AddLoanMgtModal = ({ handleClose, open, organisationId }) => {
  const { getEmployeeLoanType, getTotalSalaryEmployee } =
    useLoanQuery(organisationId);
  const {
    loanType,
    rateOfIntereset,
    loanAmount,
    loanDisbursementDate,
    noOfEmi,
    loanCompletedDate,
  } = useLaonState();

  const LoanManagemetSchema = z.object({
    loanType: z.string(),
    rateOfIntereset: z.string(),
    loanAmount: z.string(),
    loanDisbursementDate: z.string(),
    noOfEmi: z.string(),
    loanCompletedDate: z.string(),
  });

  const { control, formState, handleSubmit, getValues } = useForm({
    defaultValues: {
      loanType: loanType,
      rateOfIntereset: rateOfIntereset,
      loanAmount: loanAmount,
      loanDisbursementDate: loanDisbursementDate,
      noOfEmi: noOfEmi,
      loanCompletedDate: loanCompletedDate,
    },
    resolver: zodResolver(LoanManagemetSchema),
  });
  return (
    <>
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
            Apply For Loans
          </h1>
        </div>

        <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
          <div className="px-5 space-y-4 mt-4">
            <div className="px-5 space-y-4 mt-4">
              <div className="space-y-2 ">
                <AuthInputFiled
                  name="rateOfIntereset"
                  icon={Business}
                  control={control}
                  type="text"
                  placeholder="Rate Of Interest"
                  label="Rate Of Interest *"
                  errors={errors}
                  error={errors.rateOfIntereset}
                />
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
    </>
  );
};

export default AddLoanMgtModal;
