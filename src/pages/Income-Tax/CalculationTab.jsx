import React from "react";
import CalculationComponent from "./components/CalculationComponent";
import useGetInvestmentSection from "./hooks/queries/useGetInvestmentSection";

const CalculationTab = () => {
  const { investments } = useGetInvestmentSection("", 1);

  // const [isOpen, setIsOpen] = useState(false);
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
      <article className="mt-4 space-y-4">
        <CalculationComponent
          section="Salary"
          amount={investments?.salary}
          heading={"Salary components"}
        />
        <CalculationComponent
          section="House"
          amount={investments?.salary}
          heading={"Income From House Property"}
        />
        <CalculationComponent
          section="Otherincome"
          amount={investments?.salary}
          heading={"Income From Other Sources"}
        />
        <CalculationComponent
          section="SectionDeduction"
          amount={investments?.salary}
          heading={"Less : Deduction under chapter VI A"}
        />

        <header className="p-4 space-y-4 bg-blue-100 rounded-md w-full">
          <div className="flex w  gap-2 justify-between">
            <h1 className="text-lg font-bold text-gray-700 leading-none">
              Taxable Income
            </h1>
            <h1 className="text-lg font-bold text-gray-700 leading-none">
              RS 32000
            </h1>
          </div>
        </header>

        <header className="p-4 space-y-4 bg-blue-100 rounded-md w-full">
          <div className="flex w  gap-2 justify-between">
            <h1 className="text-lg font-bold text-gray-700 leading-none">
              Cess
            </h1>
            <h1 className="text-lg font-bold text-gray-700 leading-none">
              RS 32000
            </h1>
          </div>
        </header>

        <header className="p-4 space-y-4 bg-blue-100 rounded-md w-full">
          <div className="flex w  gap-2 justify-between">
            <h1 className="text-lg font-bold text-gray-700 leading-none">
              Tax Amount
            </h1>
            <h1 className="text-lg font-bold text-gray-700 leading-none">
              RS 32000
            </h1>
          </div>
        </header>
        {/* <div className="p-4 bg-blue-100 rounded-md w-full">
          <header className="flex  gap-2 justify-between">
            <div className="flex gap-2 items-center">
              <PlayCircle
                onClick={() => {
                  if (isOpen) {
                    setIsOpen(false);
                  } else {
                    setIsOpen(true);
                  }
                }}
                className={`text-blue-500 ${
                  isOpen ? "rotate-45" : "rotate-0"
                } cursor-pointer`}
              />
              <h1 className="text-xl font-bold text-gray-700 leading-none">
                Salary components
              </h1>
            </div>

            <h1 className="text-lg font-bold text-gray-700 leading-none">
              RS 32000
            </h1>
          </header>

          {isOpen && (
            <div className="overflow-auto mt-4">
              <table className="w-full table-auto  border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
                <thead className="border-b bg-blue-200 font-bold">
                  <tr className="!font-semibold ">
                    <th
                      scope="col"
                      className="!text-left px-2 w-max py-3 text-sm "
                    >
                      Sr. No
                    </th>
                    <th scope="col" className="py-3 text-sm px-2 ">
                      Component
                    </th>

                    <th scope="col" className="py-3 text-sm px-2 ">
                      Declaration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {investments?.allInvestment
                    ?.filter((item) => {
                      return item?.sectionname === "Salary";
                    })
                    ?.map((inv, id) => {
                      return (
                        <tr
                          className={` bg-blue-50  !font-medium  w-max border-b `}
                        >
                          <td className="!text-left   py-4    px-2 text-sm w-[70px]  ">
                            {id + 1}
                          </td>
                          <td className="!text-left   py-4    px-2 text-sm  ">
                            {inv?.name}
                          </td>
                          <td className="!text-left   py-4    px-2 text-sm  ">
                            {inv?.amount}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div> */}
      </article>
    </section>
  );
};

export default CalculationTab;
