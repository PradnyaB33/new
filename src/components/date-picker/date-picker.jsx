import { Close } from "@mui/icons-material";
import { Button, MenuItem, Popover, Select } from "@mui/material";
import moment from "moment";
import { extendMoment } from "moment-range";
import { momentLocalizer } from "react-big-calendar";
import { useQuery } from "react-query";

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Calendar } from "react-big-calendar";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import useLeaveData from "../../hooks/Leave/useLeaveData";

const AppDatePicker = () => {
  const {
    data,
    handleUpdateFunction,
    selectEvent,
    setselectEvent,
    setCalendarOpen,
    setNewAppliedLeaveEvents,
    selectedLeave,
    setSelectedLeave,
    newAppliedLeaveEvents,
    isCalendarOpen,
  } = useLeaveData();
  const momentWithRange = extendMoment(moment);
  const localizer = momentLocalizer(moment);
  const [Delete, setDelete] = useState(false);
  const [update, setUpdate] = useState(false);
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const { data2 } = useQuery("employee-disable-weekends", async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/weekend/get`,
      {
        headers: { Authorization: authToken },
      }
    );

    return response.data;
  });
  const handleSelectEvent = (event) => {
    console.log(`🚀 ~ file: date-picker.jsx:45 ~ event:`, event);
    setSelectedLeave(event);
    setCalendarOpen(true);
    if (event.title === "Selected Leave") {
      setDelete(true);
      setUpdate(false);
    } else {
      setDelete(false);
      setUpdate(true);
    }
  };

  const dayPropGetter = (date) => {
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });

    // Check if the current day is in the data? array
    const isDisabled = data2?.days?.some((day) => {
      return day.days.some((day) => day.day === dayOfWeek);
    });

    if (isDisabled) {
      return {
        style: {
          pointerEvents: "none",
          backgroundColor: "#ffb4b4",
        },
      };
    }

    return {};
  };

  const handleSelectSlot = ({ start, end }) => {
    const selectedStartDate = momentWithRange(start);
    const selectedEndDate = momentWithRange(end);
    const startDate = moment(start).startOf("day"); // Extract date, start at midnight
    const endDate = moment(end).startOf("day").add(1, "day"); // Add 1 day to make sure it's after 12 am

    // Check if the selected date range includes any disabled days
    const includesDisabledDay = data2?.days?.some((day) => {
      const disabledDate = moment(startDate).day(day.index);

      // Check if the entire day is disabled
      const isDisabledDay = moment(disabledDate).isSame(startDate, "day");

      // Check if the selected date range overlaps with the disabled day
      const isOverlap =
        selectedStartDate.isBefore(moment(disabledDate)) &&
        selectedEndDate.isAfter(moment(disabledDate));

      return isDisabledDay && isOverlap;
    });

    if (includesDisabledDay) {
      handleAlert(true, "warning", "You cannot select disabled days for leave");
      return;
    }

    const isOverlap = [
      ...data?.currentYearLeaves,
      ...newAppliedLeaveEvents,
    ].some(
      (event) =>
        (selectedStartDate.isSameOrAfter(moment(event.start)) &&
          selectedStartDate.isBefore(moment(event.end))) ||
        (selectedEndDate.isAfter(moment(event.start)) &&
          selectedEndDate.isSameOrBefore(moment(event.end))) ||
        (selectedStartDate.isBefore(moment(event.start)) &&
          selectedEndDate.isAfter(moment(event.end)))
    );

    if (isOverlap) {
      handleAlert(true, "warning", "You have already selected this leave");
    } else {
      if (selectEvent) {
        const newLeave = {
          ...selectedLeave,
          title: "Updated Leave",
          start: new Date(start).toISOString(),
          end: new Date(end).toISOString(),
          color: "black",
        };

        setNewAppliedLeaveEvents((prevEvents) => [...prevEvents, newLeave]);
        setSelectedLeave(null);

        setselectEvent(false);
      } else {
        const newLeave = {
          title: "Selected Leave",
          start: new Date(start).toISOString(),
          end: new Date(end).toISOString(),
          color: "blue",
          leaveTypeDetailsId: "",
        };
        setNewAppliedLeaveEvents((prevEvents) => [...prevEvents, newLeave]);
      }
    }
  };

  const CustomToolbar = (toolbar) => {
    const handleMonthChange = (event) => {
      const newDate = moment(toolbar.date).month(event.target.value).toDate();
      toolbar.onNavigate("current", newDate);
    };

    const handleYearChange = (event) => {
      const newDate = moment(toolbar.date).year(event.target.value).toDate();
      toolbar.onNavigate("current", newDate);
    };

    return (
      <div className="flex-row-reverse flex gap-4 items-center">
        <Button
          // variant="outlined"
          color="error"
          className="!h-full hover:!bg-[#da4f4f] hover:!text-white"
          size="small"
          onClick={() => setCalendarOpen(false)}
        >
          <Close />
        </Button>
        <Select
          className="m-2"
          size="small"
          value={moment(toolbar.date).month()}
          onChange={handleMonthChange}
        >
          {moment.months().map((month, index) => (
            <MenuItem key={index} value={index}>
              {month}
            </MenuItem>
          ))}
        </Select>
        <Select
          className="m-2"
          size="small"
          value={moment(toolbar.date).year()}
          onChange={handleYearChange}
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <MenuItem key={index} value={moment(toolbar.date).year() + index}>
              {moment(toolbar.date).year() + index}
            </MenuItem>
          ))}
        </Select>

        <div className="fled w-full flex-row-reverse px-3 text-blue-500 italic font-extrabold">
          {" "}
          {selectEvent ? "Please select dates for you leaves" : ""}
        </div>
      </div>
    );
  };
  const handleClickAway = (event) => {
    const clickableElements = document.querySelectorAll(`.rbc-event-content`);

    if (
      !Array.from(clickableElements).some((element) =>
        element.contains(event.target)
      )
    ) {
    } else {
    }
  };
  const handleDelete = (e) => {
    if (selectedLeave.title === "Selected Leave") {
      setNewAppliedLeaveEvents((prev) =>
        prev.filter((data) => {
          // Check if the current leave matches the leave to be removed
          return !(
            data.title === selectedLeave.title &&
            data.start === selectedLeave.start &&
            data.end === selectedLeave.end
          );
        })
      );
    } else {
    }
  };
  useEffect(() => {
    // Add click event listener when component mounts
    document.addEventListener("click", handleClickAway);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickAway);
    };
  }, []);
  return (
    <Popover
      PaperProps={{ className: "w-full md:w-[70vw] xl:w-[60vw]" }}
      open={isCalendarOpen}
      onClose={() => setCalendarOpen(false)}
      components={{
        toolbar: CustomToolbar,
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
      <div className=" bg-white shadow-lg z-10">
        <div className="w-full">
          <Calendar
            localizer={localizer}
            views={["month"]}
            components={{
              toolbar: CustomToolbar,
            }}
            events={
              data
                ? [...data?.currentYearLeaves, newAppliedLeaveEvents]
                : [...newAppliedLeaveEvents]
            }
            startAccessor="start"
            endAccessor="end"
            style={{
              height: "600px",
              width: "100%",
              background: "#fff",
            }}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            datePropGetter={selectedLeave}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.color,
              },
            })}
            dayPropGetter={dayPropGetter}
          />
        </div>
      </div>

      <div className="!px-4 !py-2 bg-white flex justify-between">
        <Button variant="contained" onClick={() => setCalendarOpen(false)}>
          Submit
        </Button>
        <Button
          variant="contained"
          onClick={handleDelete}
          className="rbc-event-content"
          disabled={!Delete}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          onClick={handleUpdateFunction}
          className="rbc-event-content"
          disabled={!update}
        >
          Update
        </Button>
      </div>
    </Popover>
  );
};

export default AppDatePicker;
