import Views from "./views.js";
import { getDateTimeString, formatPhoneNumber } from "../utils/helpers.js";

class RenderClients extends Views {
  _clientCasesData;

  _generateMarkup() {
    //  Create Client Button
    this._parentElement.addEventListener("click", (e) => {
      if (e.target.id === "create-client-btn") {
        window.location.hash = "new-client";
      }
    });

    return `
    <div class="table-row-horizontal">
    <h1 class="heading">Clients</h1>
    <button id="create-client-btn" class="btn-medium btn-primary">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#5f6368"
      >
        <path
          d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z"
        />
      </svg> Add New Client
    </button>
    </div>
    <table class="table clients-table">
      <thead >
        <tr class="table-header">
          <th>Client ID</th>
          <th>Client Name</th>
          <th>Phone Number</th>
          <th>Email Address</th>
          <th>Visa Type</th>
          <th>Created</th>
          <th>Latest Case#</th>
          <th>Upcoming Appointment</th>
          <th>Consultant</th>
        </tr>
      </thead>
      <tbody>
      ${this._data
        ?.map(
          (c) =>
            `<tr class="table-row">
              <td><a href="#client?I${c._id}">${c.id}</a></td>
              <td ${
                c.isLead
                  ? `style="color:var(--color-green-600); font-weight: bolder;"`
                  : ``
              }  >${c.name}</td>
              <td style="text-wrap:nowrap;">${formatPhoneNumber(c.phone)}</td>
              <td style="text-wrap:nowrap;">${c.email}</td>
              <td>${c.visaType}</td>
              <td >${getDateTimeString(c.createdAt)}</td>
              <td style="text-wrap:nowrap;">${
                c.cases[0]
                  ? `<a href="#case?C${c.cases.at(-1)?._id}">${
                      c.cases.at(-1).caseId
                    }</a>`
                  : "N/A"
              }</td>
              <td>
              ${0 ? `<a href="#task?T${"000000"}">${"000000"}</a>` : "N/A"}
              </td>
              <td style="text-wrap:nowrap;">${c.consultant?.name}</td>
            </tr>`
        )
        .join("")}
        </tbody>
    </table>
    <div class="table-row-horizontal">
      <div class="legend">
        <div class="legend-span"> </div>
        <p>Leads</p>
      </div>
    </div>
    `;
  }
}

export default new RenderClients();
