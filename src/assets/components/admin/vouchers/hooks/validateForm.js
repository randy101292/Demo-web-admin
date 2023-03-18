export default function validateForm(values, action) {
  let errors = {};

  if (values.voucher_name === "") {
    errors.voucher_name = "Voucher Name is mandatory!";
  }

  if (values.voucher_details === "") {
    errors.voucher_details = "Voucher Details is mandatory!";
  }

  return errors;
}
