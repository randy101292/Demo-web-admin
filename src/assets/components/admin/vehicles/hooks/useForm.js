import { useEffect, useState } from "react";
import { setVal } from "src/utils/common";
import request from "src/utils/request";

const useForm = (validate, act, callback) => {
  const defaultState = {
    //user_id: "",
    vin: "",
    make: "",
    model: "",
    year: "",
    engine: "",
    made_in: "",
    style: "",
    type: "",
    owner_id: "",
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
      if (action === "create") {
        request
          .post(ApiURL, values)
          .then((res) => {
            setIsSubmitting(false);
            callback(true, res.vehicle, "create");
          })
          .catch((err) => {
            console.log(err);
            setIsSubmitting(false);
            callback(false, err);
          });
      }

      if (action === "update") {
        request
          .put(ApiURL + `/${values.id}`, values)
          .then((res) => {
            console.log("success_update", res);
            setIsSubmitting(false);
            callback(true, res.vehicle, "update");
          })
          .catch((err) => {
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
            callback(true, res.vehicle, "success_delete");
          })
          .catch((err) => {
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
    setErrors,
    isSubmitting,
    resetForm,
    setAction,
    action,
  };
};

export default useForm;
