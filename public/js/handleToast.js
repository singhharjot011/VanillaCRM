import { formatDateTime } from "./helpers.js";

export const showToast = function (toast, missingFields, invalidFields) {
  const missingFieldsDiv = toast.querySelector(".missing-fields-div");
  const invalidFieldsDiv = toast.querySelector(".invalid-fields-div");

  const missingFieldsContainer = toast.querySelector(".missing-fields");
  const invalidFieldsContainer = toast.querySelector(".invalid-fields");

  // Clear previous content
  missingFieldsContainer.innerHTML = "";
  invalidFieldsContainer.innerHTML = "";

  // Populate missing fields
  if (missingFields && missingFields.length > 0) {
    missingFields.forEach((field) => {
      const p = document.createElement("p");
      p.textContent = field;
      missingFieldsContainer.appendChild(p);
    });
    missingFieldsDiv.style.display = "block"; // Show missing fields section
  } else {
    missingFieldsDiv.style.display = "none"; // Hide missing fields section
  }

  // Populate invalid fields
  if (invalidFields && invalidFields.length > 0) {
    invalidFields.forEach((field) => {
      const p = document.createElement("p");
      p.textContent = field;
      invalidFieldsContainer.appendChild(p);
    });
    invalidFieldsDiv.style.display = "block"; // Show invalid fields section
  } else {
    invalidFieldsDiv.style.display = "none"; // Hide invalid fields section
  }

  const toastCloseIcon = toast.querySelector(".toast-close-icon");
  if (toastCloseIcon) {
    toastCloseIcon.addEventListener("click", () => {
      if (toast) {
        toast.classList.add("sr-only");
      }
    });
  }
};

export const showEventToast = function (toast, fieldsMap) {
  const eventDetailsContainer = toast.querySelector(".event-details-container");
  toast.classList.remove("sr-only");

  if (fieldsMap.size > 0) {
    const renderedTaskInfo = renderTaskInfo(fieldsMap);
    eventDetailsContainer.innerHTML = renderedTaskInfo;
    eventDetailsContainer.style.display = "flex"; // Show event details section
  } else {
    eventDetailsContainer.style.display = "none"; // Hide event details section
  }

  const toastCloseIcon = toast.querySelector(".toast-close-icon");
  if (toastCloseIcon) {
    toastCloseIcon.addEventListener("click", () => {
      toast.classList.add("sr-only");
    });
  }
};

function renderTaskInfo(fieldsMap) {
  const clientName = fieldsMap.get("clientName");
  const taskId = fieldsMap.get("taskId");
  const appointmentAgenda = fieldsMap.get("appointmentAgenda");
  const assignedToName = fieldsMap.get("assignedToName");
  const requestedByName = fieldsMap.get("requestedByName");
  const isCompleted = fieldsMap.get("isCompleted");
  const start = fieldsMap.get("start");
  const end = fieldsMap.get("end");

  let output = "";

  if (clientName) {
    // It's a meeting
    output += `<h3>Meeting with ${clientName}</h3>`;
    output += `<p><strong>Agenda:</strong> ${appointmentAgenda || "N/A"}</p>`;
    output += `<p><strong>Start:</strong> ${
      formatDateTime(start) || "N/A"
    }</p>`;
    output += `<p><strong>End:</strong> ${formatDateTime(end) || "N/A"}</p>`;
  } else {
    // It's a task
    output += `<h3>Task Objective</h3>`;
    output += `<p><strong>Assigned to:</strong> ${assignedToName || "N/A"}</p>`;
    output += `<p><strong>Requested by:</strong> ${
      requestedByName || "N/A"
    }</p>`;
    output += `<p><strong>Due:</strong> ${
      formatDateTime(start) || "[Due Date Here]"
    }</p>`;
  }

  // Add the completion status
  output += `<p><strong>Status:</strong> ${
    isCompleted ? "Completed" : "Pending"
  }</p>`;

  // Add the button
  output += `<button class="btn-medium btn-primary" onclick="location.href='/task/${taskId}'">View Task</button>`;

  return output;
}
