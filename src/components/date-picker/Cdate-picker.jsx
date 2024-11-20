import { Backdrop, CircularProgress, MenuItem, Select } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import useGetUser from "../../hooks/Token/useUser";
import usePublicHoliday from "../../pages/SetUpOrganization/PublicHolidayPage/usePublicHoliday";
import BasicButton from "../BasicButton";
import HeadingOneLineInfo from "../HeadingOneLineInfo/HeadingOneLineInfo";
import ReusableModal from "../Modal/component";
import MiniForm from "./components/mini-form";

const CAppDatePicker = ({
  data,
  handleUpdateFunction,
  selectEvent,
  setselectEvent,
  setNewAppliedLeaveEvents,
  selectedLeave,
  setSelectedLeave,
  newAppliedLeaveEvents,
  shiftData,
  deleteLeaveMutation,
  setIsCAppDatePickerVisible,
  calLoader,
  setCalLoader,
  setCalendarOpen,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}) => {
  const localizer = momentLocalizer(moment);
  const queryClient = useQueryClient();
  const { organisationId } = useParams();
  const [Delete, setDelete] = useState(false);
  const [update, setUpdate] = useState(false);
  const { handleAlert } = useContext(TestContext);
  const { authToken } = useGetUser();
  const [openDelete, setOpenDelete] = useState(false);
  const { filteredHolidayWithStartAndEnd, allPublicHoliday } =
    usePublicHoliday(organisationId);

  const increaseEndDateByOneDay = (events) => {
    return events?.map((event) => ({
      ...event,
      end: moment(event.end).add(1, "days").toDate(),
    }));
  };

  const leaves = increaseEndDateByOneDay(data?.currentYearLeaves);
  const newAppliedLeaveEvent = increaseEndDateByOneDay(newAppliedLeaveEvents);

  const { data: data2 } = useQuery(
    "employee-disable-weekends",
    async () => {
      setCalLoader(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/weekend/get`,
        {
          headers: { Authorization: authToken },
        }
      );

      return response.data;
    },
    {
      onSuccess: () => {
        setCalLoader(false);
      },
      onError: () => {
        setCalLoader(false);
      },
    }
  );

  const handleSelectEvent = (event) => {
    setCalLoader(true);
    setSelectedLeave(event);
    if (event.title === "Selected Leave") {
      setDelete(true);
      setUpdate(false);
    } else if (event.color) {
      setUpdate(true);
      setDelete(true);
    } else {
      setDelete(false);
      setUpdate(false);
    }
    setCalLoader(false);
  };

  const dayPropGetter = (date) => {
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });

    // Check if the current day is in the data2 array
    const isDisabled = data2?.days?.days?.some((day) => {
      return day.day === dayOfWeek;
    });

    const isPublicHoliday = filteredHolidayWithStartAndEnd.some((holiday) =>
      moment(date).isSame(holiday.start, "day")
    );

    if (isDisabled || isPublicHoliday) {
      return {
        style: {
          pointerEvents: isDisabled ? "none" : "auto",
          backgroundColor: "#ffcccb", // light red
        },
      };
    }

    return {};
  };

  const handleSelectSlot = async ({ start, end }) => {
    setCalLoader(true);

    const selectedStartDate = moment(start).startOf("day");
    const selectedEndDate = moment(end).startOf("day").subtract(1, "days");

    const currentDate = moment(selectedStartDate);

    const includedDays = data2.days?.days?.map((day) => day.day);

    let extraDays = 0;
    let isExtraDay = false;

    while (currentDate.isSameOrBefore(selectedEndDate)) {
      const currentDay = currentDate.format("ddd");
      const isDisabled = includedDays.includes(currentDay);
      const isPublicHoliday = filteredHolidayWithStartAndEnd.some((holiday) =>
        moment(currentDate).isSame(holiday.start, "day")
      );

      if (isDisabled || isPublicHoliday) {
        setCalLoader(false);
        return handleAlert(
          true,
          "warning",
          "You cannot select holidays or public holidays"
        );
      }

      if (isDisabled || isPublicHoliday) {
        extraDays++;
        isExtraDay = true;
      }

      currentDate.add(1, "day");
    }

    await queryClient.invalidateQueries("employee-leave-table-without-default");

    const isOverlap = [
      ...data?.currentYearLeaves,
      ...newAppliedLeaveEvents,
      ...shiftData?.requests,
    ].some((range) => {
      const rangeStart = range.start;
      const rangeEnd = moment(range.end).startOf("day").subtract(1, "days");

      const isStartBetween = selectedStartDate.isBetween(
        rangeStart,
        rangeEnd,
        undefined,
        "[)"
      );

      const isEndBetween = selectedEndDate.isBetween(
        rangeStart,
        rangeEnd,
        undefined,
        "(]"
      );

      const isOverlap =
        selectedStartDate.isSameOrBefore(rangeEnd) &&
        selectedEndDate.isSameOrAfter(rangeStart);

      const isSameOverlap = selectedStartDate.isSame(rangeStart);

      return isStartBetween || isEndBetween || isOverlap || isSameOverlap;
    });

    if (isOverlap) {
      setCalLoader(false);
      return handleAlert(
        true,
        "warning",
        "You have already selected this leave"
      );
    } else {
      const newLeave = {
        title: isExtraDay
          ? "Extra Day"
          : selectEvent
          ? "Updated Leave"
          : "Selected Leave",
        start: new Date(start).toISOString(),
        end: new Date(selectedEndDate).toISOString(),
        color: selectEvent ? "black" : "blue",
        leaveTypeDetailsId: "",
        _id: selectEvent ? selectedLeave?._id : null,
        extraDays,
      };

      setNewAppliedLeaveEvents((prevEvents) => [...prevEvents, newLeave]);
      setSelectedLeave(null);
      setselectEvent(false);
    }
    setCalLoader(false);
  };

  const CustomToolbar = (toolbar) => {
    const handleMonthChange = (event) => {
      const newMonth = event.target.value;
      setSelectedMonth(newMonth + 1);
      const newDate = moment(toolbar.date).month(newMonth).toDate();
      toolbar.onNavigate("current", newDate); // Ensure "current" is used
    };

    const handleYearChange = (event) => {
      setCalLoader(true);
      const newYear = event.target.value;
      const newDate = moment(toolbar.date)
        .year(newYear)
        .month(selectedMonth - 1)
        .toDate(); // Set month to current month
      toolbar.onNavigate("current", newDate); // Ensure "current" is used
      setSelectedYear(newYear);
      setCalLoader(false);
    };

    return (
      <>
        <div className="pl-6 !m-0 flex md:flex-row flex-col justify-between gap-2 items-center">
          <div className="flex items-center py-3 justify-start">
            <HeadingOneLineInfo heading={"Attendance Calendar"} />
            <Select
              className="m-2 bg-white"
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
              className="m-2 bg-white"
              size="small"
              value={moment(toolbar.date).year()}
              onChange={handleYearChange}
            >
              {Array.from({ length: 10 }).map((_, index) => (
                <MenuItem
                  key={index}
                  value={moment(toolbar.date).year() + index}
                >
                  {moment(toolbar.date).year() + index}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="flex justify-end gap-1 items-center p-2">
            {update && (
              <BasicButton
                title={"Edit"}
                color={"success"}
                onClick={async () => {
                  await handleUpdateFunction();
                  setDelete(false);
                  setUpdate(false);
                }}
              />
            )}
            {Delete && (
              <BasicButton
                color={"danger"}
                title={"Delete"}
                onClick={handleDelete}
              />
            )}
            <BasicButton
              title={"Apply"}
              disabled={calLoader || newAppliedLeaveEvent?.length === 0}
              onClick={() => {
                setCalLoader(false);
                if (newAppliedLeaveEvents?.length > 0) {
                  setIsCAppDatePickerVisible(false);
                }
                setDelete(false);
                setUpdate(false);
                setCalendarOpen(false);
              }}
            />
          </div>
        </div>
      </>
    );
  };

  const handleDelete = (e) => {
    if (selectedLeave.title === "Selected Leave") {
      setNewAppliedLeaveEvents((prev) =>
        prev.filter((data) => {
          return (
            data.title !== selectedLeave.title &&
            data.start !== selectedLeave.start &&
            data.end !== selectedLeave.end
          );
        })
      );
    } else {
      setOpenDelete(true);
    }
    setDelete(false);
    setUpdate(false);
  };

  useEffect(() => {
    return () => {
      // document.removeEventListener("click", handleClickAway);
    };
  }, []);

  const eventPropGetter = (event) => {
    let backgroundColor = "blue";
    let color = "white";

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

    const matchingLeave = leaves?.find(
      (leave) => leave.leaveTypeDetailsId === event.leaveTypeDetailsId
    );

    if (matchingLeave) {
      backgroundColor = matchingLeave.color;
    }

    const dayOfWeek = moment(event.start).format("ddd");
    const isDisabled = data2?.days?.days?.some((day) => day.day === dayOfWeek);
    const isPublicHoliday = filteredHolidayWithStartAndEnd.some((holiday) =>
      moment(event.start).isSame(holiday.start, "day")
    );

    if (isDisabled || (isPublicHoliday && !event?.status)) {
      if (event.title === "Available") {
        backgroundColor = event?.color;
      } else {
        backgroundColor = "#ffcccb"; // light red
      }
    }

    return {
      style: {
        backgroundColor,
        color,
        fontWeight: event.isPublicHoliday ? "bold" : "normal",
      },
    };
  };

  const CustomEvent = ({ event }) => {
    const eventStyle = {
      height: "2em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      width: "100px",
    };

    if (event.isPublicHoliday) {
      return (
        <span className="absolute text-[red] top-[1px]" style={eventStyle}>
          {event.title}
        </span>
      );
    }
    return <span style={eventStyle}>{event.title}</span>;
  };

  const DateCellContent = ({ label, date }) => {
    const isPublicHoliday = filteredHolidayWithStartAndEnd.some((holiday) =>
      moment(date).isSame(holiday.start, "day")
    );

    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
    const isDisabled = data2?.days?.days?.some((day) => day.day === dayOfWeek);

    return (
      <div
        style={{
          color: isPublicHoliday || isDisabled ? "red" : "grey",
          fontSize: "1.2em",
          fontWeight: "bold",
        }}
      >
        {label}
      </div>
    );
  };

  return (
    <div className="relative">
      {calLoader && (
        <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center z-50 bg-opacity-50 bg-gray-800">
          <Backdrop style={{ position: "absolute" }} open={true}>
            <CircularProgress />
          </Backdrop>
        </div>
      )}
      <div className="z-10">
        <div className="w-full">
          {allPublicHoliday &&
            filteredHolidayWithStartAndEnd &&
            shiftData?.requests &&
            data?.currentYearLeaves && (
              <Calendar
                localizer={localizer}
                views={["month"]}
                components={{
                  event: CustomEvent,
                  toolbar: CustomToolbar,
                  dateHeader: DateCellContent,
                }}
                events={
                  data
                    ? [
                        ...leaves,
                        ...shiftData?.requests,
                        ...newAppliedLeaveEvent,
                        ...filteredHolidayWithStartAndEnd.map((holiday) => ({
                          ...holiday,
                          isPublicHoliday: true,
                        })),
                      ]
                    : [
                        ...newAppliedLeaveEvent,
                        ...filteredHolidayWithStartAndEnd.map((holiday) => ({
                          ...holiday,
                          isPublicHoliday: true,
                        })),
                      ]
                }
                startAccessor="start"
                endAccessor="end"
                style={{
                  height: "400px",
                  width: "100%",
                }}
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                datePropGetter={selectedLeave}
                eventPropGetter={eventPropGetter}
                titleAccessor={(event) =>
                  event.isPublicHoliday ? event.title : event.title
                }
                dayPropGetter={dayPropGetter}
                className="rbc-calendar" // Add this class to ensure proper alignment
              />
            )}
        </div>
      </div>

      <div className="flex justify-end px-4 gap-2">
        {/* {update && (
          <BasicButton
            title={"Edit"}
            color={"success"}
            onClick={async () => {
              await handleUpdateFunction();
              setDelete(false);
              setUpdate(false);
            }}
          />
        )}
        {Delete && (
          <BasicButton
            color={"danger"}
            title={"Delete"}
            onClick={handleDelete}
          />
        )}
        <BasicButton
          title={"Apply"}
          onClick={() => {
            setCalLoader(false);
            if (newAppliedLeaveEvents?.length > 0) {
              setIsCAppDatePickerVisible(false);
            }
            //it is more importatnt👍
            setCalendarOpen(false);
          }}
        /> */}
      </div>

      <ReusableModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        heading={"Are you sure want delete ?"}
      >
        <MiniForm
          id={selectedLeave?._id}
          mutate={deleteLeaveMutation?.mutate}
          onClose={() => setOpenDelete(false)}
        />
      </ReusableModal>
    </div>
  );
};

export default CAppDatePicker;
