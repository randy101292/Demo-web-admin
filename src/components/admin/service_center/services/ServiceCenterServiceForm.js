import { CCol, CForm, CFormLabel, CRow, CSpinner } from "@coreui/react";
import axios from "axios";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Select from "react-select";
import { deepClone } from "src/utils/common";
import request from "src/utils/request";
import { laravelUrl } from "src/utils/url";
import useForm from "../hooks_services/useForm";
import validateForm from "../hooks_services/validateForm";

const ServiceCenterServiceForm = forwardRef((props, ref) => {
  const resourceAPI = laravelUrl("api/admin/service-center-services");
  let formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [serviceList, setServiceList] = useState([]);

  useImperativeHandle(ref, () => ({
    handleFormSubmit() {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    },
    populateForm(row) {
      setAction("update");

      //console.log(row);
      let s = {
        key: row.id,
        label: row.name,
        value: row.id,
      };

      let tmpRow = deepClone(row);
      tmpRow.service_id = s;

      setFormValues(tmpRow);
    },
    deleteList(row) {
      setAction("delete");

      let tmpRow = deepClone(row);

      setFormValues(tmpRow);
    },
  }));

  const fetchService = async (props) => {
    const response2 = await request.get(`api/admin/service`, {
      params: {
        // role: "branch_manager",
        display_all: true,
      },
    });
    let arr = [];

    let res = response2.services;

    res.map((r, i) => {
      arr.push({ key: i, label: r.name, value: r.id });
      return arr;
    });

    setServiceList(arr);

    return response2;
    // setLoading(false);
  };

  const handleServiceSelect = (e, v) => {
    handleChange({
      target: {
        name: v.name,
        value: e,
      },
    });
  };

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

    //setLoading(false);
    props.onFinishLoading(true);
    axios.all([fetchService()]).then((response) => {
      setLoading(false);
      props.onFinishLoading(true);
    });
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
            {/* <CFormInput
              type="text"
              id="name"
              name="name"
              placeholder="Enter Service Name.."
              autoComplete="name"
              value={values.name}
              disabled={action === "delete" ? true : false}
              onChange={handleChange}
              className={`${errors.name ? "error-field" : ""}`}
            /> */}
            <Select
              name="service_id"
              value={values.service_id}
              onChange={handleServiceSelect}
              placeholder="Select Service.."
              options={serviceList}
              isDisabled={action === "delete" ? true : false}
              className={`${errors.service_id ? "error-field-select" : ""}`}
              isClearable={false}
            />
            {errors.service_id && (
              <div className="text-danger">{errors.service_id}</div>
            )}
          </CCol>

          {/* <CCol md="12" className="mb-3">
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
          </CCol> */}
        </CRow>
      )}
    </CForm>
  );
});

ServiceCenterServiceForm.displayName = "ServiceCenterServiceForm";

export default ServiceCenterServiceForm;
