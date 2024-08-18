import Views from "./views.js";
import { getDateTimeString, formatPhoneNumber } from "../utils/helpers.js";

class RenderMyClients extends Views {
  _clientCasesData;
  _filteredData;

  _getFilteredData() {
    this._filteredData = this._data.filter(
      (d) => d.consultant._id === "66bfab315fc554e42a9e6db6"
    );
  }

  _generateMarkup() {
    this._getFilteredData();
    return `
    <div class="table-row-horizontal">
    <h1 class="heading">Clients</h1>
    
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
       ${this._filteredData
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

export default new RenderMyClients();
