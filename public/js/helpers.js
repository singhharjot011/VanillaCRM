export const updateURL = (query, page, limit = 10) => {
  if (window.location.href.includes("/clients")) {
    window.location.href = `/clients?sort=${query}&page=${page}&limit=${limit}`;
  } else if (window.location.href.includes("/my-clients")) {
    window.location.href = `/my-clients?sort=${query}&page=${page}&limit=${limit}`;
  } else if (window.location.href.includes("/cases")) {
    window.location.href = `/cases?sort=${query}&page=${page}&limit=${limit}`;
  } else if (window.location.href.includes("/tasks")) {
    window.location.href = `/tasks?sort=${query}&page=${page}&limit=${limit}`;
  }
};

export const handleSort = function (e) {
  e.preventDefault();

  let query = "";

  switch (this.value) {
    case "Name - (A-Z)":
      query = "name";
      break;
    case "Name - (Z-A)":
      query = "-name";
      break;
    case "Newest":
      query = "-createdAt";
      break;
    case "Last Updated":
      query = "-lastUpdatedAt";
      break;
    case "Oldest":
      query = "createdAt";
      break;
    case "Visa Type - (A-Z)":
      query = "visaType";
      break;
    case "Status":
      query = "caseStatus";
      break;
    case "Completed":
      query = "completed";
      break;
    default:
      query = "-createdAt"; // or handle any unexpected value
      break;
  }

  updateURL(query, 1); // Reset to page 1 on sort change
};

export const formatDateTime = function (ISODate) {
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
};
