import { CircularProgress } from "@mui/material";
import React from "react";
import UserProfile from "../../../hooks/UserData/useUser";
import CalculationComponent from "../components/CalculationComponent";
import useGetInvestmentSection from "../hooks/queries/useGetInvestmentSection";
import useGetTdsbyEmployee from "../hooks/queries/useGetTdsbyEmployee";

const CalculationTab = () => {
  const { investments } = useGetInvestmentSection("", 1);
  const empId = UserProfile()?.getCurrentUser()?._id;

  const { tdsForEmployee, isFetching } = useGetTdsbyEmployee(
    empId,
    "2024-2025"
  );
  console.log(`🚀 ~ tdsForEmployee:`, tdsForEmployee);

  return (
    <section>
      <headers className="flex items-center justify-between ">
        <div class="flex items-center justify-between ">
          <div class="space-y-1">
            <h2 class=" text-2xl tracking-tight">Calculation</h2>
            <p class="text-sm text-muted-foreground">
              Here you can get you tax calculation
            </p>
          </div>
        </div>
      </headers>
      <article className="bg-white mt-4  border p-4 rounded-md">
        {isFetching ? (
          <>
            <CircularProgress />
          </>
        ) : (
          <>
            <article className="space-y-4">
              <CalculationComponent
                investments={tdsForEmployee?.investment}
                section="Salary"
                amount={tdsForEmployee?.salary ?? 0}
                heading={"Salary components"}
              />
              <CalculationComponent
                investments={tdsForEmployee?.investment}
                section="House"
                amount={tdsForEmployee?.houseDeclaration ?? 0}
                heading={"Income From House Property"}
              />
              <CalculationComponent
                investments={tdsForEmployee?.investment}
                section="Otherincome"
                amount={tdsForEmployee?.otherDeclaration ?? 0}
                heading={"Income From Other Sources"}
              />
              <CalculationComponent
                investments={investments?.investment}
                section="SectionDeduction"
                amount={tdsForEmployee?.sectionDeclaration ?? 0}
                heading={"Less : Deduction under chapter VI A"}
              />
            </article>

            <div className="flex w-full  gap-2 py-3 px-4  justify-between">
              <h1 className="text-lg font-bold text-gray-700 leading-none">
                Taxable Income
              </h1>
              <h1 className="text-lg font-bold text-gray-700 leading-none">
                RS {tdsForEmployee?.totalTaxableIncome}
              </h1>
            </div>

            <div className="flex w-full  gap-2 py-3 px-4  justify-between">
              <h1 className="text-lg font-bold text-gray-700 leading-none">
                Cess
              </h1>
              <h1 className="text-lg font-bold text-gray-700 leading-none">
                RS {tdsForEmployee?.cess}
              </h1>
            </div>

            <div className="flex w-full bg-blue-100 rounded-md  gap-2 p-4 justify-between">
              <h1 className="text-lg font-bold text-gray-700 leading-none">
                Tax Amount
              </h1>
              <h1 className="text-lg font-bold text-gray-700 leading-none">
                RS {tdsForEmployee?.regularTaxAmount}
              </h1>
            </div>
          </>
        )}
      </article>
    </section>
  );
};

export default CalculationTab;
