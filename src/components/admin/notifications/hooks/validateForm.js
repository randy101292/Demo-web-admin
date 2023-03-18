export default function validateForm(values, action) {
  let errors = {};

  // if (values.user_id === "") {
  //   errors.user_id = "User ID is mandatory!";
  // }

  if (
    (values.users === "" ||
    values.users === undefined ||
    values.users.length === 0) && action !== "update"
  ) {
    errors.users = "Customer is mandatory!";
  }

  if (values.content === "") {
    errors.content = "Content is mandatory!";
  }

  // if (values.type === "") {
  //   errors.type = "Type is mandatory!";
  // }

  return errors;
}
