// /* eslint-disable no-unused-vars */
// import { ErrorMessage } from "@hookform/error-message";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   AccountBalance,
//   AccountBox,
//   ContactEmergency,
//   Email,
//   LocationOn,
//   Person,
//   TodayOutlined,
// } from "@mui/icons-material";
// import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
// import { Controller, useForm } from "react-hook-form";
// import { z } from "zod";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import { useQuery } from "react-query";
// import axios from "axios";
// import { useParams } from "react-router";
// import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";

// import useAuthToken from "../../../hooks/Token/useAuth";

// // Validation function
// export const isAtLeastNineteenYearsOld = (value) => {
//   const currentDate = new Date();
//   const dob = new Date(value);
//   let differenceInYears = currentDate.getFullYear() - dob.getFullYear();
//   const monthDiff = currentDate.getMonth() - dob.getMonth();

//   if (
//     monthDiff < 0 ||
//     (monthDiff === 0 && currentDate.getDate() < dob.getDate())
//   ) {
//     differenceInYears--;
//   }

//   return differenceInYears >= 19;
// };

// const SelfOTest1 = () => {
//   const { employeeId } = useParams();

//   // Schema for form validation
//   const EmployeeSchema = z.object({
//     first_name: z
//       .string()
//       .min(1, { message: "Minimum 1 character required" })
//       .max(15, { message: "Maximum 15 characters allowed" })
//       .regex(/^[a-zA-Z]+$/, { message: "Only characters allowed" }),
//     last_name: z
//       .string()
//       .min(1, { message: "Minimum 1 character required" })
//       .max(15, { message: "Maximum 15 characters allowed" })
//       .regex(/^[a-zA-Z]+$/, { message: "Only characters allowed" }),
//     gender: z.string(),
//     email: z
//       .string()
//       .email({ message: "Invalid email format" })
//       .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, {
//         message:
//           "Email must be in lowercase and should not contain capital letters",
//       }),
//     phone_number: z
//       .string()
//       .regex(/^\d*$/, { message: "Phone Number must contain only digits" })
//       .refine((value) => value.length === 10 || value.length === 0, {
//         message: "Phone Number must be exactly 10 digits or empty",
//       }),
//     address: z.string(),
//     date_of_birth: z.string().refine(isAtLeastNineteenYearsOld, {
//       message: "Employee must be at least 19 years old",
//     }),
//     citizenship: z
//       .string()
//       .min(3, { message: "Minimum 3 characters required" })
//       .regex(/^[a-zA-Z]+$/, { message: "Only characters allowed" }),
//     adhar_card_number: z
//       .string()
//       .length(12, { message: "Aadhar number must be 12 digits." })
//       .regex(/^(?:0|[1-9]\d*)$/, {
//         message: "Aadhar number cannot be negative.",
//       }),
//     pan_card_number: z
//       .string()
//       .regex(/^([A-Z]){5}([0-9]){4}([A-Z]){1}$/, {
//         message: "Invalid PAN No.",
//       })
//       .regex(/^[^*@]+$/, {
//         message: "A PAN No cannot contain a special character, e.g., *,#.",
//       }),
//     bank_account_no: z
//       .string()
//       .max(35, { message: "Only 35 characters allowed" })
//       .regex(/^\d*$/, {
//         message: "Bank account number cannot be negative.",
//       }),
//     pwd: z.boolean().optional(),
//     uanNo: z
//       .string()
//       .refine((value) => value === "" || /^\d{12}$/.test(value), {
//         message: "UAN number must be a 12-digit number",
//       })
//       .optional(),
//     esicNo: z
//       .string()
//       .refine((value) => value === "" || /^\d{17}$/.test(value), {
//         message: "ESIC number must be a 17-digit number",
//       })
//       .optional(),
//   });

//   const {
//     // eslint-disable-next-line no-unused-vars
//     data: employeeData,
//     setStep1Data,
//     // eslint-disable-next-line no-unused-vars
//     setStep3Data,
//   } = useEmpState();

//   const { control, formState, handleSubmit, setValue } = useForm({

//     resolver: zodResolver(EmployeeSchema),
//   });

