/**
 * Finds and filters tasks based on the search input value.
 *
 */
function findTask() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const pinnedTaskContainers = document.querySelectorAll('.pinned-task-container');
    pinnedTaskContainers.forEach(container => {
        const headline = container.querySelector('.pinned-task-headline');
        const taskText = headline.textContent.toLowerCase();
        const description = container.querySelector('.pinned-task-discription');
        const taskDescription = description.textContent.toLowerCase();
        if (taskText.includes(searchInput) || taskDescription.includes(searchInput)) {
            container.classList.remove('d-none');
        } else {
            container.classList.add('d-none');
        }
    });
}

/**
 * Displays or hides a message indicating the absence of tasks.
 *
 * @param {Element} container - The container element where the message is displayed.
 * @param {Array} tasksArray - An array of tasks.
 * @param {string} text - The text message to display.
 */
function showNoTaskMessage(container, tasksArray, text) {
    const noTaskContainer = document.createElement('div');
    noTaskContainer.textContent = text;
    const tasksExist = tasksArray.some(existingTask => container.id === `task-${existingTask.id}`);
    if (!tasksExist) {
        container.appendChild(noTaskContainer);
    } else {
        const existingNoTaskContainer = container.querySelector('.no-task-message');
        if (existingNoTaskContainer) {
            container.removeChild(existingNoTaskContainer);
        }
    }
}

/**
 * Updates the progress bar based on the completion status of subtasks.
 *
 * @param {string} taskId - The ID of the task.
 */
