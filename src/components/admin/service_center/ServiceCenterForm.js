import {
  CCol,
  CForm,
  CFormCheck,
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
import { useSelector } from "react-redux";
import Select from "react-select";
import { useToasts } from "react-toast-notifications";
import { BOOKING_TIME, deepClone } from "src/utils/common";
import request from "src/utils/request";
import { getSegment, laravelUrl } from "src/utils/url";
import useForm from "./hooks/useForm";
import validateForm from "./hooks/validateForm";

const ServiceCenterForm = forwardRef((props, ref) => {
  const resourceAPI = laravelUrl("api/admin/service-center");
  let formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const { addToast } = useToasts();
  const roles = useSelector((state) => state.auth.roles[0]);
  const auth = useSelector((state) => state.auth);
  const availableTag = ["dealership", "non-dealership"];
  const [sci, setSci] = useState("");
  const [timeSlot, setTimeSlot] = useState([]);

  useImperativeHandle(ref, () => ({
    handleFormSubmit() {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    },
    populateForm(row) {
      setAction("update");
      //console.log(row);

      let s = row.services.map((v, i) => {
        return { key: i, label: v.name, value: v.id };
      });

      let time = row.timeslots.map((v, i) => {
        return { key: i, label: v.time, value: v.time };
      });

      //console.log("time", time);

      let b = {
        key: row.branch_manager.id,
        label:
          row.branch_manager.first_name + " " + row.branch_manager.last_name,
        value: row.branch_manager.id,
      };

      let state = {
        key: row.state.id,
        label: row.state.name,
        value: row.state.id,
      };

      let city = {
        key: row.city.id,
        label: row.city.name,
        value: row.city.id,
      };

      let states = deepClone(stateList[parseInt(row.state.id) - 1]);
      let arr = [];
      states.cities.map((r, i) => {
        arr.push({
          key: i,
          label: r.name,
          value: r.id,
        });
        return arr;
      });

      setCityList(arr);

      // let state = stateList[idx];
      // setCityList(state.cities);

      //{label: 'Service 1', value: 3}

      let tmpRow = deepClone(row);
      tmpRow.state = state;
      tmpRow.city = city;
      tmpRow.tag = row.tag;
      tmpRow.services = s;
      tmpRow.timeslots = time;
      tmpRow.branch_manager_id = b;
      tmpRow.id = row.id;
      setSci(row.id);
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
      let idx = stateList.findIndex(
        (value) => value.id === parseInt(row.state.id)
      );
      let state = stateList[idx];
      setCityList(state.cities);

      let s = row.services.map((v, i) => {
        return { key: i, label: v.name, value: v.id };
      });

      let tmpRow = deepClone(row);
      tmpRow.state = row.state.id;
      tmpRow.city = row.city.id;
      tmpRow.tag = row.tag;
      tmpRow.services = s;

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

  // const handleStateChange = (e) => {
  //   const { value, selectedIndex } = e.target;

  //   if (value) {
  //     // get item
  //     let state = deepClone(stateList[selectedIndex - 1]);
  //     setCityList(selectedIndex === 0 ? [] : state.cities);

  //     delete state.cities;
  //     handleChange({
  //       target: {
  //         name: "state",
  //         value: selectedIndex === 0 ? {} : state,
  //       },
  //     });

  //     handleChange({
  //       target: {
  //         name: "city",
  //         value: { id: "" },
  //       },
  //     });
  //   }
  // };

  // const handleCityChange = (e) => {
  //   const { value, selectedIndex } = e.target;

  //   if (value) {
  //     // get item
  //     let city = cityList[selectedIndex - 1];

  //     handleChange({
  //       target: {
  //         name: "city",
  //         value: selectedIndex === 0 ? {} : city,
  //       },
  //     });
  //   }
  // };

  const handleServiceSelect = (e, v) => {
    if (v.name && v.name === "state") {
      let state = deepClone(stateList[parseInt(e.value) - 1]);
      let arr = [];
      state.cities.map((r, i) => {
        arr.push({
          key: i,
          label: r.name,
          value: r.id,
        });
        return arr;
      });

      handleChange({
        target: {
          name: "city",
          value: "",
        },
      });

      setCityList(arr);
    }

    handleChange({
      target: {
        name: v.name,
        value: e,
      },
    });
  };

  const fetchUser = async (props) => {
    const response2 = await request.get(`api/admin/users`, {
      params: {
        role: "branch_manager",
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
    // setLoading(false);
  };

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

  const fetchStates = async (props) => {
    const response = await request.get(`api/admin/state`, {
      params: {
        type: "all",
      },
    });

    let arr = [];

    let res = response.data;

    res.map((r, i) => {
      arr.push({
        key: i,
        label: r.name,
        value: r.id,
        cities: r.cities,
      });
      return arr;
    });

    setStateList(arr);
    //setStateList(res);

    return response;
  };

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
    setSci(values.id);

    let arr = [];

    BOOKING_TIME.map((r, i) => {
      arr.push({
        key: i,
        label: r,
        value: r,
      });
    });
    setTimeSlot(arr);
    //console.log("init");

    axios
      .all([fetchStates(), fetchService(), fetchUser(), fetchEmployees()])
      .then((response) => {
        //FOR BRANCH MANAGER ONLY
        if (roles === "branch_manager") {
          let obj = { key: auth.id, label: auth.name, value: auth.id };
          handleChange({
            target: {
              name: "branch_manager_id",
              value: obj,
            },
          });
        }
        setLoading(false);
        props.onFinishLoading(true);
      })
      .catch((error) => {
        console.log("error catch", error);

        let err = error.response.data
          ? error.response.data.error.toString()
          : "Transaction could not proceed!";

        addToast(err, {
          autoDismiss: true,
          appearance: "error",
        });
        props.modal(false);
        setLoading(false);
      });
  }, []);

  return (
    <CForm ref={formRef} onSubmit={handleSubmit} className="row g-3" noValidate>
      {loading ? (
        <div className="d-flex justify-center align-center wh-300">
          <CSpinner />
        </div>
      ) : (
        <CRow className="mt-3">
          <CFormLabel className="required">TAG</CFormLabel>
          <CCol md="12" xs="12" s="12" className="mb-3">
            {availableTag.map((item, index) => {
              return (
                <CFormCheck
                  key={index}
                  inline
                  type="radio"
                  name="tag"
                  id={`tag${index}`}
                  value={item}
                  label={item.toUpperCase()}
                  checked={item.toLowerCase() === values.tag.toLowerCase()}
                  onChange={handleChange}
                  disabled={action === "delete" ? true : false}
                />
              );
            })}
          </CCol>
          <CCol md="6" xs="12" s="12" className="mb-3">
            <CFormLabel htmlFor="name" className="required">
              Service Center Name
            </CFormLabel>
            <CFormInput
              type="text"
              id="name"
              name="name"
              placeholder="Enter Service Center Name.."
              autoComplete="name"
              value={values.name}
              disabled={action === "delete" ? true : false}
              onChange={handleChange}
              className={`${errors.name ? "error-field" : ""}`}
              // invalid={errors.name ? true : false}
              // valid={!errors.name && values.name !== "" ? true : false}
              // required
            />
            {errors.name && <div className="text-danger">{errors.name}</div>}
          </CCol>

          <CCol md="6" sm="12" xs="12" className="mb-3">
            <CFormLabel htmlFor="country" className="required">
              Country
            </CFormLabel>
            <CFormInput
              type="text"
              id="country"
              name="country"
              placeholder="Enter Country.."
              autoComplete="country"
              value={values.country}
              onChange={handleChange}
              disabled={action === "delete" ? true : false}
              className={`${errors.country ? "error-field" : ""}`}
            />

            {errors.country && (
              <div className="text-danger">{errors.country}</div>
            )}
          </CCol>

          <CCol md="4" sm="12" xs="12" className="mb-3">
            <CFormLabel htmlFor="address_line_1" className="required">
              Address Line 1
            </CFormLabel>
            <CFormInput
              type="text"
              id="address_line_1"
              name="address_line_1"
              placeholder="Enter Address Line 1.."
              autoComplete="address_line_1"
              value={values.address_line_1}
              onChange={handleChange}
              disabled={action === "delete" ? true : false}
              className={`${errors.address_line_1 ? "error-field" : ""}`}
            />
            {errors.address_line_1 && (
              <div className="text-danger">{errors.address_line_1}</div>
            )}
          </CCol>

          <CCol md="4" sm="12" xs="12" className="mb-3">
            <CFormLabel htmlFor="address_line_2" className="">
              Address Line 2
            </CFormLabel>
            <CFormInput
              type="text"
              id="address_line_2"
              name="address_line_2"
              placeholder="Enter Address Line 2.."
              autoComplete="address_line_2"
              value={values.address_line_2}
              onChange={handleChange}
              disabled={action === "delete" ? true : false}
              className={`${errors.address_line_2 ? "error-field" : ""}`}
            />
            {errors.address_line_2 && (
              <div className="text-danger">{errors.address_line_2}</div>
            )}
          </CCol>

          <CCol md="4" sm="12" xs="12" className="mb-3">
            <CFormLabel htmlFor="zip" className="required">
            Site Geo Location
            </CFormLabel>
            <CFormInput
              type="text"
              id="zip"
              name="zip"
              placeholder="( Ex : 123456789 , 987654321 )"
              disabled={action === "delete" ? true : false}
              className={`${errors.zip ? "error-field" : ""}`}
              autoComplete="zip"
              value={values.zip}
              onChange={handleChange}
            />
            {errors.zip && <div className="text-danger">{errors.zip}</div>}
          </CCol>

          <CCol md="6" xs="12" s="12" className="mb-3">
            <CFormLabel htmlFor="state" className="required">
              State Select
            </CFormLabel>
            <Select
              name="state"
              value={values.state}
              onChange={handleServiceSelect}
              placeholder="Select State.."
              options={stateList}
              isDisabled={action === "delete" ? true : false}
              className={`${errors.state ? "error-field-select" : ""}`}
              isClearable={false}
            />
            {errors.state && <div className="text-danger">{errors.state}</div>}
          </CCol>

          <CCol md="6" xs="12" s="12" className="mb-3">
            <CFormLabel htmlFor="city" className="required">
              City Select
            </CFormLabel>
            <Select
              name="city"
              value={values.city}
              onChange={handleServiceSelect}
              placeholder="Select City.."
              options={cityList}
              isDisabled={action === "delete" ? true : false}
              className={`${errors.city ? "error-field-select" : ""}`}
              isClearable={false}
            />
            {errors.city && <div className="text-danger">{errors.city}</div>}
          </CCol>

          {/* <CCol md="6" sm="12" xs="12" className="mb-3">
            <CFormLabel htmlFor="longitude" className="">
              Longitude
            </CFormLabel>
            <CFormInput
              type="text"
              id="longitude"
              name="longitude"
              placeholder="Enter Longitude.."
              autoComplete="longitude"
              value={values.longitude}
              disabled={action === "delete" ? true : false}
              onChange={handleChange}
            />
            {errors.longitude && (
              <div className="text-danger">{errors.longitude}</div>
            )}
          </CCol>

          <CCol md="6" sm="12" xs="12" className="mb-3">
            <CFormLabel htmlFor="latitude" className="">
              Latitude
            </CFormLabel>
            <CFormInput
              type="text"
              id="latitude"
              name="latitude"
              placeholder="Enter Latitude.."
              disabled={action === "delete" ? true : false}
              autoComplete="latitude"
              value={values.latitude}
              onChange={handleChange}
            />
            {errors.latitude && (
              <div className="text-danger">{errors.latitude}</div>
            )}
          </CCol> */}

          <CCol md="12" sm="12" xs="12" className="mb-3">
            <CFormLabel htmlFor="branch_manager_id" className="required">
              Corporate Manager
            </CFormLabel>
            <Select
              name="branch_manager_id"
              value={values.branch_manager_id}
              onChange={handleServiceSelect}
              placeholder="Select Corporate Manager.."
              options={userList}
              isDisabled={
                roles !== "super_admin" && roles !== "admin_staff"
                  ? true
                  : false
              }
              className={`${
                errors.branch_manager_id ? "error-field-select" : ""
              }
              ${
                roles !== "super_admin" && roles !== "admin_staff"
                  ? "disabled-select"
                  : ""
              }
              `}
              isClearable={false}
            />
            {errors.branch_manager_id && (
              <div className="text-danger">{errors.branch_manager_id}</div>
            )}
          </CCol>

          {/* <CCol md="6" sm="12" xs="12" className="mb-3">
            <CFormLabel htmlFor="timeslots" className="required">
              Time Slots
            </CFormLabel>
            <Select
              name="timeslots"
              value={values.timeslots}
              onChange={handleServiceSelect}
              placeholder="Select Time Slot.."
              isMulti={true}
              options={timeSlot}
              isDisabled={action === "delete" ? true : false}
              className={`${errors.timeslots ? "error-field-select" : ""}`}
              isClearable={false}
            />
            {errors.timeslots && (
              <div className="text-danger">{errors.timeslots}</div>
            )}
          </CCol> */}

          {action !== "update" ? (
            <>
              <CCol md="6" sm="12" xs="12" className="mb-3">
                <CFormLabel htmlFor="services" className="required">
                  Services
                </CFormLabel>
                <Select
                  name="services"
                  value={values.services}
                  onChange={handleServiceSelect}
                  placeholder="Select Services.."
                  isMulti={true}
                  options={serviceList}
                  isDisabled={action === "delete" ? true : false}
                  className={`${errors.services ? "error-field-select" : ""}`}
                  isClearable={false}
                />
                {errors.services && (
                  <div className="text-danger">{errors.services}</div>
                )}
              </CCol>

              <CCol md="6" sm="12" xs="12" className="mb-3">
                <CFormLabel htmlFor="employees" className="">
                  Employees
                </CFormLabel>
                <Select
                  name="employees"
                  value={values.employees}
                  onChange={handleServiceSelect}
                  placeholder="Select Employees.."
                  isMulti={true}
                  options={employeesList}
                  isDisabled={action === "delete" ? true : false}
                  className={`${errors.employees ? "error-field-select" : ""}`}
                  isClearable={false}
                />
                {errors.employees && (
                  <div className="text-danger">{errors.employees}</div>
                )}
              </CCol>
            </>
          ) : (
            ""
          )}
        </CRow>
      )}
    </CForm>
  );
});

ServiceCenterForm.displayName = "ServiceCenterForm";

export default ServiceCenterForm;
