import React from "react";
import Card from "../../peformance/components/Card";
import CreateModal from "../components/CreateModal";
import DeleteInvestmentModal from "../components/DeleteInvestmentModal";
import InvestmentTable from "../components/InvestmentTable";
import useGetInvestmentSection from "../hooks/queries/useGetInvestmentSection";
import useFunctions from "../hooks/useFunctions";

const InvestmentTab = () => {
  // investment modal state
  const { search, page } = useFunctions();
  const { investments, isFetching } = useGetInvestmentSection(search, page);
  const { editOpen, setEditOpen, open, setOpen } = useFunctions();

  return (
    <section>
      <headers className="flex items-center justify-between ">
        <div class="flex items-center justify-between ">
          <div class="space-y-1">
            <h2 class=" text-2xl tracking-tight">Declaration</h2>
            <p class="text-sm text-muted-foreground">
              Here you can create your declaration
            </p>
          </div>
        </div>
      </headers>
      <div className="flex mt-4  pb-4  gap-8">
        <Card title={"Taxable Income"} data={`10`} />
        <Card title={"Total Tax"} data={`10`} />
        <Card title={"Regime Select"} data={`Old Regime`} />
      </div>
      <InvestmentTable
        setOpen={setOpen}
        investments={investments}
        isFetching={isFetching}
      />
      <CreateModal open={open} investments={investments} setOpen={setOpen} />
      <CreateModal
        open={editOpen}
        investments={investments}
        setOpen={setEditOpen}
      />
      <DeleteInvestmentModal />
    </section>
  );
};

export default InvestmentTab;
