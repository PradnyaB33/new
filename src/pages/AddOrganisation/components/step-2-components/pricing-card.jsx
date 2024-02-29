import { AddCircle } from "@mui/icons-material";
import React from "react";
const array = [
  "Dashboard",
  "Attendance tracking",
  "Employee onboarding / offboarding",
  "Payroll Salary / (Add / View / Create)",
  "Form 16 / TDS declaration",
  "Shift management",
  "Loan management",
];

const PricingCard = ({
  h1 = "Basic Plan",
  price = 55,
  mapArray = array,
  descriptionText = "You get 17 packages !",
  downDescriptionText = "10 + more",
  setConfirmOpen,
  onChange,
  packageId,
  value,
}) => {
  return (
    <div
      className={`group w-[360px] h-fit rounded-lg bg-brand-primary-blue/brand-primary-blue-1 p-[20px] flex flex-col gap-3 border  hover:border-brand/primary-blue cursor-pointer ${
        value === packageId
          ? "border-brand/primary-blue"
          : "border-Brand-washed-blue/brand-washed-blue-8"
      }`}
      onClick={() => {
        onChange(packageId);
      }}
    >
      <h1 className="text-4xl font-medium">{h1}</h1>
      <h3 className="text-2xl font-bold">
        ₹ {price} <span className="text-sm font-medium">/emp</span>
      </h3>
      <div className="text-sm">billed annually</div>
      <button
        type="button"
        className="bg-brand/primary-blue w-full rounded-md p-1 text-white"
      >
        Get Started
      </button>
      <div
        className="text-brand/primary-blue cursor-pointer"
        onClick={() => setConfirmOpen(true)}
      >
        {descriptionText}
      </div>
      <div className="flex flex-col gap-2">
        {mapArray.map((doc, key) => {
          return (
            <div key={key} className="flex gap-4">
              <div className="w-6 h-6 text-center">✓</div>
              <div className=" text-Brand-washed-blue/brand-washed-blue-10">
                {doc}
              </div>
            </div>
          );
        })}
        <div
          className="flex gap-4 text-brand/primary-blue cursor-pointer"
          onClick={() => setConfirmOpen(true)}
        >
          <div className="w-6 h-6 text-center ">
            <AddCircle className="" />
          </div>
          <div>{downDescriptionText}</div>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
