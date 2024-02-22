import { Repeat } from "@mui/icons-material";
import React from "react";

const BillingCard = () => {
  return (
    <div className="border-brand/purple border-[0.5px] bg-Brand-Purple/brand-purple-2 rounded-md grid grid-cols-4">
      <div className=" col-span-3">
        <div>
          <img
            src="/payment-not-received.svg"
            alt="payment not received"
            className="h-8"
          />
        </div>
      </div>
      <div className=" col-span-1 flex justify-center items-center">
        <div className="bg-success-400 flex justify-center items-center p-8 rounded-full">
          <Repeat className="text-white " fontSize="large" />
        </div>
      </div>
    </div>
  );
};

export default BillingCard;
