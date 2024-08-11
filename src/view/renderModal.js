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
  _completeData;

  constructor() {
    super();
  }

  _employeeIdToName(empId, data) {
    const empName = data?.employees?.find((e) => e.employeeId === empId).name;
    return empName;
  }

  _employeeNameToId(empName, data) {
    const empId = data?.employees?.find((e) => e.name === empName).employeeId;
    return empId;
  }

  addHandlerModal(
    data,
    id,
    handler,
    currentUser,
    completeData,
    controlUpdateTask,
    secondHandler
  ) {
    this._modalData = data;
    this._completeData = completeData;
    let curHashId = window.location.hash.slice(1);
    let actualId = id?.split("?")[1];

    window.addEventListener("hashchange", () => {
      curHashId = window.location.hash.slice(1);
    });

    if (curHashId === "new-client") {
      renderCreateClientModal(this._modalData, this._parentElement);
    }

    if (curHashId === "new-task") {
      renderCreateTaskModal(this._modalData, this._parentElement);
    }

    if (curHashId === "new-case") {
      renderCreateCaseModal(this._modalData, this._parentElement);
    }
    if (actualId) {
      switch (actualId) {
        case actualId.match(/^I.*$/)?.input:
          renderCreateClientModal(
            this._modalData,
            this._parentElement,
            this._completeData
          );
          break;
        case actualId.match(/^C.*$/)?.input:
          renderCreateCaseModal(
            this._modalData,
            this._parentElement,
            this._completeData
          );
          break;
        case actualId.match(/^T.*$/)?.input:
          renderCreateTaskModal(
            this._modalData,
            this._parentElement,
            this._completeData
          );
          break;
      }
    }

    // Event listeners for custom events
    this._parentElement.addEventListener("custom:eventClicked", (e) => {
      renderEventModal(
        this._modalData,
        e.detail,
        this._parentElement,
        this._completeData
      );
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
      const newClientNote = formMap.get("client-note").trim();
      const newConsultant = this._employeeNameToId(
        formMap.get("client-consultant"),
        this._completeData || this._modalData
      );

      if (curHashId === "new-client") {
        const missingFields = [];
        const invalidFields = [];

        const numberOfClients = this._modalData.clients.length;
        const newClientObj = {
          id: `I${101 + numberOfClients}`,
          name: newName,
          email: newEmail,
          phone: newPhone,
          consultant: newConsultant,
          clientNote: newClientNote,
          visaType: newVisaType,
          city: newCity,
          province: newProvince,
          postalCode: newPostalCode,
          createdBy: "E202",
          createdAt: new Date().toISOString(),
          isLead: true,
        };

        !newName.trim() && missingFields.push("Name");
        !newEmail && missingFields.push("Email Address");
        this._modalData.clients.find(
          (c) => c.name.toLowerCase() === newName.toLowerCase()
        ) &&
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

        const originalData = this._modalData;

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
        originalPhone == newPhone || updatedValues.push(newPhone);
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
          lastUpdatedBy: "E202",
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

        this._completeData.clients
          .filter((c) => c.id !== updatedClientObj.id)
          .find((c) => c.name.toLowerCase() === newName.toLowerCase()) &&
          invalidFields.push(
            "Name already exists. Please add a numerical prefix"
          );

        if (missingFields.length > 0 || invalidFields.length > 0) {
          renderToastModal(missingFields, invalidFields, this._parentElement);
          return;
        }

        handler(updatedClientObj, true);
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

    const dueDateBox = taskForm?.querySelector("#due-date-box");

    appointmentCheckbox?.addEventListener("change", (e) => {
      const checked = e.target.checked;
      const appointmentDetails = taskForm.querySelector("#appointment-details");
      dueDateBox.classList.add("sr-only");

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
        dueDateBox.classList.remove("sr-only");
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
      const assignedTo =
        formMap.get("assign-to") &&
        this._employeeNameToId(
          formMap.get("assign-to"),
          this._completeData || this._modalData
        );
      const requestedBy =
        formMap.get("requested-by") &&
        this._employeeNameToId(
          formMap.get("requested-by"),
          this._completeData || this._modalData
        );
      const description = formMap.get("objective");
      const due = formMap.get("due-date");
      const isAppointment = formMap.get("appointment-check") === "on";
      const clientId = this._clientNameToId(
        formMap.get("client"),
        this._completeData || this._modalData
      );
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
          taskCompletionNotes,
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

        // Event Object

        const isAppt = newTaskObj.isAppointment;
        const apptDate = newTaskObj.appointmentDate; // e.g., "2024-07-31"
        const apptStartTime = newTaskObj.appointmentStartTime; // e.g., "14:30:00"
        const dueDate = newTaskObj.due || new Date().toISOString(); // Default to current date if undefined

        const start = isAppt
          ? new Date(`${apptDate}T${apptStartTime}`).toISOString()
          : new Date(dueDate).toISOString();

        const newEventObj = {
          id: `A${100 + this._modalData.tasks.length}`,
          clientId: newTaskObj.isAppointment ? newTaskObj.clientId : "",
          title: newTaskObj.description || "Untitled Task",
          start: start,
          end: isAppointment
            ? new Date(
                `${appointmentDate}T${newTaskObj.appointmentEndTime}`
              ).toISOString()
            : new Date(dueDate).toISOString(),
          assignedTo: newTaskObj.assignedTo,
          requestedBy: newTaskObj.requestedBy,
          taskId: newTaskObj.id,
          classNames: isAppointment ? ["appointment"] : ["alerts"],
        };

        handler(newTaskObj, false);
        secondHandler(newEventObj);
        this.renderSpinner("Creating Task...");
        setTimeout(() => {
          window.location.hash = "tasks";
        }, 500);
      } else {
        // Code for Updating Task starts here

        const missingFields = [];

        const curTask = this._modalData;

        let updatedTaskObj = {
          ...curTask,
          completed: true,
          taskCompletionNotes,
          completedAt: new Date().toISOString(),
        };

        !taskCompletionNotes.trim() && missingFields.push("Completion Notes");

        if (missingFields.length > 0) {
          renderToastModal(missingFields, null, this._parentElement);
          return;
        }

        const curEvent = this._completeData.events.find(
          (ev) => ev.taskId === curTask.id
        );

        let updatedEventObj = {
          ...curEvent,
          completed: updatedTaskObj.completed,
          classNames: ["completed"],
        };

        handler(updatedTaskObj, true);
        secondHandler(updatedEventObj, true);
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
        const client =
          this._modalData.clients.filter(
            (c) => c.name === formData.get("client")
          )[0] || {};
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

      // const newClient = this._clientNameToId(
      //   formMap.get("client"),
      //   this._modalData
      // );
      const newCaseType = formMap.get("case-type");
      const newCaseStatus = formMap.get("case-status");
      const newCaseDescription = formMap.get("case-description");
      const newCaseConsultant = this._employeeNameToId(
        formMap.get("case-consultant"),
        this._completeData || this._modalData
      );
      const newCaseNote = formMap.get("case-note");
      const newClient = this._clientNameToId(
        formMap.get("client"),
        this._completeData || this._modalData
      );

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

        const curClient = this._modalData.clients.find(
          (c) => c.id === newClient
        );
        // Converting lead to client

        if (missingFields.length > 0) {
          renderToastModal(missingFields, null, this._parentElement);
          return;
        }

        handler(newCaseObj);
        secondHandler({ ...curClient, isLead: false }, true);
        this.renderSpinner("Creating Case...");
        setTimeout(() => {
          window.location.hash = "cases";
        }, 500);
      } else {
        // Code for Updating Case starts here

        let isNoteUpdated = false;
        let updatedCaseObj = {};

        const updatedValues = [];

        const originalData = this._modalData;

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
        ].note.trim() === newCaseNote ||
          newCaseNote.trim() === "" ||
          (updatedValues.push(newCaseNote) && (isNoteUpdated = true));

        if (updatedValues.length === 0) return;

        updatedCaseObj = {
          ...originalData,
          caseType: newCaseType,
          caseStatus: newCaseStatus,
          caseDescription: newCaseDescription,
          assignedTo: newCaseConsultant,
          notes: isNoteUpdated
            ? [
                ...originalData.notes,
                {
                  note: newCaseNote,
                  writtenBy: "E202",
                  writtenAt: new Date().toISOString(),
                },
              ]
            : originalData.notes,
          // lastUpdatedBy: this.getCurrentLoggedInId(),
          lastUpdatedAt: new Date().toISOString(),
        };

        handler(updatedCaseObj, true);
        this.renderSpinner("Updating Case...");
        setTimeout(() => {
          window.location.hash = "cases";
        }, 500);
      }
    });
  }
}

export default new RenderModal();
