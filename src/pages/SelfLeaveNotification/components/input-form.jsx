import moment from "moment";
import React from "react";
import Select from "react-select";
import useLeaveNotification from "../useLeaveNotification";

const InputForm = () => {
  const { data } = useLeaveNotification();
  console.log(`🚀 ~ file: input-form.jsx:9 ~ data:`, data);
  console.log(
    `🚀 ~ file: input-form.jsx:46 ~ moment().months():`,
    moment.months()
  );

  return (
    <form className="flex w-full">
      <div>
        <div className="w-full p-4 flex flex-wrap gap-4">
          <Select
            aria-errormessage=""
            placeholder={"Select Months"}
            styles={{
              control: (styles) => ({
                ...styles,
                borderWidth: "0px",
                boxShadow: "none",
              }),
            }}
            defaultInputValue={"January"}
            className={` border-sky-300 bg-white w-full px-2`}
            components={{
              IndicatorSeparator: () => null,
            }}
            options={moment.months().map((month, index) => ({
              label: month,
              value: month,
            }))}
          />
        </div>
      </div>
    </form>
  );
};

export default InputForm;
