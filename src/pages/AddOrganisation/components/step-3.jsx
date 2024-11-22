// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Calculate,
//   FactoryOutlined,
//   RecyclingRounded,
// } from "@mui/icons-material";
// import axios from "axios";
// import React, { useContext, useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { TestContext } from "../../../State/Function/Main";
// import useOrg from "../../../State/Org/Org";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import { packagesArray } from "./data";
// import BasicButton from "../../../components/BasicButton";

// // to define the package count schema
// const packageCountSchema = z.object({
//   count: z
//     .string()
//     .refine((doc) => Number(doc) > 0, { message: "Count is greater than 0" }),
//   cycleCount: z.string().refine((doc) => Number(doc) > 0, {
//     message: "Cycle Count is greater than 0",
//   }),
//   coupan: z.string().optional(),
//   paymentType: z.enum(["Phone_Pay", "RazorPay"]),
// });

// const Step3 = ({ nextStep, prevStep }) => {
//   // to define the state, hook and import the other function
//   const {
//     count,
//     setStep3Data,
//     cycleCount,
//     paymentType,
//     packageInfo,
//     setVerifyToken,
//     coupan,
//   } = useOrg();

//   // use useForm
//   const { control, handleSubmit, formState, watch } = useForm({
//     defaultValues: {
//       count,
//       cycleCount,
//       paymentType,
//       coupan,
//     },
//     resolver: zodResolver(packageCountSchema),
//   });

//   const authToken = useAuthToken();
//   const { handleAlert } = useContext(TestContext);
//   const { errors } = formState;

//   // State to track selected packages
//   const [selectedPackages, setSelectedPackages] = useState([]);

//   useEffect(() => {
//     const storedPackages =
//       JSON.parse(localStorage.getItem("selectedPackages")) || [];
//     setSelectedPackages(storedPackages);
//   }, []);

//   const handleCheckboxChange = (value) => {
//     const updatedPackages = selectedPackages.includes(value)
//       ? selectedPackages.filter((pkg) => pkg !== value)
//       : [...selectedPackages, value];

//     setSelectedPackages(updatedPackages);
//     // Update local storage
//     localStorage.setItem("selectedPackages", JSON.stringify(updatedPackages));
//   };

//   // Calculate total price based on selected packages
//   const calculateTotalPrice = () => {
//     return selectedPackages.reduce((total, pkg) => {
//       const packageObj = packagesArray.find((item) => item.value === pkg);
//       return total + (packageObj ? packageObj.price : 0);
//     }, 0);
//   };
//   console.log(calculateTotalPrice);

//   // to define the onSubmit function
//   const onSubmit = async (data) => {
//     setVerifyToken(null);

//     // Set the selected packages in the submitted data
//     data.packages = selectedPackages;

//     // Handle coupon verification
//     if (watch("coupan") !== undefined && watch("coupan") !== "") {
//       const checkToken = await axios.post(
//         `${process.env.REACT_APP_API}/route/organization/verify/coupon`,
//         {
//           coupan: data?.coupan,
//         },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );

//       if (!checkToken?.data?.status) {
//         handleAlert(
//           true,
//           "error",
//           checkToken?.data?.message || "Invalid Token"
//         );
//         return false;
//       }

//       if (checkToken?.data?.status) {
//         setVerifyToken(checkToken?.data?.verfiyCoupan);
//         handleAlert(
//           true,
//           "success",
//           checkToken?.data?.message || "Coupan code is correct"
//         );
//       }
//     }

//     setStep3Data(data);
//     nextStep();
//   };

//   // const totalPrice = calculateTotalPrice(); // Calculate total price

