import { useEffect, useState } from "react";
import { setVal } from "src/utils/common";
import request from "src/utils/request";

const useForm = (validate, act, callback) => {
  const defaultState = {
    //user_id: "",
    customer_id: "",
    service_id: [],
    vehicle_id: "",
    service_center_id: "",
    notes: "",
    date: null,
    time: "",
    status: "",
    created_by: "",
    updated_by: "",
  };
  const [values, setValues] = useState(defaultState);
  const [errors, setErrors] = useState({});
  const [action, setAction] = useState("create");
  const [ApiURL, setApiURL] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setVal(values, name, value);
    setValues({ ...values });

    // setVal(values, name, value);
    // setValues({ ...values });
  };

  const resetForm = () => {
    setValues(defaultState);
  };

  const setFormValues = (values) => {
    setValues(values);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSubmitting) {
      if (action === "delete") {
        setIsSubmitting(true);
      } else {
        let errs = validate(values, action);
        setErrors(errs);

        if (Object.keys(errs).length === 0) {
          setIsSubmitting(true);
        }
      }
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      let orig_date = values.date;
      let orig_customer_id = values.customer_id;
      let orig_service_center_id = values.service_center_id;
      let orig_service_id = values.service_id;

      values.date = values.date.substring(0, 10) + " " + values.time;
      values.customer_id = values.customer_id.value;
      values.service_center_id = values.service_center_id.value;

      if (values.service_id && values.service_id.length > 0) {
        let arr = values.service_id.map((v) => {
          return v.value;
        });

        values.service_id = arr;
      } else {
        values.service_id = [];
      }

      if (action === "create") {
        request
          .post(ApiURL, values)
          .then((res) => {
            setIsSubmitting(false);
            callback(true, res.booking, "create");
          })
          .catch((err) => {
            values.date = orig_date;
            values.customer_id = orig_customer_id;
            values.service_center_id = orig_service_center_id;
            values.service_id = orig_service_id;
            console.log(err);
            setIsSubmitting(false);
            callback(false, err);
          });
      }

      if (action === "update") {
        request
          .put(ApiURL + `/${values.id}`, values)
          .then((res) => {
            //console.log("success_update", res);
            setIsSubmitting(false);
            callback(true, res.booking, "update");
          })
          .catch((err) => {
            values.date = orig_date;
            values.customer_id = orig_customer_id;
            values.service_center_id = orig_service_center_id;
            values.service_id = orig_service_id;
            console.log(err);
            setIsSubmitting(false);
            callback(false, err);
          });
      }

      if (action === "delete") {
        request
          .delete(ApiURL + `/${values.id}`, values)
          .then((res) => {
            //console.log("success_delete", res);
            setIsSubmitting(false);
            callback(true, res.booking, "success_delete");
          })
          .catch((err) => {
            values.date = orig_date;
            values.customer_id = orig_customer_id;
            console.log(err);
            setIsSubmitting(false);
            callback(false, err);
          });
      }
    }
  });

  return {
    handleChange,
    setValues,
    values,
    handleSubmit,
    setFormValues,
    setApiURL,
    errors,
    isSubmitting,
    resetForm,
    setAction,
    action,
  };
};

export default useForm;
