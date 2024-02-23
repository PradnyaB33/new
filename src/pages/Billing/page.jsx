import React from "react";
import useOrgList from "../../hooks/QueryHook/Orglist/hook";
import BillingCard from "./components/billing-card";

const Billing = () => {
  const { data, isLoading } = useOrgList();
  console.log(`🚀 ~ file: page.jsx:7 ~ isLoading:`, isLoading);
  console.log(`🚀 ~ file: billing-card.jsx:69 ~ data:`, data);
  return (
    <div className="p-4 gap-4 flex flex-col">
      Billing
      {!isLoading &&
        data?.organizations?.map((doc, i) => {
          return <BillingCard key={i} doc={doc} />;
        })}
    </div>
  );
};

export default Billing;
