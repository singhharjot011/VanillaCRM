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

const renderData = async function (typeOfData) {
  try {
    const hash = window.location.hash.slice(1);
    const id = !hash ? (window.location.hash = "dashboard") : hash;
    typeOfData = id;
    renderCalendar.renderSpinner();

    let data;

    switch (id) {
      case "calendar":
        data = await model.loadData("events");
        renderCalendar.render(data);
        break;
      case "dashboard":
        const newsData = await model.getNews();
        data = await model.loadData();
        renderDashboard.addHandlerRender(controlGetLastDaysData);
        renderDashboard.render(data, null, newsData);
        break;
      case "clients":
        data = await model.loadData(typeOfData);
        renderClients.render(data);
        break;
      case "my-clients":
        data = await model.loadData("clients");
        renderMyClients.render(data);
        break;
      case "tasks":
        data = await model.loadData(typeOfData);
        renderTasks.render(data);
        break;
      case "cases":
        data = await model.loadData(typeOfData);
        renderCases.render(data);
        break;
      case "knowledge-base":
        renderKnowledgeBase.render(data);
        break;
      case id.match(/^client\?.*$/)?.input:
        const clientData = await model.getCurClient(id);
        renderModal.addHandlerModal(clientData, id);
        break;
      case "new-client":
        renderModal.addHandlerModal(data, id, controlHandleClient);
        break;
      case id.match(/^my-client\?.*$/)?.input:
        const myClientData = await model.getCurClient(id);
        renderModal.addHandlerModal(myClientData, id);
        break;
      case "new-case":
        renderModal.addHandlerModal(data, id, controlHandleCase);
        break;
      case id.match(/^case\?.*$/)?.input:
        const caseData = await model.getCurCase(id);
        renderModal.addHandlerModal(caseData, id);
        break;
      case id.match(/^task\?.*$/)?.input:
        const taskData = await model.getCurTask(id);
        renderModal.addHandlerModal(taskData, id);
        break;
      case "new-task":
        renderModal.addHandlerModal(data, id, controlHandleTask, currentUser);
        break;
      default:
        renderPageNotFound.render(null, null, null);
    }
  } catch (err) {
    console.error(err.message);
  }
};

const controlHandleClient = function (clientObj) {
  model.handleClientObject(clientObj);
};

const controlHandleTask = function (taskObj) {
  model.handleTaskObject(taskObj);
};

const controlHandleCase = function (caseObj) {
  model.handleCaseObject(caseObj);
};

const controlGetLastDaysData = async function (days) {
  return await model.loadDashboardData(days);
};
const controlGetCurTask = function (id) {
  return model.getCurTask(id);
};

const controlUpdateTask = function (id, updatedTaskData) {
  return model.updateCurTask(id, updatedTaskData);
};

const init = function () {
  renderCalendar.addHandlerRender(renderData);
  renderMenu.addHandlerMenu();
};

init();
