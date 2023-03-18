import { CFormCheck } from '@coreui/react';
import React, { forwardRef, useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';

const VehicleBookingFormTime = forwardRef((props, ref) => {
  const [val, onChange] = useState("");
  const availableTime = [
    "08:00 AM - 09:00 AM",
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM",
  ];

  const onRadioChange = (e) => {
    const { value } = e.target;
    onChange(value);
    props.onChange(value);
  };

  useEffect(() => {
    if (props.value) {
      onChange(props.value);
    }
  }, [])

  return (
    <div>
      { availableTime.map((item, index) => {
        return (
          <CFormCheck
            key={index}
            type="radio"
            name="bookingTime"
            id={`bookingTime${index}`}
            value={item}
            label={item}
            checked={val === item}
            onChange={onRadioChange}
          />
        )
      })}
    </div>
  );
});

VehicleBookingFormTime.displayName = 'VehicleBookingFormTime';

export default VehicleBookingFormTime;