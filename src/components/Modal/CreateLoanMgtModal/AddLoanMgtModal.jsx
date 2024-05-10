import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React, { useContext, useEffect } from "react";
import useLaonState from "../../../hooks/LoanManagemet/useLaonState";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";
import { Business, Person } from "@mui/icons-material";
import useLoanOption from "../../../hooks/LoanManagemet/useLoanOption";
import useCalculation from "../../../hooks/LoanManagemet/useCalculation";
import { useMutation, useQueryClient } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
import axios from "axios";

const AddLoanMgtModal = ({ handleClose, open, organisationId }) => {
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const {
    loanType,
    rateOfIntereset,
    loanAmount,
    loanDisbursementDate,
    noOfEmi,
    loanCompletedDate,
  } = useLaonState();

  const { LoanTypeListOption } = useLoanOption(organisationId);

  const {
    interestPerMonth,
    principalPerMonth,
    totalDeductionPerMonth,
    totalAmountWithSimpleInterest,
  } = useCalculation();

  const LoanManagemetSchema = z.object({
    loanType: z.object({
      label: z.string(),
      value: z.string(),
    }),
    rateOfIntereset: z.string(),
    loanAmount: z.string(),
    loanDisbursementDate: z.string(),
    noOfEmi: z.string(),
    loanCompletedDate: z.string(),
  });

  const { control, formState, handleSubmit, setValue } = useForm({
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

  useEffect(() => {
    setValue("principalPerMonth", principalPerMonth.toString());
    setValue("interestPerMonth", interestPerMonth.toString());
    setValue("totalDeductionPerMonth", totalDeductionPerMonth.toString());
    setValue("totalAmountWithSimpleInterest", totalAmountWithSimpleInterest.toString());
  }, [principalPerMonth, interestPerMonth, totalDeductionPerMonth, totalAmountWithSimpleInterest, setValue]);

  const { errors } = formState;

  const queryClient = useQueryClient();

  const ApplyLoan = useMutation(
    (data) =>
      axios.post(`${process.env.REACT_APP_API}/route/organization/${organisationId}/add-loan-data`, data, {
        headers: {
          Authorization: authToken,
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["loanDatas"] });
        handleClose();
        handleAlert(
          true,
          "success",
          "Your loan application has been submitted successfully. It is now awaiting approval from HR"
        );
      },
      onError: () => {
        console.log("An Error occurred while creating a loan data.");
      },
    }
  );

  const onSubmit = async (data) => {
    try {
      const requestData = {
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
        organizationId: organisationId,
      };
      await ApplyLoan.mutateAsync(requestData);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "An error occurred while applying loan ");
    }
  };

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
          <h1 className="text-xl pl-2 font-semibold font-sans">Apply For Loans</h1>
        </div>

        <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
          <form onSubmit={handleSubmit(onSubmit)} className="px-5 space-y-4 mt-4">
            <div className="px-5 space-y-4 mt-4">
              <div className="px-5 space-y-4 mt-4">
                <div className="space-y-2 ">
                  <AuthInputFiled
                    name="loanType"
                    value={loanType}
                    icon={Business}
                    control={control}
                    type="select"
                    placeholder="Loan Type"
                    label="Select Loan Type  *"
                    errors={errors}
                    error={errors.loanType}
                    options={LoanTypeListOption}
                  />
                </div>
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

                <div className="space-y-2 ">
                  <AuthInputFiled
                    name="loanAmount"
                    icon={Business}
                    control={control}
                    type="text"
                    placeholder="Loan Amount"
                    label="Loan Amount *"
                    errors={errors}
                    error={errors.loanAmount}
                  />
                </div>

                <div className="space-y-2 ">
                  <AuthInputFiled
                    name="loanDisbursementDate"
                    icon={Business}
                    control={control}
                    type="date"
                    placeholder="dd-mm-yyyy"
                    label="Loan Disbursment Date *"
                    errors={errors}
                    error={errors.loanDisbursementDate}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2 ">
                  <AuthInputFiled
                    name="loanCompletedDate"
                    icon={Business}
                    control={control}
                    type="date"
                    placeholder="dd-mm-yyyy"
                    label="Loan Completion Date *"
                    errors={errors}
                    error={errors.loanCompletedDate}
                  />
                </div>

                <div className="space-y-2 ">
                  <AuthInputFiled
                    name="noOfEmi"
                    icon={Business}
                    control={control}
                    type="text"
                    placeholder="No of EMIs"
                    label="No of EMIs *"
                    errors={errors}
                    error={errors.noOfEmi}
                  />
                </div>

                <div className="flex w-full gap-2">
                  <div className=" w-[50%] ">
                    <AuthInputFiled
                      name="principalPerMonth"
                      icon={Person}
                      control={control}
                      type="text"
                      placeholder="Principal amount monthly"
                      label="Principal amount monthly *"
                      errors={errors}
                      error={errors.principalPerMonth}
                    />
                  </div>
                  <div className=" w-[50%]">
                    <AuthInputFiled
                      name="interestPerMonth"
                      icon={Person}
                      control={control}
                      type="text"
                      placeholder="Interest amount monthly"
                      label="Interest amount monthly *"
                      errors={errors}
                      error={errors.interestPerMonth}
                    />
                  </div>
                </div>

                <div className="flex w-full gap-2">
                  <div className=" w-[50%] ">
                    <AuthInputFiled
                      name="totalDeductionPerMonth"
                      icon={Person}
                      control={control}
                      type="text"
                      placeholder=" Total amount monthly deducted"
                      label=" Total amount monthly deducted *"
                      errors={errors}
                      error={errors.totalDeductionPerMonth}
                    />
                  </div>
                  <div className=" w-[50%]">
                    <AuthInputFiled
                      name="totalAmountWithSimpleInterest"
                      icon={Person}
                      control={control}
                      type="text"
                      placeholder=" Total amount with simple interest"
                      label=" Total amount with simple interest *"
                      errors={errors}
                      error={errors.totalAmountWithSimpleInterest}
                    />
                  </div>
                </div>
              </div>
              <DialogActions sx={{ justifyContent: "end" }}>
                <Button onClick={handleClose} color="error" variant="outlined">
                  Cancel
                </Button>

                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </DialogActions>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddLoanMgtModal;
