import Views from "./views.js";

class RenderTasks extends Views {
  _generateMarkup() {
    setTimeout(() => {
      const createCaseBtn =
        this._parentElement.querySelector("#create-task-btn");
      createCaseBtn.addEventListener(
        "click",
        this._dispatchCustomEvent.bind(this)
      );
    }, 0);

    return `
    <div class="table-row-horizontal">
    <h1 class="heading"> Tasks</h1>
    <button id="create-task-btn" class="btn-medium btn-primary">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#5f6368"
        >
        <path
          d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q32 0 62-6t58-17l60 61q-41 20-86 31t-94 11Zm280-80v-120H640v-80h120v-120h80v120h120v80H840v120h-80ZM424-296 254-466l56-56 114 114 400-401 56 56-456 457Z"
        />
      </svg> Add New Task
    </button>
    </div>
    <table class="table tasks-table">
    <tr class="table-header">
      <td>Task ID</td>
      <td>Description</td>
      <td>Requested By</td>
      <td>Completed</td>
      <td>Assigned To</td>
      <td>Date</td>
    </tr>
    ${this._data.tasks
      .filter((t) => t.assignedTo === this._currentUser.employeeId)
      .map(
        (t) =>
          `<tr class="table-row">
            <td><a href="#task?${t.id}">${t.id}</a></td>
            <td>${t.description}</td>
            <td>${this._employeeIdToName(t.requestedBy)}</td>
            <td style="color: ${t.completed ? "green" : "red"}">${
            t.completed
          }</td>
            <td>${this._employeeIdToName(t.assignedTo)}</td>
            <td>${t.appointmentDate || t.due}</td>
          </tr>`
      )
      .join("")}
  </table>`;
  }

  _dispatchCustomEvent(e) {
    const ev = new CustomEvent("custom:createTaskClicked", {
      bubbles: true,
      detail: {},
    });
    this._parentElement.dispatchEvent(ev);
  }
}

export default new RenderTasks();
