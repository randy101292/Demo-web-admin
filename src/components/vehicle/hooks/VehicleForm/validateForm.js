export default function validateForm(values, action) {
  let errors = {};

  if (!values.vin) {
    errors.vin = "VIN is mandatory!";
  }

  return errors;
}
