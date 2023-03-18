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
import Select from "react-select";
import { BOOKING_TIME, deepClone } from "src/utils/common";
import { laravelUrl } from "src/utils/url";
import useForm from "../hooks_timeslot/useForm";
import validateForm from "../hooks_timeslot/validateForm";
const ServiceCenterTimeSlotForm = forwardRef((props, ref) => {
  const resourceAPI = laravelUrl("api/admin/service-center-services");
  let formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [timeSlot, setTimeSlot] = useState([]);

  useImperativeHandle(ref, () => ({
    handleFormSubmit() {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    },
    populateForm(row) {
      setAction("update");
      console.log(row);
      let s = {
        key: row.time,
        label: row.time,
        value: row.time,
      };

      let tmpRow = deepClone(row);
      tmpRow.time = s;

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
    setFormValues({ ...values });
    setLoading(true);
    //console.log("init");

    let arr = [];
    BOOKING_TIME.map((r, i) => {
      arr.push({
        key: i,
        label: r,
        value: r,
      });
    });
    setTimeSlot(arr);

    setLoading(false);
    props.onFinishLoading(true);
    // axios.all([fetchStates(), fetchUser()]).then((response) => {
    //   setLoading(false);
    //   props.onFinishLoading(true);
    // });
  }, []);

  const handleServiceSelect = (e, v) => {
    handleChange({
      target: {
        name: v.name,
        value: e,
      },
    });
  };

  return (
    <CForm ref={formRef} onSubmit={handleSubmit} className="row g-3">
      {loading ? (
        <div className="d-flex justify-center align-center wh-300">
          <CSpinner />
        </div>
      ) : (
        <CRow className="mt-3">
          <CCol md="12" sm="12" xs="12" className="mb-3">
            <CFormLabel htmlFor="time" className="required">
              Time Slots
            </CFormLabel>
            <Select
              name="time"
              value={values.time}
              onChange={handleServiceSelect}
              placeholder="Select Time Slot.."
              options={timeSlot}
              isDisabled={action === "update" ? true : false}
              className={`${errors.time ? "error-field-select" : ""}`}
              isClearable={false}
            />
            {errors.time && <div className="text-danger">{errors.time}</div>}
          </CCol>

          <CCol md="12" sm="12" xs="12" className="mb-3">
            <CFormLabel htmlFor="max_limit" className="required">
              Max Limit
            </CFormLabel>
            <CFormInput
              type="text"
              id="max_limit"
              name="max_limit"
              placeholder="Enter Service Center Max Limit.."
              autoComplete="max_limit"
              value={values.max_limit}
              disabled={action === "delete" ? true : false}
              onChange={handleChange}
              className={`${errors.max_limit ? "error-field" : ""}`}
              // invalid={errors.name ? true : false}
              // valid={!errors.name && values.name !== "" ? true : false}
              // required
            />
            {errors.max_limit && (
              <div className="text-danger">{errors.max_limit}</div>
            )}
          </CCol>
        </CRow>
      )}
    </CForm>
  );
});

ServiceCenterTimeSlotForm.displayName = "ServiceCenterTimeSlotForm";

export default ServiceCenterTimeSlotForm;
