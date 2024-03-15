import moment from "moment";
import React, { useState } from "react";

const CustomCalendar = () => {
  const daysInMonth = moment().daysInMonth();
  const firstDayOfMonth = moment().startOf("month").day();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const emptyCellsBefore = Array.from(
    { length: firstDayOfMonth },
    (_, index) => index
  );

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Function to handle mouse down event
  const handleMouseDown = (day) => {
    setStartDate(day);
    setEndDate(day);
  };

  // Function to handle mouse enter event
  const handleMouseEnter = (day) => {
    if (startDate !== null) {
      setEndDate(day);
    }
  };

  // Function to handle mouse up event
  const handleMouseUp = () => {
    if (startDate !== null && endDate !== null) {
      console.log("Selected Range:", startDate, "to", endDate);
      // You can perform any action here with the selected range
      // For now, we are just logging it to the console
    }
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div className="grid grid-cols-7 gap-1 mt-48">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="day-header text-center">
          {day}
        </div>
      ))}
      {emptyCellsBefore.map((_, index) => (
        <div key={`empty-${index}`} className="empty-cell"></div>
      ))}
      {days.map((day, index) => (
        <div
          key={index}
          className={`select-none day-cell text-center ${
            day >= startDate && day <= endDate ? "bg-blue-500 text-white" : ""
          }`}
          onMouseDown={() => handleMouseDown(day)}
          onMouseEnter={() => handleMouseEnter(day)}
          onMouseUp={handleMouseUp}
          onTouchStart={() => handleMouseDown(day)}
          onTouchMove={() => handleMouseEnter(day)}
          onTouchEnd={handleMouseUp}
        >
          {day}
        </div>
      ))}
    </div>
  );
};

export default CustomCalendar;