function updateProgressBar(taskId) {
    const task = allTasks.find(task => task.id === taskId);
    const progressBarId = task.progressBarId;
    const progressBar = document.getElementById(`progress-bar-${progressBarId}`);
    if (!progressBar) {
        console.error(`Progress-Bar mit der ID "${progressBarId}" wurde nicht gefunden.`);
        return;
    }
    const checkedSubtasks = task.subtasks.filter(subtask => subtask.checked);
    const progressPercentage = (checkedSubtasks.length / task.subtasks.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

/**
 * Applies line-through style and updates the checkbox status for subtasks.
 *
 * @param {string} currentTaskId - The ID of the task.
 */
function applyLineThroughAndCheckbox(currentTaskId) {
    const task = allTasks.find(task => task.id === currentTaskId);
    if (!task) {
        console.error(`Aufgabe mit der ID "${currentTaskId}" wurde nicht gefunden.`);
        return;
    }
    const subtasksStatusArray = task.subtasksStatusArray || [];
    subtasksStatusArray.forEach((subtaskStatus, index) => {
        const subtaskId = task.subtasksId[index];
        const subtaskElement = document.getElementById(subtaskId);
        if (subtaskElement) {
            const checkboxElement = subtaskElement.querySelector('.subtask-checkbox');
            if (checkboxElement) {
                if (subtaskStatus === true) {
                    subtaskElement.classList.add('lineThrough');
                    checkboxElement.checked = true;
                } else {
                    subtaskElement.classList.remove('lineThrough');
                    checkboxElement.checked = false;
                }
            }
        }
    });
}

/**
 * Hides the overlay section.
 *
 */
function hideOverlay() {
    const overlaySection = document.getElementById('overlaySection');
    overlaySection.classList.add('d-none');
}

/**
 * Checks and updates the progress bar based on the completion status of subtasks.
 *
 * @param {string} taskId - The ID of the task.
 * @param {string} progressBarId - The ID of the progress bar element.
 */
function checkProgressBar(taskId, progressBarId) {
    const task = allTasks.find(task => task.id === taskId);
    if (!task) {
        console.error(`Task mit der ID "${taskId}" wurde nicht gefunden.`);
        return;
    }
    const progressBar = document.getElementById(`progress-bar-${progressBarId}`);
    if (!progressBar) {
        console.error(`Progress-Bar mit der ID "${progressBarId}" wurde nicht gefunden.`);
        return;
    }
    const subtasks = task.subtasks;
    const subtasksStatusArray = task.subtasksStatusArray || [];
    const filledSubtasksCount = subtasksStatusArray.filter(status => status).length;
    const progressPercentage = (filledSubtasksCount / subtasks.length) * 100;
    progressBar.style.transition = 'width 0.5s ease';
    progressBar.style.height = '100%';
    progressBar.style.backgroundColor = '#29ABE2';
    progressBar.style.width = `${progressPercentage}%`;
}

/**
 * Sets the selected category and its color in the designated HTML element.
 *
 * @param {string} category - The category name.
 * @param {string} color - The color associated with the category.
 * @returns {string} The selected category color.
 */
function selectedCategory(category, color) {
    category = category.charAt(0).toUpperCase() + category.slice(1);
    document.getElementById('category').innerHTML = /*html*/ `
            <div id="_xak1l2uph" class="categoryContainer">
                ${category}
                <div class="categoryColor" style="background-color: ${color}; margin-left: 10px"></div>
            </div>
        `;
    closeCategoryDropdown();
    return color;
}


/**
 * Clears the arrays used for adding tasks.
 */
function clearAddTaskArrays() {
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
 * Clears all the fields and arrays used for adding tasks.
 */
function clearAddTaskFields() {
    clearInputFields();
    resetAssignedField();
    clearDateInput();
    resetPriorityButtons();
    clearSubtasks();
    clearAddTaskArrays();
}

/**
 * Changes the icon of the clear button to the default state.
 * @param {string} IdHover - The ID of the button in the hover state.
 * @param {string} IdDefault - The ID of the button in the default state.
 */
function changeClearBtnIconToDefault(IdHover, IdDefault) {
    document.getElementById(IdHover).classList.add('d-none');
    document.getElementById(IdDefault).classList.remove('d-none');
}

/**
 * Changes the icon of the clear button to the hover state.
 * @param {string} IdDefault - The ID of the button in the default state.
 * @param {string} IdHover - The ID of the button in the hover state.
 */
function changeClearBtnIconToHover(IdDefault, IdHover) {
    document.getElementById(IdDefault).classList.add('d-none');
    document.getElementById(IdHover).classList.remove('d-none');
}

/**
 * Opens the overlay for adding tasks.
 */
function openOverlay() {
    const overlaySection = document.getElementById('addTaskOverlaySection');
    const overlay = document.getElementById('add-task-form');
    overlay.classList.add('slide-in');
    overlaySection.classList.remove('d-none');
}

/**
 * Adds a task for the "To-Do" category and opens the overlay.
 */
function addTaskForToDo() {
    const overlaySection = document.getElementById('addTaskOverlaySection');
    const overlay = document.getElementById('add-task-form');
    overlay.classList.add('slide-in');
    overlaySection.classList.remove('d-none');
    inWhichContainer.push('for-To-Do-Container'); // Füge 'for-To-Do-Container' zum Array hinzu
}

/**
 * Adds a task for the "In Progress" category and opens the overlay.
 */
function addTaskForInProgress() {
    const overlaySection = document.getElementById('addTaskOverlaySection');
    const overlay = document.getElementById('add-task-form');
    overlay.classList.add('slide-in');
    overlaySection.classList.remove('d-none');
    inWhichContainer.push('in-Progress-Container');
}

/**
 * Adds a task for the "Await Feedback" category and opens the overlay.
 */
function addTaskForAwaitFeedback() {
    const overlaySection = document.getElementById('addTaskOverlaySection');
    const overlay = document.getElementById('add-task-form');
    overlay.classList.add('slide-in');
    overlaySection.classList.remove('d-none');
    inWhichContainer.push('for-Await-Feedback-Container');
}

/**
 * Closes the overlay, clearing the state.
 */
function closeOverlay() {
    inWhichContainer = [];
    const overlaySection = document.getElementById('addTaskOverlaySection');
    const overlay = document.getElementById('addTaskOverlaySection');
    overlay.classList.remove('slide-in');
    overlaySection.classList.add('d-none');
}