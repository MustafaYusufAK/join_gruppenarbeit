let currentShowedTaskId;

/**
 * Shows a task from the array by creating a task div, determining the target container, and adding content.
 */
function showTaskFromArray() {
    const task = allTasks[allTasks.length - 1];
    const taskContainer = document.getElementById('target-to-do-table');
    const feedbackTaskContainer = document.getElementById('target-await-feedback-table');
    const inProgressContainer = document.getElementById('target-in-progress-table');
    const doneTaskContainer = document.getElementById('target-done-table');
    const targetContainer = determineTargetContainer(task, taskContainer, inProgressContainer, feedbackTaskContainer, doneTaskContainer);
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

async function showTasksInOverview(taskId, event) {
    const clickedElement = event.target;
    const taskArray = findTaskArray(taskId);
    if (clickedElement.classList.contains('navigate-tasks-mobile')) {
        event.stopPropagation();
    } else if (clickedElement.classList.contains('mobile-taskcategory')) {
        currentShowedTaskId = taskId;
        if (clickedElement.classList.contains('to-do-category')) 
            await moveTaskToCategory(taskArray, tasksToDo);
         else if (clickedElement.classList.contains('in-progress-category')) 
            await moveTaskToCategory(taskArray, tasksInProgress);
         else if (clickedElement.classList.contains('await-feedback-category')) 
            await moveTaskToCategory(taskArray, tasksAwaitFeedback);
         else if (clickedElement.classList.contains('done-category'))
            await moveTaskToCategory(taskArray, tasksDone);
    } else if (!clickedElement.classList.contains('navigate-tasks-mobile') || !clickedElement.classList.contains('mobile-taskcategory')) {
        const overlaySection = document.getElementById('overlaySection');
        overlaySection.classList.remove('d-none');
        displayTaskOverview(taskArray);
    }
}

async function moveTaskToCategory(taskArray, newArray) {
    if (taskArray && newArray) {
        const taskIndex = taskArray.findIndex(task => task.id === currentShowedTaskId);

        if (taskIndex !== -1) {
            const task = taskArray.splice(taskIndex, 1)[0];
            task.inWhichContainer = determineContainerKey(newArray);
            newArray.push(task);
            await saveTasks();
            await saveTasksCategory();
            showTasks();
        } else {
            console.error('Task not found in the old array');
        }
    } else {
        console.error('Invalid task array or new array');
    }
}

function determineContainerKey(array) {
    if (array === tasksToDo) {
        return 'for-To-Do-Container';
    } else if (array === tasksInProgress) {
        return 'in-Progress-Container';
    } else if (array === tasksAwaitFeedback) {
        return 'for-Await-Feedback-Container';
    } else if (array === tasksDone) {
        return 'for-Done-Container';
    } else {
        return '';
    }
}


function findTaskArray(taskId) {
    const task = allTasks.find(task => task.id === taskId);

    if (task) {
        if (tasksToDo.includes(task)) {
            return tasksToDo;
        } else if (tasksInProgress.includes(task)) {
            return tasksInProgress;
        } else if (tasksAwaitFeedback.includes(task)) {
            return tasksAwaitFeedback;
        } else if (tasksDone.includes(task)) {
            return tasksDone;
        } else {
            return null; // Falls die Aufgabe in keinem Array gefunden wird
        }
    } else {
        return null; // Falls die Aufgabe mit der gegebenen taskId nicht gefunden wird
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
        task.assignedToValues.forEach((assignment, index) => {
            const nameParts = assignment.trim().split(' ');
            let initials = '';
            if (nameParts.length >= 2)
                initials = nameParts[0][0] + nameParts[1][0];
            else if (nameParts.length === 1)
                initials = nameParts[0][0];
            const color = task.assignedToColors[index];
            taskPopUpSingleAssignmentContainer += assignmentHTMLTemplate(color, initials, assignment);
        });
    }

    return taskPopUpSingleAssignmentContainer;
}

/**
 * Creates the HTML code for an assignment.
 * @param {string} color - The background color of the assignment.
 * @param {string} initials - The initials of the assigned person.
 * @param {string} assignment - The assigned person.
 * @returns {string} The HTML code for an assignment.
 */
function assignmentHTMLTemplate(color, initials, assignment) {
    return /*html*/`
        <div class="assignment-container">
            <div class="assigne-ball" style="background-color: ${color}">
                <div>${initials}</div>
            </div>
            <div class="taskPopUpNameContainer">${assignment}</div>
        </div>
    `;
}

/**
 * Creates specific div elements for displaying "No Task" messages in different task containers.
 */
function createSpecificNoTaskDivs() {
    let noTaskInToDo = document.createElement('div');
    noTaskInToDo.id = 'noTaskInToDo';
    let noTaskInAwait = document.createElement('div');
    noTaskInAwait.id = 'noTaskInAwait';
    let noTaskInProgress = document.createElement('div');
    noTaskInProgress.id = 'noTaskInProgress';
    let noTaskInDone = document.createElement('div');
    noTaskInDone.id = 'noTaskInDone';
    let taskContainer = document.getElementById('target-to-do-table');
    let feedbackTaskContainer = document.getElementById('target-await-feedback-table');
    let inProgressContainer = document.getElementById('target-in-progress-table');
    let targetDoneTable = document.getElementById('target-done-table');
    taskContainer.appendChild(noTaskInToDo);
    feedbackTaskContainer.appendChild(noTaskInAwait);
    inProgressContainer.appendChild(noTaskInProgress);
    targetDoneTable.appendChild(noTaskInDone);
}

/**
 * Creates a common "No Task Available" div element and appends it to different task containers.
 */
function createNoTaskDiv() {
    let noTaskDiv = document.createElement('div');
    noTaskDiv.id = 'noTask';
    noTaskDiv.className = 'no_tasks_class';
    noTaskDiv.textContent = 'No Task Available';
    let noTaskInToDo = document.getElementById('noTaskInToDo');
    let noTaskInAwait = document.getElementById('noTaskInAwait');
    let noTaskInProgress = document.getElementById('noTaskInProgress');
    let noTaskInDone = document.getElementById('noTaskInDone');
    noTaskInToDo.appendChild(noTaskDiv);
    noTaskInAwait.appendChild(noTaskDiv.cloneNode(true));
    noTaskInProgress.appendChild(noTaskDiv.cloneNode(true));
    noTaskInDone.appendChild(noTaskDiv.cloneNode(true));
}

/**
 * Applies line-through and checkbox status to subtasks based on their completion status.
 * @param {string} currentTaskId - The ID of the current task.
 */
function applyLineThroughAndCheckbox(currentTaskId) {
    const task = allTasks.find(task => task.id === currentTaskId);
    if (!task) return console.error(`Aufgabe mit der ID "${currentTaskId}" wurde nicht gefunden.`);
    (task.subtasksStatus || []).forEach((subtaskStatus, index) => {
        const subtaskId = task.subtasksId[index];
        const subtaskElement = document.getElementById(subtaskId);
        const checkboxElement = subtaskElement?.querySelector('.subtask-checkbox');
        if (subtaskElement && checkboxElement) {
            subtaskElement.classList[subtaskStatus ? 'add' : 'remove']('lineThrough');
            checkboxElement.checked = subtaskStatus;
        }
    });
}

/**
 * Displays tasks by creating task div elements, determining target containers, adding content, and initializing drag and drop.
 * @param {HTMLElement} taskContainer - The task container element.
 * @param {HTMLElement} feedbackTaskContainer - The feedback task container element.
 * @param {HTMLElement} inProgressContainer - The in-progress container element.
 * @param {HTMLElement} targetDoneTable - The target done table element.
 */
function displayTasks(taskContainer, feedbackTaskContainer, inProgressContainer, targetDoneTable) {
    allTasks.forEach(task => {
        const taskId = task.id
        const progressBarId = generateUniqueID();
        task.progressBarId = progressBarId;
        const categorybackgroundColor = task.categoryColors[0];
        let priorityImageSrc = getPriorityImageSrc(task.priority);
        const taskDiv = createTaskDiv(task);
        const targetContainer = determineTargetContainer(task, taskContainer, inProgressContainer, feedbackTaskContainer, targetDoneTable);
        const assignePinnedTaskBall = createAssignmentBalls(task);
        addContentToTaskDiv(task, taskDiv, assignePinnedTaskBall, priorityImageSrc, categorybackgroundColor, progressBarId, taskId);
        targetContainer.appendChild(taskDiv);
        createProgressBar(progressBarId, taskId);
        setStylesForTaskDiv(taskId)
        updateProgressBar(taskId);
        checkProgressBar(taskId, progressBarId);
    });
    initializeDragAndDrop();
    restoreTasksFromLocalStorage();
    sortTaskIntoArrays(allTasks, tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone);
}

function createProgressBar(progressBarId, taskId) {
    const task = allTasks.find(task => task.id === taskId);
    if (!task || !task.subtasks || !task.subtasksId || task.subtasks.length === 0 || task.subtasksId.length === 0) {
        return; // Beende die Funktion frühzeitig, wenn die Bedingungen nicht erfüllt sind
    }
    const taskDiv = document.getElementById(`progress-div-${taskId}`);
    if (!taskDiv) {
        return; // Beende die Funktion, wenn das Task-Div nicht gefunden wurde
    }
    const existingProgressBar = taskDiv.querySelector(`#progress-bar-${progressBarId}`);
    if (existingProgressBar) {
        console.warn('Der Fortschrittsbalken existiert bereits für diese Aufgabe.');
        return; // Beende die Funktion, wenn der Fortschrittsbalken bereits vorhanden ist
    }
    const progressBarContainer = document.createElement('div');
    progressBarContainer.classList.add('progress-bar-container');
    const progressBarCounter = document.createElement('div');
    progressBarCounter.id = `progress-bar-counter-${progressBarId}`;
    progressBarCounter.classList.add('progress-bar-counter');
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    progressBar.id = `progress-bar-${progressBarId}`;
    progressBarContainer.appendChild(progressBar);
    taskDiv.appendChild(progressBarCounter);
    taskDiv.appendChild(progressBarContainer);
}

function setStylesForTaskDiv(taskId) {
    const taskDiv = document.getElementById(`progress-div-${taskId}`);
    if (taskDiv) {
        taskDiv.style.height = '12px';
        taskDiv.style.width = '100%';
        taskDiv.style.marginBottom = '10px';
        taskDiv.style.justifyContent = 'flex-end';
        taskDiv.style.display = 'flex';
        taskDiv.style.flexDirection = 'row-reverse';
    }
}

/**
 * Clears the content of specified containers.
 * @param {...HTMLElement} containers - The containers to clear.
 */
function clearTaskContainers(...containers) {
    containers.forEach(container => container.innerHTML = '');
}

/**
 * Gets the source URL for the priority image based on the priority.
 * @param {string} priority - The priority string.
 * @returns {string} The source URL for the priority image.
 */
function getPriorityImageSrc(priority) {
    if (priority.includes('low')) {
        return '../assets/img/Prio baja.svg';
    } else if (priority.includes('medium')) {
        return '../assets/img/Prio media.svg';
    } else if (priority.includes('urgent')) {
        return '../assets/img/Prio alta.svg';
    }
}
