import { useEffect, useState } from "react";
import { setVal } from "src/utils/common";
import request from "src/utils/request";

const useForm = (validate, act, callback) => {
  const defaultState = {
    //user_id: "",
    name: "",
    address_line_1: "",
    address_line_2: "",
    // branch_address: {
    //   street: "",
    //   state: "",
    //   city: "",
    // },
    id: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    longitude: "",
    latitude: "",
    tag: "dealership",
    branch_manager_id: "",
    employees: [],
    services: [],
    //timeslots: [],
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

    // if (name === "city" || name === "state") {
    //   setVal(values, name, value.id);
    //   setValues({ ...values });
    // } else {
    //   setVal(values, name, value);
    //   setValues({ ...values });
    // }
    setVal(values, name, value);
    setValues({ ...values });
  };

  const resetForm = () => {
    setValues(defaultState);
  };

  const setFormValues = (values) => {
    setValues(values);
  };

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    // if (form.checkValidity() === false) {
    //   e.preventDefault();
    //   e.stopPropagation();
    // }
    // validated(true);
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
      let orig_services = values.services;
      let orig_employees = values.employees;
      //let orig_timeslots = values.timeslots;
      let orig_branch_manager_id = values.branch_manager_id;
      let orig_state = values.state;
      let orig_city = values.city;

      if (
        action === "create" &&
        values.services &&
        values.services.length > 0
      ) {
        let arr = values.services.map((v) => {
          return v.value;
        });

        values.services = arr;
      } else {
        values.services = [];
      }

      if (
        action === "create" &&
        values.employees &&
        values.employees.length > 0
      ) {
        let arr = values.employees.map((v) => {
          return v.value;
        });

        values.employees = arr;
      } else {
        values.employees = [];
      }

      // if (values.timeslots && values.timeslots.length > 0) {
      //   let arr = values.timeslots.map((v) => {
      //     return v.value;
      //   });

      //   values.timeslots = arr;
      // } else {
      //   values.timeslots = [];
      // }

      values.branch_manager_id = values.branch_manager_id.value;
      values.state = values.state.value;
      values.city = values.city.value;

      if (action === "create") {
        request
          .post(ApiURL, values)
          .then((res) => {
            //let service_center_id = res.service_center.id;

            setIsSubmitting(false);
            callback(true, res.service_center, "create");

            // let val = {
            //   service_center_id,
            //  // timeslots: values.timeslots,
            // };

            // request
            //   .post("api/admin/time-slot", val)
            //   .then((res2) => {
            //     setIsSubmitting(false);
            //     callback(true, res.service_center, "create");
            //   })
            //   .catch((err) => {
            //     values.services = orig_services;
            //     values.employees = orig_employees;
            //     values.timeslots = orig_timeslots;
            //     values.branch_manager_id = orig_branch_manager_id;
            //     values.state = orig_state;
            //     values.city = orig_city;

            //     console.log(err);
            //     setIsSubmitting(false);
            //     callback(false, err);
            //   });
          })
          .catch((err) => {
            values.services = orig_services;
            values.employees = orig_employees;
            //values.timeslots = orig_timeslots;
            values.branch_manager_id = orig_branch_manager_id;
            values.state = orig_state;
            values.city = orig_city;

            console.log(err);
            setIsSubmitting(false);
            callback(false, err);
          });
      }

      if (action === "update") {
        console.log("values=update", values);
        request
          .put(ApiURL + `/${values.id}`, values)
          .then((res) => {
            //console.log("success_update", res);

            setIsSubmitting(false);
            callback(true, res.service_center, "update");

            // let service_center_id = values.id;
            // let val = {
            //   service_center_id,
            //   timeslots: values.timeslots,
            // };
            // console.log("timeslots---------------", values.timeslots);
            // request
            //   .post("api/admin/time-slot", val)
            //   .then((res2) => {
            //     setIsSubmitting(false);
            //     callback(true, res.service_center, "update");
            //   })
            //   .catch((err) => {
            //     values.services = orig_services;
            //     values.employees = orig_employees;
            //     values.timeslots = orig_timeslots;
            //     values.branch_manager_id = orig_branch_manager_id;
            //     values.state = orig_state;
            //     values.city = orig_city;

            //     console.log(err);
            //     setIsSubmitting(false);
            //     callback(false, err);
            //   });
          })
          .catch((err) => {
            console.log(err);
            values.services = orig_services;
            values.employees = orig_employees;
            // values.timeslots = orig_timeslots;
            values.branch_manager_id = orig_branch_manager_id;
            values.state = orig_state;
            values.city = orig_city;

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
            callback(true, res.service_center, "success_delete");
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
