export default function validateForm(values, action) {
  let errors = {};

  // if (values.user_id === "") {
  //   errors.user_id = "Branch manager is mandatory!";
  // }

  // if (values.branch_code === "") {
  //   errors.branch_code = "Branch code is mandatory!";
  // }

  if (values.name === "") {
    errors.name = "Service Name is mandatory!";
  }

  if (values.address_line_1 === "") {
    errors.address_line_1 = "Service Address Line 1 is mandatory!";
  }

  // if (values.address_line_2 === "") {
  //   errors.address_line_2 = "Service Address Line 2 is mandatory!";
  // }

  // if (values.branch_mobile === "") {
  //   errors.branch_mobile = "Branch mobile number is mandatory!";
  // }

  // if (values.address_line_1 === "") {
  //   errors.address_line_1 = "Branch mobile number is mandatory!";
  // }

  // if (values.zip === "") {
  //   errors.zip = "Zip is mandatory!";
  // }

  // if (values.longitude === "") {
  //   errors.longitude = "Longitude is mandatory!";
  // }

  // if (values.latitude === "") {
  //   errors.latitude = "Latitude is mandatory!";
  // }

  if (values.country === "") {
    errors.country = "Country is mandatory!";
  }

  if (values.zip === "") {
    errors.zip = "Zip is mandatory!";
  } else if (!/^[A-Za-z0-9 _]+$/.test(values.zip)) {
    errors.zip = "Invalid Zip!";
  }

  if (
    values.state === "" ||
    values.state === undefined ||
    values.state === null
  ) {
    errors.state = "State is mandatory!";
  }

  if (values.city === "" || values.city === undefined || values.city === null) {
    errors.city = "City is mandatory!";
  }

  if (
    (values.services === "" ||
      values.services === undefined ||
      values.services.length === 0) &&
    action === "create"
  ) {
    errors.services = "Services is mandatory!";
  }

  if (
    values.branch_manager_id === "" ||
    values.branch_manager_id === undefined ||
    values.branch_manager_id === null
  ) {
    errors.branch_manager_id = "Branch Manager is mandatory!";
  }

  // if (
  //   (values.employees === "" ||
  //     values.employees === undefined ||
  //     values.employees.length === 0) &&
  //   action === "create"
  // ) {
  //   errors.employees = "Employees is mandatory!";
  // }

  // if (
  //   values.timeslots === "" ||
  //   values.timeslots === undefined ||
  //   values.timeslots.length === 0
  // ) {
  //   errors.timeslots = "Time Slot is mandatory!";
  // }

  // if (
  //   !values.branch_address?.state?.id ||
  //   values.branch_address?.state?.id === ""
  // ) {
  //   errors.state = "State is mandatory!";
  // }

  // if (
  //   !values.branch_address?.city?.id ||
  //   values.branch_address?.city?.id === ""
  // ) {
  //   errors.city = "City is mandatory!";
  // }

  return errors;
}
