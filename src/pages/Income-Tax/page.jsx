import { Tab } from "@headlessui/react";
import { West } from "@mui/icons-material";
import React from "react";
import { Link } from "react-router-dom";
import CalculationTab from "./tabs/CalculationTab";
import InvestmentTab from "./tabs/InvestmentTab";

const IncomeTaxPage = () => {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const tabArray = [
    {
      title: "Investment Proofs",
      disabled: false,
    },
    {
      title: "TDS calculation",
      disabled: false,
    },
  ];

  return (
    <>
      <header className="text-lg w-full pt-6 bg-white border  p-4">
        <Link to={-1}>
          <West className="mx-4 !text-xl" />
        </Link>
        Income Tax
      </header>

      <div className="px-8 py-4  justify-between  min-h-[85vh] bg-gray-50">
        <Tab.Group>
          <div className="flex justify-between items-center">
            <Tab.List className=" mb-3 flex w-max space-x-1 rounded-xl bg-gray-200 p-1">
              {tabArray?.map((tab, index) => (
                <Tab
                  disabled={tab.disabled}
                  className={({ selected }) =>
                    classNames(
                      "w-full rounded-lg py-2.5 px-10 text-sm font-medium leading-5 whitespace-nowrap",
                      selected
                        ? "bg-white text-blue-700 shadow"
                        : "text-black hover:bg-gray-200 ",
                      tab.disabled &&
                        "cursor-not-allowed text-gray-400 hover:bg-gray-100"
                    )
                  }
                >
                  {tab?.title}
                </Tab>
              ))}
            </Tab.List>
          </div>
          <Tab.Panels>
            <Tab.Panel>
              <InvestmentTab />
            </Tab.Panel>
            <Tab.Panel>
              <CalculationTab />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
};

export default IncomeTaxPage;
