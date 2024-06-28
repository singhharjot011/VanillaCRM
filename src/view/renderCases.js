import Views from "./views.js";
import { getDateTimeString } from "../utils/helpers.js";

class RenderCases extends Views {
  _parentElement = document.querySelector("#main");
  _colorMap = new Map(
    Object.entries({
      "In Progress": "MediumSeaGreen",
      Pending: "Gold",
      "Under Review": "RoyalBlue",
      Completed: "Green",
      Referred: "Grey",
      Cancelled: "Grey",
      Closed: "SlateGrey",
    })
  );

  _getColor(key) {
    return this._colorMap.get(key);
  }

  _generateMarkup() {
    setTimeout(() => {
      const createCaseBtn =
        this._parentElement.querySelector("#create-case-btn");
      createCaseBtn.addEventListener(
        "click",
        this._dispatchCustomEvent.bind(this)
      );
    }, 0);

    return `<div class="table-row-horizontal">
    <h1 class="heading"> Cases </h1>
    <button id="create-case-btn" class="btn-medium btn-primary" >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#5f6368"
          >
            <path
              d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38H200Zm0-120v40-560 243-3 280Zm80-40h163q3-21 9.5-41t14.5-39H280v80Zm0-160h244q32-30 71.5-50t84.5-27v-3H280v80Zm0-160h400v-80H280v80ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Zm-20-80h40v-100h100v-40H740v-100h-40v100H600v40h100v100Z"
            />
          </svg>Create Case
        </button> 
    </div>
    <table class="table cases-table">
    <tr class="table-header">
      <td>Case ID</td>
      <td>Client</td>
      <td>Description</td>
      <td>Type</td>
      <td>Status</td>
      <td>Created</td>
      <td>Assigned To</td>
    </tr>
    ${this._data
      .map(
        (cases) =>
          `<tr class="table-row">
            <td><a href="#case?C${cases._id}">${cases.caseId}</a></td>
            <td>${cases.clientId}</td>
            <td>${cases.caseDescription}</td>
            <td>${cases.caseType}</td>
            <td style="white-space: nowrap; background-color:${this._getColor(
              cases.caseStatus
            )}; color:white; padding: 0 1rem; border-radius: 5px;" ">${
            cases.caseStatus
          }</td>
            <td>${getDateTimeString(cases.createdAt)}</td>
            <td>${cases.assignedTo}</td>
          </tr>`
      )
      .join("")}
  </table>`;
  }

  _dispatchCustomEvent(e) {
    const ev = new CustomEvent("custom:createCaseClicked", {
      bubbles: true,
      detail: {},
    });
    this._parentElement.dispatchEvent(ev);
  }
}

export default new RenderCases();
