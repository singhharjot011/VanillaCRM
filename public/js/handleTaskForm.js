import { showAlert } from "./alerts.js";
import { showToast } from "./handleToast.js";

export const handleTaskForm = (taskForm) => {
  const toast = document.querySelector(".toast");
  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(taskForm);
    const formMap = new Map(formData);

    const isAppointment = formMap.get("appointment-check") === "on";

    const newTaskObj = {
      assignedToName: formMap.get("assign-to"),
      requestedByName: formMap.get("requested-by"),
      description: formMap.get("objective"),
      createdAt: Date.now(),
      isAppointment,
      ...(isAppointment
        ? {
            clientName: formMap.get("client"),
            appointmentDate: formMap.get("appointment-date"),
            appointmentStartTime: formMap.get("appointment-start-time"),
            appointmentEndTime: formMap.get("appointment-end-time"),
            appointmentAgenda: formMap.get("agenda"),
          }
        : {
            due: formMap.get("due-date"),
          }),
    };

    const missingFields = [];

    // Validate common fields
    !newTaskObj.description.trim() && missingFields.push("Task Objective");

    // Validate based on task type (appointment or simple task)
    if (newTaskObj.isAppointment) {
      !newTaskObj.clientName && missingFields.push("Client Name");
      !newTaskObj.appointmentDate && missingFields.push("Appointment Date");
      !newTaskObj.appointmentStartTime &&
        missingFields.push("Appointment Start Time");
      !newTaskObj.appointmentEndTime &&
        missingFields.push("Appointment End Time");
      !newTaskObj.appointmentAgenda && missingFields.push("Appointment Agenda");
    }

    if (missingFields.length > 0) {
      toast.classList.remove("sr-only");
      showToast(toast, missingFields);
      return;
    }

    const urlPath = window.location.href.split("/").at(-1);

    if (urlPath === "add-task") {
      document.querySelector("#task-submit-button").textContent = "Creating...";

      try {
        const response = await fetch("/api/v1/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTaskObj),
        });

        if (!response.ok) {
          showAlert("error", "Failed to create task");
          throw new Error("Failed to create task");
        }
        const result = await response.json();

        showAlert("success", "Task Created Successfully");

        document.querySelector("#task-submit-button").textContent =
          "Create Task";

        window.location.assign("/tasks");
      } catch (error) {
        console.error("Error creating task:", error);
        document.querySelector("#task-submit-button").textContent =
          "Create Task";
      }
    } else {
      const updatedTaskObj = {
        taskCompletionNotes: formMap.get("completion-note"),
      };

      if (!updatedTaskObj.taskCompletionNotes) {
        missingFields.push("Completion Notes");
      }

      if (missingFields.length > 0) {
        toast.classList.remove("sr-only");
        showToast(toast, missingFields);
        return;
      }

      document.querySelector("#task-submit-button").textContent = "Updating...";

      const response = await fetch(`/api/v1/tasks/${window.taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTaskObj),
      });

      if (!response.ok) {
        showAlert("error", "Failed to update task");
        throw new Error("Failed to update task");
      }

      const result = await response.json();

      showAlert("success", "Task Completed");

      document.querySelector("#task-submit-button").textContent = "Update Task";

      window.location.assign("/tasks");
    }
  });
};
