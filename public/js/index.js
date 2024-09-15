import { callCalendar } from "./handleCalendar.js";
import { handleCaseForm } from "./handleCaseForm.js";
import { handleClientForm } from "./handleClientForm.js";
import { handleTaskForm } from "./handleTaskForm.js";
import { showEventToast } from "./handleToast.js";
import { handleSort, updateURL } from "./helpers.js";
import { forgotPassword, login, logout, setNewPassword } from "./login.js";
import { updateSettings } from "./updateSettings.js";

// DOM Elements
const loginForm = document.querySelector(".signin-form");
const logOutBtn = document.querySelector("#signout-btn");
const myAccountBtn = document.querySelector("#my_account-btn");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const forgotPasswordForm = document.querySelector(".forgotPassword-form");
const setNewPasswordForm = document.querySelector(".setNewPassword-form");
const signupForm = document.querySelector(".signup-form");
const completeSignupForm = document.querySelector(".completeSignup-form");
const addNewClient = document.querySelector("#create-client-btn");
const addNewCase = document.querySelector("#create-case-btn");
const addNewTask = document.querySelector("#create-task-btn");
const closeButton = document.getElementById("closeButton");
const closeButtonAccount = document.getElementById("closeButtonAccount");

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

if (forgotPasswordForm) {
  const resetPwBtn = forgotPasswordForm.querySelector(
    "#forgotPassword-submit-button"
  );
  forgotPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    resetPwBtn.textContent = "Sending token...";
    const email = document.getElementById("email").value;
    await forgotPassword(email);
    resetPwBtn.textContent = "Reset Password";
  });
}

if (setNewPasswordForm) {
  setNewPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = window.location.pathname.split("/").at(-1);
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    await setNewPassword(password, passwordConfirm, token);

    location.assign("/dashboard");
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Sign Up Form");
  });
}

if (completeSignupForm) {
  completeSignupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Complete Sign Up");
  });
}

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
if (closeButtonAccount)
  closeButtonAccount.addEventListener("click", function () {
    history.back();
  });

// CASE FORM

const caseForm = document.querySelector("#case-form");
if (caseForm) handleCaseForm(caseForm);

// CLIENT FORM

const clientForm = document.querySelector("#client-form");
if (clientForm) handleClientForm(clientForm);

// TASK FORM

const taskForm = document.querySelector("#task-form");
if (taskForm) handleTaskForm(taskForm);

// SORTING

const sortClientsDropdown = document.querySelector("#sort-input-client");
const sortCasesDropdown = document.querySelector("#sort-input-case");
const sortTasksDropdown = document.querySelector("#sort-input-task");

// Function to handle sorting and page changes

if (sortClientsDropdown) {
  console.log("this hjere");
  sortClientsDropdown.addEventListener("change", handleSort);
}

if (sortCasesDropdown) {
  sortCasesDropdown.addEventListener("change", handleSort);
}

if (sortTasksDropdown) {
  sortTasksDropdown.addEventListener("change", handleSort);
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
const dueDateBox = document.getElementById("due-date-box");
const appointmentDetailsContainer = document.getElementById(
  "appointment-details-container"
);

function toggleAppointmentDetails() {
  appointmentDetailsContainer.style.display = appointmentCheckbox.checked
    ? "block"
    : "none";

  dueDateBox.style.display = appointmentCheckbox.checked ? "none" : "flex";
}
if (appointmentCheckbox)
  appointmentCheckbox.addEventListener("change", toggleAppointmentDetails);

// Handle Menu

const menu = document.querySelector("#sidebar");
if (menu) {
  const urlPath = window.location.pathname;
  const currentMenuItem = urlPath.split("/")[1];
  const menuItems = menu.querySelectorAll("a");

  menuItems.forEach((item) => {
    item.classList.remove("active");

    const itemText = item.textContent
      .split(" ")
      .join("")
      .toString()
      .toLowerCase()
      .trim();

    if (!currentMenuItem && itemText.startsWith("dashboard")) {
      item.classList.add("active");
    } else if (
      currentMenuItem &&
      itemText.startsWith(currentMenuItem.toLowerCase().trim())
    ) {
      item.classList.add("active");
    }
  });
}
