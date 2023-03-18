
import { useEffect, useState } from "react";
import request from "src/utils/request";

const useForm = (validate, action, callback) => {
  const defaultState = {
    id: "",
    vin: "",
    year: "",
    make: "",
    model: "",
    engine: "",
    made_in: "",
    style: "",
    type: "",
    created_by: "",
    updated_by: "",
  };
  const [values, setValues] = useState(defaultState);
  const [errors, setErrors] = useState({});
  const [vehicleAPI, setApiURL] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
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
      let errs = validate(values, action);
      setErrors(errs);

      if (Object.keys(errs).length === 0) {
        setIsSubmitting(true);
      }
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      if (action === "create") {
        request
          .post(vehicleAPI, values)
          .then(res => {
            setIsSubmitting(false);
            callback(true, res.data, "create");
          })
          .catch((err) => {
            console.log(err);
            setIsSubmitting(false);
            callback(false, {});
          });
      }

      if (action === "update") {
        request
          .put(vehicleAPI, values)
          .then((res) => {
            console.log(res)
            setIsSubmitting(false);
            callback(true, res.data, "update");
          })
          .catch((err) => {
            console.log(err);
            setIsSubmitting(false);
            callback(false, {});
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
  };
};

export default useForm;