//   return (
//     <div>
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="item-center flex flex-col"
//         noValidate
//       >
//         <div className="grid grid-cols-1 sm:grid-cols-2 w-full sm:gap-4 gap-4">
//           <AuthInputFiled
//             name="count"
//             icon={Calculate}
//             control={control}
//             type="number"
//             placeholder="Member Count"
//             label="Member Count *"
//             errors={errors}
//             error={errors.count}
//           />
//           <AuthInputFiled
//             name="cycleCount"
//             icon={RecyclingRounded}
//             control={control}
//             type="number"
//             placeholder="Cycle count used for recycle your subscription"
//             label="Cycle Count *"
//             errors={errors}
//             error={errors.cycleCount}
//             descriptionText={
//               "if you select 2 then you will be charged every 3 months subscription with 2 cycle it mean it will be 6 months subscription just amount will be charged one time."
//             }
//           />
//         </div>

//         {packageInfo?.packageName === "Enterprise Plan" && (
//           <div className="flex flex-col pb-4 mb-4">
//             <div className="package-selection">
//               <h3 className="text-gray-500 text-md font-semibold mb-4">
//                 Select Package Additions:
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//                 {packagesArray.map((pkg) => (
//                   <div
//                     key={pkg.value}
//                     className={`border rounded-md shadow-sm p-3 transition-transform transform ${
//                       selectedPackages.includes(pkg.value)
//                         ? "bg-blue-100 scale-105"
//                         : "bg-white hover:bg-gray-100"
//                     }`}
//                     style={{ width: "260px", height: "50px" }}
//                   >
//                     <label className="flex items-center h-full cursor-pointer">
//                       <input
//                         type="checkbox"
//                         id={pkg.value}
//                         checked={selectedPackages.includes(pkg.value)}
//                         onChange={() => handleCheckboxChange(pkg.value)}
//                         className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500"
//                       />
//                       <span className="ml-2 flex flex-col justify-center">
//                         <span className="font-medium text-sm">
//                           {pkg.label} - &nbsp; ({pkg.price} rs)
//                         </span>
//                       </span>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="grid sm:grid-cols-2 grid-cols-1 w-full sm:gap-4 gap-4">
//           <AuthInputFiled
//             name="paymentType"
//             icon={FactoryOutlined}
//             control={control}
//             type="naresh-select"
//             placeholder="Select your Merchant"
//             label="Payment Gateway *"
//             errors={errors}
//             error={errors.paymentType}
//             options={[
//               { value: "Phone_Pay", label: "Phone_Pay" },
//               { value: "RazorPay", label: "RazorPay" },
//             ]}
//             descriptionText={"Additional 2% charges on every transaction"}
//           />
//           <div className="my-2">
//             <AuthInputFiled
//               name="coupan"
//               icon={FactoryOutlined}
//               control={control}
//               type="text"
//               placeholder="Ex: ABCD12345A"
//               label="Enter Coupon Code "
//               errors={errors}
//               error={errors.coupan}
//               descriptionText={
//                 "You can request for coupan code to get discount"
//               }
//             />
//           </div>

//           {/* Skillmatrix */}
//           {/* <div className="my-2">
//             <AuthInputFiled
//               name="skillMatrix"
//               icon={FactoryOutlined}
//               control={control}
//               type="text"
//               placeholder="Ex: ABCD12345A"
//               label="Skill Matrix "
//               errors={errors}
//               error={errors.coupan}
//               descriptionText={
//                 "You can request for coupan code to get discount"
//               }
//             />
//           </div> */}

//         </div>
//         <div className="flex justify-end space-x-4">
//           <BasicButton title="Back" variant={"outlined"} onClick={prevStep} />
//           <BasicButton type="submit" title={"Confirm & Pay"} />
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Step3;

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calculate,
  FactoryOutlined,
  RecyclingRounded,
} from "@mui/icons-material";
import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import useOrg from "../../../State/Org/Org";

import SkillsMatrixOrg from "../../../State/Org/SkillsMatrixOrg"
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../hooks/Token/useAuth";
import { packagesArray } from "./data";
import BasicButton from "../../../components/BasicButton";

