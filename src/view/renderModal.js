import Views from "./views.js";
import {
  validateEmail,
  validatePhone,
  validatePostalCode,
} from "../utils/helpers.js";

import renderToastModal from "./modals/renderToastModal.js";
import renderEventModal from "./modals/renderEventModal.js";
import renderCreateCaseModal from "./modals/renderCreateCaseModal.js";
import renderCreateClientModal from "./modals/renderCreateClientModal.js";
import renderCreateTaskModal from "./modals/renderCreateTaskModal.js";

class RenderModal extends Views {
  _calendar;
  _modalData;

  constructor() {
    super();
  }

  addHandlerModal(
    data,
    id,
    handler,
    currentUser,
    controlGetCurTask,
    controlUpdateTask
  ) {
    this._modalData = data;
    let curHashId = window.location.hash.slice(1);
    let actualId = id?.split("?")[1];

    window.addEventListener("hashchange", () => {
      curHashId = window.location.hash.slice(1);
    });

    if (curHashId === "new-client") {
      renderCreateClientModal(null, this._modalData, this._parentElement);
    }

    if (curHashId === "new-task") {
      renderCreateTaskModal(
        null,
        this._modalData,
        this._parentElement,
        curHashId,
        currentUser
      );
    }

    if (curHashId === "new-case") {
      renderCreateCaseModal(null, this._modalData, this._parentElement);
    }

    if (actualId) {
      switch (actualId) {
        case actualId.match(/^I.*$/)?.input:
          renderCreateClientModal(this._modalData, this._parentElement);
          break;
        case actualId.match(/^C.*$/)?.input:
          renderCreateCaseModal(this._modalData, this._parentElement);
          break;
        case actualId.match(/^T.*$/)?.input:
          renderCreateTaskModal(this._modalData, this._parentElement);
          break;
      }
    }

    // Event listeners for custom events
    this._parentElement.addEventListener("custom:eventClicked", (e) => {
      renderEventModal(e.detail, this._parentElement, this._modalData);
    });

    this._parentElement.addEventListener("custom:createCaseClicked", (e) => {
      window.location.hash = "new-case";
    });

    this._parentElement.addEventListener("custom:createClientClicked", (e) => {
      window.location.hash = "new-client";
    });

    this._parentElement.addEventListener("custom:createTaskClicked", (e) => {
      window.location.hash = "new-task";
    });

    // Click event listener for closing modals
    this._parentElement.addEventListener("click", (e) => {
      if (e.target.closest(".close-icon")) {
        const modalAsParent = e.target.closest(".modal");
        const modalAsChild = e.target.querySelector(".modal");

        if (
          !modalAsParent ||
          modalAsChild ||
          e.target.closest("div").classList.contains("close-icon")
        ) {
          modalAsParent?.remove();
          modalAsChild?.remove();

          if (id && curHashId === id.match(/^my-client\?.*$/)?.[0]) {
            window.location.hash = "my-clients";
          } else if (
            (id && curHashId === id.match(/^client\?.*$/)?.[0]) ||
            curHashId === "new-client"
          ) {
            window.location.hash = "clients";
          } else if (
            (id && curHashId === id.match(/^case\?.*$/)?.[0]) ||
            curHashId === "new-case"
          ) {
            window.location.hash = "cases";
          } else if (
            (id && curHashId === id.match(/^task\?.*$/)?.[0]) ||
            curHashId === "new-task"
          ) {
            window.location.hash = "tasks";
          } else {
            window.location.hash = curHashId;
          }
        }
      }

      if (e.target.closest(".toast-close-icon")) {
        const toast = e.target.closest(".toast");
        toast?.remove();
      }
    });

    /*---------------- Client Form ----------------------*/

    const clientForm = this._parentElement.querySelector("#client-form");

    // Form Reset Event Listener

    clientForm?.addEventListener("reset", (e) => {});

    // Form Submit event listener
    clientForm?.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(clientForm);
      const formMap = new Map(formData);

      const newName =
        formMap.get("first-name") + " " + formMap.get("last-name");
      const newEmail = formMap.get("email");
      const newPhone = formMap.get("phone");
      const newVisaType = formMap.get("visa-type");
      const newCity = formMap.get("city");
      const newPostalCode = formMap.get("postal-code");
      const newProvince = formMap.get("province");
      const newClientNote = formMap.get("client-note");
      const newConsultant = this._employeeNameToId(
        formMap.get("client-consultant"),
        this._modalData
      );

      if (curHashId === "new-client") {
        const missingFields = [];
        const invalidFields = [];

        const newClientObj = {
          id: `I${101 + this._modalData.clients.length}`,
          name: newName,
          email: newEmail,
          phone: newPhone,
          consultant: newConsultant,
          clientNote: newClientNote,
          visaType: newVisaType,
          city: newCity,
          province: newProvince,
          postalCode: newPostalCode,
          // createdBy:
          createdAt: new Date().toISOString(),
          isLead: true,
        };

        !newName.trim() && missingFields.push("Name");
        !newEmail && missingFields.push("Email Address");
        this._modalData.clients.find((c) => c.name === newName) &&
          invalidFields.push(
            "Name already exists. Please add a numerical prefix"
          );
        !validateEmail(newEmail) && invalidFields.push("Email");
        !newPhone && missingFields.push("Phone");
        !validatePhone(newPhone) && invalidFields.push("Phone Number");
        !newCity && missingFields.push("City");
        !newPostalCode && missingFields.push("Postal Code");
        !validatePostalCode(newPostalCode) && invalidFields.push("Postal Code");

        if (missingFields.length > 0 || invalidFields.length > 0) {
          renderToastModal(missingFields, invalidFields, this._parentElement);
          return;
        }

        handler(newClientObj);
        this.renderSpinner("Creating Client...");
        setTimeout(() => {
          window.location.hash = "clients";
        }, 500);
      } else {
        // Code for Updating Client starts here

        let updatedClientObj = {};

        const updatedValues = [];
        const missingFields = [];
        const invalidFields = [];

        const originalData = this._modalData.clients.filter(
          (cl) => cl.id === actualId
        )[0];

        const {
          name: originalName,
          email: originalEmail,
          phone: originalPhone,
          visaType: originalVisaType,
          city: originalCity,
          postalCode: originalPostalCode,
          province: originalProvince,
          consultant: originalConsultant,
          clientNote: originalClientNote,
        } = originalData;

        originalName === newName || updatedValues.push(newName);
        originalPhone === newPhone || updatedValues.push(newPhone);
        originalEmail === newEmail || updatedValues.push(newEmail);
        originalVisaType === newVisaType || updatedValues.push(newVisaType);
        originalCity === newCity || updatedValues.push(newCity);
        originalPostalCode === newPostalCode ||
          updatedValues.push(newPostalCode);
        originalProvince === newProvince || updatedValues.push(newProvince);
        originalConsultant === newConsultant ||
          updatedValues.push(newConsultant);
        originalClientNote === newClientNote ||
          updatedValues.push(newClientNote);

        if (updatedValues.length === 0) return;

        updatedClientObj = {
          ...originalData,
          name: newName,
          email: newEmail,
          phone: newPhone,
          visaType: newVisaType,
          city: newCity,
          postalCode: newPostalCode,
          province: newProvince,
          consultant: newConsultant,
          clientNote: newClientNote,
          // lastUpdatedBy: this.getCurrentLoggedInId(),
          lastUpdatedAt: new Date().toISOString(),
        };

        !newName.trim() && missingFields.push("Name");
        !newEmail && missingFields.push("Email Address");
        !validateEmail(newEmail) && invalidFields.push("Email");
        !newPhone && missingFields.push("Phone");
        !validatePhone(newPhone) && invalidFields.push("Phone Number");
        !newCity && missingFields.push("City");
        !newPostalCode && missingFields.push("Postal Code");
        !validatePostalCode(newPostalCode) && invalidFields.push("Postal Code");

        if (missingFields.length > 0 || invalidFields.length > 0) {
          renderToastModal(missingFields, invalidFields, this._parentElement);
          return;
        }

        handler(updatedClientObj);
        this.renderSpinner("Updating Client...");
        setTimeout(() => {
          if (curHashId.startsWith("my-client")) {
            window.location.hash = "my-clients";
          } else window.location.hash = "clients";
        }, 500);
      }
    });

    /*---------------- Task Form ----------------------*/

    const taskForm = this._parentElement.querySelector("#task-form");

    const appointmentCheckbox = taskForm?.querySelector(
      "input[name=appointment-check]"
    );

    appointmentCheckbox?.addEventListener("change", (e) => {
      const checked = e.target.checked;
      const appointmentDetails = taskForm.querySelector("#appointment-details");

      const html = `<div class="form-row">
          <label for="client" class="form-label"><strong>Client</strong> </label>
          <input type="text" class="form-input" id="client" name="client"  placeholder="Search Name" autocomplete="off" list="clients" name="client">
                  <datalist id="clients">
                  ${this._modalData.clients
                    .map((cl) => `<option value="${cl.name}">`)
                    .join("")}
                  </datalist>


          <label for="appointment-date" class="form-label">Appointment Date  </label>
          <input type="date" id="appointment-date" class="form-input" name="appointment-date"  min="${""}" max="2030-12-31" value="">
          <label for="appointment-start-time" class="form-label">Start Time:</label>
          <input type="time" id="appointment-start-time" class="form-input" name="appointment-start-time" min="" />
          <label for="appointment-end-time" class="form-label">End Time:</label>
          <input type="time" id="appointment-end-time" class="form-input" name="appointment-end-time" min="" />           
          <label for="agenda" class="form-label">Agenda</label>
          <textarea id="agenda" name="agenda" class="form-input" rows="4"></textarea>
          
      </div>`;

      if (checked) {
        appointmentDetails.innerHTML = html;
      } else if (!checked && appointmentDetails) {
        appointmentDetails.innerHTML = "";
      }
    });

    // Form Reset Event Listener
    taskForm?.addEventListener("reset", (e) => {});

    // Form Submit event listener

    taskForm?.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(taskForm);
      const formMap = new Map(formData);

      const taskCompletionNotes = formMap.get("completion-note");
      const assignedTo = this._employeeNameToId(
        formMap.get("assign-to"),
        this._modalData
      );
      const requestedBy = currentUser.employeeId;
      const description = formMap.get("objective");
      const due = formMap.get("due-date");
      const isAppointment = formMap.get("appointment-check") === "on";
      const clientId = this._clientNameToId(formMap.get("client"));
      const appointmentDate = formMap.get("appointment-date");
      const appointmentStartTime = formMap.get("appointment-start-time");
      const appointmentEndTime = formMap.get("appointment-end-time");
      const appointmentAgenda = formMap.get("agenda");

      if (curHashId === "new-task") {
        const missingFields = [];

        const newTaskObj = {
          id: `T${100 + this._modalData.tasks.length}`,
          assignedTo,
          requestedBy,
          description,
          due,
          createdAt: new Date().toISOString(),
          //created by
          completed: false,
          deleted: false,
          hidden: false,
          notes: taskCompletionNotes,
          isAppointment,
          clientId,
          appointmentDate,
          appointmentStartTime,
          appointmentEndTime,
          appointmentAgenda,
        };

        !newTaskObj.description.trim() && missingFields.push("Task Objective");
        !isAppointment && !newTaskObj.due && missingFields.push("Due Date");
        isAppointment && !clientId && missingFields.push("Client Name");
        isAppointment &&
          !appointmentDate &&
          missingFields.push("Appointment Date");
        isAppointment &&
          !appointmentStartTime &&
          missingFields.push("Appointment Start Time");
        isAppointment &&
          !appointmentEndTime &&
          missingFields.push("Appointment End Time");

        if (missingFields?.length > 0) {
          renderToastModal(missingFields, null, this._parentElement);
          return;
        }

        handler(newTaskObj);
        this.renderSpinner("Creating Task...");
        setTimeout(() => {
          window.location.hash = "tasks";
        }, 500);
      } else {
        // Code for Updating Task starts here

        const missingFields = [];

        const curTask = this._modalData.tasks.filter(
          (t) => t.id === actualId
        )[0];

        if (curTask.completed) return;

        let updatedTaskObj = {
          ...curTask,
          completed: true,
          notes: taskCompletionNotes,
          completedAt: new Date().toISOString(),
        };

        !taskCompletionNotes.trim() && missingFields.push("Completion Notes");

        if (missingFields.length > 0) {
          renderToastModal(missingFields, null, this._parentElement);
          return;
        }

        controlUpdateTask(curHashId.slice(1), updatedTaskObj);
        this.renderSpinner("Updating Task...");
        setTimeout(() => {
          window.location.hash = "tasks";
        }, 500);
      }
    });

    /*---------------- Case Form ----------------------*/

    const caseForm = this._parentElement.querySelector("#case-form");
    const caseFormInputElements = caseForm?.querySelectorAll("input");
    const caseFormLabelElements = caseForm?.querySelectorAll("label");
    let emailAddressLabel;
    let phoneNumberLabel;
    let visaTypeLabel;

    caseFormLabelElements?.forEach((el, index, arr) => {
      if (!el.getAttribute("name")) return;
      el.getAttribute("name") === "email-address-label" &&
        (emailAddressLabel = el);
      el.getAttribute("name") === "phone-number-label" &&
        (phoneNumberLabel = el);
      el.getAttribute("name") === "visa-type-label" && (visaTypeLabel = el);
    });

    caseFormInputElements?.forEach((input) => {
      input.addEventListener("focusout", (e) => {
        if (!e.target.getAttribute("name")) return;
        const formData = new FormData(caseForm);
        const client = this._modalData.clients.filter(
          (c) => c.name === formData.get("client")
        )[0];
        emailAddressLabel.textContent = client.email;
        phoneNumberLabel.textContent = client.phone;
        visaTypeLabel.textContent = client.visaType;
      });
    });

    // Form Reset Event Listener
    caseForm?.addEventListener("reset", (e) => {});

    // Form Submit event listener
    caseForm?.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(caseForm);
      const formMap = new Map(formData);

      const newClient = this._clientNameToId(
        formMap.get("client"),
        this._modalData
      );
      const newCaseType = formMap.get("case-type");
      const newCaseStatus = formMap.get("case-status");
      const newCaseDescription = formMap.get("case-description");
      const newCaseConsultant = this._employeeNameToId(
        formMap.get("case-consultant")
      );
      const newCaseNote = formMap.get("case-note");

      if (curHashId === "new-case") {
        const missingFields = [];

        const newCaseObj = {
          caseId: `C${10000 + this._modalData.cases.length}`,
          caseType: newCaseType,
          caseStatus: newCaseStatus,
          caseDescription: newCaseDescription,
          assignedTo: newCaseConsultant,
          clientId: newClient,
          notes: [
            {
              note: newCaseNote,
              // Will change WrittenBy Later
              writtenBy: "E202",
              writtenAt: new Date().toISOString(),
            },
          ],
          // createdBy:
          createdAt: new Date().toISOString(),
        };

        !newCaseDescription.trim() && missingFields.push("Case Description");
        !newClient && missingFields.push("Client Name");
        !newCaseNote.trim() && missingFields.push("Notes");

        if (missingFields.length > 0) {
          renderToastModal(missingFields, null, this._parentElement);
          return;
        }

        handler(newCaseObj);
        this.renderSpinner("Creating Case...");
        setTimeout(() => {
          window.location.hash = "cases";
        }, 500);
      } else {
        // Code for Updating Case starts here

        let updatedCaseObj = {};

        const updatedValues = [];

        const originalData = this._modalData.cases.filter(
          (c) => c.caseId === actualId
        )[0];

        const {
          caseType: originalCaseType,
          caseStatus: originalCaseStatus,
          caseDescription: originalCaseDescription,
          assignedTo: originalCaseConsultant,
          notes: originalLatestCaseNote,
        } = originalData;

        originalCaseType === newCaseType || updatedValues.push(newCaseType);
        originalCaseStatus === newCaseStatus ||
          updatedValues.push(newCaseStatus);
        originalCaseDescription.trim() === newCaseDescription ||
          updatedValues.push(newCaseDescription);
        originalCaseConsultant === newCaseConsultant ||
          updatedValues.push(newCaseConsultant);
        originalLatestCaseNote[
          originalLatestCaseNote.length - 1
        ].note.trim() === newCaseNote || updatedValues.push(newCaseNote);

        if (updatedValues.length === 0) return;

        updatedCaseObj = {
          ...originalData,
          caseType: newCaseType,
          caseStatus: newCaseStatus,
          caseDescription: newCaseDescription,
          assignedTo: newCaseConsultant,
          notes: [
            ...originalData.notes,
            {
              note: newCaseNote,
              writtenBy: "E202",
              writtenAt: new Date().toISOString(),
            },
          ],
          // lastUpdatedBy: this.getCurrentLoggedInId(),
          lastUpdatedAt: new Date().toISOString(),
        };
        handler(updatedCaseObj);
        this.renderSpinner("Updating Client...");
        setTimeout(() => {
          window.location.hash = "cases";
        }, 500);
      }
    });
  }
}

export default new RenderModal();
