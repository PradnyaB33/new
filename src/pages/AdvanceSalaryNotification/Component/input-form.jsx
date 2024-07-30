import React from "react";
import AdvanceSalaryCard from "./employee-salary-card";
import AdvanceSalaryLoader from "./employee-salary-loader";
import useAdvanceSalaryData from "../../../hooks/QueryHook/notification/advance-salary-notification/useAdvanceSalary";

const InputForm = () => {
  const { advanceSalaryNotification, isFetching, isLoading } =
    useAdvanceSalaryData();

  return (
    <div className="flex w-full flex-col gap-4">
      {(isLoading || isFetching) &&
        [1, 2].map((item) => <AdvanceSalaryLoader key={item} />)}
      {advanceSalaryNotification?.map((item, index) => (
        <AdvanceSalaryCard key={index} items={item} />
      ))}
      {advanceSalaryNotification < 1 && <h1>Sorry, no request found</h1>}
    </div>
  );
};

export default InputForm;
