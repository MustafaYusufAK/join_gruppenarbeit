let inWhichContainer = [];
let task_category = {};
let tasksToDo = [];
let tasksInProgress = [];
let tasksAwaitFeedback = [];
let tasksDone = [];

/**
 * Initializes the Kanban board by loading tasks, contacts, generating the sidebar,
 * showing tasks, restoring tasks from local storage, sorting tasks into arrays,
 * adding event listeners for task overlays, creating contact dropdown, assigning option IDs,
 * and setting the minimum date for the board.
 * @returns {Promise<void>} A promise indicating the completion of the initialization.
 */
async function initForBoard() {
    await loadTasks();
    await loadContacts();
    generateSideBar();
    showTasks();
    restoreTasksFromLocalStorage();
    sortTaskIntoArrays(allTasks, tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone);
    addTaskOverlayClickEventlisteners();
    createContactDropdown();
    getRandomColor();
    assignOptionIDs();
    setMinDateForBoard();
}

/**
 * Sets the minimum date for the board based on the current date.
 */
function setMinDateForBoard() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Monat ist 0-basiert, daher +1
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    document.getElementById('createdAt').min = currentDate;
}

/**
 * Resets the assigned field by programmatically triggering click events on assignee balls.
 */
function resetAssignedField() {
    const assignedToList = document.getElementById('assignedToList');
    const assigneeBalls = assignedToList.querySelectorAll('.assigneeContainer');
    const clickEvent = new Event('click', { bubbles: true });
    assigneeBalls.forEach(ball => {
        ball.dispatchEvent(clickEvent);
    });
}

/**
 * Fills the empty category if the category is not selected with default values.
 */
function fillEmptyCategory() {
    const defaultCategoryText = 'Keine Category ausgewählt';
    const defaultCategoryColor = '#808080';
    if (category === '') {
        category = defaultCategoryText;
    }
    if (categoryColorArray.length === 0) {
        categoryColorArray.push(defaultCategoryColor);
    }
}

/**
 * Sorts tasks into different arrays based on their current status on the board.
 * @param {Array} allTasks - An array containing all tasks.
 * @param {Array} tasksToDo - An array to store tasks in the "To Do" status.
 * @param {Array} tasksInProgress - An array to store tasks in progress.
 * @param {Array} tasksAwaitFeedback - An array to store tasks awaiting feedback.
 * @param {Array} tasksDone - An array to store completed tasks.
 */
function sortTaskIntoArrays(allTasks, tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone) {
    allTasks.forEach(task => {
        const taskDiv = document.getElementById(`task-${task.id}`);
        if (!taskDiv) return;
        const targetArray = getTargetArray(taskDiv, tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone);
        const shouldAddTask = !targetArray.some(existingTask => existingTask.id === task.id);
        if (shouldAddTask) targetArray.push(task);
    });
}

/**
 * Extracts information about assignees and populates corresponding arrays.
 */
function getTargetArray(taskDiv, tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone) {
    switch (taskDiv.parentElement.id) {
        case 'target-to-do-table':
            return tasksToDo;
        case 'target-in-progress-table':
            return tasksInProgress;
        case 'target-await-feedback-table':
            return tasksAwaitFeedback;
        case 'target-done-table':
            return tasksDone;
        default:
            return [];
    }
}

/**
 * Extracts information about assignees and populates corresponding arrays.
 */
function extractAssigneeInfo() {
    const assignedToDiv = document.getElementById('assignedToList');
    const assigneeContainers = assignedToDiv.getElementsByClassName('assigneeContainer');
    for (const container of assigneeContainers) {
        const backgroundColor = container.style.backgroundColor;
        const contactValue = container.getAttribute('data-contact-value');
        const contactText = container.textContent.trim();
        assignedToColorsArray.push(backgroundColor);
        assignedToValuesArray.push(contactValue);
        assignedShortValues.push(contactText);
    }
}

/**
 * Creates a task object based on the user input.
 * @returns {Object} A task object.
 */
