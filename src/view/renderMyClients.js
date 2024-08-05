import Views from "./views.js";
import { getDateTimeString, formatPhoneNumber } from "../utils/helpers.js";

class RenderMyClients extends Views {
  _clientCasesData;
  _filteredData;

  _getFilteredData() {
    this._filteredData = this._data.clients.filter(
      (c) => c.consultant === "E202"
    );
  }

  _getLatestCase(clientId) {
    const latestCase = this._data.cases
      .filter((c) => c.clientId === clientId)
      .sort((a, b) => {
        return a.createdAt - b.createdAt;
      })[0];

    return latestCase
      ? { caseId: latestCase.caseId, _id: latestCase._id }
      : null;
  }

  _getLatestAppointment(clientId) {
    const latestAppointment = this._data.tasks
      .filter((t) => t.clientId === clientId)
      .sort((a, b) => {
        return a.start - b.start;
      })[0];

    return latestAppointment
      ? { taskId: latestAppointment.id, _id: latestAppointment._id }
      : null;
  }

  _employeeIdToName(empId) {
    const empName = this._data.employees.find(
      (e) => e.employeeId === empId
    ).name;
    return empName;
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
        .map(
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
                this._getLatestCase(c.id)
                  ? `<a href="#case?C${this._getLatestCase(c.id)._id}">${
                      this._getLatestCase(c.id).caseId
                    }</a>`
                  : "N/A"
              }</td>
              <td>
              ${
                this._getLatestAppointment(c.id)
                  ? `<a href="#task?T${this._getLatestAppointment(c.id)._id}">${
                      this._getLatestAppointment(c.id).taskId
                    }</a>`
                  : "N/A"
              }
              </td>
              <td style="text-wrap:nowrap;">${this._employeeIdToName(
                c.consultant
              )}</td>
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
