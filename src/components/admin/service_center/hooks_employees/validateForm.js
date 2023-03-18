export default function validateForm(values, action) {
  let errors = {};

  if (
    values.user_id === "" ||
    values.user_id === undefined ||
    values.user_id.length === 0
  ) {
    errors.user_id = "Employees is mandatory!";
  }
  return errors;
}