function createTaskObject() {
    const categorySelect = document.getElementById('category');
    const categoryText = categorySelect ? categorySelect.innerText.trim() : '';
    if (categoryText === 'Select task category') {
        selectCategoryNotification();
        return; // Beende die Funktion, um das Hinzufügen der Aufgabe zu verhindern
    }
    const id = generateUniqueID();
    return {
        id: id,
        title: document.getElementById('title').value,
        description_text: document.getElementById('description_text').value,
        task_category: categorySelect ? categorySelect.innerText : '',
        createdAt: document.getElementById('createdAt').value,
        priority: priorityArray,
        subtasks: subtaskTextsArray,
        subtasksId: subtaskIdsArray,
        categoryColors: categoryColorArray,
        assignedToValues: assignedToValuesArray,
        assignedToColors: assignedToColorsArray,
        assignedShortValues: assignedShortValues,
        inWhichContainer: inWhichContainer.length > 0 ? inWhichContainer : ''
    };
}

/**
 * Gathers information about the task from user input.
 * @returns {Object} An object containing task information.
 */
function gatherTaskInfo() {
    const description = document.getElementById('description_text').value;
    const createdAt = document.getElementById('createdAt').value;
    const title = document.getElementById('title').value;
    const categorySelect = document.getElementById('category');
    const categoryColor = categorySelect ? categorySelect.querySelector('.categoryColor').style.backgroundColor : '';
    return {
        title,
        description,
        createdAt,
        categoryColor,
    };
}

/**
 * Updates various arrays with the task information.
 * @param {Object} task - The task object to update arrays.
 */
async function updateArrays(task) {
    titlesArray.push(task.title);
    descriptionsArray.push(task.description);
    createdAtArray.push(task.createdAt);
    categoryArray.push(task.category);
    categoryColorArray.push(task.categoryColor);
    allTasks.push(task);
    await saveTasks();
}

/**
 * Empties arrays related to task information.
 */
function emptyArrays() {
    subtasksArray = [];
    categoryArray = [];
    categoryColorArray = [];
    assignedToValuesArray = [];
    assignedToColorsArray = [];
    assignedShortValues = [];
    createdAtArray = [];
    priorityArray = [];
}

/**
 * Finalizes the board state by showing a final notification, closing the overlay,
 * showing tasks, restoring tasks from local storage, sorting tasks into arrays, emptying arrays,
 * and clearing add task fields.
 */
function finalizeBoardState() {
    showBoardFinalNotification();
    setTimeout(() => {
        closeOverlay();
        showTasks();
        restoreTasksFromLocalStorage();
        sortTaskIntoArrays(allTasks, tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone);
        emptyArrays();
    }, 1500);
    clearAddTaskFields();
}

/**
 * Handles filled fields by gathering task information, updating arrays, and finalizing the board state.
 * @param {Object} task - The task object to handle.
 */
function handleFilledFields(task) {
    const taskInfo = gatherTaskInfo();
    updateArrays({ ...taskInfo, ...task });
    finalizeBoardState();
}

/**
 * Shows a notification and resets arrays based on the status of assigned values and priorities.
 */
function showNotificationAndResetArrays() {
    if (priorityArray.length === 0) {
        showPrioNotification();
    } else {
        boardHideShowFinalNotification();
    }
}

/**
 * Adds a task from the overlay, preventing the default event action and validating required fields.
 */
