const limit = 10;
export const updateURL = (query, page) => {
  if (window.location.href.includes("/clients")) {
    window.location.href = `/clients?sort=${query}&page=${page}&limit=${limit}`;
  } else if (window.location.href.includes("/my-clients")) {
    window.location.href = `/my-clients?sort=${query}&page=${page}&limit=${limit}`;
  } else if (window.location.href.includes("/cases")) {
    window.location.href = `/cases?sort=${query}&page=${page}&limit=${limit}`;
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
    case "Oldest":
      query = "createdAt";
      break;
    case "Visa Type - (A-Z)":
      query = "visaType";
      break;
    case "Status":
      query = "caseStatus";
      break;
    default:
      query = ""; // or handle any unexpected value
      break;
  }

  updateURL(query, 1); // Reset to page 1 on sort change
};
