import { callCalendar } from "./handleCalendar.js";
import { handleCaseForm } from "./handleCaseForm.js";
import { handleClientForm } from "./handleClientForm.js";
import { handleSort, updateURL } from "./helpers.js";
import { login, logout } from "./login.js";
import { updateSettings } from "./updateSettings.js";

// DOM Elements
const loginForm = document.querySelector(".signin-form");
const logOutBtn = document.querySelector("#signout-btn");
const myAccountBtn = document.querySelector("#my_account-btn");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const addNewClient = document.querySelector("#create-client-btn");
const addNewCase = document.querySelector("#create-case-btn");
const addNewTask = document.querySelector("#create-task-btn");
const closeButton = document.getElementById("closeButton");

const fileInput = document.querySelector("#photo");
const fileNameDisplay = document.querySelector("#file-name");
if (fileInput)
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      fileNameDisplay.textContent = file.name;
    } else {
      fileNameDisplay.textContent = "No file chosen";
    }
  });

if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener("click", logout);
if (myAccountBtn) {
  myAccountBtn.addEventListener("click", () => {
    location.assign("/me");
  });
}

if (addNewClient)
  addNewClient.addEventListener("click", () => {
    window.location.assign("/add-client");
  });
if (addNewCase)
  addNewCase.addEventListener("click", () => {
    window.location.assign("/add-case");
  });
if (addNewTask)
  addNewTask.addEventListener("click", () => {
    window.location.assign("/add-task");
  });

if (userDataForm)
  userDataForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn-save-data").textContent = "Updating...";
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);

    await updateSettings(form, "data");
    document.querySelector(".btn-save-data").textContent = "Save";
  });

if (userPasswordForm)
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn-save-password").textContent = "Updating...";
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );
    document.querySelector(".btn-save-password").textContent = "Save";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });

if (closeButton)
  closeButton.addEventListener("click", function () {
    history.back();
  });

// CASE FORM

const caseForm = document.querySelector("#case-form");
if (caseForm) handleCaseForm(caseForm);

// CLIENT FORM

const clientForm = document.querySelector("#client-form");
if (clientForm) handleClientForm(clientForm);

// SORTING

const sortClientsDropdown = document.querySelector("#sort-input-client");
const sortCasesDropdown = document.querySelector("#sort-input-case");

// Function to handle sorting and page changes

if (sortClientsDropdown) {
  sortClientsDropdown.addEventListener("change", handleSort);
}

if (sortCasesDropdown) {
  sortCasesDropdown.addEventListener("change", handleSort);
}

const prevButton = document.querySelector("#prev-btn");
const nextButton = document.querySelector("#next-btn");
const pageButtons = document.querySelectorAll(".btn-page");

let currentPage = parseInt(
  new URLSearchParams(window.location.search).get("page") || "1",
  10
);

if (prevButton) {
  prevButton.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      const query =
        new URLSearchParams(window.location.search).get("sort") || "";
      updateURL(query, currentPage);
    }
  });
}

if (nextButton) {
  nextButton.addEventListener("click", function () {
    // Add a check here if you have totalPages defined
    // if (currentPage < totalPages) {
    currentPage++;
    const query = new URLSearchParams(window.location.search).get("sort") || "";
    updateURL(query, currentPage);
    // }
  });
}

pageButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const selectedPage = parseInt(this.textContent, 10);
    currentPage = selectedPage;
    const query = new URLSearchParams(window.location.search).get("sort") || "";
    updateURL(query, currentPage);
  });
});

// Calendar

const calendarEl = document.getElementById("calendar-container");

if (calendarEl) {
  callCalendar(calendarEl);
}

// Task Events Handling

const appointmentCheckbox = document.getElementById("appointment-check-new");
const appointmentDetailsContainer = document.getElementById(
  "appointment-details-container"
);

function toggleAppointmentDetails() {
  appointmentDetailsContainer.style.display = appointmentCheckbox.checked
    ? "block"
    : "none";
}
if (appointmentCheckbox)
  appointmentCheckbox.addEventListener("change", toggleAppointmentDetails);
