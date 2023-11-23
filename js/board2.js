let currentShowedTaskId;
/**
 * Shows a task from the array by creating a task div, determining the target container, and adding content.
 */
function showTaskFromArray() {
    const task = allTasks[allTasks.length - 1];
    const taskContainer = document.getElementById('target-to-do-table');
    const feedbackTaskContainer = document.getElementById('target-await-feedback-table');
    const inProgressContainer = document.getElementById('target-in-progress-table');
    const targetContainer = determineTargetContainer(task, taskContainer, inProgressContainer, feedbackTaskContainer);
    const taskDiv = createTaskDiv(task);
    const priorityImageSrc = getPriorityImageSrc(task.priority);
    const assignePinnedTaskBall = createAssignmentBalls(task);
    addContentToTaskDiv(task, taskDiv, assignePinnedTaskBall, priorityImageSrc);
    targetContainer.appendChild(taskDiv);
    initializeDragAndDrop();
}

/**
 * Rotates the element by 10 degrees on drag start.
 * @param {Event} event - The drag event.
 */
function onDrag(event) {
    event.target.style.transform = 'rotate(10deg)';
}

/**
 * Resets the rotation to zero degrees on drag end.
 * @param {Event} event - The drag event.
 */
function onDragEnd(event) {
    event.target.style.transform = '';
}

/**
 * Moves a task to a target container.
 * Updates the task status in local storage and sorts tasks into arrays.
 * @param {string} taskId - The task ID.
 * @param {string} targetContainerId - The target container ID.
 */
function moveTo(taskId, targetContainerId) {
    const taskDiv = document.getElementById(taskId);
    const targetContainer = document.getElementById(targetContainerId);
    if (taskDiv && targetContainer) {
        targetContainer.appendChild(taskDiv);
        updateTaskStatusInLocalStorage(taskId, targetContainerId);
    }
    sortTaskIntoArrays(allTasks, tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone);
}

/**
 * Updates the task status in local storage.
 * @param {string} taskId - The task ID.
 * @param {string} targetContainerId - The target container ID.
 */
function updateTaskStatusInLocalStorage(taskId, targetContainerId) {
    tasksToDo = [];
    tasksInProgress = [];
    tasksAwaitFeedback = [];
    tasksDone = [];
    let tasksStatus = JSON.parse(localStorage.getItem('tasksStatus')) || {};
    tasksStatus[taskId] = targetContainerId;
    localStorage.setItem('tasksStatus', JSON.stringify(tasksStatus));
}

/**
 * Restores tasks from local storage.
 */
function restoreTasksFromLocalStorage() {
    const tasksStatus = JSON.parse(localStorage.getItem('tasksStatus'));
    if (tasksStatus) {
        for (const taskId in tasksStatus) {
            const targetContainerId = tasksStatus[taskId];
            moveTo(taskId, targetContainerId);
        }
    }
}

/**
 * Sets the data format on drag start.
 * @param {Event} event - The drag event.
 */
function onDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

/**
 * Prevents the default behavior and moves the task to the target container on drop.
 * @param {Event} event - The drop event.
 */
function onDrop(event) {
    event.preventDefault();
    const targetContainer = event.target.closest('.drop-container');
    if (targetContainer) {
        const taskId = event.dataTransfer.getData('text/plain');
        const targetContainerId = targetContainer.id;
        moveTo(taskId, targetContainerId);
    }
    event.target.classList.remove('drag-over');
}

/**
 * Allows dropping elements and highlights the target container during drag over.
 * @param {Event} event - The dragover event.
 */
function allowDrop(event) {
    event.preventDefault();
    if (event.target.classList.contains('drop-container')) {
        event.target.classList.add('drag-over');
    }
}

/**
 * Clears all tasks.
 */
async function clearAllTasks() {
    allTasks = [];
    await saveTasks();
}

/**
 * Deletes a task based on its ID.
 * @param {string} taskId - The ID of the task to delete.
 */
async function deleteTask(taskId) {
    const taskElement = document.getElementById('task-' + taskId);
    if (taskElement)
        taskElement.remove();
    else
        console.error('HTML Task element not found for deletion');
    const taskIndex = allTasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        allTasks.splice(taskIndex, 1);
        hideOverlay();
    } else
        console.error('Task not found for deletion');
    await saveTasks();
}

/**
 * Hides the overlay.
 */
function hideOverlay() {
    const overlaySection = document.getElementById('overlaySection');
    overlaySection.classList.add('d-none');
}

/**
 * Shows details of a task in the overview.
 * @param {string} taskId - The ID of the task to show.
 */
function showTasksInOverViev(taskId) {
    currentShowedTaskId = [];
    const taskOverviewPopUp = document.getElementById('taskOverviewPopUp');
    const overlaySection = document.getElementById('overlaySection');
    overlaySection.classList.remove('d-none');
    taskOverviewPopUp.innerHTML = '';
    const task = allTasks.find(task => task.id === taskId);
    currentShowedTaskId = taskId;
    if (task) {
        displayTaskOverview(task);
    }
}

/**
 * Displays the overview details of a task.
 * @param {Object} task - The task.
 */
function displayTaskOverview(task) {
    const taskOverviewPopUp = document.getElementById('taskOverviewPopUp');
    const categorybackgroundColor = task.categoryColors[0];
    const currentId = task.id;
    const title = task.title;
    const description = task.description_text;
    const date = task.createdAt;
    const priority = task.priority.join(', ');
    const subTasks = task.subtasks;
    const subTasksId = task.subtasksId;
    let subTasksHTML = createSubTasksHTML(subTasks, subTasksId);
    let taskPopUpSingleAssignmentContainer = createAssignmentContainerHTML(task);
    taskOverviewTemplate(taskOverviewPopUp, task, categorybackgroundColor, title, description, date, priority, taskPopUpSingleAssignmentContainer, subTasksHTML, currentId);
}

