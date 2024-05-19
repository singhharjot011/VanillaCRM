import { API_URL, NEWS_API_KEY } from "../utils/config.js";

export const state = {
  clients: {},
  employees: {},
  tasks: {},
  users: {},
  events: {},
};

/**
 *
 * @param {string} typeOfData The type of data to load (e.g., 'clients', 'employees', 'tasks', 'users').
 * @returns {Promise<object>} A promise that resolves to the loaded data object.
 * @throws {Error} If there is an error loading the data.
 */

export const loadData = async function (typeOfData) {
  try {
    // This code is temporary only to maintain state until backend is implemented
    if (state.clients.length >= 1)
      return (typeOfData && state.typeOfData) || state;

    const res = await fetch(`${API_URL}`);
    const data = await res.json();

    const { clients } = data[0];
    const { employees } = data[1];
    const { cases } = data[2];
    const { tasks } = data[3];
    const { users } = data[4];
    const { events } = data[5];

    state.clients = clients;
    state.employees = employees;
    state.cases = cases;
    state.tasks = tasks;
    state.users = users;
    state.events = events;
    return (typeOfData && state.typeOfData) || state;
  } catch (err) {
    console.error(`${err}💣💣💣💣`);
    throw err;
  }
};

export const handleClientObject = function (clientObj) {
  const index = state.clients.findIndex((c) => c.id === clientObj.id);
  // if index !== -1 which means it exists, client will be updated
  if (index !== -1) {
    state.clients[index] = clientObj;
  } else {
    // if index === -1 which means it doesn't exist, client will be added
    state.clients.push(clientObj);
  }
};

export const handleTaskObject = function (taskObj) {
  const index = state.tasks.findIndex((t) => t.id === taskObj.id);

  let eventObj;

  if (taskObj.isAppointment) {
    eventObj = {
      id: `A` + (101 + state.events.length),
      title: taskObj.description,
      start: taskObj.appointmentDate + " " + taskObj.appointmentStartTime,
      end: taskObj.appointmentDate + " " + taskObj.appointmentEndTime,
      completed: false,
      assignedTo: taskObj.assignedTo,
      completedAt: "",
      taskId: taskObj.id,
      classNames: ["appointment"],
      clientId: taskObj.clientId,
    };
  } else {
    eventObj = {
      id: `A` + (101 + state.events.length),
      title: taskObj.description,
      start: taskObj.due,
      taskId: taskObj.id,
      completed: false,
      assignedTo: taskObj.assignedTo,
      completedAt: "",
      classNames: ["alerts"],
    };
  }

  // if index !== -1 which means it exists, client will be updated
  if (index !== -1) {
    state.tasks[index] = taskObj;
  } else {
    // if index === -1 which means it doesn't exist, client will be added
    state.tasks.push(taskObj);
    eventObj && state.events.push(eventObj);
  }
};

export const handleCaseObject = function (caseObj) {
  const index = state.cases.findIndex((c) => c.caseId === caseObj.caseId);
  // if index !== -1 which means it exists, client will be updated
  if (index !== -1) {
    state.cases[index] = caseObj;
  } else {
    // if index === -1 which means it doesn't exist, client will be added
    const client = state.clients.find((c) => c.id === caseObj.clientId);
    console.log(client)
    client && handleClientObject({ ...client, isLead: false });
    state.cases.push(caseObj);
  }
};

export const getNews = async function () {
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?country=ca&apiKey=${NEWS_API_KEY}`
  );

  const data = await res.json();
  return data;
};
