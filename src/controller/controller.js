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
        data = await model.loadData();
        renderClients.render(data);
        break;
      case "my-clients":
        data = await model.loadData();
        renderMyClients.render(data);
        break;
      case "tasks":
        data = await model.loadData();
        renderTasks.render(data);
        break;
      case "cases":
        data = await model.loadData();
        renderCases.render(data);
        break;
      case "knowledge-base":
        renderKnowledgeBase.render(data);
        break;
      case id.match(/^client\?.*$/)?.input:
        const clientData = await model.getCurClient(id);
        data = await model.loadData();
        renderModal.addHandlerModal(
          clientData,
          id,
          controlHandleClient,
          null,
          data
        );
        break;
      case "new-client":
        data = await model.loadData();
        renderModal.addHandlerModal(data, null, controlHandleClient);
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
        data = await model.loadData();
        renderModal.addHandlerModal(
          data,
          null,
          controlHandleCase,
          null,
          null,
          null,
          controlHandleClient
        );
        break;
      case id.match(/^case\?.*$/)?.input:
        const caseData = await model.getCurCase(id);
        data = await model.loadData();
        renderModal.addHandlerModal(
          caseData,
          id,
          controlHandleCase,
          null,
          data,
          null,
          controlHandleClient
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
        data = await model.loadData();
        renderModal.addHandlerModal(
          data,
          null,
          controlHandleTask,
          null,
          null,
          null,
          controlHandleEvent
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