//   const authToken = useAuthToken();
//   // eslint-disable-next-line no-unused-vars
//   const {
//     data: fetchedEmployees,
//     isLoading,
//     isFetching,
//   } = useQuery(
//     ["employeeId", employeeId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/employee/get/profile/${employeeId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data;
//     },
//     {
//       onSuccess: (data) => {
//         setValue("first_name", data?.employee?.first_name);
//         setValue("last_name", data?.employee?.last_name);
//         setValue("date_of_birth", data?.employee?.date_of_birth);
//         setValue("email", data?.employee?.email);
//         setValue("gender", data?.employee?.gender);
//         setValue("phone_number", data?.employee?.phone_number);
//         setValue("address", data?.employee?.address);
//         setValue("citizenship", data?.employee?.citizenship);
//         setValue("adhar_card_number", data?.employee?.adhar_card_number);
//         setValue("pan_card_number", data?.employee?.pan_card_number);
//         setValue("bank_account_no", data?.employee?.bank_account_no);
//         setValue("pwd", data?.employee?.pwd);
//         setValue("uanNo", data?.employee?.uanNo);
//         setValue("esicNo", data?.employee?.esicNo);
//       },
//     },
//     {
//       onError: (error) => {
//         console.error("Error fetching onboarded employees:", error);
//         alert("Could not fetch onboarded employees. Please try again later.");
//       },
//     }
//   );

//   const { errors } = formState;

//   console.log(errors, "errors");
//   const onSubmit = async (data) => {
//     const processedData = {
//       ...data,
//       email: data.email.toLowerCase(),
//     };

//     setStep1Data(processedData);
//     nextStep();
//   };

//   return (
//     <div className="w-full mt-1">
//       <h1 className="text-2xl mb-3 font-bold">Personal Details</h1>

//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="w-full flex flex-1 space-y-1 flex-col"
//       >

//         <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
//           <AuthInputFiled
//             name="first_name"
//             icon={Person}
//             control={control}
//             type="text"
//             placeholder="john"
//             label="Employee First Name *"
//             errors={errors}
//             error={errors.first_name}
//             className="text-sm"
//           />

//           <AuthInputFiled
//             name="last_name"
//             icon={Person}
//             control={control}
//             type="text"
//             placeholder="Doe"
//             label="Employee Last Name *"
//             errors={errors}
//             error={errors.last_name}
//             className="text-sm"
//           />

//           <AuthInputFiled
//             name="date_of_birth"
//             icon={TodayOutlined}
//             control={control}
//             type="date"
//             placeholder="dd-mm-yyyy"
//             label="Date Of Birth *"
//             errors={errors}
//             error={errors.date_of_birth}
//             className="text-sm"
//           />
//         </div>
//         <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
//           <AuthInputFiled
//             name="email"
//             icon={Email}
//             control={control}
//             type="text"
//             placeholder="Employee Email"
//             label="Employee  Email *"
//             errors={errors}
//             error={errors.email}
//             className="text-sm"
//           />

//           <AuthInputFiled
//             name="phone_number"
//             icon={ContactEmergency}
//             control={control}
//             // value={phone_number}
//             type="number"
//             placeholder="1234567890"
//             label="Contact *"
//             errors={errors}
//             error={errors.phone_number}
//             className="text-sm"
//           />

//           <AuthInputFiled
//             name="address"
//             icon={Person}
//             control={control}
//             // type="textarea"
//             type="text"
//             placeholder="Address"
//             label="Current Address *"
//             errors={errors}
//             error={errors.address}
//             className="text-sm"
//           />
//         </div>

