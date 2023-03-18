import { useEffect, useState } from "react";
//import { fbase } from "src/config/firebaseConfig";
import request from "src/utils/request";

const useForm = (validate, act, callback) => {
  const defaultState = {
    users: [],
    content: "",
    type: "",
    created_by: "",
    updated_by: "",
  };
  const [values, setValues] = useState(defaultState);
  const [errors, setErrors] = useState({});
  const [action, setAction] = useState(act);
  //const [vehicleAPI, setApiURL] = useState("");
  const [ApiURL, setApiURL] = useState("");
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
      let orig_users = values.users;

      if (values.users && values.users.length > 0) {
        let arr = values.users.map((v) => {
          return v.value;
        });

        values.users = arr;
      } else {
        values.users = [];
      }

      if (action === "create") {
        request
          .post(ApiURL, values)
          .then((res) => {
            setIsSubmitting(false);
            callback(true, res.notifications, "create");
          })
          .catch((err) => {
            console.log(err);
            values.user_id = orig_users;
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
            callback(true, res, "update");
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
            callback(true, res.notifications, "success_delete");
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
    isSubmitting,
    resetForm,
    setAction,
    action,
  };
};

export default useForm;
