import { zodResolver } from "@hookform/resolvers/zod";
import { ContactMail } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { React, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useEmpQuery from "../../../hooks/Employee-OnBoarding/useEmpQuery";
// import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";
import useVendorState from "../../../hooks/Vendor-Onboarding/useVendorState";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
// import UploadDocumentModal from "../../DocumentManagement/components/UploadDocumentModal";
import Uploaddocument from "./Uploaddocument";


// import { useState } from "react";

const Page3a = ({ isLastStep, nextStep, prevStep, isFirstStep }) => {
  // define state, hook and other if needed
  const organisationId = useParams("");
  const { AdditionalListCall } = useEmpQuery(organisationId);
  const { addtionalFields, addtionalLoading } = AdditionalListCall();
  const { setStep3Data, data ,document} = useVendorState();
  const VendorSchema = z.object({}).catchall(z.any().optional());
  
   console.log("document789",document);
  
  // define the useForm
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      ...data,
      // document,
    },
    resolver: zodResolver(VendorSchema),
  });
  

   // for upload the document
   const [createModalOpen, setCreateModalOpen] = useState(false);
   const handleCreateModalOpen = () => {
     setCreateModalOpen(true);
   };
  
   const handleCreateModalClose = () => {
    setCreateModalOpen(false);
  };



 
  // to define the onSubmit function
  const onSubmit = (testData) => {
    console.log("Test 3", testData);
    setStep3Data(testData);
    nextStep();
  };


  const { errors } = formState;
  if (addtionalLoading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className="w-full mt-4">
      <h1 className="text-2xl mb-4 font-bold">Additional Info</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex  flex-1 flex-col"
      >
        {/* <div className="grid grid-cols-2 w-full gap-3"> */}
        <div className="grid grid-cols-1  md:grid-cols-3 w-full gap-4">
          {addtionalFields?.inputField?.inputDetail?.map((input, id) => (
            <>
            
              {input.isActive && (
                <AuthInputFiled
                  name={input.label}
                  placeholder={input.label}
                  label={input.placeholder}
                  icon={ContactMail}
                  control={control}
                  type={input.inputType}
                  errors={errors}
                  error={errors.label}
                  className="text-sm" 
                />
              )}
            </>
          ))}
        </div>

            <div className="flex justify-center w-full">
              <Button
                className="!font-semibold !bg-sky-500 flex gap-2"
                variant="contained"
                onClick={handleCreateModalOpen}
              >
                <Add />
                Upload Document
              </Button>
            </div>
        
   {/* for create */}
   <Uploaddocument
        handleClose={handleCreateModalClose}
        open={createModalOpen}
      />


        <div className="flex items-end w-full justify-between">
          <button
            type="button"
            onClick={() => {
              prevStep();
            }}
            className="!w-max flex group justify-center px-6  gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            Prev
          </button>
          <button
            type="submit"
            disabled={isLastStep}
            className="!w-max flex group justify-center px-6  gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page3a;
