import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker CSS

const CalenderInterviewShedule = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCell, setSelectedCell] = useState({});
    const [dates, setDates] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const { control, formState, handleSubmit } = useForm({
        defaultValues: {
            employeeName: "",
            interviewType: "",
            notes: "",
        },
    });
    const { errors } = formState;

    const times = ["1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12AM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM", "12PM"]; // Add more times as needed

    // Function to get the current week's dates (7 days)
    const getCurrentWeekDates = () => {
        const today = new Date();
        const firstDayOfWeek = today.getDate() - today.getDay(); // Get the first day of the week (Sunday)
        const startOfWeek = new Date(today.setDate(firstDayOfWeek)); // Set the date to Sunday

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + i);
            const day = currentDate.toLocaleString("en-us", { weekday: "short" });
            weekDates.push({ day, date: currentDate.getDate() });
        }
        return weekDates;
    };

    // Set default dates to show current week (7 days) initially
    useEffect(() => {
        const weekDates = getCurrentWeekDates();
        setDates(weekDates);
    }, []);

    // Handle Date Range Selection
    const handleDateRangeChange = (range) => {
        const [start, end] = range;
        setStartDate(start);
        setEndDate(end);
        // Assuming you want to generate dates based on the selected range
        const newDates = generateDatesInRange(start, end);
        setDates(newDates); // Update the dates array to reflect the selected range
    };

    const generateDatesInRange = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const datesArray = [];
        let currentDate = startDate;

        while (currentDate <= endDate) {
            const day = currentDate.toLocaleString("en-us", { weekday: "short" });
            datesArray.push({ day, date: currentDate.getDate() });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return datesArray;
    };

    // Handle cell click
    const handleCellClick = (day, date, time) => {
        setSelectedCell({ day, date, time });
        setDialogOpen(true);
    };

    // Close dialog
    const closeDialog = () => setDialogOpen(false);

    // Handle interview scheduling form submission
    const onSubmit = (data) => {
        // Log the data or send it to an API
        console.log("Scheduled Interview Data:", {
            ...data,
            date: selectedCell.date,
            time: selectedCell.time,
            day: selectedCell.day,
        });

        // Close dialog after submitting
        closeDialog();
    };

    return (
        <div style={{ display: "flex", gap: "20px" }}>
            {/* Sidebar for Date Range Selection */}
            <div style={{ minWidth: "300px" }}>
                <h3>Select Date</h3>

                <Controller
                    control={control}
                    name="timeRange"
                    render={({ field }) => (
                        <div className="flex rounded-md py-2">
                            <DatePicker
                                selected={startDate}
                                onChange={handleDateRangeChange} // Handle range change
                                startDate={startDate}
                                endDate={endDate}
                                selectsRange
                                inline
                            />
                        </div>
                    )}
                />
            </div>

            {/* Calendar */}
            <div style={{ flex: 1 }}>
                <table border="1" style={{ width: "100%", textAlign: "center", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ backgroundColor: "#f0f0f0" }}>Time</th>
                            {dates.map((d, index) => (
                                <th key={index} style={{ backgroundColor: "#f0f0f0" }}>
                                    {d.day}
                                    <br />
                                    {d.date}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {times.map((time, rowIndex) => (
                            <tr key={rowIndex}>
                                <td style={{ backgroundColor: "#fafafa" }}>{time}</td>
                                {dates.map((d, colIndex) => (
                                    <td
                                        key={colIndex}
                                        style={{
                                            cursor: "pointer",
                                            background: "#fff",
                                            padding: "10px",
                                            border: "1px solid #ddd",
                                            height: "50px",
                                        }}
                                        onClick={() => handleCellClick(d.day, d.date, time)}
                                    >
                                        {/* Cell content */}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Dialog Box */}
            <Dialog open={dialogOpen} onClose={closeDialog}>
                <DialogTitle>Schedule Interview</DialogTitle>
                <DialogContent>
                    <p><strong>Day:</strong> {selectedCell.day}</p>
                    <p><strong>Date:</strong> {selectedCell.date}</p>
                    <p><strong>Time:</strong> {selectedCell.time}</p>

                    {/* Interview scheduling form */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            control={control}
                            name="employeeName"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Employee Name"
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    error={!!errors.employeeName}
                                    helperText={errors.employeeName ? "Employee name is required" : ""}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="interviewType"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Interview Type"
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    error={!!errors.interviewType}
                                    helperText={errors.interviewType ? "Interview type is required" : ""}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="notes"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Notes"
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                />
                            )}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit(onSubmit)} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CalenderInterviewShedule;
