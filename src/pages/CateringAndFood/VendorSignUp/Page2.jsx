import React, { useState } from "react";
import { useForm } from "react-hook-form";
// import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// import moment from "moment";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import useEmpOption from "../../../hooks/Employee-OnBoarding/useEmpOption";
// import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";
import useVendorState from "../../../hooks/Vendor-Onboarding/useVendorState";
// import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import { Work, ContactMail, Key, KeyOff } from "@mui/icons-material";

const Page2 = ({ isLastStep, nextStep, prevStep }) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleCPassword, setVisibleCPassword] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFrequency, setSelectedMenuFrequency] = useState([]);

  // const organisationId = useParams("");

  // const {
  // s
  // } = useEmpOption(organisationId);
  const {
    vendorId,
    confirmPassword,
    password,
    payment_info,

    companyname,
    setStep2Data,
  } = useVendorState();

  // const { data } = useSubscriptionGet(organisationId);

  const VendorSchema = z
    .object({
      password: z
        .string()
        .min(8)
        .refine((value) => passwordRegex.test(value), {
          message:
            "Password must be 8+ characters with 1 number and 1 special character.",
        }),
      confirmPassword: z.string(),
      payment_info: z.string(),

      vendorId: z
        .string()
        .min(1, { message: "Vendor code is required" })
        .max(25, { message: "Vendor code cannot exceed 25 characters." }),
      mgrempid: z
        .object({ label: z.string().optional(), value: z.string().optional() })
        .optional()
        .nullable(),

      companyname: z.string(),
      profile: z.string().array().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      vendorId,
      confirmPassword,
      password,
      payment_info,

      companyname,
    },
    resolver: zodResolver(VendorSchema),
  });

  const { errors } = formState;

  const handleFileUpload = (e) => {
    const filesArray = Array.from(e.target.files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...filesArray]);
  };

  const onSubmit = (data) => {
    console.log("Form data:", {
      ...data,
      uploadedFiles,
      selectedDocumentType,
      selectedFrequency,
    });
    setStep2Data(data);
    nextStep();
  };

  return (
    <div className="w-full mt-1">
      <h1 className="text-2xl mb-3 font-bold">Company Info</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
          <AuthInputFiled
            name="vendorId"
            icon={Work}
            control={control}
            type="text"
            placeholder="Employee Code"
            label="Vendor Code *"
            errors={errors}
            error={errors.vendorId}
            className="text-sm"
          />
          <AuthInputFiled
            name="companyname"
            icon={ContactMail}
            control={control}
            type="text"
            placeholder="Company Name"
            label="Vendor Company Name *"
            errors={errors}
            error={errors.companyemail}
            className="text-sm"
            wrapperMessage="Note this email is used for login credentials"
          />
        </div>

        <div className="mt-4 mb-4">
          <label className="block mb-1">
            Select frequency for uploading menu
          </label>
          <select
            value={selectedFrequency}
            onChange={(e) => setSelectedMenuFrequency(e.target.value)}
            className="block w-full border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100 transition duration-200"
          >
            <option value="">Select Frequency</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="fortnightly">Fortnightly</option>
          </select>
        </div>

        <div className="mt-4 mb-4">
          <label className="block mb-1">Select Document Type</label>
          <select
            value={selectedDocumentType}
            onChange={(e) => setSelectedDocumentType(e.target.value)}
            className="block w-full border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100 transition duration-200"
          >
            <option value="">Select Document</option>
            <option value="pan_card">PAN Card</option>
            <option value="aadhar_card">Aadhar Card</option>
            <option value="food_catering_license">Food Catering License</option>
            <option value="bank_account">Bank Account</option>
          </select>
        </div>

        <div className="mt-4 mb-4">
          <label className="block">Upload Document(s)</label>
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".pdf, .jpeg, .jpg"
            multiple
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100 transition duration-200"
          />
          {uploadedFiles.length > 0 && (
            <div className="mt-2 text-green-600">
              <p>{uploadedFiles.length} file(s) uploaded:</p>
              <ul>
                {uploadedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <AuthInputFiled
          name="payment_info"
          control={control}
          placeholder="Enter Upi_Id"
          type="text"
          label="Payment Information (UPI ID)"
          errors={errors}
          error={errors.payment_info}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
          <AuthInputFiled
            name="password"
            visible={visiblePassword}
            setVisible={setVisiblePassword}
            icon={Key}
            control={control}
            type="password"
            label="Password *"
            errors={errors}
            error={errors.password}
            className="text-sm"
          />
          <AuthInputFiled
            name="confirmPassword"
            visible={visibleCPassword}
            setVisible={setVisibleCPassword}
            icon={KeyOff}
            control={control}
            type="password"
            label="Confirm Password *"
            errors={errors}
            error={errors.confirmPassword}
            className="text-sm"
          />
        </div>

        <div className="flex items-end justify-between w-full">
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center justify-center px-6 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 rounded-md"
          >
            Prev
          </button>
          <button
            type="submit"
            disabled={isLastStep}
            className="flex items-center justify-center px-6 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 rounded-md"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page2;