const Step3 = ({ nextStep, prevStep }) => {
  const {
    count,
    setStep3Data,
    cycleCount,
    paymentType,
    packageInfo,
    setVerifyToken,
    coupan,
  // } = useOrg();
  
  }=SkillsMatrixOrg();
  const { control, handleSubmit, formState, watch } = useForm({
    defaultValues: {
      count,
      cycleCount,
      paymentType,
      coupan,
    },
    resolver: zodResolver(
      z.object({
        count: z.string().refine((val) => Number(val) > 0, {
          message: "Count must be greater than 0",
        }),
        cycleCount: z.string().refine((val) => Number(val) > 0, {
          message: "Cycle Count must be greater than 0",
        }),
        coupan: z.string().optional(),
        paymentType: z.enum(["Phone_Pay", "RazorPay"]),
      })
    ),
  });

  const authToken = useAuthToken();
  const { handleAlert } = useContext(TestContext);
  const { errors } = formState;

  const [selectedPackages, setSelectedPackages] = useState([]);
  const [skillsMatrixEnabled, setSkillsMatrixEnabled] = useState(false);
  const [selectedPlan, setselectedPlan] = useState("");

  useEffect(() => {
    const storedPackages =
      JSON.parse(localStorage.getItem("selectedPackages")) || [];
    setSelectedPackages(storedPackages);
  }, []);

  const handleCheckboxChange = (value) => {
    const updatedPackages = selectedPackages.includes(value)
      ? selectedPackages.filter((pkg) => pkg !== value)
      : [...selectedPackages, value];
    setSelectedPackages(updatedPackages);
    localStorage.setItem("selectedPackages", JSON.stringify(updatedPackages));
  };

  // Calculate total price
  const calculateTotalPrice = (
    selectedPackage = [],
    packagesArray = [],
    count = 0
  ) => {
    let total = selectedPackages.reduce((sum, pkg) => {
      const packageObj = packagesArray.find((item) => item.value === pkg);
      return sum + (packageObj ? packageObj.price : 0);
    }, 0);

    if (selectedPackages.includes("Skills Matrix")) {
      const skillsMatrixPackage = packagesArray.find(
        (item) => item.value === "Skills Matrix"
      );

      if (skillsMatrixPackage) {
        console.log("Skills Matrix Package Details:", skillsMatrixPackage);
        const selectedPlan = skillsMatrixPackage.plans.find(
          (plan) => plan.selected === true
        );
        
        
        if (selectedPlan) {
          if (selectedPlan.name === "SM No Cost") {
            total += 0; // No cost for "SM No Cost" plan
          } else if (selectedPlan.name === "Alliance") {
            total += selectedPlan.price * count; // ₹80 per employee for "Alliance" plan
          }
        }
        
      }
    }
    return total;
  };

  const onSubmit = async (data) => {
    console.log("skillsMatrixEnabled", skillsMatrixEnabled);
    console.log("Skills Matrix Plan :", selectedPlan);

    if (skillsMatrixEnabled && !selectedPlan) {
      handleAlert(true, "error", "Please select a Skills Matrix plan.");
      return;
    }
    setVerifyToken(null);
    data.packages = selectedPackages;

    // Add Skills Matrix selection to the data
    if (skillsMatrixEnabled) {
      data.skillsMatrix = {
        enabled: skillsMatrixEnabled,
        plan: selectedPlan,
      };
    }

    // Verify coupon
    if (watch("coupan")) {
      const checkToken = await axios.post(
        `${process.env.REACT_APP_API}/route/organization/verify/coupon`,
        { coupan: data.coupan },
        { headers: { Authorization: authToken } }
      );

      if (!checkToken?.data?.status) {
        handleAlert(
          true,
          "error",
          checkToken?.data?.message || "Invalid Token"
        );
        return false;
      }

      setVerifyToken(checkToken?.data?.verfiyCoupan);
      handleAlert(
        true,
        "success",
        checkToken?.data?.message || "Coupon code is correct"
      );
    }

    setStep3Data(data);
    nextStep();
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="item-center flex flex-col"
        noValidate
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 w-full sm:gap-4 gap-4">
          <AuthInputFiled
            name="count"
            icon={Calculate}
            control={control}
            type="number"
            placeholder="Member Count"
            label="Member Count *"
            errors={errors}
            error={errors.count}
          />
          <AuthInputFiled
            name="cycleCount"
            icon={RecyclingRounded}
            control={control}
            type="number"
            placeholder="Cycle count for subscription"
            label="Cycle Count *"
            errors={errors}
            error={errors.cycleCount}
          />
        </div>

        {/* {packageInfo?.packageName === "Enterprise Plan" && (
          <div className="flex flex-col pb-4 mb-4">
            <h3 className="text-gray-500 text-md font-semibold mb-4">
              Select Package Additions:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {packagesArray.map((pkg) => (


                <div
                  key={pkg.value}
                  className={`border rounded-md shadow-sm p-3 transition-transform transform ${
                    selectedPackages.includes(pkg.value)
                      ? "bg-blue-100 scale-105"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id={pkg.value}
                      checked={selectedPackages.includes(pkg.value)}
                      onChange={() => handleCheckboxChange(pkg.value)}
                      className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2">{pkg.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )} */}
        {/* For Enterprise Plan */}
        {packageInfo?.packageName === "Enterprise Plan" && (
          <div className="flex flex-col pb-4 mb-4">
            <h3 className="text-gray-500 text-md font-semibold mb-4">
              Select Package Additions:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {packagesArray.map((pkg) => {
                // Only display the Skills Matrix package for Enterprise Plan
                if (pkg.value === "Skills Matrix") {
                  return (
                    <div
                      key={pkg.value}
                      className={`border rounded-md shadow-sm p-3 transition-transform transform ${
                        selectedPackages.includes(pkg.value)
                          ? "bg-blue-100 scale-105"
                          : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id={pkg.value}
                          checked={selectedPackages.includes(pkg.value)}
                          onChange={() => handleCheckboxChange(pkg.value)}
                          className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2">{pkg.label}</span>
                      </label>

                      {/* Skills Matrix Plan Selection */}
                      {selectedPackages.includes(pkg.value) && (
                        <div className="mt-4">
                          <label className="block text-gray-700 font-medium mb-2">
                            Select Skills Matrix Plan:
                          </label>

                          <select
                            value={selectedPlan}
                            onChange={(e) => setselectedPlan(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                          >
                            <option value="">-- Select Plan --</option>
                            {pkg.plans.map((plan) => (
                              <option key={plan.name} value={plan.name}>
                                {plan.name} ({plan.description})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={pkg.value}
                      className={`border rounded-md shadow-sm p-3 transition-transform transform ${
                        selectedPackages.includes(pkg.value)
                          ? "bg-blue-100 scale-105"
                          : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id={pkg.value}
                          checked={selectedPackages.includes(pkg.value)}
                          onChange={() => handleCheckboxChange(pkg.value)}
                          className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2">{pkg.label}</span>
                      </label>
                    </div>
                  );
                }
              })}
            </div>

            {/* Skills Matrix Checkbox for Enterprise Plan */}
            {selectedPackages.includes("Skills Matrix") && (
              <div className="my-4">
                <label className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={skillsMatrixEnabled}
                    onChange={(e) => setSkillsMatrixEnabled(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-700 font-medium">
                    Enable Skills Matrix
                  </span>
                </label>

                {skillsMatrixEnabled && (
                  <div className="mt-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Select Skills Matrix Plan:
                    </label>
                    <select
                      value={selectedPlan}
                      onChange={(e) => setselectedPlan(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                    >
                      <option value="">-- Select Plan --</option>
                      {packagesArray
                        .find((pkg) => pkg.value === "Skills Matrix")
                        ?.plans.map((plan) => (
                          <option key={plan.name} value={plan.name}>
                            {plan.name} ({plan.description})
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {/* For Essential, Basic, or Intermediate Plans */}
        {["Essential Plan", "Basic Plan", "Intermediate Plan"].includes(
          packageInfo?.packageName
        ) && (
          <div className="flex flex-col pb-4 mb-4">
            <h3 className="text-gray-500 text-md font-semibold mb-4">
              Select Package Additions:
            </h3>

            {selectedPackages.includes("Skills Matrix") && (
              <div className="my-4">
                <label className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={skillsMatrixEnabled}
                    onChange={(e) => setSkillsMatrixEnabled(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-700 font-medium">
                    Enable Skills Matrix
                  </span>
                </label>

                {skillsMatrixEnabled && (
                  <div className="mt-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Select Skills Matrix Plan:
                    </label>
                    <select
                      value={selectedPlan}
                      onChange={(e) => setselectedPlan(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                    >
                      <option value="">-- Select Plan --</option>
                      <option value="SM No Cost">SM No Cost (Free)</option>
                      <option value="Alliance">
                        Alliance (80 rs per month/Employee)
                      </option>
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* For Essential, Basic, or Intermediate Plans */}
        {/* {["Essential Plan", "Basic Plan", "Intermediate Plan"].includes(
          packageInfo?.packageName
        ) && (
          <div className="flex flex-col pb-4 mb-4">
            <h3 className="text-gray-500 text-md font-semibold mb-4">
              Select Package Additions:
            </h3>

          
            <div className="my-4">
              <label className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={skillsMatrixEnabled}
                  onChange={(e) => setSkillsMatrixEnabled(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-gray-700 font-medium">
                  Enable Skills Matrix
                </span>
              </label>

              {skillsMatrixEnabled && (
                <div className="mt-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Select Skills Matrix Plan:
                  </label>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setselectedPlan(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                  >
                    <option value="">-- Select Plan --</option>
                    <option value="SM No Cost">SM No Cost (Free)</option>
                    <option value="Alliance">
                      Alliance (80 rs per month/Employee)
                    </option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )} */}

        {/* Skills Matrix Checkbox */}
        {/* <div className="my-4">
          <label className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={skillsMatrixEnabled}
              onChange={(e) => setSkillsMatrixEnabled(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700 font-medium">
              Enable Skills Matrix
            </span>
          </label>

          {skillsMatrixEnabled && (
            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-2">
                Select Skills Matrix Plan:
              </label>
              <select
                value={selectedPlan}
                onChange={(e) => setselectedPlan(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
              >
                <option value="">-- Select Plan --</option>
                <option value="SM No Cost">SM No Cost (Free)</option>
                <option value="Alliance">
                  Alliance (80 rs per month/Employee)
                </option>
              </select>
            </div>
          )}
        </div> */}

        <div className="grid sm:grid-cols-2 grid-cols-1 w-full sm:gap-4 gap-4">
          <AuthInputFiled
            name="paymentType"
            icon={FactoryOutlined}
            control={control}
            type="naresh-select"
            placeholder="Select your Merchant"
            label="Payment Gateway *"
            errors={errors}
            error={errors.paymentType}
            options={[
              { value: "Phone_Pay", label: "Phone_Pay" },
              { value: "RazorPay", label: "RazorPay" },
            ]}
          />
          <AuthInputFiled
            name="coupan"
            icon={FactoryOutlined}
            control={control}
            type="text"
            placeholder="Ex: ABCD12345A"
            label="Enter Coupon Code"
            errors={errors}
            error={errors.coupan}
          />
        </div>

        <div className="mt-4 text-right">
          <h3 className="text-gray-800 font-semibold">
            {/* Total Price: {calculateTotalPrice()} rs */}
            Total Price:{" "}
            {calculateTotalPrice(
              selectedPackages,
              packagesArray,
              watch("count")
            )}{" "}
            rs
          </h3>
        </div>

        <div className="flex justify-end space-x-4 mt-4">
          <BasicButton title="Back" variant="outlined" onClick={prevStep} />
          <BasicButton type="submit" title="Confirm & Pay" />
        </div>
      </form>
    </div>
  );
};

export default Step3;
