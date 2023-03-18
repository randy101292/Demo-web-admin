export default function validateForm(values, action) {
  let errors = {};

  if (values.vin === "") {
    errors.vin = "VIN is mandatory!";
  }

  if (values.make === "") {
    errors.make = "Make is mandatory!";
  }

  if (values.year === "") {
    errors.year = "Year is mandatory!";
  }

  if (values.model === "") {
    errors.model = "Model is mandatory!";
  }

  if (values.owner_id === "") {
    errors.owner_id = "Customer is mandatory!";
  }

  // if (values.made_in === "") {
  //   errors.made_in = "Made In is mandatory!";
  // }

  // if (values.style === "") {
  //   errors.style = "Style is mandatory!";
  // }

  if (values.engine === "") {
    errors.engine = "Engine is mandatory!";
  }

  // if (values.type === "") {
  //   errors.type = "Type is mandatory!";
  // }

  //console.log(values);

  return errors;
}
