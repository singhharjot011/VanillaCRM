import Views from "./views.js";
import { getDateTimeString, getDayDifference } from "../utils/helpers.js";

class RenderDashboard extends Views {
  _parentElement = document.querySelector("#main");
  _days = "7";

  constructor() {
    super();
    this.addHandlerRender();
  }

  addHandlerRender() {
    // Listen for the custom event to trigger re-render
    this._parentElement.addEventListener("custom:daysFilterClicked", (e) => {
      this._days = e.detail.days;

      this.render(this._data, this._parentElement, this._newsData);
    });
  }

  filteredClientData = (type, days) => {
    if (!type) type = "client";
    if (!days) days = "7";
    if (type === "client") {
      switch (days) {
        case "7":
          return this._data.clients.filter(
            (c) => getDayDifference(c.createdAt, null) <= days
          ).length;
        case "30":
          return this._data.clients.filter(
            (c) =>
              getDayDifference(c.createdAt, null) <= days &&
              getDayDifference(c.createdAt, null) > 7
          ).length;
        case "90":
        case "30":
          return this._data.clients.filter(
            (c) =>
              getDayDifference(c.createdAt, null) <= days &&
              getDayDifference(c.createdAt, null) > 30
          ).length;
      }
    }
    if (type === "lead") {
      switch (days) {
        case "7":
          return this._data.clients.filter(
            (c) => c.isLead && getDayDifference(c.createdAt, null) <= days
          ).length;
        case "30":
          return this._data.clients.filter(
            (c) =>
              c.isLead &&
              getDayDifference(c.createdAt, null) <= days &&
              getDayDifference(c.createdAt, null) > 7
          ).length;
        case "90":
          return this._data.clients.filter(
            (c) =>
              c.isLead &&
              getDayDifference(c.createdAt, null) <= days &&
              getDayDifference(c.createdAt, null) > 30
          ).length;
      }
    }
  };

  filteredCaseData = (type, days) => {
    if (!type) type = "active";
    if (!days) days = "7";
    if (type === "active") {
      switch (days) {
        case "7":
          return this._data.cases.filter(
            (cs) =>
              cs.caseStatus !== "Completed" &&
              cs.caseStatus !== "Closed" &&
              getDayDifference(cs.createdAt, null) <= days
          ).length;
        case "30":
          return this._data.cases.filter(
            (cs) =>
              cs.caseStatus !== "Completed" &&
              cs.caseStatus !== "Closed" &&
              getDayDifference(cs.createdAt, null) <= days &&
              getDayDifference(cs.createdAt, null) > 7
          ).length;
        case "90":
          return this._data.cases.filter(
            (cs) =>
              cs.caseStatus !== "Completed" &&
              cs.caseStatus !== "Closed" &&
              getDayDifference(cs.createdAt, null) <= days &&
              getDayDifference(cs.createdAt, null) > 30
          ).length;
      }
    }
    if (type === "closed") {
      switch (days) {
        case "7":
          return this._data.cases.filter(
            (cs) =>
              cs.caseStatus === "Completed" &&
              cs.caseStatus === "Closed" &&
              getDayDifference(cs.createdAt, null) <= days
          ).length;
        case "30":
          return this._data.cases.filter(
            (cs) =>
              cs.caseStatus === "Completed" &&
              cs.caseStatus === "Closed" &&
              getDayDifference(cs.createdAt, null) <= days &&
              getDayDifference(cs.createdAt, null) > 7
          ).length;
        case "90":
          return this._data.cases.filter(
            (cs) =>
              cs.caseStatus === "Completed" &&
              cs.caseStatus === "Closed" &&
              getDayDifference(cs.createdAt, null) <= days &&
              getDayDifference(cs.createdAt, null) > 30
          ).length;
      }
    }
  };

