import React, { useState } from "react";
import Card from "../peformance/components/Card";
import CreateModal from "./components/CreateModal";
import InvestmentTable from "./components/InvestmentTable";

const InvestmentTab = () => {
  // investment modal state
  const [open, setOpen] = useState(false);

  return (
    <section>
      <headers className="flex items-center justify-between ">
        <div class="flex items-center justify-between ">
          <div class="space-y-1">
            <h2 class=" text-2xl tracking-tight">Investments</h2>
            <p class="text-sm text-muted-foreground">
              Here you can create your declaration
            </p>
          </div>
        </div>
      </headers>

      <div className="flex mt-4  pb-4  gap-8">
        <Card title={"Taxable Income"} data={`10`} />
        <Card title={"Cess surcharge"} data={`10`} />
        <Card title={"Total Tax"} data={`10`} />
      </div>

      <InvestmentTable setOpen={setOpen} />
      <CreateModal open={open} setOpen={setOpen} />
    </section>
  );
};

export default InvestmentTab;
