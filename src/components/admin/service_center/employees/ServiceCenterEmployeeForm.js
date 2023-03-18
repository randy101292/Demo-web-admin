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
import useForm from "../hooks_employees/useForm";
import validateForm from "../hooks_employees/validateForm";

const ServiceCenterEmployeeForm = forwardRef((props, ref) => {
  const resourceAPI = laravelUrl("api/admin/service-center-employee");
  let formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [employeesList, setEmployeesList] = useState([]);

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

  const fetchEmployees = async (props) => {
    const response = await request.get(`api/admin/allowed-employee`, {
      params: {
        roles: ["branch_staff", "order_monitoring_staff"],
      },
    });
    let arr = [];

    let res = response.users;

    res.map((r, i) => {
      arr.push({
        key: i,
        label: r.first_name + " " + r.last_name,
        value: r.id,
      });
      return arr;
    });

    setEmployeesList(arr);

    return response;
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

    setLoading(false);
    props.onFinishLoading(true);
    axios.all([fetchEmployees()]).then((response) => {
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
          <CCol md="12" className="mb-3">
            <CFormLabel htmlFor="user_id" className="required">
              Employees
            </CFormLabel>
            <Select
              name="user_id"
              value={values.user_id}
              onChange={handleServiceSelect}
              placeholder="Select Employees.."
              isMulti={true}
              options={employeesList}
              isDisabled={action === "delete" ? true : false}
              className={`${errors.user_id ? "error-field-select" : ""}`}
              isClearable={false}
            />
            {errors.user_id && (
              <div className="text-danger">{errors.user_id}</div>
            )}
          </CCol>
        </CRow>
      )}
    </CForm>
  );
});

ServiceCenterEmployeeForm.displayName = "ServiceCenterEmployeeForm";

export default ServiceCenterEmployeeForm;
