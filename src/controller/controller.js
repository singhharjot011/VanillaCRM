import * as model from "../model/model.js";
import renderCalendar from "../view/renderCalendar.js";
import renderCases from "../view/renderCases.js";
import renderClients from "../view/renderClients.js";
import renderDashboard from "../view/renderDashboard.js";
import renderHeader from "../view/renderHeader.js";
import renderKnowledgeBase from "../view/renderKnowledgeBase.js";
import renderMenu from "../view/renderMenu.js";
import renderModal from "../view/renderModal.js";
import renderMyClients from "../view/renderMyClients.js";
import renderPageNotFound from "../view/renderPageNotFound.js";
import renderTasks from "../view/renderTasks.js";
import renderSignup from "../view/renderSignup.js";
import renderSignin from "../view/renderSignin.js";

const renderData = async function (typeOfData) {
  try {
    const hash = window.location.hash.slice(1);
    const id = !hash ? (window.location.hash = "dashboard") : hash;
    typeOfData = id;
    renderCalendar.renderSpinner();

    let data;
    let clientsData;
    let myClientsData;
    let usersData;
    let curClientData;
    let casesData;
    let tasksData;
    let curCaseData;

    switch (id) {
      case "signup":
        renderSignup.render();
        break;
      case "signin":
        renderSignin.render();
        break;
      case "calendar":
        const eventData = await model.loadData("events");
        data = await model.loadData();
        renderCalendar.render(eventData);
        renderModal.addHandlerModal(
          eventData,
          id,
          controlHandleEvent,
          null,
          data
        );
        break;
      case "dashboard":
        const newsData = await model.getNews();
        data = await model.loadData();
        renderDashboard.addHandlerRender(controlGetLastDaysData);
        renderDashboard.render(data, null, newsData);
        break;
      case "clients":
        clientsData = await model.loadData("clients");
        renderClients.render(clientsData);
        break;
      case "my-clients":
        myClientsData = await model.loadData("clients");
        renderMyClients.render(myClientsData);
        break;
      case "tasks":
        tasksData = await model.loadData("tasks");
        renderTasks.render(tasksData);
        break;
      case "cases":
        casesData = await model.loadData("cases");
        renderCases.render(casesData);
        break;
      case "knowledge-base":
        renderKnowledgeBase.render(data);
        break;
      case id.match(/^client\?.*$/)?.input:
        usersData = await model.loadData("users");
        curClientData = await model.getCurClient(id);
        clientsData = await model.loadData("clients");
        renderModal.addHandlerModal(
          id,
          usersData,
          clientsData,
          curClientData,
          controlHandleClient
        );
        break;
      case "new-client":
        usersData = await model.loadData("users");
        clientsData = await model.loadData("clients");
        renderModal.addHandlerModal(
          id,
          usersData,
          clientsData,
          null,
          controlHandleClient
        );
        break;
      case id.match(/^my-client\?.*$/)?.input:
        const myClientData = await model.getCurClient(id);
        data = await model.loadData();
        renderModal.addHandlerModal(
          myClientData,
          id,
          controlHandleClient,
          null,
          data
        );
        break;
      case "new-case":
        usersData = await model.loadData("users");
        clientsData = await model.loadData("clients");
        renderModal.addHandlerModal(
          id,
          usersData,
          clientsData,
          null,
          controlHandleCase
        );
        break;
      case id.match(/^case\?.*$/)?.input:
        curCaseData = await model.getCurCase(id);
        usersData = await model.loadData("users");
        clientsData = await model.loadData("clients");
        renderModal.addHandlerModal(
          id,
          usersData,
          clientsData,
          curCaseData,
          controlHandleCase,
        );
        break;
      case id.match(/^task\?.*$/)?.input:
        const taskData = await model.getCurTask(id);
        data = await model.loadData();
        renderModal.addHandlerModal(
          taskData,
          id,
          controlHandleTask,
          null,
          data,
          null,
          controlHandleEvent
        );
        break;
      case "new-task":
        usersData = await model.loadData("users");
        clientsData = await model.loadData("clients");
        renderModal.addHandlerModal(
          id,
          usersData,
          clientsData,
          null,
          controlHandleTask
        );
        break;
      default:
        renderPageNotFound.render(null, null, null);
    }
  } catch (err) {
    console.error(err.message);
  }
};

const controlHandleClient = function (clientObj, isUpdating) {
  model.handleClientObject(clientObj, isUpdating);
};

const controlHandleCase = function (caseObj, isUpdating) {
  model.handleCaseObject(caseObj, isUpdating);
};

const controlHandleTask = function (taskObj, isUpdating) {
  model.handleTaskObject(taskObj, isUpdating);
};

const controlHandleEvent = function (eventObj, isUpdating) {
  model.handleEventObject(eventObj, isUpdating);
};

const controlGetLastDaysData = async function (days) {
  return await model.loadDashboardData(days);
};

const init = function () {
  renderCalendar.addHandlerRender(renderData);
  renderMenu.addHandlerMenu();
};

init();
