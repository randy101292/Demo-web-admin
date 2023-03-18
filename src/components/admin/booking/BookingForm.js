import {
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CSpinner,
} from "@coreui/react";
import axios from "axios";
import moment from "moment";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { useToasts } from "react-toast-notifications";
import { deepClone } from "src/utils/common";
import request from "src/utils/request";
import { getSegment, laravelUrl } from "src/utils/url";
import useForm from "./hooks/useForm";
import validateForm from "./hooks/validateForm";

const BookingForm = forwardRef((props, ref) => {
  const resourceAPI = laravelUrl("api/admin/booking");
  let formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [serviceCenterList, setServiceCenterList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const { addToast } = useToasts();

  useImperativeHandle(ref, () => ({
    handleFormSubmit() {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    },
    populateForm(row) {
      setAction("update");
      setLoading(true);

      //console.log("row", row);
      let s = {
        key: row.user.id,
        label: row.user.first_name + " " + row.user.last_name,
        value: row.user.id,
      };

      let tmpRow = deepClone(row);

      //console.log(Array.isArray(row.service_id));

      let service_id = row.services.map((v, i) => {
        return { key: i, label: v.name, value: v.id };
      });
      fetchServiceCenter(service_id, row.service_center_id);
      tmpRow.service_id = service_id;

      let service_center_id = {
        key: row.service_center_id,
        label: row.service_center.name,
        value: row.service_center_id,
      };
      //fetchService(row.service_center_id);
      fetchVehicle(row.customer_id);

      tmpRow.state = row.state;
      tmpRow.city = row.city;
      tmpRow.tag = row.tag;
      tmpRow.date = moment(row.date).format("YYYY-MM-DD");
      tmpRow.time = moment(row.date).format("HH:mm");
      tmpRow.customer_id = s;
      tmpRow.service_center_id = service_center_id;

      setStartDate(new Date(row.date));
      setFormValues(tmpRow);

      setLoading(false);
    },
    deleteList(row) {
      setAction("delete");

      let tmpRow = deepClone(row);
      tmpRow.state = row.state;
      tmpRow.city = row.city;

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

  const handleCustomerChange = (e) => {
    const { value } = e;

    //console.log(e);

    if (value) {
      fetchVehicle(value);

      handleChange({
        target: {
          name: "customer_id",
          value: e,
        },
      });
    }
  };

  const handleServiceSelect = (e, v) => {
    fetchServiceCenter(e, values.service_center_id.value);
    handleChange({
      target: {
        name: v.name,
        value: e,
      },
    });
  };

  const handleServiceCenter = (e) => {
    const { value, timeSlots } = e;

    if (value) {
      //fetchService(value);
      setTimeSlots(timeSlots);

      handleChange({
        target: {
          name: "service_center_id",
          value: e,
        },
      });

      handleChange({
        target: {
          name: "time",
          value: "",
        },
      });
    }
  };

  const fetchCustomer = async (props) => {
    const response2 = await request.get(`api/admin/users`, {
      params: {
        role: "customer",
        display_all: true,
      },
    });

    //setCustomerList(response2.data);
    let arr = [];
    let res = response2.data;

    //console.log(res);

    res.map((r) => {
      arr.push({
        key: r.id,
        label: r.first_name + " " + r.last_name,
        value: r.id,
      });
      return arr;
    });

    setCustomerList(arr);

    return response2;
  };

  const fetchServiceCenter = async (e, service_center_id) => {
    if (e.length === 0) {
      values.service_center_id = "";
      values.time = "";
      setServiceCenterList([]);
      setTimeSlots([]);
    } else {
      let s = e.map((i) => i.value);
      const response2 = await request.get(`api/customer/service-center`, {
        params: {
          services: s,
        },
      });

      let arr = [];
      let time = [];
      let res = response2.service_centers.data;

      //console.log(service_center_id);

      res.map((r) => {
        arr.push({
          key: r.id,
          label: r.name,
          value: r.id,
          timeSlots: r.timeslots,
        });

        if (service_center_id !== undefined) {
          if (service_center_id === r.id) {
            time = r.timeslots;
          }
        }

        return arr;
      });

      setServiceCenterList(arr);

      if (time.length > 0) {
        setTimeSlots(time);
      } else {
        setTimeSlots([]);
        values.time = "";
      }

      return response2;
    }
  };

  //UPDATE JPG
  // const fetchService = async (service_center_id) => {
  //   const response2 = await request.get(`api/admin/service-center-services`, {
  //     params: {
  //       service_center_id,
  //     },
  //   });

  //   setServiceList(response2.services);
  //   return response2;
  // };

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

  const fetchVehicle = async (owner_id) => {
    const response2 = await request.get(`api/admin/vehicle`, {
      params: {
        owner_id,
      },
    });

    setVehicleList(response2.vehicle.data);
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

    axios
      .all([
        fetchService(),
        fetchCustomer(),
        //fetchServiceCenter(),
        //fetchVehicle(),
      ])
      .then((response) => {
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
    <CForm ref={formRef} onSubmit={handleSubmit} className="row g-3">
      {loading ? (
        <div className="d-flex justify-center align-center wh-300">
          <CSpinner />
        </div>
      ) : (
        <CRow className="mt-3">
          <CCol md="12" sm="12" xs="12" className="mb-3">
            <CFormLabel className="required">Customer</CFormLabel>
            <Select
              name="customer_id"
              value={values.customer_id}
              onChange={handleCustomerChange}
              placeholder="Select Customer"
              options={customerList}
              isDisabled={action === "delete" ? true : false}
              className={`${errors.customer_id ? "error-field-select" : ""}  `}
              isClearable={false}
            />

            {errors.customer_id && (
              <div className="text-danger">{errors.customer_id}</div>
            )}
          </CCol>

          {/* <CCol md="12" sm="12" xs="12" className="mb-3">
            <CFormLabel className="required">Services</CFormLabel>
            <CFormSelect
              name="service_id"
              value={values.service_id}
              onChange={handleChange}
              aria-label="Default select example"
              placeholder="Please Select"
              disabled={
                action === "delete" || action === "update" ? true : false
              }
              className={`${errors.service_id ? "error-field" : ""}`}
            >
              <option value="">Select Service</option>
              {serviceList.map((s, i) => (
                <option key={i} value={s.id}>
                  {s.name}
                </option>
              ))}
            </CFormSelect>
            {errors.service_id && (
              <div className="text-danger">{errors.service_id}</div>
            )}
          </CCol> */}

          <CCol md="12" sm="12" xs="12" className="mb-3">
            <CFormLabel htmlFor="service_id" className="required">
              Services
            </CFormLabel>
            <Select
              name="service_id"
              value={values.service_id}
              onChange={handleServiceSelect}
              placeholder="Select Services.."
              isMulti={true}
              options={serviceList}
              isDisabled={action === "delete" ? true : false}
              className={`${errors.service_id ? "error-field-select" : ""}`}
              isClearable={false}
            />
            {errors.service_id && (
              <div className="text-danger">{errors.service_id}</div>
            )}
          </CCol>

          <CCol md="6" sm="12" xs="12" className="mb-3">
            <CFormLabel className="required">Vehicle</CFormLabel>
            <CFormSelect
              name="vehicle_id"
              value={values.vehicle_id}
              onChange={handleChange}
              aria-label="Default select example"
              placeholder="Please Select"
              disabled={action === "delete" ? true : false}
              className={`${errors.vehicle_id ? "error-field" : ""}`}
            >
              <option value="">Select Vehicle</option>
              {vehicleList.map((v, i) => (
                <option key={i} value={v.id}>
                  {v.make} - {v.model}
                </option>
              ))}
            </CFormSelect>
            {errors.vehicle_id && (
              <div className="text-danger">{errors.vehicle_id}</div>
            )}
          </CCol>

          <CCol md="6" sm="12" xs="12" className="mb-3">
            <CFormLabel className="required">Service Center</CFormLabel>
            <Select
              name="service_center_id"
              value={values.service_center_id}
              onChange={handleServiceCenter}
              placeholder="Select Service Center"
              options={serviceCenterList}
              isDisabled={action === "delete" ? true : false}
              className={`${
                errors.service_center_id ? "error-field-select" : ""
              }   `}
              isClearable={false}
            />

            {errors.service_center_id && (
              <div className="text-danger">{errors.service_center_id}</div>
            )}
          </CCol>

          {/* <CCol md="12" className="mb-3">
            DATE
            <Calendar onChange={handleChange} value={values.date} name="date" />
          </CCol> */}

          <CCol md="4" sm="12" xs="12" className="mb-3">
            <CFormLabel className="required">Booking Date</CFormLabel>
            <DatePicker
              selected={startDate}
              onChange={(date, e) => {
                e.preventDefault();
                if (date !== null) {
                  setStartDate(date);
                  values.date = moment(date).format("YYYY-MM-DD");
                } else {
                  setStartDate("");
                  values.date = "";
                }
              }}
              dateFormat="yyyy-MM-dd"
              id="date"
              name="date"
              placeholderText="Enter Booking Date"
              disabled={action === "delete" ? true : false}
              disabledKeyboardNavigation={true}
              className={`form-control ${errors.date ? "error-field" : ""}`}
            />
            {errors.date && <div className="text-danger">{errors.date}</div>}
          </CCol>

          <CCol md="4" sm="12" xs="12" className="mb-3">
            <CFormLabel className="required">Booking Time</CFormLabel>
            <CFormSelect
              name="time"
              value={values.time}
              onChange={handleChange}
              aria-label="Default select example"
              placeholder="Please Select"
              disabled={action === "delete" ? true : false}
              className={`${errors.time ? "error-field" : ""}`}
            >
              <option value="">Select Booking Time</option>
              {timeSlots.map((s, i) => (
                <option key={i} value={s.time}>
                  {s.time}
                </option>
              ))}
            </CFormSelect>
            {errors.time && <div className="text-danger">{errors.time}</div>}
          </CCol>

          <CCol md="4" sm="12" xs="12" className="mb-3">
            <CFormLabel className="required">Status</CFormLabel>
            <CFormSelect
              name="status"
              value={values.status}
              onChange={handleChange}
              aria-label="Default select example"
              placeholder="Please Select"
              disabled={action === "delete" ? true : false}
              className={`${errors.status ? "error-field" : ""}`}
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In-Progress</option>
              <option value="done">Done</option>
            </CFormSelect>
            {errors.status && (
              <div className="text-danger">{errors.status}</div>
            )}
          </CCol>

          <CCol md="12" sm="12" xs="12" className="mb-3">
            <CFormLabel className="">Notes</CFormLabel>
            <CFormInput
              type="text"
              id="notes"
              name="notes"
              placeholder="Enter Notes"
              disabled={action === "delete" ? true : false}
              autoComplete="notes"
              value={values.notes}
              onChange={handleChange}
              className={`${errors.notes ? "error-field" : ""}`}
            />
            {errors.notes && <div className="text-danger">{errors.notes}</div>}
          </CCol>
        </CRow>
      )}
    </CForm>
  );
});

BookingForm.displayName = "BookingForm";

export default BookingForm;
