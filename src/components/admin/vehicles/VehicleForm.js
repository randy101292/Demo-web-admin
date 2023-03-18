import { cilSearch } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
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
import { useToasts } from "react-toast-notifications";
import { deepClone } from "src/utils/common";
import request from "src/utils/request";
import { getSegment, laravelUrl } from "src/utils/url";
import useForm from "./hooks/useForm";
import validateForm from "./hooks/validateForm";

const initialValueOfVIN = {
  vin: "5TDJZRFH6KS738459",
  year: "2019",
  make: "Toyota",
  model: "Highlander",
  engine: "3.5-L V-6 DOHC 24V",
  made_in: "United States",
  style: "AWD V-6",
  type: "Sport Utility Vehicle",
};

const VehicleForm = forwardRef((props, ref) => {
  const resourceAPI = laravelUrl("api/admin/vehicle");
  let formRef = useRef();
  const [loading, setLoading] = useState(false);
  //const [bookManually, setBookManually] = useState(false);
  //const [fromVin, setFromVin] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  //const [tableOption, setTableOption] = useState({});
  const { addToast } = useToasts();
  //const [pageCount, setPageCount] = useState(0);

  useImperativeHandle(ref, () => ({
    handleFormSubmit() {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    },
    populateForm(row) {
      setAction("update");

      let tmpRow = deepClone(row);
      console.log("tmpRow", tmpRow);

      setFormValues(tmpRow);
    },
    deleteList(row) {
      setAction("delete");

      let tmpRow = deepClone(row);
      console.log("tmpRow", tmpRow);

      setFormValues(tmpRow);
    },
  }));

  const fetchCustomer = async (props) => {
    setLoading(true);

    const response = await request.get(`api/admin/users`, {
      params: {
        role: "customer",
        display_all: true
      },
    });

    setCustomerList(response.data);
    setLoading(false);
    //setPageCount(response.meta.last_page);
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
    setErrors,
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
    axios
      .all([fetchCustomer()])
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

  // const handleBookManual = () => {
  //   if (bookManually) {
  //     setFromVin(false);
  //     values.make = "";
  //     values.year = "";
  //     values.model = "";
  //   }
  //   setBookManually(!bookManually);
  // };

  const handleGetVIN = (e) => {
    setLoading(true);
    e.preventDefault();

    //console.log("here");
    let vin = values.vin;
    let errors = {};
    let { year, make, model, engine, made_in, style, type } = initialValueOfVIN;

    // request
    //   .post(`api/vin-api-query`, {
    //     vin: values.vin,
    //   })
    //   .then((res) => {
    //     console.log(res);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log("err", err);
    //     return;
    //   });

    if (vin === "" || vin === undefined || vin === null) {
      errors.vin = "VIN is mandatory!";
      values.make = "";
      values.year = "";
      values.model = "";
      values.engine = "";
      values.made_in = "";
      values.style = "";
      values.type = "";
      //setBookManually(false);
      //setFromVin(false);
      setErrors(errors);
      setLoading(false);
      return;
    } else if (vin.toUpperCase() === "5TDJZRFH6KS738459") {
      values.make = make;
      values.year = year;
      values.model = model;
      values.engine = engine;
      values.made_in = made_in;
      values.style = style;
      values.type = type;

      //setBookManually(false);
      //setFromVin(false);
      window.setTimeout(() => {
        //setBookManually(true);
        setLoading(false);
      }, 1000);
    } else {
      setErrors(errors);
      //setFromVin(true);

      values.make = "";
      values.year = "";
      values.model = "";
      values.engine = "";
      values.made_in = "";
      values.style = "";
      values.type = "";

      window.setTimeout(() => {
        //setBookManually(true);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <CForm ref={formRef} onSubmit={handleSubmit} className="row g-3">
      {loading ? (
        <div className="d-flex justify-center align-center wh-300">
          <CSpinner />
        </div>
      ) : (
        <CRow className="mt-3">
          <CFormLabel className="required">VIN</CFormLabel>
          <CCol md="12" className="mb-3">
            <CInputGroup>
              <CFormInput
                type="text"
                id="vin"
                name="vin"
                placeholder="Enter VIN.."
                autoComplete="vin"
                value={values.vin}
                disabled={action === "delete" ? true : false}
                onChange={handleChange}
                className={`${errors.vin ? "error-field" : ""}`}
              />
              {action === "delete" ? (
                ""
              ) : (
                <CButton
                  type="button"
                  color="primary"
                  onClick={(e) => handleGetVIN(e)}
                  variant="outline"
                >
                  Search &nbsp;
                  <CIcon icon={cilSearch} />
                </CButton>
              )}
            </CInputGroup>
            {errors.vin && <div className="text-danger">{errors.vin}</div>}
          </CCol>

          <CCol md="6" sm="12" xs="12" className="mb-3">
            <CFormLabel className="required">Customer</CFormLabel>
            <CFormSelect
              name="owner_id"
              value={values.owner_id}
              onChange={handleChange}
              aria-label="Default select example"
              placeholder="Please Select"
              className={`${errors.owner_id ? "error-field" : ""}`}
            >
              <option value="">Select Customer</option>
              {customerList.map((v, i) => (
                <option key={i} value={v.id}>
                  {v.full_name}
                </option>
              ))}
            </CFormSelect>
            {errors.owner_id && (
              <div className="text-danger">{errors.owner_id}</div>
            )}
          </CCol>

          <CCol md="6" sm="12" xs="12" className="mb-3">
            <CFormLabel className="required">Year</CFormLabel>
            <CFormInput
              type="text"
              id="year"
              name="year"
              placeholder="Enter Year"
              autoComplete="year"
              value={values.year}
              onChange={handleChange}
              disabled={action === "delete" ? true : false}
              className={`${errors.year ? "error-field" : ""}`}
            />
            {errors.year && <div className="text-danger">{errors.year}</div>}
          </CCol>

          <CCol md="6" sm="12" xs="12" className="mb-3">
            <CFormLabel className="required">Make</CFormLabel>
            <CFormInput
              type="text"
              id="make"
              name="make"
              placeholder="Enter Make"
              autoComplete="make"
              value={values.make}
              onChange={handleChange}
              disabled={action === "delete" ? true : false}
              className={`${errors.make ? "error-field" : ""}`}
            />
            {errors.make && <div className="text-danger">{errors.make}</div>}
          </CCol>

          <CCol md="6" sm="12" xs="12" className="mb-3">
            <CFormLabel className="required">Model</CFormLabel>
            <CFormInput
              type="text"
              id="model"
              name="model"
              placeholder="Enter Model"
              autoComplete="model"
              value={values.model}
              onChange={handleChange}
              disabled={action === "delete" ? true : false}
              className={`${errors.model ? "error-field" : ""}`}
            />
            {errors.model && <div className="text-danger">{errors.model}</div>}
          </CCol>

          <CCol md="6" sm="12" xs="12" className="mb-3">
            <CFormLabel className="required">Engine</CFormLabel>
            <CFormInput
              type="text"
              id="engine"
              name="engine"
              placeholder="Enter Engine"
              autoComplete="engine"
              value={values.engine}
              onChange={handleChange}
              disabled={action === "delete" ? true : false}
              className={`${errors.engine ? "error-field" : ""}`}
            />
            {errors.engine && (
              <div className="text-danger">{errors.engine}</div>
            )}
          </CCol>

          <CCol md="6" sm="12" xs="12" className="mb-3">
            <CFormLabel className="">Made In</CFormLabel>
            <CFormInput
              type="text"
              id="made_in"
              name="made_in"
              placeholder="Enter Made In"
              autoComplete="made_in"
              value={values.made_in}
              onChange={handleChange}
              disabled={action === "delete" ? true : false}
              className={`${errors.made_in ? "error-field" : ""}`}
            />
            {errors.made_in && (
              <div className="text-danger">{errors.made_in}</div>
            )}
          </CCol>

          <CCol md="6" sm="12" xs="12" className="mb-3">
            <CFormLabel className="">Style</CFormLabel>
            <CFormInput
              type="text"
              id="style"
              name="style"
              placeholder="Enter Style"
              autoComplete="style"
              value={values.style}
              onChange={handleChange}
              disabled={action === "delete" ? true : false}
              className={`${errors.style ? "error-field" : ""}`}
            />
            {errors.style && <div className="text-danger">{errors.style}</div>}
          </CCol>

          <CCol md="6" sm="12" xs="12" className="mb-3">
            <CFormLabel className="">Type</CFormLabel>
            <CFormInput
              type="text"
              id="type"
              name="type"
              placeholder="Enter Type"
              autoComplete="type"
              value={values.type}
              onChange={handleChange}
              disabled={action === "delete" ? true : false}
              className={`${errors.type ? "error-field" : ""}`}
            />
            {errors.type && <div className="text-danger">{errors.type}</div>}
          </CCol>

          {/* <CCol
            md="12"
            className="mb-3 d-flex justify-content-center text-align-center"
          >
            <CButton
              type="button"
              color="primary"
              variant="outline"
              onClick={() => handleBookManual()}
            >
              {bookManually ? (
                <>
                  Close &nbsp;
                  <CIcon icon={cilArrowCircleTop} />
                </>
              ) : (
                <>
                  Book Manually &nbsp;
                  <CIcon icon={cilArrowCircleBottom} />
                </>
              )}
            </CButton>
          </CCol> */}
        </CRow>
      )}
    </CForm>
  );
});

VehicleForm.displayName = "VehicleForm";

export default VehicleForm;
