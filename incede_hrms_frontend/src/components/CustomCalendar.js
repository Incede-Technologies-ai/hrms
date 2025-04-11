import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaCalendarAlt } from "react-icons/fa"; // Import a calendar icon
import "./CustomCalendar.css";

const CustomCalendar = ({ value, onChange, minDate }) => {
  const [calendarVisible, setCalendarVisible] = useState(false);

  const toggleCalendar = () => {
    setCalendarVisible(!calendarVisible);
  };

  const handleDateChange = (date) => {
    const formattedDate = formatDate(date);
    onChange(formattedDate); // Pass the formatted date directly
    setCalendarVisible(false); // Hide the calendar after selecting a date
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="custom-calendar">
      <div className="input-with-icon">
        <div className="input-container">
          <input
            type="text"
            value={value || ""}
            readOnly
            className="form-control"
            placeholder="Select date"
          />
          <button
            type="button"
            className="calendar-icon-button"
            onClick={toggleCalendar}
          >
            <FaCalendarAlt />
          </button>
        </div>
      </div>
      {calendarVisible && (
        <div className="calendar-modal">
          <div className="calendar-modal-content">
            <button
              type="button"
              className="close-button"
              onClick={toggleCalendar}
            >
            x
            </button>
            <Calendar
              onChange={handleDateChange}
              value={value ? new Date(value) : null}
              minDate={minDate}
              locale="en-US" // Set locale to en-US to start the week on Sunday
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;