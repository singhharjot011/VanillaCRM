import { showAlert } from "./alerts.js";
import { showToast } from "./handleToast.js";
 
export const handleCaseForm = (caseForm) => {
  const clientInput = document.querySelector("[data-client-input]");
  const emailLabel = document.querySelector("[data-email-label]");
  const phoneLabel = document.querySelector("[data-phone-label]");
  const visaTypeLabel = document.querySelector("[data-visa-type-label]");

  clientInput?.addEventListener("change", async function () {
    const clientName = this.value;
    try {
      const response = await fetch(`/api/v1/clients?name=${clientName}`);
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

  const toast = document.querySelector(".toast");

  caseForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(caseForm);
    const formMap = new Map(formData);
    const newCaseObj = {
      caseType: formMap.get("case-type"),
      caseStatus: formMap.get("case-status"),
      caseDescription: formMap.get("case-description"),
      consultantName: formMap.get("case-consultant"),
      clientName: formMap.get("client"),
      note: formMap.get("case-note"),
    };

    const missingFields = [];
    const invalidFields = [];

    // Validate the fields
    !newCaseObj.caseType.trim() && missingFields.push("Case Type");
    !newCaseObj.caseStatus && missingFields.push("Case Status");
    !newCaseObj.caseDescription && missingFields.push("Case Description");
    !newCaseObj.clientName &&
      phoneLabel.textContent === "" &&
      missingFields.push("Client Name");

    if (missingFields.length > 0 || invalidFields.length > 0) {
      toast.classList.remove("sr-only");
      showToast(toast, missingFields, invalidFields);
      return;
    }

    const urlPath = window.location.href.split("/").at(-1);

    if (urlPath === "add-case") {
      document.querySelector("#case-submit-button").textContent = "Creating...";

      try {
        const response = await fetch("/api/v1/cases", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCaseObj),
        });

        if (!response.ok) {
          showAlert("error", "Failed to create Case");
          throw new Error("Failed to create Case");
        }
        const result = await response.json();

        showAlert("success", "Case Created Successfully");

        document.querySelector("#case-submit-button").textContent =
          "Create Case";

        window.location.assign("/cases");
      } catch (error) {
        console.error("Error creating case:", error);
        document.querySelector("#case-submit-button").textContent =
          "Create Case";
      }
    } else {
      const urlPath = window.location.href.split("/").at(-1);

      // Fetch the original case data
      const originalCaseResponse = await fetch(
        `/api/v1/cases?caseId=${urlPath}`
      );
      const res = await originalCaseResponse.json();

      const originalCase = res.data.case;

      // Initialize an empty object to hold only the updated fields
      const updatedCaseObj = {};

      // Compare the new data with the original data and add only updated fields to updatedCaseObj
      Object.keys(newCaseObj).forEach((key) => {
        if (
          newCaseObj[key] !== originalCase[key] &&
          key !== "consultantName" &&
          key !== "note" &&
          key !== "clientName"
        ) {
          updatedCaseObj[key] = newCaseObj[key];
        }
      });

      // Check if there's a change in consultantName or note and add them to updatedCaseObj if changed
      if (originalCase.assignedTo.name !== newCaseObj.consultantName) {
        updatedCaseObj.consultantName = newCaseObj.consultantName;
      }
      if (newCaseObj.note.trim() !== "") {
        updatedCaseObj.note = newCaseObj.note.trim();
      }

      // If no changes were detected, show an alert and exit the function
      if (Object.keys(updatedCaseObj).length === 0) {
        showAlert("error", "No changes detected");
        return;
      }

      document.querySelector("#case-submit-button").textContent = "Updating...";

      console.log(updatedCaseObj);

      // Send only the updated fields in the PATCH request
      const response = await fetch(`/api/v1/cases/${originalCase._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCaseObj),
      });

      if (!response.ok) {
        showAlert("error", "Failed to update case");
        throw new Error("Failed to update case");
      }

      const result = await response.json();

      showAlert("success", "Case Updated Successfully");

      document.querySelector("#case-submit-button").textContent = "Update Case";

      window.location.assign("/cases");
    }
  });
};
