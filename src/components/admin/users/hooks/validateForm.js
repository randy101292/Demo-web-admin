export default function validateForm(values, action) {
  let errors = {};

  if (values.first_name === "") {
    errors.first_name = "First name is mandatory!";
  }

  if (values.last_name === "") {
    errors.last_name = "Last name is mandatory!";
  }

  if (values.email === "") {
    errors.email = "Email is mandatory!";
  } else if (
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)
  ) {
    errors.email = "Invalid Email!";
  }

  if (values.mobile_phone === "") {
    errors.mobile_phone = "Contact # is mandatory!";
  }

  if (values.password === "" && action === "create") {
    errors.password = "Password is mandatory!";
  }

  return errors;
}
