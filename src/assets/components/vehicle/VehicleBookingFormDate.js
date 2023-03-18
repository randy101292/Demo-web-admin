import { CCol, CForm, CFormInput, CRow } from '@coreui/react';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Calendar } from 'react-calendar';
import { laravelUrl } from 'src/utils/url';
import 'react-calendar/dist/Calendar.css';

const VehicleBookingFormDate = forwardRef((props, ref) => {
  const resourceAPI = laravelUrl("api/vehicle");
  let formRef = useRef();
  const [value, onChange] = useState(new Date());

  useImperativeHandle(ref, () => ({
    handleFormSubmit() {
      formRef.current.dispatchEvent(new Event("submit", { cancelable: true, bubbles:true }))
    },
  }))

  const onDateChange = (val) => {
    onChange(val);
    props.onChange(val);
  };

  const onSubmit = (success, response) => {
    props.onFormSubmit(success, response);

    if (success) {
      // resetForm();
    }
  };

  // const {
  //   handleChange,
  //   values,
  //   handleSubmit,
  //   setApiURL,
  //   errors,
  //   isSubmitting,
  //   resetForm,
  // } = useForm(validateForm, "create", onSubmit);

  useEffect(() => {
    // setApiURL(resourceAPI);
    console.log(props);
    if (props.value) {
      onChange(props.value);
    }
  }, [])

  return (
    <Calendar onChange={onDateChange} value={value} />
  );
});

VehicleBookingFormDate.displayName = 'VehicleBookingFormDate';

export default VehicleBookingFormDate;