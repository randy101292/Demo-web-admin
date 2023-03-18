export default function validateForm(values, action) {
  let errors = {};

  if (values.name === "") {
    errors.name = "Service Name is mandatory!";
  }

  if (values.details === "") {
    errors.details = "Details is mandatory!";
  }

  return errors;
}
