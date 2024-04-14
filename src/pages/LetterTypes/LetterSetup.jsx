import { zodResolver } from "@hookform/resolvers/zod";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import Setup from "../SetUpOrganization/Setup";

const LetterSetup = () => {
  const letterTypes = [
    "Employment Offer Letter",
    "Appointment Letter",
    "Promotion Letter",
    "Transfer Letter",
    "Termination Letter",
    "Resignation Acceptance Letter",
    "Confirmation Letter",
    "Performance Appraisal Letter",
    "Warning Letter",
    "Salary Increment Letter",
    "Training Invitation Letter",
    "Employee Recognition Letter",
  ];
  const organizationSchema = z.object({
    EmploymentOfferLetter: z.object({
      workflow: z.boolean(),
      downcast: z.boolean(),
    }),
    AppointmentLetter: z.object({
      workflow: z.boolean(),
      downcast: z.boolean(),
    }),
    PromotionLetter: z.object({
      workflow: z.boolean(),
      downcast: z.boolean(),
    }),
    TransferLetter: z.object({
      workflow: z.boolean(),
      downcast: z.boolean(),
    }),
    TerminationLetter: z.object({
      workflow: z.boolean(),
      downcast: z.boolean(),
    }),
    ResignationAcceptanceLetter: z.object({
      workflow: z.boolean(),
      downcast: z.boolean(),
    }),
    ConfirmationLetterLetter: z.object({
      workflow: z.boolean(),
      downcast: z.boolean(),
    }),
    PerformanceAppraisalLetter: z.object({
      workflow: z.boolean(),
      downcast: z.boolean(),
    }),
    WarningLetter: z.object({
      workflow: z.boolean(),
      downcast: z.boolean(),
    }),
    SalaryIncrementLetter: z.object({
      workflow: z.boolean(),
      downcast: z.boolean(),
    }),
    TrainingInvitationLetter: z.object({
      workflow: z.boolean(),
      downcast: z.boolean(),
    }),
    EmployeeRecognitionLetter: z.object({
      workflow: z.boolean(),
      downcast: z.boolean(),
    }),
  });
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {},
    resolver: zodResolver(organizationSchema),
  });
  const { errors } = formState;
  return (
    <div>
      <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
        <Setup>
          <article className="SetupSection bg-white w-[80%] h-max shadow-md rounded-sm border items-center">
            <div className="p-4 border-b-[.5px] flex items-center justify-between gap-3 w-full border-gray-300">
              <div className="flex gap-3 ">
                <div className="mt-1">
                  <FolderOutlinedIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Letter Setup</h1>
                  <p className="text-xs text-gray-600">
                    Setup related to letter types which employee's would be
                    receiving.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div>
                <>
                  <div className="flex gap-4">
                    {/* <h1>{item}</h1> */}
                    <div
                      className="py-2 px-5"
                      style={{ borderRight: "1px solid #e6e8eb" }}
                    >
                      <div className="flex gap-2">
                        <h1 className="pt-2">Employment Offer Letter</h1>
                        <AuthInputFiled
                          name="EmploymentOfferLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                        <AuthInputFiled
                          name="AppointmentLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                      </div>
                      <div className="flex gap-2">
                        <h1 className="pt-2">EmploymentOfferLetter</h1>
                        <AuthInputFiled
                          name="EmploymentOfferLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                        <AuthInputFiled
                          name="AppointmentLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                      </div>
                      <div className="flex gap-2">
                        <h1 className="pt-2">EmploymentOfferLetter</h1>
                        <AuthInputFiled
                          name="EmploymentOfferLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                        <AuthInputFiled
                          name="AppointmentLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                      </div>
                      <div className="flex gap-2">
                        <h1 className="pt-2">EmploymentOfferLetter</h1>
                        <AuthInputFiled
                          name="EmploymentOfferLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                        <AuthInputFiled
                          name="AppointmentLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                      </div>
                      <div className="flex gap-2">
                        <h1 className="pt-2">EmploymentOfferLetter</h1>
                        <AuthInputFiled
                          name="EmploymentOfferLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                        <AuthInputFiled
                          name="AppointmentLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                      </div>
                      <div className="flex gap-2">
                        <h1 className="pt-2">EmploymentOfferLetter</h1>
                        <AuthInputFiled
                          name="EmploymentOfferLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                        <AuthInputFiled
                          name="AppointmentLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                      </div>
                    </div>
                    <div className="py-2 px-5">
                      <div className="flex gap-2">
                        <h1 className="pt-2">EmploymentOfferLetter</h1>
                        <AuthInputFiled
                          name="EmploymentOfferLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                        <AuthInputFiled
                          name="AppointmentLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                      </div>
                      <div className="flex gap-2">
                        <h1 className="pt-2">EmploymentOfferLetter</h1>
                        <AuthInputFiled
                          name="EmploymentOfferLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                        <AuthInputFiled
                          name="AppointmentLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                      </div>
                      <div className="flex gap-2">
                        <h1 className="pt-2">EmploymentOfferLetter</h1>
                        <AuthInputFiled
                          name="EmploymentOfferLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                        <AuthInputFiled
                          name="AppointmentLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                      </div>
                      <div className="flex gap-2">
                        <h1 className="pt-2">EmploymentOfferLetter</h1>
                        <AuthInputFiled
                          name="EmploymentOfferLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                        <AuthInputFiled
                          name="AppointmentLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                      </div>
                      <div className="flex gap-2">
                        <h1 className="pt-2">EmploymentOfferLetter</h1>
                        <AuthInputFiled
                          name="EmploymentOfferLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                        <AuthInputFiled
                          name="AppointmentLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                      </div>
                      <div className="flex gap-2">
                        <h1 className="pt-2">EmploymentOfferLetter</h1>
                        <AuthInputFiled
                          name="EmploymentOfferLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                        <AuthInputFiled
                          name="AppointmentLetter"
                          control={control}
                          type="checkbox"
                          placeholder="Dual Workflow"
                          label="Dual Workflow "
                          errors={errors}
                          error={errors.dualWorkflow}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <Button variant="contained" size="small">
                      Submit
                    </Button>
                  </div>
                </>
              </div>
            </div>
          </article>
        </Setup>
      </section>
    </div>
  );
};

export default LetterSetup;
