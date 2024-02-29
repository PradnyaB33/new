import React from "react";
import PricingCard from "./pricing-card";

const PriceInput = ({ field, setConfirmOpen }) => {
  return (
    <div className={`flex gap-4`}>
      <PricingCard
        setConfirmOpen={setConfirmOpen}
        onChange={field.onChange}
        packageId={process.env.REACT_APP_BASICPLAN || "plan_NgWEcv4vEvrZFc"}
        value={field.value}
      />
      <PricingCard
        h1="Intermediate Plan"
        price={85}
        setConfirmOpen={setConfirmOpen}
        downDescriptionText="See full package list"
        descriptionText="Everything in Basic +"
        mapArray={[
          "Performance",
          "Training (Basic) ",
          "Document Management ",
          "Remote / GPS log in",
          "Communication",
          "Reporting MIS",
          "Catering / Food",
        ]}
        packageId={process.env.REACT_APP_INTERMEDIATE || "plan_NgWFMMrbumeC2U"}
        onChange={field.onChange}
        value={field.value}
      />
      <PricingCard
        h1="Enterprise Plan"
        price={115}
        setConfirmOpen={setConfirmOpen}
        downDescriptionText="See full package list"
        descriptionText="Everything in Basic & Intermediate +"
        mapArray={[
          "Transport (daily Bus)",
          "Expense management",
          "Help desk HR",
          "Project /  task list management",
          "Skill Matrix",
          "Training (Advanced)",
          "Travel desk / Booking",
        ]}
        packageId={process.env.REACT_APP_ENTERPRISE || "plan_NgWFtyZ4Ifd8WD"}
        onChange={field.onChange}
        value={field.value}
      />
    </div>
  );
};

export default PriceInput;
