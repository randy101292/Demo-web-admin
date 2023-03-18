import {
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
} from "@coreui/react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { deepClone } from "src/utils/common";
import { getSegment, laravelUrl } from "src/utils/url";
import useForm from "./hooks/useForm";
import validateForm from "./hooks/validateForm";

const ServiceForm = forwardRef((props, ref) => {
  const resourceAPI = laravelUrl("api/admin/service");
  let formRef = useRef();
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    handleFormSubmit() {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    },
    populateForm(row) {
      setAction("update");

      let tmpRow = deepClone(row);

      setFormValues(tmpRow);
    },
    deleteList(row) {
      setAction("delete");

      let tmpRow = deepClone(row);

      setFormValues(tmpRow);
    },
  }));

  const onSubmit = (success, response) => {
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
    setFormValues({ ...values, role: getSegment(3) });
    setLoading(true);
    //console.log("init");

    setLoading(false);
    props.onFinishLoading(true);
    // axios.all([fetchStates(), fetchUser()]).then((response) => {
    //   setLoading(false);
    //   props.onFinishLoading(true);
    // });
  }, []);

  return (
    <CForm ref={formRef} onSubmit={handleSubmit} className="row g-3">
      {loading ? (
        <div className="d-flex justify-center align-center wh-300">
          <CSpinner />
        </div>
      ) : (
        <CRow className="mt-3">
          <CFormLabel className="required">Service Name</CFormLabel>
          <CCol md="12" className="mb-3">
            <CFormInput
              type="text"
              id="name"
              name="name"
              placeholder="Enter Service Name.."
              autoComplete="name"
              value={values.name}
              disabled={action === "delete" ? true : false}
              onChange={handleChange}
              className={`${errors.name ? "error-field" : ""}`}
            />
            {errors.name && <div className="text-danger">{errors.name}</div>}
          </CCol>

          <CCol md="12" className="mb-3">
            <CFormLabel className="required">Details</CFormLabel>
            <CFormInput
              type="text"
              id="details"
              name="details"
              placeholder="Enter Details"
              autoComplete="details"
              value={values.details}
              onChange={handleChange}
              disabled={action === "delete" ? true : false}
              className={`${errors.details ? "error-field" : ""}`}
            />
            {errors.details && (
              <div className="text-danger">{errors.details}</div>
            )}
          </CCol>
        </CRow>
      )}
    </CForm>
  );
});

ServiceForm.displayName = "ServiceForm";

export default ServiceForm;
