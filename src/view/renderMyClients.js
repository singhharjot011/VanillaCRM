import Views from "./views.js";
import { getDateTimeString, formatPhoneNumber } from "../utils/helpers.js";

class RenderMyClients extends Views {
  _getLatestCaseId(clientId) {
    const allCases = this._data.cases.filter((c) => c.clientId === clientId);
    if (allCases.length === 0) return "N/A";
    const latestCaseId = allCases.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )[0].caseId;
    return allCases.length > 1 ? latestCaseId : allCases[0].caseId;
  }

  _getLatestAppointment(clientId) {
    const allAppointments = this._data.events.filter(
      (e) => e.isAppointment && e.clientId === clientId
    );
    if (allAppointments?.length === 0) return "N/A";
    if (allAppointments?.length === 1)
      return `<strong>${allAppointments[0].title}</strong> on ${allAppointments[0].start}`;
    const latestAppointment = allAppointments.sort(
      (a, b) => b.start.getTime() - a.start.getTime()
    );
    return latestAppointment[0].title + latestAppointment[0].start;
  }

  _generateMarkup() {
    return `
    <div class="table-row-horizontal">
    <h1 class="heading">My Clients</h1>
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
    ${this._data.clients
      .filter((e) => e.consultant === "E202")
      .map(
        (c) =>
          `<tr class="table-row">
            <td><a href="#my-client?${c.id}">${c.id}</a></td>
            <td ${
              c.isLead
                ? `style="color:var(--color-green-600); font-weight: bolder;"`
                : ``
            }  >${c.name}</td>
            <td>${formatPhoneNumber(c.phone)}</td>
            <td>${c.email}</td>
            <td>${c.visaType}</td>
            <td>${getDateTimeString(c.createdAt)}</td>
            <td>${this._getLatestCaseId(c.id)}</td>
            <td>
              ${this._getLatestAppointment(c.id)}
            </td>
            <td>${this._employeeIdToName(c.consultant)}</td>
          </tr>`
      )
      .join("")}
  </table>
  <div class="table-row-horizontal">
      <div class="legend">
        <div class="legend-span"> </div>
        <p>Leads</p>
      </div>
    </div>`;
  }
}

export default new RenderMyClients();