/**
 * Creates the HTML code for subtasks.
 * @param {Array} subTasks - The array of subtasks.
 * @returns {string} The HTML code for subtasks.
 */
function createSubTasksHTML(subTasks, subTasksId) {
    const taskSubtasks = allTasks.find(task => task.subtasks === subTasks);
    const taskSubtasksId = allTasks.find(task => task.subtasksId === subTasksId);
    let subTasksHTML = '';
    if (subTasks && subTasksId && subTasks.length > 0) {
        subTasksHTML += '<ul class="edit-subTask">';
        subTasks.forEach((subTask, index) => {
            const subtaskStatus = taskSubtasksId ? taskSubtasksId[index] : false;
            subTasksHTML += `<li id="${subTasksId[index]}" class="subTaskAlignment"><div class="${subtaskStatus ? 'lineThrough' : ''}">${subTask}</div></li>`;
        });
        subTasksHTML += '</ul>';
    }
    return subTasksHTML;
}

/**
 * Generates and sets the HTML content for the task overview popup.
 *
 * @param {HTMLElement} taskOverviewPopUp - The container for the task overview.
 * @param {Object} task - The task object containing details.
 * @param {string} categorybackgroundColor - The background color for the category.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} date - The due date of the task.
 * @param {string} priority - The priority of the task.
 * @param {string} taskPopUpSingleAssignmentContainer - The HTML content for assigned persons.
 * @param {string} subTasksHTML - The HTML content for subtasks.
 * @param {string} currentId - The ID of the current task.
 */
function taskOverviewTemplate(taskOverviewPopUp, task, categorybackgroundColor, title, description, date, priority, taskPopUpSingleAssignmentContainer, subTasksHTML, currentId) {
    taskOverviewPopUp.innerHTML = /*html*/ `
        <div class="wholeTaskOverview" id="wholeTaskOverview">
            <div class="categoryHeaderDiv">
                <div class="categoryHeaderPosition">
                    <img class="vector-class" src="../assets/img/Vector (1).svg" alt="" onclick="closeTaskOverviewPopUp()">
                    <div class="categoryOvervievPopUp" style="background-color: ${categorybackgroundColor}">
                        <div class="category">${task.task_category}</div>      
                    </div>
                </div>
            </div>
            <div class="taskPopUpHeadline">${title}</div>
            <div class="taskPopUpDiscription">${description}</div>
            <div class="taskPopUpRow">
                <div class="taskPopUpLeftTd"><b>Due Date:</b></div>
                <div class="taskPopUpRightTd">${date}</div>
            </div>
            <div class="taskPopUpRow">
                <div class="taskPopUpLeftTd"><b>Priority:</b></div>
                <div id="modify${priority}" class="prioContainer">
                    ${priority} <div id="modify${priority}Icon"></div>
                </div>
            </div>
            <div class="taskPopUpAssignments" id="taskPopUpAssignments">
                <div class="assignedToHeadline"><b>Assigned to:</b></div>
            </div>
            <div id="taskPopUpAssignmentsList" class="taskPopUpAssignmentsList">
                ${taskPopUpSingleAssignmentContainer}
            </div>
            <div class="subtasksOverview" id="subtasksOverview">
                <div class="edit-subTask-titel"><b>Subtasks</b></div>
                <div id="overViewAssignedToList" class="subTaskContainer">
                    ${subTasksHTML}
                </div>
            </div>
            <div class="overviewButtons">
                <div class="popUpButtonsContainer">
                    <div class="taskPopUpButton leftBtn btn-border" onclick="deleteTask('${currentId}')">
                        <img class="" id="deleteTask-Img" src="../assets/img/delete-32.png" alt="">
                    </div>
                    <div class="taskPopUpButton rightBtn btn-bg" onclick="editingShowTask('${currentId}')">
                        <img class="popUpPenTriangel" src="../assets/img/pencil-32.png" alt="">
                    </div>
                </div>
            </div>
        </div>`;
}

/**
 * Creates the HTML code for assignments.
 * @param {Object} task - The task.
 * @returns {string} The HTML code for assignments.
 */
function createAssignmentContainerHTML(task) {
    let taskPopUpSingleAssignmentContainer = '';
    if (task.assignedToValues && task.assignedToValues.length > 0) {
        task.assignedToValues.forEach((assignment) => {
            const nameParts = assignment.trim().split(' ');
            let initials = '';
            if (nameParts.length >= 2) {
                initials = nameParts[0][0] + nameParts[1][0];
            } else if (nameParts.length === 1) {
                initials = nameParts[0][0];
            }
        })
        return taskPopUpSingleAssignmentContainer;
    }
}

/**
 * Creates the HTML code for an assignment.
 * @param {string} color - The background color of the assignment.
 * @param {string} initials - The initials of the assigned person.
 * @param {string} assignment - The assigned person.
 * @returns {string} The HTML code for an assignment.
 */
function assignmentHTMLTemplate(color, initials, assignment) {
    return /*html*/ `
    <div class="taskPopUpSingleAssignmentContainer">
        <div class="assigne-ball" style="background-color:${color}">
            ${initials}
        </div>
        <div class="taskPopUpNameContainer">${assignment}</div>
    </div>
`;
}
