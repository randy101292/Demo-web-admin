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

const VouchersForm = forwardRef((props, ref) => {
  const resourceAPI = laravelUrl("api/vouchers");
  let formRef = useRef();
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    handleFormSubmit() {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    },
    populateForm(row) {
      //console.log("setACtion herer");
      setAction("update");

      let tmpRow = deepClone(row);
      console.log("tmpRow", tmpRow);

      //console.log("row", row);
      // tmpRow.branch_address.state = {
      //   id: tmpRow.branch_address.state_id,
      //   name: tmpRow.branch_address.state,
      //   state_code: tmpRow.branch_address.state_code,
      // };

      // tmpRow.branch_address.city = {
      //   id: tmpRow.branch_address.city_id,
      //   name: tmpRow.branch_address.city,
      // };

      setFormValues(tmpRow);
    },
    deleteList(row) {
      setAction("delete");

      let tmpRow = deepClone(row);

      // tmpRow.branch_address.state = {
      //   id: tmpRow.branch_address.state_id,
      //   name: tmpRow.branch_address.state,
      //   state_code: tmpRow.branch_address.state_code,
      // };

      // tmpRow.branch_address.city = {
      //   id: tmpRow.branch_address.city_id,
      //   name: tmpRow.branch_address.city,
      // };

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

    // axios.all([]).then((response) => {
    //   setLoading(false);
    //   props.onFinishLoading(true);
    // });
  }, [resourceAPI, setApiURL, setFormValues, values]);

  return (
    <CForm ref={formRef} onSubmit={handleSubmit} className="row g-3">
      {loading ? (
        <div className="d-flex justify-center align-center wh-300">
          <CSpinner />
        </div>
      ) : (
        <CRow className="mt-3">
          {/* <CCol md="12" className="mb-3">
          <CFormSelect name="user_id" value={values.user_id} onChange={handleChange} aria-label="Default select example">
            <option value="">Select branch manager user</option>
            {userList.map((user, i) => (
              <option key={i} value={user.id}>
                {user.name}
              </option>
            ))}
          </CFormSelect>
          {errors.user_id && (
              <div className="text-danger">{errors.user_id}</div>
          )}
        </CCol> */}

          {/* <CCol md="12" className="mb-3">
            <CFormInput
              type="text"
              id="branch_code"
              name="branch_code"
              placeholder="Enter Branch Code.."
              autoComplete="branch_code"
              value={values.branch_code}
              onChange={handleChange}
              readOnly={action === "update"}
            />
            {errors.branch_code && (
              <div className="text-danger">{errors.branch_code}</div>
            )}
          </CCol> */}

          <CCol md="12" className="mb-3">
            <CFormLabel className="required">Voucher Name</CFormLabel>
            <CFormInput
              type="text"
              id="voucher_name"
              name="voucher_name"
              placeholder="Enter Voucher Name.."
              autoComplete="voucher_name"
              value={values.voucher_name}
              disabled={action === "delete" ? true : false}
              onChange={handleChange}
              className={`${errors.voucher_name ? "error-field" : ""}`}
            />
            {errors.voucher_name && (
              <div className="text-danger">{errors.voucher_name}</div>
            )}
          </CCol>

          <CCol md="12" className="mb-3">
            <CFormLabel className="required">Voucher Details</CFormLabel>
            <CFormInput
              type="text"
              id="voucher_details"
              name="voucher_details"
              placeholder="Enter Voucher Details.."
              autoComplete="voucher_details"
              value={values.voucher_details}
              onChange={handleChange}
              disabled={action === "delete" ? true : false}
              className={`${errors.voucher_details ? "error-field" : ""}`}
            />
            {errors.voucher_details && (
              <div className="text-danger">{errors.voucher_details}</div>
            )}
          </CCol>
        </CRow>
      )}
    </CForm>
  );
});

VouchersForm.displayName = "VouchersForm";

export default VouchersForm;