function addTaskFromOverlay() {
    event.preventDefault();
    const description = document.getElementById('description_text').value;
    const createdAt = document.getElementById('createdAt').value;
    const title = document.getElementById('title').value;
    const newCategoryContainer = document.getElementById('newCategoryContainer');
    const newCategoryInput = document.getElementById('newCategoryInput');
    const newCategoryColor = document.getElementById('newCategoryColor');
    let subtaskTextsArray = [];
    let subtaskIdsArray = [];
    const subtaskItems = document.querySelectorAll('.subtask-item');
    subtaskItems.forEach(subtask => {
        const subtaskText = subtask.textContent.trim();
        const subtaskId = subtask.id;
        if (subtaskText && subtaskId) {
            subtaskTextsArray.push(subtaskText);
            subtaskIdsArray.push(subtaskId);
        }
    });
    if (!newCategoryContainer.classList.contains('d-none')) {
        if (newCategoryInput && !newCategoryInput.value.trim()) {
            categoryNotification();
            return;
        }
        if (newCategoryColor && !newCategoryColor.style.backgroundColor) {
            categoryColorNotification();
            return;
        }
        if (newCategoryInput && newCategoryInput.value.trim() && newCategoryColor && newCategoryColor.style.backgroundColor) {
            confirmCategoryNotification();
            return;
        }
    }
    extractAssigneeInfo();
    if (title && description && createdAt && priorityArray.length > 0 && assignedToValuesArray.length > 0) {
        const task = createTaskObject();
        handleFilledFields(task);
    } else {
        showNotificationAndResetArrays();
    }
}

/**
 * Creates a task div element with specified attributes.
 * @param {Object} task - The task object.
 * @returns {HTMLElement} The created task div element.
 */
function createTaskDiv(task) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-item');
    taskDiv.setAttribute('id', `task-${task.id}`);
    taskDiv.setAttribute('draggable', true);
    taskDiv.addEventListener('dragstart', onDragStart);
    return taskDiv;
}

/**
 * Determines the target container for a task based on its status.
 * @param {Object} task - The task object.
 * @param {HTMLElement} taskContainer - The task container element.
 * @param {HTMLElement} inProgressContainer - The in-progress container element.
 * @param {HTMLElement} feedbackTaskContainer - The feedback task container element.
 * @returns {HTMLElement} The target container for the task.
 */
function determineTargetContainer(task, taskContainer, inProgressContainer, feedbackTaskContainer) {
    let targetContainer = taskContainer;
    const inWhichContainer = task.inWhichContainer;
    if (inWhichContainer && inWhichContainer.includes('for-To-Do-Container')) {
        targetContainer = taskContainer;
    } else if (inWhichContainer && inWhichContainer.includes('in-Progress-Container')) {
        targetContainer = inProgressContainer;
    } else if (inWhichContainer && inWhichContainer.includes('for-Await-Feedback-Container')) {
        targetContainer = feedbackTaskContainer;
    }
    return targetContainer;
}

/**
 * Creates assignment balls HTML based on assigned values and colors.
 * @param {Object} task - The task object.
 * @returns {string} The HTML string for assignment balls.
 */
function createAssignmentBalls(task) {
    let assignePinnedTaskBall = '';
    if (task.assignedToValues && task.assignedToValues.length > 0) {
        const maxAssignmentsToShow = 3;
        const assignmentsToDisplay = task.assignedToValues.slice(0, maxAssignmentsToShow);
        let additionalAssignmentsCount = task.assignedToValues.length - maxAssignmentsToShow;
        assignePinnedTaskBall = processAssignments(assignmentsToDisplay, task.assignedToColors);
        if (additionalAssignmentsCount > 0) {
            assignePinnedTaskBall += `
                <div class="assigne-ball" style="background-color: rgb(0, 0, 0)">
                    +${additionalAssignmentsCount}
                </div>
            `;
        }
    }
    return assignePinnedTaskBall;
}

/**
 * Processes assignments and returns the HTML string for assignment balls.
 * @param {Array} assignments - An array of assignments.
 * @param {Array} colors - An array of colors.
 * @returns {string} The HTML string for assignment balls.
 */

function processAssignments(assignments, colors) {
    let assignePinnedTaskBall = '';
    assignments.forEach((assignment, index) => {
        const nameParts = assignment.trim().split(' ');
        let initials = '';
        if (nameParts.length >= 2) {
            initials = nameParts[0][0] + nameParts[1][0];
        } else if (nameParts.length === 1) {
            initials = nameParts[0][0];
        }
        const color = colors[index];
        assignePinnedTaskBall = `
            <div class="assigne-ball" style="background-color: ${color}">
                <div>${initials}</div>
            </div>
        `;
    });
    return assignePinnedTaskBall;
}

