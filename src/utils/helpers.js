function getDateTimeString(ISODate) {
  const fullDate = new Date(ISODate);

  const monthArray = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayArray = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const year = fullDate.getFullYear();
  const month = monthArray.at(fullDate.getMonth());
  const date = fullDate.getDate();
  const day = dayArray.at(fullDate.getDay());
  const hour = fullDate.getHours();
  const minutes = fullDate.getMinutes();

  const dateString =
    month +
    " " +
    date +
    " " +
    year +
    " " +
    String(hour).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0");
  return dateString;
}

function getDayDifference(date1, date2) {
  if (date1 === null) date1 = new Date();
  if (date2 === null) date2 = new Date();

  // Normalize the dates to midnight
  const normalizeToMidnight = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate;
  };

  const time1 = normalizeToMidnight(date1).getTime();
  const time2 = normalizeToMidnight(date2).getTime();

  // Calculate the difference in milliseconds
  const diffInMilliseconds = time2 - time1;

  // Convert the difference to days
  const diffInDays = Math.floor(diffInMilliseconds / (24 * 60 * 60 * 1000));

  return diffInDays;
}

function formatPhoneNumber(phone) {
  // if (typeof phone === "number") return phone;
  return (
    phone.toString().slice(0, 3) +
    "-" +
    phone.toString().slice(2, 5) +
    "-" +
    phone.toString().slice(5, -1)
  );
}

function validateEmail(email) {
  if (email.length === 0) return true;
  var regx = /^([a-zA-Z0-9\._]+)@([a-zA-Z]+).([a-zA-Z]+)$/;
  return regx.test(email);
}

function validatePhone(phone) {
  if (phone.length === 0) return true;
  if (phone.length < 10) return false;
  var regx = /^\d+$/;
  return regx.test(phone);
}

function validatePostalCode(postalCode) {
  if (postalCode.length === 0) return true;
  var regx = /^([a-zA-Z]+)([0-9]+)([a-zA-Z]+)([0-9]+)([a-zA-Z]+)([0-9])$/;
  return regx.test(postalCode);
}

const colorMap = new Map(
  Object.entries({
    "In Progress": "MediumSeaGreen",
    Pending: "Gold",
    "Under Review": "RoyalBlue",
    Completed: "Green",
    Referred: "Grey",
    Cancelled: "Grey",
    "Closed-Win": "SlateGrey",
    "Closed-Lost": "SlateGrey",
  })
);

function getColor(key) {
  return colorMap.get(key);
}

export {
  getDateTimeString,
  getDayDifference,
  validateEmail,
  validatePhone,
  validatePostalCode,
  formatPhoneNumber,
  getColor,
};
