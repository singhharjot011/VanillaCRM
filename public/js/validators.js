export const validateEmail = function (email) {
  if (email.length === 0) return true;
  var regx = /^([a-zA-Z0-9\._]+)@([a-zA-Z]+).([a-zA-Z]+)$/;
  return regx.test(email);
};

export const validatePhone = function (phone) {
  if (phone.length === 0) return true;
  if (phone.length < 10) return false;
  var regx = /^\d+$/;
  return regx.test(phone);
};

export const validatePostalCode = function (postalCode) {
  if (postalCode.length === 0) return true;
  var regx = /^([a-zA-Z]+)([0-9]+)([a-zA-Z]+)([0-9]+)([a-zA-Z]+)([0-9])$/;
  return regx.test(postalCode);
};
