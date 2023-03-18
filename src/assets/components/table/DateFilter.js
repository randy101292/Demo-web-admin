import React, { forwardRef, useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

const DateFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // eslint-disable-next-line react/display-name
  const ButtonCalendarInput = forwardRef(({ value, onClick }, ref) => (
    <button
      className="example-custom-input"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e)
      }}
      ref={ref}>
      {value}
    </button>
  ));

  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => {
        setStartDate(date)
        setFilter(moment(date).format("Y-MM-DD"));
      }}
      onChangeRaw={(e) => e.stopPropagation()}
      customInput={<ButtonCalendarInput />}
      renderCustomHeader={({
        date,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div
          style={{
            margin: 10,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              decreaseMonth()
            }}
            disabled={prevMonthButtonDisabled}>
            {"<"}
          </button>
          <div className="react-datepicker__current-month">{moment(date).format("MMMM Y")}</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              increaseMonth()
            }}
            disabled={nextMonthButtonDisabled}>
            {">"}
          </button>
        </div>
      )}
    />
  );
}

export default DateFilter;