const loginValidation = (userData, setFormError) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { email, password } = userData;
  const error = {};

  if (!email.trim()) error.email = "Please enter an email. ";
  else if (!emailPattern.test(email))
    error.email = "Please enter a valid email address.";
  if (!password.trim()) error.password = "Please enter a password.";
  else if (password.length < 6)
    error.password = "Password must be at least 6 characters long.";

  setFormError(error);
  return Object.keys(error).length === 0;
};

const regValidate = (formData, setErrors) => {
  const { name, email, newpassword, reenterpassword } = formData;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errors = {};

  if (!name) errors.name = "Enter name";
  if (!email) errors.email = "Please enter an email. ";
  else if (!emailPattern.test(email))
    errors.email = "Please enter a valid email address.";
  if (!newpassword) errors.newpassword = "Enter password";
  else if (newpassword.length < 6)
    errors.newpassword = "Password must be at least 6 characters";
  if (!newpassword) errors.newpassword = "Enter password";
  if (reenterpassword !== newpassword)
    errors.reenterpassword = "Password not matched";
  setErrors(errors);
  return Object.keys(errors).length === 0;
};

const EditProfileValidation = (formData, setErrors) => {
  const { address, phoneNo, latitude, longitude } = formData;
  const errors = {};

  // console.log(latitude, longitude);

  if (!(address ?? "").trim()) errors.address = "Enter address";
  if (!(phoneNo ?? "").trim()) errors.phoneNo = "Enter phone number";
  else if (!/^[0-9]{10}$/.test(phoneNo))
    errors.phoneNo = "Enter a valid 10-digit phone number";
  if (!latitude) errors.latitude = "Latitude is required";
  if (!longitude) errors.longitude = "Longitude is required";

  setErrors(errors);
  console.log(Object.keys(errors));
  // Return a boolean indicating whether there are any errors
  return Object.keys(errors).length === 0;
};

module.exports = { loginValidation, regValidate, EditProfileValidation };
