import { CCol, CForm, CFormInput, CFormLabel, CRow } from "@coreui/react";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { getSegment, laravelUrl } from "src/utils/url";
import useForm from "./hooks/useForm";
import validateForm from "./hooks/validateForm";

const UserForm = forwardRef((props, ref) => {
  const resourceAPI = laravelUrl("api/admin/users");
  let formRef = useRef();

  useImperativeHandle(ref, () => ({
    handleFormSubmit() {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    },
    populateForm(row) {
      setAction("update");
      row.password = "";
      setFormValues(row);
    },
  }));

  const onSubmit = (success, response) => {
    //props.onFormSubmit(success, response);
    props.onFormSubmit(success, response, action);
    props.onSubmitting(isSubmitting);
    if (success) {
      resetForm();
    }
  };

  const {
    handleChange,
    values,
    handleSubmit,
    setApiURL,
    setFormValues,
    errors,
    isSubmitting,
    resetForm,
    setAction,
    action,
  } = useForm(validateForm, "create", onSubmit);

  useEffect(() => {
    setApiURL(resourceAPI);
    setFormValues({ ...values, role: getSegment(2) });
  }, []);

  return (
    <CForm ref={formRef} onSubmit={handleSubmit} className="row g-3">
      <CRow className="mt-3">
        <CCol md="4" sm="12" xs="12" className="mb-3">
          <CFormLabel className="required">First Name</CFormLabel>
          <CFormInput
            type="text"
            id="first_name"
            name="first_name"
            placeholder="Enter First Name.."
            autoComplete="first_name"
            value={values.first_name}
            onChange={handleChange}
            className={`${errors.first_name ? "error-field" : ""}`}
          />
          {errors.first_name && (
            <div className="text-danger">{errors.first_name}</div>
          )}
        </CCol>
        <CCol md="4" sm="12" xs="12" className="mb-3">
          <CFormLabel className="">Middle Name</CFormLabel>
          <CFormInput
            type="text"
            id="middle_name"
            name="middle_name"
            placeholder="Enter Middle Name.."
            autoComplete="middle_name"
            value={values.middle_name}
            onChange={handleChange}
            className={`${errors.middle_name ? "error-field" : ""}`}
          />
          {errors.middle_name && (
            <div className="text-danger">{errors.middle_name}</div>
          )}
        </CCol>
        <CCol md="4" sm="12" xs="12" className="mb-3">
          <CFormLabel className="required">Last Name</CFormLabel>
          <CFormInput
            type="text"
            id="last_name"
            name="last_name"
            placeholder="Enter Last Name.."
            autoComplete="last_name"
            value={values.last_name}
            onChange={handleChange}
            className={`${errors.last_name ? "error-field" : ""}`}
          />
          {errors.last_name && (
            <div className="text-danger">{errors.last_name}</div>
          )}
        </CCol>
        <CCol md="12" sm="12" xs="12" className="mb-3">
          <CFormLabel className="required">Contact Number</CFormLabel>
          <CFormInput
            type="text"
            id="mobile_phone"
            name="mobile_phone"
            placeholder="Enter Contact Number.."
            autoComplete="mobile_phone"
            value={values.mobile_phone}
            onChange={handleChange}
            className={`${errors.mobile_phone ? "error-field" : ""}`}
          />
          {errors.mobile_phone && (
            <div className="text-danger">{errors.mobile_phone}</div>
          )}
        </CCol>
        <CCol
          md={`${action === "update" ? "12" : "6"}`}
          sm="12"
          xs="12"
          className="mb-3"
        >
          <CFormLabel className="required">Email</CFormLabel>
          <CFormInput
            type="text"
            id="email"
            name="email"
            placeholder="Enter Email.."
            autoComplete="off"
            readOnly={action === "update"}
            value={values.email}
            onChange={handleChange}
            className={`${errors.email ? "error-field" : ""}`}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </CCol>

        {action !== "update" ? (
          <CCol md="6" sm="12" xs="12" className="mb-3">
            <CFormLabel className="required">Password</CFormLabel>
            <CFormInput
              type="password"
              id="password"
              name="password"
              placeholder="Enter password.."
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange}
              className={`${errors.password ? "error-field" : ""}`}
            />
            {errors.password && (
              <div className="text-danger">{errors.password}</div>
            )}
          </CCol>
        ) : (
          ""
        )}
      </CRow>
    </CForm>
  );
});

UserForm.displayName = "UserForm";

export default UserForm;
