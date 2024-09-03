import {
  DeleteOutlined,
  EditOutlined,
  Person,
  West,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { format } from "date-fns";
import moment from "moment";
import React, { useContext, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import { CustomOption } from "../../../components/InputFileds/AuthInputFiled";
import { TestContext } from "../../../State/Function/Main";
import SideBalenceTable from "../components/SideBalenceTable";
import SideLeaveTable from "../components/SideLeaveTable";
import SkeletonLeave from "../components/skeletonComponent";
import useCustomStates from "../hooks/useCustomStates";
import useGetWeekends from "../hooks/useGetWeekends";
import useManagerCalender from "./useManagerCalender";

const ManagementCalender = () => {
  const localizer = momentLocalizer(moment);
  const { organisationId } = useParams("");
  const [employee, setEmployee] = useState("");

  const {
    EmployeeLeaves,
    leaveTableData,
    employeeData,
    employeeLoading,
    isFetching,
  } = useManagerCalender({ employee, organisationId });

  const { handleAlert } = useContext(TestContext);
  const {
    newAppliedLeaveEvents,
    setNewAppliedLeaveEvents,
    selectedLeave,
    setSelectedLeave,
    selectEvent,
    changeTable,
    setSelectEvent,
  } = useCustomStates();

  const increaseEndDateByOneDay = (events) => {
    return events.map((event) => ({
      ...event,
      end: moment(event.end).add(1, "days").toDate(),
    }));
  };

  const currentYearLeavesWithIncreasedEndDate = increaseEndDateByOneDay(
    EmployeeLeaves?.currentYearLeaves || []
  );
  const newAppliedLeaveEventsWithIncreasedEndDate = increaseEndDateByOneDay(
    newAppliedLeaveEvents || []
  );

  // Combine the arrays
  const combinedEvents = [
    ...currentYearLeavesWithIncreasedEndDate,
    ...newAppliedLeaveEventsWithIncreasedEndDate,
  ];

  const handleSelectSlot = async ({ start, end }) => {
    const selectedStartDate = moment(start).startOf("day");
    const selectedEndDate = moment(end).startOf("day").subtract(1, "days");

    const currentDate = moment(selectedStartDate);

    const includedDays = weekends.days?.days?.map((day) => day.day);
    while (currentDate.isSameOrBefore(selectedEndDate)) {
      const currentDay = currentDate.format("ddd");
      if (includedDays.includes(currentDay)) {
        // setCalLoader(false);
        return handleAlert(
          true,
          "warning",
          `You cannot select ${currentDay} for leave`
        );
      }
      currentDate.add(1, "day");
    }
    // await queryClient.invalidateQueries("employee-leave-table-without-default");

    const isOverlap = newAppliedLeaveEvents.some((range) => {
      // Convert range start and end dates to Moment.js objects
      const rangeStart = range.start;
      const rangeEnd = moment(range.end).startOf("day").subtract(1, "days");

      // Check if selected start date is between any existing range
      const isStartBetween = selectedStartDate.isBetween(
        rangeStart,
        rangeEnd,
        undefined,
        "[)"
      );

      // Check if selected end date is between any existing range
      const isEndBetween = selectedEndDate.isBetween(
        rangeStart,
        rangeEnd,
        undefined,
        "(]"
      );

      // Check if selected start and end date overlaps with any existing range

      const isOverlap =
        selectedStartDate.isSameOrBefore(rangeEnd) &&
        selectedEndDate.isSameOrAfter(rangeStart);
      // Return true if any overlap is found
      return isStartBetween || isEndBetween || isOverlap;
    });

    if (isOverlap) {
      return handleAlert(
        true,
        "warning",
        "You have already selected this leave"
      );
    } else {
      const newLeave = {
        title: selectEvent ? "Updated Leave" : "Selected Leave",
        start: new Date(selectedStartDate).toISOString(),
        end: new Date(selectedEndDate).toISOString(),
        color: selectEvent ? "black" : "blue",
        leaveTypeDetailsId: "",
        _id: selectedLeave?._id ? selectedLeave?._id : null,
      };

      setNewAppliedLeaveEvents(newLeave);
      setSelectedLeave(selectEvent ? null : newLeave);
      // setselectEvent(false);
    }
    // setCalLoader(false);
  };

  const { weekends } = useGetWeekends();

  const dayPropGetter = (date) => {
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });

    // Check if the current day is in the data? array
    const isDisabled = weekends?.days?.days?.some((day) => {
      return day.day === dayOfWeek;
    });
    if (isDisabled) {
      return {
        style: {
          pointerEvents: "none",
          backgroundColor: "#f7bfbf",
        },
      };
    }

    // const isSelected =
    //   selectedLeave &&
    //   moment(date).isBetween(
    //     selectedLeave.start,
    //     selectedLeave.end,
    //     "day",
    //     "[]"
    //   );
    // if (isSelected) {
    //   return {
    //     style: {
    //       backgroundColor: "#bff7bf",
    //     },
    //   };
    // }

    return {};
  };

  const handleSelectEvent = (event) => {
    setSelectedLeave(event);
  };

  return (
    <div>
      <header className="text-xl w-full pt-6 bg-white border-b   p-4">
        <Link to={-1}>
          <West className="mx-4 !text-xl" />
        </Link>
        Employee Attendance
      </header>

      {/* Top Bar */}

      <section className="p-4 px-8 bg-gray-50 min-h-[80vh] ">
        <div>
          <h1 className="text-2xl text-gray-700   font-semibold  tracking-tight">
            View Employee Attendence
          </h1>
          <p className="text-gray-500 text-sm tracking-tight ">
            Here you can view your employee attendance
          </p>
        </div>

        <div className="my-4 flex justify-between gap-4 items-end">
          <div className="w-[30%]">
            <div className={`space-y-1 min-w-[15vw] `}>
              <label className={` font-semibold text-gray-500 text-lg`}>
                Select Employee
              </label>
              <div
                className={`flex rounded-md px-2 bg-white border-gray-200 border-[.5px] items-center`}
              >
                <Person className="text-gray-700 md:text-lg !text-[1em]" />
                <Select
                  aria-errormessage=""
                  placeholder={"Assignee"}
                  isClearable
                  styles={{
                    control: (styles) => ({
                      ...styles,
                      borderWidth: "0px",
                      boxShadow: "none",
                    }),
                  }}
                  className={` bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                  components={{
                    Option: CustomOption,
                    IndicatorSeparator: () => null,
                  }}
                  options={employeeData?.map((emp) => ({
                    value: emp._id,
                    label: `${emp.first_name} ${emp.last_name}`,
                    image: emp.user_logo_url,
                  }))}
                  onChange={(value) => {
                    setEmployee(value?.value);
                  }}
                />
              </div>
            </div>
          </div>

          {selectedLeave?.title !== "Selected Leave" &&
          Object.keys(selectedLeave).length > 0 ? (
            <div className="flex gap-2 p-1 px-4 w-[70%] bg-white justify-between border rounded-md items-center">
              <h1 className="text-lg font-bold leading-none text-gray-700">
                Modify {selectedLeave?.title} request from{" "}
                {format(new Date(selectedLeave?.start), "PP")} to{" "}
                {format(new Date(selectedLeave?.end), "PP")}
              </h1>
              <div className="flex gap-2 ">
                <IconButton>
                  <DeleteOutlined color="error" />
                </IconButton>
                <IconButton>
                  <EditOutlined color="primary" />
                </IconButton>
                {/* <button
                  type="button"
                  disabled={
                    selectedLeave?.title === "Selected Leave" || !selectedLeave
                  }
                  className={`w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-2  text-md font-semibold text-white ${
                    selectedLeave?.title === "Selected Leave" || !selectedLeave
                      ? "bg-gray-400"
                      : "bg-red-500 hover:bg-red-500"
                  } focus-visible:outline-red-500`}
                >
                  Delete Leave
                </button>
                <button
                  type="button"
                  disabled={
                    selectedLeave?.title === "Selected Leave" || !selectedLeave
                  }
                  className={`w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-2  text-md font-semibold text-white
                 ${
                   selectedLeave?.title === "Selected Leave" || !selectedLeave
                     ? "bg-gray-400"
                     : "bg-blue-500 hover:bg-blue-500"
                 } focus-visible:outline-blue-500`}
                >
                  Update Leave
                </button> */}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>

        {isFetching ? (
          <SkeletonLeave />
        ) :  !EmployeeLeaves ? (
          <div className="flex items-center flex-col gap-2 justify-center">
            <img src="/calender.svg" className="h-[200px]" alt="none" />
            <div>
              <h1 className="text-4xl text-gray-700   font-semibold  tracking-tight">
                {employeeLoading ? "Loading..." : "Select Employee!"}
              </h1>
              <h1 className="text-sm text-gray-700   font-semibold  tracking-tight">
                {employeeLoading
                  ? ""
                  : !employee
                  ? "Please Select Employee to view the data"
                  : "No data found for this selected employee about attendance"}
              </h1>
            </div>
          </div>
        ) : (
          <section className="w-full flex gap-4 ">
            {newAppliedLeaveEvents?.length > 0 && !changeTable ? (
              <SideLeaveTable
                empId={employee}
                leaveTableData={leaveTableData}
              />
            ) : (
              <SideBalenceTable leaveTableData={leaveTableData} />
            )}
            <div className="manager-cal w-[70%] p-4 bg-white rounded-md border flex items-center justify-center ">
              <Calendar
                localizer={localizer}
                datePropGetter={selectedLeave}
                eventPropGetter={(event) => {
                  let backgroundColor = "blue";

                  if (event?.status) {
                    switch (event.status) {
                      case "Pending":
                        backgroundColor = "orange";
                        break;
                      case "Rejected":
                        backgroundColor = "red";
                        break;
                      case "Approved":
                        backgroundColor = "green";
                        break;
                      default:
                        backgroundColor = "blue";
                        break;
                    }
                  }
                  if (event.color) {
                    backgroundColor = event.color;
                  }

                  return {
                    style: {
                      backgroundColor,
                    },
                  };
                }}
                views={["month"]}
                // components={{
                //   toolbar: CustomToolbar,
                // }}
                selectable
                events={combinedEvents}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                dayPropGetter={dayPropGetter}
                startAccessor="start"
                endAccessor="end"
                style={{
                  height: "75vh",
                  width: "100%",
                  border: "none",
                  background: "#fff",
                }}
              />
            </div>
          </section>
        )}
      </section>
    </div>
  );
};

export default ManagementCalender;
