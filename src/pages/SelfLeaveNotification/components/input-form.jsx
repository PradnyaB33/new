import { Button } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import Select from "react-select";
import useLeaveData from "../../../hooks/Leave/useLeaveData";
import useLeaveRequesationHook from "../../../hooks/QueryHook/Leave-Requsation/hook";
import useLeaveNotification from "../useLeaveNotification";
import LeaveRequestCard from "./employee-leave-card";
import LeaveRequestLoaderCard from "./employee-leave-loader";

const InputForm = () => {
  const {
    data,
    setMaxDate,
    setMinDate,
    setStatus,
    setLeaveTypeDetailsId,
    setSkip,
    skip,
    isLoading,
    leaveTypeDetails,
    isFetching,
  } = useLeaveNotification();
  console.log(`🚀 ~ file: input-form.jsx:23 ~ skip:`, skip);
  const { data: leaveMain2 } = useLeaveData();
  const { data: leaveMain } = useLeaveRequesationHook();
  const [month, setMonth] = useState();

  return (
    <form className="flex w-full flex-col gap-4">
      <div className="w-full py-4 flex flex-wrap gap-4 justify-between">
        <Select
          value={{ value: month, label: month }}
          isClearable
          aria-errormessage=""
          placeholder={"Select Months"}
          components={{
            IndicatorSeparator: () => null,
          }}
          className="w-80"
          options={moment.months().map((month, index) => ({
            label: month,
            value: month,
          }))}
          onChange={(value) => {
            setMonth(value.value);
            if (value === null) return;
            console.log(`🚀 ~ file: input-form.jsx:25 ~ value`, value);
            // get start date of month
            const startDate = moment(value.value, "MMMM").startOf("month");
            // get end date of month
            const endDate = moment(value.value, "MMMM").endOf("month");
            setMinDate(startDate);
            setMaxDate(endDate);
          }}
        />
        {leaveMain2?.LeaveTypedEdited && leaveMain?.leaveTypes && (
          <Select
            value={leaveTypeDetails}
            isClearable
            className="min-w-60 z-50"
            aria-errormessage=""
            placeholder={"Select leave type"}
            components={{
              IndicatorSeparator: () => null,
            }}
            options={[
              ...leaveMain2?.LeaveTypedEdited?.filter((item) => item.count < 0),
              ...leaveMain?.leaveTypes.filter((item) => item.count > 0),
            ].map((month) => ({
              label: month?.leaveName,
              value: month?._id,
            }))}
            onChange={(value) => {
              console.log(`🚀 ~ file: input-form.jsx:25 ~ value`, value);
              setLeaveTypeDetailsId(value.value);
            }}
          />
        )}
        <Select
          isClearable
          className="min-w-60 z-50"
          aria-errormessage=""
          placeholder={"Select status"}
          components={{
            IndicatorSeparator: () => null,
          }}
          options={[
            { label: "Accepted", value: "Accepted" },
            {
              label: "Rejected",
              value: "Rejected",
            },
          ].map((month) => ({
            label: month?.label,
            value: month?.value,
          }))}
          onChange={(value) => {
            console.log(`🚀 ~ file: input-form.jsx:25 ~ value`, value);
            setStatus(value.value);
          }}
        />
      </div>
      {(isLoading || isFetching) &&
        [(1, 2, 3, 4, 5, 6)].map((item) => <LeaveRequestLoaderCard />)}
      {data?.leaveRequests?.map((item, index) => (
        <LeaveRequestCard key={index} items={item} />
      ))}

      <div className="flex justify-between">
        <Button
          variant="contained"
          disabled={skip >= 0 ? true : false}
          onClick={() => setSkip((prev) => prev + 1)}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onChange={() => setSkip((prev) => prev - 1)}
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default InputForm;
