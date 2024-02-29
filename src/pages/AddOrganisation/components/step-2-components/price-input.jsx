import React from "react";
import { packageArray } from "../../../../utils/Data/data";
import PricingCard from "./pricing-card";

const PriceInput = ({ field }) => {
  return (
    <div className={`flex gap-4 flex-wrap justify-center`}>
      <PricingCard
        onChange={field.onChange}
        packageId={process.env.REACT_APP_BASICPLAN || "plan_NgWEcv4vEvrZFc"}
        value={field.value}
        mapArray={packageArray.filter(
          (doc, index) => doc.Basic === "✓" && index < 5
        )}
      />
      <PricingCard
        h1="Intermediate Plan"
        price={85}
        downDescriptionText="See full package list"
        descriptionText="Everything in Basic +"
        mapArray={packageArray
          .filter((doc, index) => doc.Intermediate === "✓" && index < 5)
          .reverse()}
        packageId={process.env.REACT_APP_INTERMEDIATE || "plan_NgWFMMrbumeC2U"}
        onChange={field.onChange}
        value={field.value}
      />
      <PricingCard
        h1="Enterprise Plan"
        price={115}
        downDescriptionText="See full package list"
        descriptionText="Everything in Basic & Intermediate +"
        mapArray={packageArray
          .filter((doc, index) => doc.Enterprise === "✓")
          .reverse()
          .filter((doc, index) => index < 5)}
        packageId={process.env.REACT_APP_ENTERPRISE || "plan_NgWFtyZ4Ifd8WD"}
        onChange={field.onChange}
        value={field.value}
      />
    </div>
  );
};

export default PriceInput;
