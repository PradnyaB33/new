import { Close } from "@mui/icons-material";
import { Button, MenuItem, Popover, Select } from "@mui/material";
import moment from "moment";
import { momentLocalizer } from "react-big-calendar";
import { QueryClient, useQuery } from "react-query";

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Calendar } from "react-big-calendar";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";

const AppDatePicker = ({
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
    disabledShiftId
}) => {
    const localizer = momentLocalizer(moment);
    const [Delete, setDelete] = useState(false);
    const [update, setUpdate] = useState(false);
    const { handleAlert } = useContext(TestContext);
    const [newData, setNewData] = useState([])
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const arr = data;
    const arrayOfData = arr && arr.requests ? arr.requests : [];

    useEffect(() => {
        const newArr = arrayOfData.filter((item) => {
            return item._id !== disabledShiftId;
        });
        setNewData(newArr);
    }, [arr]);

    const { data: data2 } = useQuery("employee-disable-weekends", async () => {
        const response = await axios.get(
            `${process.env.REACT_APP_API}/route/weekend/get`,
            {
                headers: { Authorization: authToken },
            }
        );

        return response.data;
    });
    const handleSelectEvent = (event) => {
        if (event.title === "Selected Leave") {
            const filteredEvents = newAppliedLeaveEvents.filter(
                (item) => item.title !== "Selected Leave"
            );
            setNewAppliedLeaveEvents(filteredEvents);
        }
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
        console.log(selectedLeave);
        const selectedStartDate = moment(start).startOf("day");
        const selectedEndDate = moment(end).startOf("day").subtract(1, "day");
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
        if (data && data.requests && Array.isArray(data.requests)) {
            const isOverlapWithData = data.requests.some(event => {
                const eventStartDate = moment(event.start);
                const eventEndDate = moment(event.end);

                return (
                    // Check if selected slot starts or ends within existing event
                    (moment(start).isSameOrAfter(eventStartDate) && moment(start).isBefore(eventEndDate)) ||
                    (moment(end).isAfter(eventStartDate) && moment(end).isSameOrBefore(eventEndDate)) ||
                    // Check if existing event is within selected slot
                    (moment(start).isSameOrBefore(eventStartDate) && moment(end).isSameOrAfter(eventEndDate))
                );
            });

            if (isOverlapWithData) {
                return handleAlert(true, "error", "This slot overlaps with an existing event.");
            }
        }



        const isOverlap = [
            ...newAppliedLeaveEvents,
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
                title: selectEvent ? "Updated Shift" : "Selected Shift",
                start: new Date(start).toISOString(),
                end: new Date(end).toISOString(),
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
                    {selectEvent ? "select the dates to update" : ""}
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
    const handleDelete = async () => {
        try {
            if (selectedLeave._id) {
                await axios.delete(`${process.env.REACT_APP_API}/route/shiftApply/delete/${selectedLeave._id}`, {
                    headers: {
                        Authorization: authToken
                    }
                });
                // Update newAppliedLeaveEvents state after successful deletion
                setNewAppliedLeaveEvents(prevEvents =>
                    prevEvents.filter(event => event._id !== selectedLeave._id)
                );
                setSelectedLeave(null); // Reset selectedLeave state
                setDelete(false); // Toggle delete state
                console.log("Shift deleted successfully");
            } else if (selectedLeave) {
                // If selectedLeave does not have an _id, filter it out from newAppliedLeaveEvents
                setNewAppliedLeaveEvents(prevEvents =>
                    prevEvents.filter(event =>
                        event.title !== selectedLeave.title ||
                        event.start !== selectedLeave.start ||
                        event.end !== selectedLeave.end
                    )
                );
                setSelectedLeave(null); // Reset selectedLeave state
                setDelete(false); // Toggle delete state
            } else {
                console.log("This operation cannot be done");
            }
        } catch (error) {
            console.log("Error deleting shift:", error);
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
            PaperProps={{ className: "w-full xl:w-[400px] xl:h-[470px] !bottom-0 !p-0 flex flex-col justify-between" }}
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
            <div className=" bg-white shadow-lg z-10">
                <div className="w-full">
                    <Calendar
                        localizer={localizer}
                        views={["month"]}
                        components={{
                            toolbar: CustomToolbar,
                        }}
                        events={data
                            ? [...newData, ...newAppliedLeaveEvents]
                            : [...newAppliedLeaveEvents]}
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
                    disabled={!selectedLeave}
                >
                    Delete
                </Button>
            </div>
        </Popover>
    );
};

export default AppDatePicker;
