export default function validateForm(values, action) {
  let errors = {};

  if (values.service_id === "") {
    errors.service_id = "Service Name is mandatory!";
  }

  // if (values.details === "") {
  //   errors.details = "Details is mandatory!";
  // }

  return errors;
}
