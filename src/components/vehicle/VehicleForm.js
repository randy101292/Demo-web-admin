import { CCol, CForm, CFormInput, CRow } from '@coreui/react';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { laravelUrl } from 'src/utils/url';
import useForm from "./hooks/VehicleForm/useForm";
import validateForm from "./hooks/VehicleForm/validateForm";

const VehicleForm = forwardRef((props, ref) => {
  const resourceAPI = laravelUrl("api/vehicle");
  let formRef = useRef();

  useImperativeHandle(ref, () => ({
    handleFormSubmit() {
      formRef.current.dispatchEvent(new Event("submit", { cancelable: true, bubbles:true }))
    },
  }))

  const onSubmit = (success, response) => {
    props.onFormSubmit(success, response);

    if (success) {
      resetForm();
    }
  };

  const {
    handleChange,
    values,
    handleSubmit,
    setApiURL,
    errors,
    isSubmitting,
    resetForm,
  } = useForm(validateForm, "create", onSubmit);

  useEffect(() => {
    setApiURL(resourceAPI);
  }, [])

  return (
    <CForm ref={formRef} onSubmit={handleSubmit} className="row g-3">
      <CRow className='mt-3'>
        <CCol md="12">
          <CFormInput
            type="text"
            id="vin"
            name="vin"
            placeholder="Enter VIN.."
            autoComplete="vin"
            value={values.vin}
            onChange={handleChange}
          />
          {errors.vin && (
              <div className="text-danger">{errors.vin}</div>
          )}
        </CCol>
      </CRow>
    </CForm>
  );
});

VehicleForm.displayName = 'VehicleForm';

export default VehicleForm;