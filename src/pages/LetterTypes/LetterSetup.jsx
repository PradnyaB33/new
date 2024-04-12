// import { zodResolver } from "@hookform/resolvers/zod";
// import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
// import React from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import Setup from "../SetUpOrganization/Setup";
// const LetterSetup = () => {
//   const letterTypes = [
//     "Employment Offer Letter",
//     "Appointment Letter",
//     "Promotion Letter",
//     "Transfer Letter",
//     "Termination Letter",
//     "Resignation Acceptance Letter",
//     "Confirmation Letter",
//     "Performance Appraisal Letter",
//     "Warning Letter",
//     "Salary Increment Letter",
//     "Training Invitation Letter",
//     "Employee Recognition Letter",
//   ];
//   const organizationSchema = z.object({
//     EmploymentOfferLetter: z.boolean(),
//     AppointmentLetter: z.boolean(),
//     PromotionLetter: z.boolean(),
//     TransferLetter: z.boolean(),
//     TerminationLetter: z.boolean(),
//     ResignationAcceptanceLetter: z.boolean(),
//     ConfirmationLetterLetter: z.boolean(),
//     PerformanceAppraisalLetter: z.boolean(),
//     WarningLetter: z.boolean(),
//     SalaryIncrementLetter: z.boolean(),
//     TrainingInvitationLetter: z.boolean(),
//     EmployeeRecognitionLetter: z.boolean(),
//   });
//   const { control, formState, handleSubmit } = useForm({
//     defaultValues: {},
//     resolver: zodResolver(organizationSchema),
//   });
//   return (
//     <div>
//       <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
//         <Setup>
//           <article className="SetupSection bg-white w-[80%] h-max shadow-md rounded-sm border items-center">
//             <div className="p-4 border-b-[.5px] flex items-center justify-between gap-3 w-full border-gray-300">
//               <div className="flex gap-3 ">
//                 <div className="mt-1">
//                   <FolderOutlinedIcon />
//                 </div>
//                 <div>
//                   <h1 className="!text-lg">Letter Setup</h1>
//                   <p className="text-xs text-gray-600">
//                     Setup related to letter types which employee's would be
//                     receiving.
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <div>
//                 <>
//                   <div className="flex items-center">
//                     {/* <h1>{item}</h1> */}
//                     {/* <AuthInputFiled
//                       name="EmploymentOfferLetter"
//                       icon={Business}
//                       control={control}
//                       type="checkbox"
//                       placeholder="Dual Workflow"
//                       label="Dual Workflow "
//                       errors={errors}
//                       error={errors.dualWorkflow}
//                       descriptionText={
//                         "Enabling workflow ensures account approval after manager's approval otherwise added directly as allowance."
//                       }
//                     />
//                     <AuthInputFiled
//                       name="AppointmentLetter"
//                       icon={Business}
//                       control={control}
//                       type="checkbox"
//                       placeholder="Dual Workflow"
//                       label="Dual Workflow "
//                       errors={errors}
//                       error={errors.dualWorkflow}
//                       descriptionText={
//                         "Enabling workflow ensures account approval after manager's approval otherwise added directly as allowance."
//                       }
//                     />
//                     <AuthInputFiled
//                       name="PromotionLetter"
//                       icon={Business}
//                       control={control}
//                       type="checkbox"
//                       placeholder="Dual Workflow"
//                       label="Dual Workflow "
//                       errors={errors}
//                       error={errors.dualWorkflow}
//                       descriptionText={
//                         "Enabling workflow ensures account approval after manager's approval otherwise added directly as allowance."
//                       }
//                     />
//                     <AuthInputFiled
//                       name="TransferLetter"
//                       icon={Business}
//                       control={control}
//                       type="checkbox"
//                       placeholder="Dual Workflow"
//                       label="Dual Workflow "
//                       errors={errors}
//                       error={errors.dualWorkflow}
//                       descriptionText={
//                         "Enabling workflow ensures account approval after manager's approval otherwise added directly as allowance."
//                       }
//                     />
//                     <AuthInputFiled
//                       name="TerminationLetter"
//                       icon={Business}
//                       control={control}
//                       type="checkbox"
//                       placeholder="Dual Workflow"
//                       label="Dual Workflow "
//                       errors={errors}
//                       error={errors.dualWorkflow}
//                       descriptionText={
//                         "Enabling workflow ensures account approval after manager's approval otherwise added directly as allowance."
//                       }
//                     />
//                     <AuthInputFiled
//                       name="ResignationAcceptanceLetter"
//                       icon={Business}
//                       control={control}
//                       type="checkbox"
//                       placeholder="Dual Workflow"
//                       label="Dual Workflow "
//                       errors={errors}
//                       error={errors.dualWorkflow}
//                       descriptionText={
//                         "Enabling workflow ensures account approval after manager's approval otherwise added directly as allowance."
//                       }
//                     />
//                     <AuthInputFiled
//                       name="ConfirmationLetter"
//                       icon={PriceChangeOutlined}
//                       control={control}
//                       type="checkbox"
//                       placeholder="Enable Extra Allowance"
//                       label="Enable Extra Allowance "
//                       errors={errors}
//                       error={errors.allowance}
//                       descriptionText={
//                         "Enabling allowance will allow the employee to get extra amount."
//                       }
//                     />
//                     <AuthInputFiled
//                       name="PerformanceAppraisalLetter"
//                       icon={PriceChangeOutlined}
//                       control={control}
//                       type="checkbox"
//                       placeholder="Enable Extra Allowance"
//                       label="Enable Extra Allowance "
//                       errors={errors}
//                       error={errors.allowance}
//                       descriptionText={
//                         "Enabling allowance will allow the employee to get extra amount."
//                       }
//                     />
//                     <AuthInputFiled
//                       name="WarningLetter"
//                       icon={PriceChangeOutlined}
//                       control={control}
//                       type="checkbox"
//                       placeholder="Enable Extra Allowance"
//                       label="Enable Extra Allowance "
//                       errors={errors}
//                       error={errors.allowance}
//                       descriptionText={
//                         "Enabling allowance will allow the employee to get extra amount."
//                       }
//                     />
//                     <AuthInputFiled
//                       name="SalaryIncrementLetter"
//                       icon={PriceChangeOutlined}
//                       control={control}
//                       type="checkbox"
//                       placeholder="Enable Extra Allowance"
//                       label="Enable Extra Allowance "
//                       errors={errors}
//                       error={errors.allowance}
//                       descriptionText={
//                         "Enabling allowance will allow the employee to get extra amount."
//                       }
//                     />
//                     <AuthInputFiled
//                       name="TrainingInvitationLetter"
//                       icon={PriceChangeOutlined}
//                       control={control}
//                       type="checkbox"
//                       placeholder="Enable Extra Allowance"
//                       label="Enable Extra Allowance "
//                       errors={errors}
//                       error={errors.allowance}
//                       descriptionText={
//                         "Enabling allowance will allow the employee to get extra amount."
//                       }
//                     />
//                     <AuthInputFiled
//                       name="EmployeeRecognitionLetter"
//                       icon={PriceChangeOutlined}
//                       control={control}
//                       type="checkbox"
//                       placeholder="Enable Extra Allowance"
//                       label="Enable Extra Allowance "
//                       errors={errors}
//                       error={errors.allowance}
//                       descriptionText={
//                         "Enabling allowance will allow the employee to get extra amount."
//                       }
//                     /> */}
//                   </div>
//                 </>
//               </div>
//             </div>
//           </article>
//         </Setup>
//       </section>
//     </div>
//   );
// };

// export default LetterSetup;
