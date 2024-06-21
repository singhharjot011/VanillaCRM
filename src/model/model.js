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

    // const { clients } = data[0];

    const clientRes = await fetch(`${API_URL}/clients`);
    const clientsArr = await clientRes.json();
    const { clients } = clientsArr.data;

    const employeesRes = await fetch(`${API_URL}/employees`);
    const employeesArr = await employeesRes.json();
    const { employees } = employeesArr.data;

    const casesRes = await fetch(`${API_URL}/cases`);
    const casesArr = await casesRes.json();
    const { cases } = casesArr.data;

    const tasksRes = await fetch(`${API_URL}/tasks`);
    const tasksArr = await tasksRes.json();
    const { tasks } = tasksArr.data;

    // const usersRes = await fetch(`${API_URL}/users`);
    // const usersArr = await usersRes.json();
    // const { users } = usersArr.data;

    const eventsRes = await fetch(`${API_URL}/events`);
    const eventsArr = await eventsRes.json();
    const { events } = eventsArr.data;

    state.clients = clients;
    state.employees = employees;
    state.cases = cases;
    state.tasks = tasks;
    // state.users = users;
    state.events = events;
    return (typeOfData && state.typeOfData) || state;
  } catch (err) {
    console.error(`${err}💣💣💣💣`);
    throw err;
  }
};

export const handleClientObject = async function (clientObj) {
  try {
    // Client exists, so update it
    const result = await fetch(`${API_URL}/clients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientObj),
    });
    return result;
  } catch (err) {
    console.error("Error handling client object:", err.message);
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

export const handleCaseObject = async function (caseObj) {
  try {
    // case exists, so update it
    const result = await fetch(`${API_URL}/cases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(caseObj),
    });
    return result;
  } catch (err) {
    console.error("Error handling case object:", err.message);
  }
};

// export const getNews = async function () {
//   const res = await fetch(
//     `https://newsapi.org/v2/top-headlines?country=ca&apiKey=${NEWS_API_KEY}`
//   );

//   const data = await res.json();
//   return data;
// };
