import { useEffect, useState } from "react";
//import { fbase } from "src/config/firebaseConfig";
import request from "src/utils/request";
import { getSegment } from "src/utils/url";

const useForm = (validate, act, callback) => {
  const defaultState = {
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    password: "",
    mobile_phone: "",
    avatar: "",
    status: "",
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
      if (action === "create") {
        request
          .post(ApiURL, { ...values, role: getSegment(2) })
          .then((res) => {
            setIsSubmitting(false);
            callback(true, res.data, "create");
          })
          .catch((err) => {
            console.log(err);
            setIsSubmitting(false);
            callback(false, err);
          });
        // fbase
        //   .auth()
        //   .createUserWithEmailAndPassword(values.email, values.password)
        //   .then((result) => {
        //     const user = result.user.providerData[0];
        //     user.isNewUser = result.additionalUserInfo.isNewUser;
        //     user.fbuid = result.user.uid;

        //     request
        //       .post(vehicleAPI, { ...values, ...user })
        //       .then((res) => {
        //         setIsSubmitting(false);
        //         callback(true, res.data, "create");
        //       })
        //       .catch((err) => {
        //         console.log(err);
        //         setIsSubmitting(false);
        //         callback(false, {});
        //       });
        //   });
      }
      if (action === "update") {
        request
          .put(ApiURL + `/${values.id}`, values)
          .then((res) => {
            //console.log("success_update", res);
            setIsSubmitting(false);
            callback(true, res.data, "update");
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
            callback(true, res.data, "success_delete");
          })
          .catch((err) => {
            console.log(err);
            setIsSubmitting(false);
            callback(false, err);
          });
      }

      // if (action === "update") {
      // var updateUser = fbase
      //   .app()
      //   .functions("asia-southeast1")
      //   .httpsCallable("updateUser");
      // updateUser(values).then((result) => {
      //   request
      //     .put(vehicleAPI + `/${values.id}`, values)
      //     .then((res) => {
      //       setIsSubmitting(false);
      //       //callback(true, res.data, "update");
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //       setIsSubmitting(false);
      //       callback(false, {});
      //     });
      // });
      // }
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
