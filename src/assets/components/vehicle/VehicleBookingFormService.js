import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Calendar } from 'react-calendar';
import { laravelUrl } from 'src/utils/url';
import 'react-calendar/dist/Calendar.css';
import { CFormCheck } from '@coreui/react';
import { check } from 'prettier';

const VehicleBookingFormService = forwardRef((props, ref) => {
  const [val, onChange] = useState([]);
  const services = [
    {
      id: 1,
      job_order_name: "Oil Change"
    },
    {
      id: 2,
      job_order_name: "New Tires"
    },
    {
      id: 3,
      job_order_name: "Tire Rotation"
    },
    {
      id: 4,
      job_order_name: "Auto Detailing"
    },
    {
      id: 5,
      job_order_name: "Window Tinting"
    },
    {
      id: 6,
      job_order_name: "New Car Purchase"
    },
    {
      id: 7,
      job_order_name: "Manufacturer Recall"
    },
  ];

  const onCheckChange = (e) => {
    const { value, checked } = e.target;

    let items = val;
    if (checked) {
      items.push(+value);
    } else {
      let find = items.indexOf(+value);
      items.splice(find, 1);
    }

    props.onChange(items);
    onChange(items);
  };

  const onSubmit = (success, response) => {
    props.onFormSubmit(success, response);

    if (success) {
      // resetForm();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (props.value) {
        onChange(props.value);
      }
    }, 100);
  }, [])

  return (
    <div>
      { services.map((item, index) => {
        return (
          <CFormCheck
            key={Math.random()}
            name="bookingService"
            id={`bookingService${index}`}
            value={item.id}
            label={item.job_order_name}
            defaultChecked={val.includes(item.id)}
            onChange={onCheckChange}
          />
        )
      })}
    </div>
  );
});

VehicleBookingFormService.displayName = 'VehicleBookingFormService';

export default VehicleBookingFormService;