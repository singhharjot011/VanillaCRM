import Views from "./views.js";
import { getDateTimeString, formatPhoneNumber } from "../utils/helpers.js";

class RenderMyClients extends Views {
  _clientCasesData;
  _filteredData;

  _getFilteredData() {
    this._filteredData = this._data?.filter(
      (c) => c.consultant._id === "66bd6daf18b4120ed48ad221"
    );
  }

  _getLatestCase(clientId) {
    const cases =
      this._data.cases?.filter((c) => c.clientId === clientId) || [];
    const latestCase = cases.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];
    return latestCase
      ? { caseId: latestCase.caseId, _id: latestCase._id }
      : null;
  }

  _getLatestAppointment(clientId) {
    const tasks =
      this._data.tasks?.filter((t) => t.clientId === clientId) || [];
    const latestAppointment = tasks.sort(
      (a, b) => new Date(b.start) - new Date(a.start)
    )[0];
    return latestAppointment
      ? { taskId: latestAppointment.id, _id: latestAppointment._id }
      : null;
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
