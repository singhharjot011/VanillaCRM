import { API_URL, NEWS_API_KEY } from "../utils/config.js";

export const state = {
  clients: {},
  users: {},
  cases: {},
  tasks: {},
  events: {},
};

/**
 *
 * @param {string} typeOfData The type of data to load (e.g., 'clients', 'users', 'tasks', 'users').
 * @returns {Promise<object>} A promise that resolves to the loaded data object.
 * @throws {Error} If there is an error loading the data.
 */

export const loadData = async function (typeOfData) {
  try {
    const endpoints = {
      clients: "clients",
      users: "users",
      cases: "cases",
      tasks: "tasks",
      events: "events",
    };

    if (typeOfData && endpoints[typeOfData]) {
      const response = await fetch(`${API_URL}/${endpoints[typeOfData]}`);
      const data = await response.json();
      state[typeOfData] = data?.data[typeOfData];

      return data?.data;
    } else {
      // Fetch all data if typeOfData is not provided or is invalid
      const fetchPromises = Object.values(endpoints).map((endpoint) =>
        fetch(`${API_URL}/${endpoint}`)
      );

      const responses = await Promise.all(fetchPromises);
      const data = await Promise.all(responses.map((res) => res.json()));


      const [clientsData, usersData, casesData, tasksData, eventsData] = data;

      state.clients = clientsData?.data;
      state.users = usersData?.data;
      state.cases = casesData?.data;
      state.tasks = tasksData?.data;
      state.events = eventsData?.data;

      return state;
    }
  } catch (err) {
    console.error(`${err}💣💣💣💣`);
    throw err;
  }
};

export const loadDashboardData = async (days = 7) => {
  try {
    const casesResponse = await fetch(`${API_URL}/cases/data/${days}`);
    const clientsResponse = await fetch(`${API_URL}/clients/data/${days}`);

    // Parse JSON response
    const casesData = await casesResponse.json();
    const clientsData = await clientsResponse.json();

    // Combine the data as needed
    const combinedData = {
      cases: casesData.data,
      clients: clientsData.data,
    };
    return combinedData;
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
};

export const handleClientObject = async function (
  clientObj,
  isUpdating = false
) {
  try {
    // Client exists, so update it
    if (isUpdating) {
      const result = await fetch(`${API_URL}/clients/${clientObj._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientObj),
      });
      return result;
    } else {
      const result = await fetch(`${API_URL}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientObj),
      });
      return result;
    }
  } catch (err) {
    console.error("Error handling client object:", err.message);
  }
};

export const handleCaseObject = async function (caseObj, isUpdating = false) {
  try {
    // Case exists, so update it
    if (isUpdating) {
      const result = await fetch(`${API_URL}/cases/${caseObj._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(caseObj),
      });
      return result;
    } else {
      const result = await fetch(`${API_URL}/cases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(caseObj),
      });
      return result;
    }
  } catch (err) {
    console.error("Error handling client object:", err.message);
  }

  // Patching client to isLead field is pending
};

export const handleTaskObject = async function (taskObj, isUpdating = false) {
  console.log(taskObj);
  try {
    if (isUpdating) {
      const result = await fetch(`${API_URL}/tasks/${taskObj._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskObj),
      });
      return result;
    } else {
      const result = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskObj),
      });
      return result;
    }
  } catch (err) {
    console.error("Error handling task object:", err.message);
    throw err;
  }
};

export const handleEventObject = async function (eventObj, isUpdating) {
  try {
    if (isUpdating) {
      const result = await fetch(`${API_URL}/events/${eventObj._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventObj),
      });
      return result;
    } else {
      const result = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventObj),
      });
      return result;
    }
  } catch (err) {
    console.error("Error handling task object:", err.message);
    throw err;
  }
};

export const getCurTask = async function (id) {
  const res = await fetch(`${API_URL}/tasks/${id.split("?")[1].slice(1)}`);
  const data = await res.json();
  const curTask = data.data.doc;
  return curTask;
};

export const getCurClient = async function (id) {
  const res = await fetch(`${API_URL}/clients/${id.split("?")[1].slice(1)}`);
  const data = await res.json();
  const curClient = data.data.doc;
  return curClient;
};

export const getCurCase = async function (id) {
  const res = await fetch(`${API_URL}/cases/${id.split("?")[1].slice(1)}`);
  const data = await res.json();
  const curCase = data.data.doc;
  return curCase;
};

export const updateCurTask = async function (id, updatedTaskData) {
  try {
    const response = await fetch(`${API_URL}/tasks/${id.slice(1)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTaskData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Error updating task:", err.message);
    throw err;
  }
};

export const getNews = async function () {
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?country=ca&apiKey=${NEWS_API_KEY}`
  );

  const data = await res.json();
  return data;
};