  _generateMarkup() {
    setTimeout(() => {
      const filter7Days = this._parentElement.querySelector("#filter-7days");
      const filter30Days = this._parentElement.querySelector("#filter-30days");
      const filter90Days = this._parentElement.querySelector("#filter-90days");

      filter7Days?.addEventListener(
        "click",
        this._dispatchCustomEvent.bind(this)
      );
      filter30Days?.addEventListener(
        "click",
        this._dispatchCustomEvent.bind(this)
      );
      filter90Days?.addEventListener(
        "click",
        this._dispatchCustomEvent.bind(this)
      );
    }, 5);

    return `
    <div id="dashboard">
        <div class="table-row-horizontal">
        <h1 class="heading">Dashboard</h1>
        <div id="filter-buttons">
            <button id="filter-7days" class="btn-medium ${
              this._days === "7" ? `btn-primary` : `btn-secondary`
            }" >
              Last 7 Days
            </button> 
            <button id="filter-30days" class="btn-medium ${
              this._days === "30" ? `btn-primary` : `btn-secondary`
            }" >
              Last 30 Days
            </button> 
            <button id="filter-90days" class="btn-medium ${
              this._days === "90" ? `btn-primary` : `btn-secondary`
            }" >
              Last 90 Days
            </button> 
        </div>
      </div>
      <div id="dashboard-tiles">
        <div id="dashboard-tile" class="new-clients-tile">
            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" " fill="#5f6368"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/></svg>
          <div id="stat-tile">
            <h3> New Clients </h3>
            <span>${this.filteredClientData("client", this._days)}</span>
          </div>
        </div>
        <div id="dashboard-tile" class="active-cases-tile">
            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"  fill="#5f6368"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38H200Zm0-120v40-560 243-3 280Zm80-40h163q3-21 9.5-41t14.5-39H280v80Zm0-160h244q32-30 71.5-50t84.5-27v-3H280v80Zm0-160h400v-80H280v80ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Zm-20-80h40v-100h100v-40H740v-100h-40v100H600v40h100v100Z"/></svg>
          <div id="stat-tile">
            <h3> Active Cases </h3>
            <span>${this.filteredCaseData("active", this._days)}</span>
          </div>
        </div>
        <div id="dashboard-tile" class="closed-cases-tile">
        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"  fill="#5f6368"><path d="M320-480h320v-80H320v80Zm0-160h320v-80H320v80Zm478 499L636-352q-17-23-42-35.5T540-400H160v-400q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 5-.5 9.5T798-141ZM240-80q-33 0-56.5-23.5T160-160v-160h380q10 0 18.5 4.5T573-303L741-83q-5 2-10.5 2.5T720-80H240Z"/></svg>
          <div id="stat-tile">
            <h3> Closed Cases </h3>
            <span>${this.filteredCaseData("closed", this._days)}</span>
          </div>
        </div>
        <div id="dashboard-tile" class="lead-tile">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"  fill="#5f6368"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
          <div id="stat-tile">
            <h3> New Leads </h3>
            <span>${this.filteredClientData("lead", this._days)}</span>
          </div>
        </div>
      </div>
      
      <div id="dashboard-bigger-tiles">
        <div id="dashboard-appointments-tile">
          <div class="dashboard-appointments-sub-tile">
            <h4> Upcoming Appointments & Tasks</h4>
            <h4>Today</h4>
            ${this._data.events
              .filter(
                (e) =>
                  e.assignedTo === this._currentUser.employeeId &&
                  getDayDifference(null, e.start) === 0
              )
              .map(
                (e) => `<div class="table-row">
            <div class="appointment-row ">
              ${
                e.classNames.includes("appointment")
                  ? `<p><span>Time: ${e.start
                      .split(" ")
                      .slice(-2)
                      .join(" ")}</span> </p>
                      <p><span style="color: var(--color-green-600);" >Appt:</span> ${
                        e.title
                      }</p>
              <p>Appointment with ${this._clientIdToName(e.clientId)} </p>`
                  : `<p><span style="color: var(--color-red-700);" >Task:</span> ${e.title}</p>`
              }
              </div>
          </div>`
              )
              .join("")}
            
            <h4>Tomorrow</h4>
            ${this._data.events
              .filter(
                (e) =>
                  e.assignedTo === this._currentUser.employeeId &&
                  getDayDifference(null, e.start) === 1
              )
              .map(
                (e) => `<div class="table-row">
            <div class="appointment-row ">
              ${
                e.classNames.includes("appointment")
                  ? `<p><span>Time: ${e.start
                      .split(" ")
                      .slice(-2)
                      .join(" ")}</span> </p>
                      <p><span style="color: var(--color-green-600);" >Appt:</span> ${
                        e.title
                      }</p>
              <p>Appointment with ${this._clientIdToName(e.clientId)} </p>`
                  : `<p><span style="color: var(--color-red-700);" >Task:</span> ${e.title}</p>`
              }
              </div>
          </div>`
              )
              .join("")}
        </div>  
        
        
        

      </div>
      <div id="dashboard-case-tile">
          <div class="dashboard-case-sub-tile">
            <h4> Pending Cases </h4>
            <h4>My Cases</h4>
            <div class="table-row">
              <p>${
                this._data.cases.filter(
                  (c) =>
                    c.assignedTo === this._currentUser.employeeId &&
                    c.caseStatus !== "Completed" &&
                    c.caseStatus !== "Closed"
                ).length
              }</p>
            </div>
            <h4>Total Pending Cases</h4>
            <div class="table-row">
              <p>${
                this._data.cases.filter(
                  (c) =>
                    c.caseStatus !== "Completed" && c.caseStatus !== "Closed"
                ).length
              }</p>
            </div>           
        </div>
      </div>

      <div id="dashboard-news-tile">
          <div class="dashboard-news-sub-tile">
          <h4>Latest News Highlights</h4>
            <p>${this._newsData.articles
              ?.map((n, i) =>
                i < 5
                  ? `<div class="table-row">
                  <p><strong>${n.author ? n.author : ""}: </strong>
                  <a href="${n.url}" target="_blank" >${n.title}</a>
                  </p>
                  </div>`
                  : ""
              )
              .join("")}</p>
            

            
        </div>
      </div>
      
  
  `;
  }
  _dispatchCustomEvent(e) {
    const id = e.target.getAttribute("id");
    const days = id.split("-")[1].match(/\d+/)[0];
    const ev = new CustomEvent("custom:daysFilterClicked", {
      bubbles: true,
      detail: { days },
    });
    this._parentElement.dispatchEvent(ev);
  }
}

export default new RenderDashboard();

// ${this._newsData.articles
//   .map((n, i) =>
//     i < 5
//       ? `<div class="table-row">
//       <p><strong>${n.author ? n.author : ""}: </strong>
//       <a href="${n.url}" target="_blank" >${n.title}</a>
//       </p>
//       </div>`
//       : ""
//   )
//   .join("")}

// <h4>Latest News Highlights</h4>
//             <p>Apologies for the inconvenience, but we're currently experiencing issues with our News API integration on our Netlify production site. As a result, this section will temporarily display a curated selection of the latest news highlights manually updated by our team. We appreciate your patience as we work to resolve this issue. </p>
