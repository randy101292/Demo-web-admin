import {
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
} from "@coreui/react";
import axios from "axios";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { components } from "react-select";
import makeAnimated from "react-select/animated";
import { deepClone } from "src/utils/common";
import request from "src/utils/request";
import { getSegment, laravelUrl } from "src/utils/url";
import useForm from "./hooks/useForm";
import validateForm from "./hooks/validateForm";
import MySelect from "./MySelect";

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

const MultiValue = (props) => (
  <components.MultiValue {...props}>
    <span>{props.data.label}</span>
  </components.MultiValue>
);

const animatedComponents = makeAnimated();

const NotificationsForm = forwardRef((props, ref) => {
  const resourceAPI = laravelUrl("api/admin/notification");
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  let formRef = useRef();

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

  const fetchUser = async (props) => {
    const response2 = await request.get(`api/admin/users`, {
      params: {
        role: "customer",
        display_all: true,
      },
    });

    let arr = [];

    let res = response2.data;

    res.map((r, i) => {
      arr.push({
        key: i,
        label: r.first_name + " " + r.last_name,
        value: r.id,
      });
      return arr;
    });

    setUserList(arr);

    return response2;
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

    axios.all([fetchUser()]).then((response) => {
      setLoading(false);
      props.onFinishLoading(true);
    });
  }, []);

  const handleServiceSelect = (e, v) => {
    handleChange({
      target: {
        name: "users",
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
          { action !== 'update' ? <CCol md="12" sm="12" xs="12" className="mb-3">
            <CFormLabel htmlFor="users" className="required">
              Customer
            </CFormLabel>
            {/* <Select
              name="users"
              value={values.users}
              onChange={handleServiceSelect}
              placeholder="Select Customer.."
              isMulti={true}
              options={userList}
              isDisabled={action === "delete" ? true : false}
              className={`${errors.users ? "error-field-select" : ""}`}
              isClearable={false}
              components={{ Option, MultiValue, animatedComponents }}
              allowSelectA
            /> */}
            <MySelect
              name="users"
              className={`${errors.users ? "error-field-select" : ""}`}
              placeholder="Select Customer.."
              isDisabled={action === "delete" ? true : false}
              options={userList}
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{ Option, MultiValue, animatedComponents }}
              onChange={handleServiceSelect}
              allowSelectAll={true}
              value={values.users}
            />
            {errors.users && <div className="text-danger">{errors.users}</div>}
          </CCol> : null }

          <CCol md="12" sm="12" xs="12" className="mb-3">
            <CFormLabel className="required">Content</CFormLabel>
            <CFormInput
              type="text"
              id="content"
              name="content"
              placeholder="Enter Content.."
              autoComplete="content"
              value={values.content}
              onChange={handleChange}
              disabled={action === "delete" ? true : false}
              className={`${errors.content ? "error-field" : ""}`}
            />
            {errors.content && (
              <div className="text-danger">{errors.content}</div>
            )}
          </CCol>
          <CCol md="12" sm="12" xs="12" className="mb-3">
            <CFormLabel className="">Type</CFormLabel>
            <CFormInput
              type="text"
              id="type"
              name="type"
              placeholder="Enter Type.."
              autoComplete="type"
              value={values.type}
              onChange={handleChange}
              disabled={action === "delete" ? true : false}
              className={`${errors.type ? "error-field" : ""}`}
            />
            {errors.type && <div className="text-danger">{errors.type}</div>}
          </CCol>
        </CRow>
      )}
    </CForm>
  );
});

NotificationsForm.displayName = "NotificationsForm";

export default NotificationsForm;
