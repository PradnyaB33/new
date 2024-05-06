import { Close } from "@mui/icons-material";
import { Button, MenuItem, Popover, Select } from "@mui/material";
import moment from "moment";
import { momentLocalizer } from "react-big-calendar";
import { useQuery } from "react-query";

import axios from "axios";
import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { Calendar } from "react-big-calendar";
import { TestContext } from "../../State/Function/Main";
import useGetUser from "../../hooks/Token/useUser";

const AppDatePicker = ({
  data,
  handleUpdateFunction,
  shiftData,
  selectEvent,
  setselectEvent,
  setCalendarOpen,
  setNewAppliedLeaveEvents,
  selectedLeave,
  setSelectedLeave,
  newAppliedLeaveEvents,
  isCalendarOpen,
}) => {
  const localizer = momentLocalizer(moment);
  const [Delete, setDelete] = useState(false);
  const [update, setUpdate] = useState(false);
  const { handleAlert } = useContext(TestContext);
  const [leaveText, setLeaveText] = useState("");
  const { authToken } = useGetUser();
  const { data: data2 } = useQuery("employee-disable-weekends", async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/weekend/get`,
      {
        headers: { Authorization: authToken },
      }
    );

    return response.data;
  });

  console.log("this is shiftData", shiftData);
  const handleSelectEvent = (event) => {
    setLeaveText(
      `The application for ${format(new Date(event.start), "dd-MM-yyyy")} is ${
        event?.status
      } state`
    );
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
    const isDisabled = data2?.days?.days?.some((day) => {
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

    return {};
  };

  const handleSelectSlot = ({ start, end }) => {
    const selectedStartDate = moment(start).startOf("day");
    const selectedEndDate = moment(end).startOf("day").subtract(1, "day");
    const difference = selectedEndDate.diff(selectedStartDate, "days");
    console.log(`🚀 ~ file: date-picker.jsx:102 ~ difference:`, difference);

    const currentDate = moment(selectedStartDate);

    const includedDays = data2.days?.days?.map((day) => day.day);

    while (currentDate.isSameOrBefore(selectedEndDate)) {
      const currentDay = currentDate.format("ddd");
      if (includedDays.includes(currentDay)) {
        return handleAlert(
          true,
          "warning",
          `You cannot select ${currentDay} for leave`
        );
      }
      currentDate.add(1, "day");
    }

    const isOverlap = [
      ...data?.currentYearLeaves,
      ...newAppliedLeaveEvents,
      ...shiftData?.requests,
    ].some(
      (event) =>
        (selectedStartDate.isSameOrAfter(moment(event.start).startOf("day")) &&
          selectedStartDate.isBefore(moment(event.end).startOf("day"))) ||
        (selectedEndDate.isAfter(moment(event.start).startOf("day")) &&
          selectedEndDate.isSameOrBefore(moment(event.end).startOf("day"))) ||
        (selectedStartDate.isBefore(moment(event.start).startOf("day")) &&
          selectedEndDate.isAfter(moment(event.end).startOf("day")))
    );

    if (isOverlap) {
      return handleAlert(
        true,
        "warning",
        "You have already selected this leave"
      );
    } else {
      const newLeave = {
        title: selectEvent ? "Updated Leave" : "Selected Leave",
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
        color: selectEvent ? "black" : "blue",
        leaveTypeDetailsId: "",
        _id: selectedLeave?._id ? selectedLeave?._id : null,
      };

      setNewAppliedLeaveEvents((prevEvents) => [...prevEvents, newLeave]);
      setSelectedLeave(selectEvent ? null : newLeave);
      setselectEvent(false);
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
      <>
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
        </div>
        <div className="flex w-full flex-row-reverse px-3 text-red-500 italic font-extrabold text-xs h-[20px]">
          {" "}
          {selectEvent ? "Please select dates for you leaves" : leaveText}
        </div>
      </>
    );
  };
  const handleClickAway = (event) => {
    const clickableElements = document.querySelectorAll(`.rbc-event-content`);

    if (
      !Array.from(clickableElements).some((element) =>
        element.contains(event.target)
      )
    ) {
      setLeaveText("");
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
    }
    setDelete(false);
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
      PaperProps={{
        className:
          "w-full xl:w-[400px] xl:h-[470px] !bottom-0 !p-0 flex flex-col justify-between",
      }}
      open={isCalendarOpen}
      onClose={() => setCalendarOpen(false)}
      components={{
        toolbar: CustomToolbar,
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      style={{ height: "500px !important" }}
    >
      <div className=" bg-white z-10">
        <div className="w-full">
          <Calendar
            localizer={localizer}
            views={["month"]}
            components={{
              toolbar: CustomToolbar,
            }}
            events={
              data
                ? [
                    ...data?.currentYearLeaves,
                    ...shiftData?.requests,
                    ...newAppliedLeaveEvents,
                  ]
                : [...newAppliedLeaveEvents]
            }
            startAccessor="start"
            endAccessor="end"
            style={{
              height: "400px",
              width: "100%",
              background: "#fff",
            }}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
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
          onClick={async () => {
            await handleUpdateFunction();
            setUpdate(false);
          }}
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