/**
 * Adds content to the task div based on task information.
 * @param {Object} task - The task object.
 * @param {HTMLElement} taskDiv - The task div element.
 * @param {string} assignePinnedTaskBall - The HTML string for assignment balls.
 * @param {string} priorityImageSrc - The source URL for the priority image.
 * @param {string} categorybackgroundColor - The background color for the category.
 */
function addContentToTaskDiv(task, taskDiv, assignePinnedTaskBall, priorityImageSrc, categorybackgroundColor, progressBarId, taskId) {
    taskDiv.innerHTML = `
            <div class="pinned-task-container" onclick="showTasksInOverViev('${task.id}')">
                <div class="category-background-color" style="background-color: ${categorybackgroundColor}">
                    <div class="category-div-text">${task.task_category}</div>
                </div>
                <h3 class="pinned-task-headline">${task.title}</h3>
                <p class="pinned-task-discription">${task.description_text}</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" id="progress-bar-${progressBarId}"></div>
                </div>
                <div id="ball-and-prio-img-div" class="ball-and-prio-img-div">
                <div class="pinnedAssigneBallPosition">
                    ${assignePinnedTaskBall}
                    </div>
                    <div class="pinnedPrioPosition">
                    <div>
                        <img class="pinnedPrioImg" src="${priorityImageSrc}" alt="Priority Image">
                    </div>
                    </div>
                </div>
            </div>`;
}

/**
 * Initializes drag and drop functionality for drop containers.
 */
function initializeDragAndDrop() {
    const dropContainers = document.querySelectorAll('.drop-container');
    dropContainers.forEach(container => {
        container.addEventListener('drop', onDrop);
        container.addEventListener('dragover', allowDrop);
    });
}

/**
 * Shows tasks by clearing task containers, displaying tasks, and initializing drag and drop.
 */
function showTasks() {
    createSpecificNoTaskDivs();
    createNoTaskDiv();
    const taskContainer = document.getElementById('target-to-do-table');
    const feedbackTaskContainer = document.getElementById('target-await-feedback-table');
    const inProgressContainer = document.getElementById('target-in-progress-table');
    const targetDoneTable = document.getElementById('target-done-table');
    clearTaskContainers(taskContainer, feedbackTaskContainer, inProgressContainer, targetDoneTable);
    createSpecificNoTaskDivs();
    createNoTaskDiv();
    displayTasks(taskContainer, feedbackTaskContainer, inProgressContainer, targetDoneTable);
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
        const targetContainer = determineTargetContainer(task, taskContainer, inProgressContainer, feedbackTaskContainer);
        const assignePinnedTaskBall = createAssignmentBalls(task);
        addContentToTaskDiv(task, taskDiv, assignePinnedTaskBall, priorityImageSrc, categorybackgroundColor, progressBarId, taskId);
        targetContainer.appendChild(taskDiv);
        checkProgressBar(taskId, progressBarId);
    });

    initializeDragAndDrop();
    restoreTasksFromLocalStorage();
    sortTaskIntoArrays(allTasks, tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone);
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

function applyLineThroughAndCheckbox(currentTaskId) {
    const task = allTasks.find(task => task.id === currentTaskId);
    if (!task) {
        console.error(`Aufgabe mit der ID "${currentTaskId}" wurde nicht gefunden.`);
        return;
    }
    const subtasksStatus = task.subtasksStatus || [];
    subtasksStatus.forEach((subtaskStatus, index) => {
        const subtaskId = task.subtasksId[index];
        const subtaskElement = document.getElementById(subtaskId);
        const checkboxElement = subtaskElement.querySelector('.subtask-checkbox');
        if (subtaskElement && checkboxElement) {
            if (subtaskStatus === true) {
                subtaskElement.classList.add('lineThrough');
                checkboxElement.checked = true;
            } else {
                subtaskElement.classList.remove('lineThrough');
                checkboxElement.checked = false;
            }
        }
    });
}
