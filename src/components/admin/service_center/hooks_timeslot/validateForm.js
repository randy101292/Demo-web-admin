export default function validateForm(values, action) {
  let errors = {};

  if (values.time === "") {
    errors.time = "Time Slot is mandatory!";
  }

  if (values.max_limit === "") {
    errors.max_limit = "Max Limit is mandatory!";
  } else if (!/^[0-9]+$/.test(values.max_limit)) {
    errors.max_limit = "Max Limit is invalid!";
  } else if (values.max_limit !== "" && parseInt(values.max_limit) <= 0) {
    errors.max_limit = "Max Limit must be greater than 0!";
  }

  return errors;
}
