import { showAlert } from "./alerts.js";
import { showToast } from "./handleToast.js";
import {
  validateEmail,
  validatePhone,
  validatePostalCode,
} from "./validators.js";

export const handleClientForm = (clientForm) => {
  const toast = document.querySelector(".toast");
  clientForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(clientForm);
    const formMap = new Map(formData);

    const newClientObj = {
      name: formMap.get("first-name") + " " + formMap.get("last-name"),
      email: formMap.get("email"),
      phone: formMap.get("phone"),
      consultantName: formMap.get("client-consultant"),
      createdAt: Date.now(),
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
    !validateEmail(newClientObj.email) && invalidFields.push("Email");
    !newClientObj.phone && missingFields.push("Phone");
    !validatePhone(newClientObj.phone) && invalidFields.push("Phone Number");
    !newClientObj.city && missingFields.push("City");
    !newClientObj.postalCode && missingFields.push("Postal Code");
    !validatePostalCode(newClientObj.postalCode) &&
      invalidFields.push("Postal Code");

    const currentClientName = window.currentClientName;
    const existingClient = window.clientsNames?.find(
      (c) => c.name.toLowerCase() === newClientObj.name.toLowerCase()
    );

    if (
      existingClient &&
      existingClient.name.toLowerCase() !== currentClientName?.toLowerCase()
    ) {
      invalidFields.push("Name already exists. Please add a numerical prefix");
    }

    if (missingFields.length > 0 || invalidFields.length > 0) {
      toast.classList.remove("sr-only");
      showToast(toast, missingFields, invalidFields);
      return;
    }

    const urlPath = window.location.href.split("/").at(-1);

    if (urlPath === "add-client") {
      document.querySelector("#client-submit-button").textContent =
        "Creating...";

      try {
        const response = await fetch("/api/v1/clients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newClientObj),
        });

        if (!response.ok) {
          showAlert("error", "Failed to create client");
          throw new Error("Failed to create client");
        }
        const result = await response.json();

        showAlert("success", "Client Created Successfully");

        document.querySelector("#client-submit-button").textContent =
          "Create Client";

        window.location.assign("/clients");
      } catch (error) {
        console.error("Error creating client:", error);
        document.querySelector("#client-submit-button").textContent =
          "Create Client";
      }
    } else {
      newClientObj._id = window.currentClientId;

      // Fetch the original client data
      const originalClientResponse = await fetch(
        `/api/v1/clients/${window.currentClientId}`
      );

      const res = await originalClientResponse.json();
      const originalClient = res.data.doc;

      // Initialize an empty object to hold only the updated fields
      const updatedClientObj = {};

      // Compare the new data with the original data and add only updated fields to updatedClientObj
      Object.keys(newClientObj).forEach((key) => {
        if (
          newClientObj[key] !== originalClient[key] &&
          key !== "consultantName" &&
          key !== "createdAt" &&
          key !== "clientNote" &&
          key !== "phone"
        ) {
          updatedClientObj[key] = newClientObj[key];
        }
      });

      // Check if there's a change in consultantName and add it to updatedClientObj if changed
      if (originalClient.consultant.name !== newClientObj.consultantName) {
        updatedClientObj.consultantName = newClientObj.consultantName;
      }
      if (originalClient.clientNote.trim() !== "") {
        updatedClientObj.clientNote = newClientObj.clientNote.trim();
      }
      if (originalClient.phone.toString() !== newClientObj.phone.toString()) {
        updatedClientObj.phone = newClientObj.phone.toString();
      }

      // If no changes were detected, show an alert and exit the function
      if (Object.keys(updatedClientObj).length === 0) {
        showAlert("error", "No changes detected");
        return;
      }

      const { createdAt, ...filteredClientObj } = newClientObj;
      Object.assign(newClientObj, filteredClientObj);


      document.querySelector("#client-submit-button").textContent =
        "Updating...";

      try {
        const response = await fetch(
          `/api/v1/clients/${window.currentClientId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(filteredClientObj),
          }
        );

        if (!response.ok) {
          showAlert("error", "Failed to update client");
          throw new Error("Failed to update client");
        }

        const result = await response.json();

        showAlert("success", "Client Updated Successfully");

        document.querySelector("#client-submit-button").textContent =
          "Update Client";

        window.location.assign("/clients");
      } catch (error) {
        console.error("Error updating client:", error);
        document.querySelector("#client-submit-button").textContent =
          "Update Client";
      }
    }
  });
};
