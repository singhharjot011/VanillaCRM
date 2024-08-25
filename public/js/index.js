import { createClient } from "../../controller/clientController.js";
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
const closeButton = document.getElementById("closeButton");

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
if (caseForm) {
  const clientInput = document.querySelector("[data-client-input]");
  const emailLabel = document.querySelector("[data-email-label]");
  const phoneLabel = document.querySelector("[data-phone-label]");
  const visaTypeLabel = document.querySelector("[data-visa-type-label]");

  clientInput?.addEventListener("change", async function () {
    const clientName = this.value;
    try {
      const response = await fetch(
        `/api/v1/clients?name=${encodeURIComponent(clientName)}`
      );
      if (!response.ok) {
        throw new Error("Client not found");
      }
      const res = await response.json();
      const client = res.data.doc;
      emailLabel.textContent = client.email || "";
      phoneLabel.textContent = client.phone || "";
      visaTypeLabel.textContent = client.visaType || "";
    } catch (error) {
      emailLabel.textContent = "";
      phoneLabel.textContent = "";
      visaTypeLabel.textContent = "";
    }
  });
}

// CLIENT FORM

const clientForm = document.querySelector("#client-form");
if (clientForm) {
  const toast = document.querySelector(".toast");

  clientForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(clientForm);
    const formMap = new Map(formData);
    console.log(formMap);

    const newClientObj = {
      name: formMap.get("first-name") + " " + formMap.get("last-name"),
      email: formMap.get("email"),
      phone: formMap.get("phone"),
      consultantName: formMap.get("client-consultant"),
      clientNote: formMap.get("client-note").trim(),
      visaType: formMap.get("visa-type"),
      city: formMap.get("city"),
      province: formMap.get("province"),
      postalCode: formMap.get("postal-code"),
    };

    const missingFields = [];
    const invalidFields = [];

    // Validate the fields
    !newClientObj.name.trim() && missingFields.push("Name");
    !newClientObj.email && missingFields.push("Email Address");
    // !validateEmail(newClientObj.email) && invalidFields.push("Email");
    !newClientObj.phone && missingFields.push("Phone");
    // !validatePhone(newClientObj.phone) && invalidFields.push("Phone Number");
    !newClientObj.city && missingFields.push("City");
    !newClientObj.postalCode && missingFields.push("Postal Code");
    // !validatePostalCode(newClientObj.postalCode) && invalidFields.push("Postal Code");

    if (missingFields.length > 0 || invalidFields.length > 0) {
      toast.classList.remove("sr-only");
      showToast(toast, missingFields, invalidFields);
      return;
    }

    const urlPath = window.location.href.split("/").at(-1);
    // let apiUrl = "/api/v1/clients";

    if (urlPath === "add-client") {
      document.querySelector("#client-submit-button").textContent =
        "Creating...";

      // const response = await fetch(apiUrl, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(newClientObj),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to create client");
      // }

      // const result = await response.json();
      // console.log(result);

      document.querySelector("#client-submit-button").textContent =
        "Create Client";
      history.back();
    } else {
      document.querySelector("#client-submit-button").textContent =
        "Updating...";

      document.querySelector("#client-submit-button").textContent =
        "Update Client";
    }
  });
}

// TOAST FUNCTION

function showToast(toast, missingFields, invalidFields) {
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
}