//         <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
//           <div className=" ">
//             <label
//               htmlFor={"gender"}
//               className={`${
//                 errors.gender && "text-red-500"
//               }  text-gray-500  font-bold  text-sm `}
//             >
//               Gender *
//             </label>
//             <Controller
//               control={control}
//               name={"gender"}
//               id={"gender"}
//               render={({ field }) => (
//                 <>
//                   <div
//                     className={`flex items-center gap-5 rounded-md  px-2   bg-white py-1 md:py-[4px]`}
//                   >
//                     <RadioGroup
//                       row
//                       aria-labelledby="demo-row-radio-buttons-group-label"
//                       {...field}
//                     >
//                       <FormControlLabel
//                         value="female"
//                         // control={<Radio />}
//                         control={<Radio size="small" />}
//                         label="Female"
//                       />
//                       <FormControlLabel
//                         value="male"
//                         // control={<Radio />}
//                         control={<Radio size="small" />}
//                         label="Male"
//                       />
//                       <FormControlLabel
//                         value="transgender"
//                         // control={<Radio />}
//                         control={<Radio size="small" />}
//                         label="Transgender"
//                       />
//                     </RadioGroup>
//                   </div>
//                 </>
//               )}
//             />
//             <div className="h-4 w-[200px]  !z-50   !mb-1">
//               <ErrorMessage
//                 errors={errors}
//                 name={"gender"}
//                 render={({ message }) => (
//                   <p className="text-sm mb-4 relative !bg-white  text-red-500">
//                     {message}
//                   </p>
//                 )}
//               />
//             </div>
//           </div>

//           <AuthInputFiled
//             name={"pwd"}
//             placeholder={"Person with disability"}
//             label={"Person with disability"}
//             control={control}
//             type="checkbox"
//             errors={errors}
//             error={errors.pwd}
//             className="mt-2 pt-2 text-sm
//           "
//           />
//         </div>
//         <div className="grid grid-cols-1  md:grid-cols-3 w-full gap-4">
//           <AuthInputFiled
//             name="adhar_card_number"
//             icon={AccountBox}
//             control={control}
//             type="number"
//             placeholder="Aadhar No"
//             label="Employee Aadhar No *"
//             errors={errors}
//             error={errors.adhar_card_number}
//             className=" text-sm
//           "
//           />
//           <AuthInputFiled
//             name="pan_card_number"
//             icon={AccountBox}
//             control={control}
//             type="text"
//             placeholder="Employee PAN No"
//             label="Employee PAN No *"
//             errors={errors}
//             error={errors.pan_card_number}
//             className=" text-sm
//           "
//           />

//           <AuthInputFiled
//             name="bank_account_no"
//             icon={AccountBalance}
//             control={control}
//             type="number"
//             placeholder="Bank Account No"
//             label="Bank Account No*"
//             errors={errors}
//             error={errors.bank_account_no}
//             className="text-sm
//           "
//           />
//         </div>
//         <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
//           {/* <div className="grid grid-cols-1  md:grid-cols-2 w-full gap-2"> */}
//           <AuthInputFiled
//             name="citizenship"
//             icon={LocationOn}
//             control={control}
//             type="text"
//             placeholder="Citizenship Status."
//             label="Citizenship Status. *"
//             errors={errors}
//             error={errors.citizenship}
//             pattern="[A-Za-z\s]+"
//             className=" text-sm
//           "
//           />
//           {/* </div> */}

//           {/* <div className="grid grid-cols-1  md:grid-cols-2 w-full gap-2"> */}
//           <AuthInputFiled
//             name="uanNo"
//             icon={AccountBalance}
//             control={control}
//             type="number"
//             placeholder="UAN No"
//             label="Employee UAN No"
//             errors={errors}
//             error={errors.uanNo}
//             className="text-sm
//           "
//           />
//           <AuthInputFiled
//             name="esicNo"
//             icon={AccountBalance}
//             control={control}
//             type="text"
//             placeholder="ESIC No"
//             label="Employee ESIC No"
//             errors={errors}
//             error={errors.esicNo}
//             pattern="[A-Za-z\s]+"
//             className=" text-sm"
//           />
//         </div>

//         <div className="flex justify-end  ">
//           <button
//             type="submit"
//             className="border border-gray-400 px-4 py-2 rounded-md bg-gray-700 text-white"
//           >
//             Next
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SelfOTest1;

/* eslint-disable no-unused-vars */
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AccountBalance,
  AccountBox,
  ContactEmergency,
  Email,
  ContactMail,
  LocationOn,
  Person,
  TodayOutlined,
} from "@mui/icons-material";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import { useQuery } from "react-query";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";
import useAuthToken from "../../../hooks/Token/useAuth";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

