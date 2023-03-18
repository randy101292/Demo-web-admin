import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { setVal } from "src/utils/common";
import request from "src/utils/request";

const useForm = (validate, act, callback) => {
  const params = useParams();
  const defaultState = {
    //user_id: "",
    service_center_id: params.service_center_id,
    service_id: "",
    details: "",
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
      let orig_service_id = values.service_id;
      values.service_id = values.service_id.value;

      if (action === "create") {
        request
          .post(
            `api/admin/service-center/${values.service_center_id}/services`,
            values
          )
          .then((res) => {
            setIsSubmitting(false);
            callback(true, res.service, "create");
          })
          .catch((err) => {
            console.log(err);
            values.service_id = orig_service_id;
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
            callback(true, res.service, "update");
          })
          .catch((err) => {
            console.log(err);
            values.service_id = orig_service_id;
            setIsSubmitting(false);
            callback(false, err);
          });
      }

      if (action === "delete") {
        request
          .delete(
            `api/admin/service-center/${values.service_center_id}/services/${values.id}`,
            values
          )
          .then((res) => {
            //console.log("success_delete", res);
            setIsSubmitting(false);
            callback(true, res.service, "success_delete");
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
