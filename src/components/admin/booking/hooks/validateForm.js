export default function validateForm(values, action) {
  let errors = {};

  // if (values.user_id === "") {
  //   errors.user_id = "Branch manager is mandatory!";
  // }

  // if (values.branch_code === "") {
  //   errors.branch_code = "Branch code is mandatory!";
  // }
  //console.log("values", values);

  // if (values.customer_id === "") {
  //   errors.customer_id = "Customer Name is mandatory!";
  // }

  // if (values.service_id === "") {
  //   errors.service_id = "Service Name is mandatory!";
  // }

  if (values.vehicle_id === "") {
    errors.vehicle_id = "Vehicle is mandatory!";
  }

  if (values.status === "") {
    errors.status = "Staus is mandatory!";
  }

  if (values.date === "" || values.date === null) {
    errors.date = "Date is mandatory!";
  }

  // if (values.time === "" || values.time === null || values.time === undefined) {
  //   errors.time = "Time is mandatory!";
  // }

  // if (values.service_center_id === "") {
  //   errors.service_center_id = "Service Center is mandatory!";
  // }

  if (
    values.customer_id === "" ||
    values.customer_id === undefined ||
    values.customer_id.length === 0
  ) {
    errors.customer_id = "Customer is mandatory!";
  }

  if (
    values.time === "" ||
    values.time === undefined ||
    values.time.length === 0
  ) {
    errors.time = "Time is mandatory!";
  }

  if (
    values.service_center_id === "" ||
    values.service_center_id === undefined ||
    values.service_center_id.length === 0
  ) {
    errors.service_center_id = "Service Center is mandatory!";
  }

  if (
    values.time === "" ||
    values.time === undefined ||
    values.time.length === 0
  ) {
    errors.time = "Time is mandatory!";
  }

  if (
    values.service_id === "" ||
    values.service_id === undefined ||
    values.service_id.length === 0
  ) {
    errors.service_id = "Service is mandatory!";
  }

  //console.log(values);
  return errors;
}