// Validation function
const isAtLeastNineteenYearsOld = (value) => {
  const currentDate = new Date();
  const dob = new Date(value);
  let differenceInYears = currentDate.getFullYear() - dob.getFullYear();
  const monthDiff = currentDate.getMonth() - dob.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && currentDate.getDate() < dob.getDate())
  ) {
    differenceInYears--;
  }

  return differenceInYears >= 19;
};

const SelfOTest1 = () => {
  const { employeeId, organisationId } = useParams();
  const navigate = useNavigate();
  const { setStep1Data, emptyState } = useEmpState();
  const authToken = useAuthToken();

  // Schema for form validation
  const EmployeeSchema = z.object({
    first_name: z
      .string()
      .min(1, { message: "Minimum 1 character required" })
      .max(15, { message: "Maximum 15 characters allowed" })
      .regex(/^[a-zA-Z]+$/, { message: "Only characters allowed" }),
    last_name: z
      .string()
      .min(1, { message: "Minimum 1 character required" })
      .max(15, { message: "Maximum 15 characters allowed" })
      .regex(/^[a-zA-Z]+$/, { message: "Only characters allowed" }),
    gender: z.string(),
    email: z
      .string()
      .email({ message: "Invalid email format" })
      .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, {
        message: "Email must be in lowercase",
      }),
    phone_number: z
      .string()
      .regex(/^\d*$/, { message: "Phone Number must contain only digits" })
      .refine((value) => value.length === 10 || value.length === 0, {
        message: "Phone Number must be exactly 10 digits or empty",
      }),
    address: z.string(),
    date_of_birth: z.string().refine(isAtLeastNineteenYearsOld, {
      message: "Employee must be at least 19 years old",
    }),
    citizenship: z
      .string()
      .min(3, { message: "Minimum 3 characters required" })
      .regex(/^[a-zA-Z]+$/, { message: "Only characters allowed" }),
    adhar_card_number: z
      .string()
      .length(12, { message: "Aadhar number must be 12 digits." })
      .regex(/^\d*$/, { message: "Aadhar number cannot be negative." }),
    pan_card_number: z
      .string()
      .regex(/^([A-Z]){5}([0-9]){4}([A-Z]){1}$/, { message: "Invalid PAN No." })
      .regex(/^[^*@]+$/, {
        message: "A PAN No cannot contain a special character, e.g., *,#.",
      }),
    bank_account_no: z
      .string()
      .max(35, { message: "Only 35 characters allowed" })
      .regex(/^\d*$/, { message: "Bank account number cannot be negative." }),
    pwd: z.boolean().optional(),
    uanNo: z
      .string()
      .refine((value) => value === "" || /^\d{12}$/.test(value), {
        message: "UAN number must be a 12-digit number",
      })
      .optional(),
    esicNo: z
      .string()
      .refine((value) => value === "" || /^\d{17}$/.test(value), {
        message: "ESIC number must be a 17-digit number",
      })
      .optional(),
    companyemail: z.string().email(),
    profile: z.string().array().optional(),
    shift_allocation: z
      .object({
        label: z.string().optional(),
        value: z.string().optional(),
      })
      .optional()
      .nullable(),
  });

  const { control, formState, handleSubmit, setValue } = useForm({
    resolver: zodResolver(EmployeeSchema),
  });

  const { errors } = formState;

  // Fetch employee data if updating
  useQuery(
    ["employeeId", employeeId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get/profile/${employeeId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      enabled: !!employeeId,
      onSuccess: (data) => {
        Object.keys(data.employee).forEach((key) =>
          setValue(key, data.employee[key])
        );
      },
      onError: (error) => {
        console.error("Error fetching employee data:", error);
        alert("Could not fetch employee data. Please try again later.");
      },
    }
  );

  const handleSignOut = () => {
  
    return new Promise((resolve) => {
      Cookies.remove("aegis");
      Cookies.remove("role");
      resolve();
    }).then(() => {
      window.location.reload();
    });
  };

  // Form submission handler
  const onSubmit = async (data) => {
    const processedData = {
      ...data,
      email: data.email.toLowerCase(),
    };

    try {
      if (employeeId) {
        // Update employee
        await axios.put(
          `${process.env.REACT_APP_API}/route/employee/update/${organisationId}/${employeeId}`,
          processedData,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        // toast.success("Thank you ! Your Onboarding is completed");
        toast.success("Thank you !Your onboarding is successful! You will be logged out shortly." );
        setTimeout(handleSignOut , 2000)
      } else {
        // Add new employee
        await axios.post(
          `${process.env.REACT_APP_API}/route/employee/add-employee`,
          processedData,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        toast.success("Employee added successfully");
      }
      emptyState();
   
    //   toast.success(
    //     "Thank you !Your onboarding is successful! You will be logged out shortly."
    //   );
      setTimeout(() => {
        handleSignOut();
      }, 4000);

    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form. Please try again.");
    }
  };

  return (
    <div className="w-full mt-1">
      <h1 className="text-2xl mb-3 font-bold">Personal Details</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col space-y-1"
      >
        {/* Form Fields */}
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          <AuthInputFiled
            name="first_name"
            icon={Person}
            control={control}
            type="text"
            placeholder="First Name"
            label="First Name *"
            errors={errors}
          />
          <AuthInputFiled
            name="last_name"
            icon={Person}
            control={control}
            type="text"
            placeholder="Last Name"
            label="Last Name *"
            errors={errors}
          />
          <AuthInputFiled
            name="date_of_birth"
            icon={TodayOutlined}
            control={control}
            type="date"
            label="Date Of Birth *"
            errors={errors}
          />
        </div>

        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          <AuthInputFiled
            name="phone_number"
            icon={ContactEmergency}
            control={control}
            type="number"
            placeholder="Phone Number"
            label="Phone Number *"
            errors={errors}
          />
          <AuthInputFiled
            name="email"
            icon={Email}
            control={control}
            type="text"
            placeholder="Email"
            label="Email *"
            errors={errors}
          />
          <AuthInputFiled
            name="companyemail"
            icon={ContactMail}
            control={control}
            type="text"
            placeholder="Email"
            label="Company Email *"
            errors={errors}
            error={errors.companyemail}
            className="text-sm"
            wrapperMessage={"Note this email is used for login credentails"}
          />
        </div>

        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          {/*1  */}
          <div>
            <label className="text-gray-500 font-bold text-sm">Gender *</label>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <RadioGroup row {...field}>
                  <FormControlLabel
                    value="male"
                    control={<Radio size="small" />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio size="small" />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="transgender"
                    control={<Radio size="small" />}
                    label="Transgender"
                  />
                </RadioGroup>
              )}
            />
            <ErrorMessage
              errors={errors}
              name="gender"
              render={({ message }) => (
                <p className="text-red-500">{message}</p>
              )}
            />
          </div>
          {/* 2 */}

          <AuthInputFiled
            name="address"
            icon={LocationOn}
            control={control}
            type="text"
            placeholder="Address"
            label="Address *"
            errors={errors}
          />
        </div>

        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          {/* 1 */}
          <AuthInputFiled
            name="adhar_card_number"
            icon={AccountBox}
            control={control}
            type="number"
            placeholder="Aadhar Number"
            label="Aadhar No *"
            errors={errors}
          />
          {/* 2 */}
          <AuthInputFiled
            name="pan_card_number"
            icon={AccountBox}
            control={control}
            type="text"
            placeholder="PAN No"
            label="PAN No *"
            errors={errors}
          />
          {/* 3 */}

          <AuthInputFiled
            name="bank_account_no"
            icon={AccountBalance}
            control={control}
            type="text"
            placeholder="Bank Account Number"
            label="Bank Account Number *"
            errors={errors}
          />
        </div>

        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          <AuthInputFiled
            name="citizenship"
            icon={LocationOn}
            control={control}
            type="text"
            placeholder="Citizenship"
            label="Citizenship *"
            errors={errors}
          />
          <AuthInputFiled
            name="esicNo"
            icon={AccountBox}
            control={control}
            type="text"
            placeholder="ESIC Number (optional)"
            label="ESIC Number (optional)"
            errors={errors}
          />

          <AuthInputFiled
            name="uanNo"
            icon={AccountBox}
            control={control}
            type="text"
            placeholder="UAN Number (optional)"
            label="UAN Number (optional)"
            errors={errors}
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded-lg"
          >
            {employeeId ? "Submit" : "Add Employee"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SelfOTest1;