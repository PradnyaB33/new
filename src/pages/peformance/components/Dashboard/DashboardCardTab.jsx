import { Tab } from "@headlessui/react";
import React from "react";

const DashboardCardTab = () => {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const tabArray = [
    {
      title: "Dashboard",
      disabled: false,
    },
    {
      title: "Goal Setting",
      //   component: <GoalSettingTab />,
      disabled: false,
    },
  ];

  return (
    <>
      <div>
        <Tab.Group>
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
            {/* <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 px-10 text-sm font-medium leading-5 whitespace-nowrap",
                  selected
                    ? "bg-white text-blue-500 shadow"
                    : "text-black hover:bg-gray-200 "
                )
              }
            >
              Goal Setting
            </Tab> */}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <h1>Hii there</h1>
              {/* <PerformanceDashboard /> */}
            </Tab.Panel>
            <Tab.Panel>
              {/* <GoalSettingTab /> */}
              <h1>Hii review there</h1>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
};

export default DashboardCardTab;
