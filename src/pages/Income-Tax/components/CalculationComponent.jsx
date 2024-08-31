import { PlayCircle } from "@mui/icons-material";
import React from "react";
import useGetInvestmentSection from "../hooks/queries/useGetInvestmentSection";
import useFunctions from "./useFunctions";

const CalculationComponent = ({ section, heading, amount }) => {
  console.log(`🚀 ~ amount:`, amount);
  const { setIsOpenCalculation, isOpenCalculation } = useFunctions();
  const handleToggleSection = () => {
    setIsOpenCalculation(section);
  };
  const { investments } = useGetInvestmentSection("", 1);
  return (
    <div className="p-4 bg-blue-100 rounded-md w-full">
      <header className="flex  gap-2 justify-between">
        <div className="flex gap-2 items-center">
          <PlayCircle
            onClick={handleToggleSection}
            className={`text-blue-500 ${
              isOpenCalculation.includes(section) ? "rotate-45" : "rotate-0"
            } cursor-pointer`}
          />
          <h1 className="text-lg font-bold text-gray-700 leading-none">
            {heading}
          </h1>
        </div>

        <h1 className="text-lg  font-bold text-gray-700 leading-none">
          RS {amount}
        </h1>
      </header>

      {isOpenCalculation.includes(section) && (
        <div className="overflow-auto mt-4">
          <table className="w-full table-auto  border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
            <thead className="border-b bg-blue-200 font-bold">
              <tr className="!font-semibold ">
                <th scope="col" className="!text-left px-2 w-max py-3 text-sm ">
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
                  return item?.sectionname === section;
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
    </div>
  );
};

export default CalculationComponent;
