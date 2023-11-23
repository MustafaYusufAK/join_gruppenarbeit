let currentTaskId;

/**
 * Creates an assignee container element.
 * @param {string} contactName - The name of the contact.
 * @param {string} color - The background color of the container.
 * @returns {HTMLDivElement} - The assignee container element.
 */
function createAssigneeContainer(contactName, color) {
    const assigneeContainer = document.createElement('div');
    assigneeContainer.classList.add('assigneeContainer');
    assigneeContainer.style.backgroundColor = color;
    const [firstName, lastName] = contactName.split(' ');
    assigneeContainer.innerHTML = `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`;
    assigneeContainer.setAttribute('value', contactName);
    return assigneeContainer;
}

/**
 * Adds event listeners to the assignee container.
 * @param {HTMLDivElement} assigneeContainer - The assignee container element.
 */
function addAssigneeContainerEvents(assigneeContainer) {
    assigneeContainer.addEventListener('mouseover', () => {
        const value = assigneeContainer.getAttribute('value');
        if (value)
            assigneeContainer.setAttribute('title', value);
    });
    assigneeContainer.addEventListener('mouseout', () => {
        assigneeContainer.removeAttribute('title');
    });
    assigneeContainer.addEventListener('click', () => {
        assigneeContainer.remove();
        const contactValue = assigneeContainer.getAttribute('value');
        const dropdown = document.getElementById('boardOverlayContact');
        const option = [...dropdown.options].find(opt => opt.value === contactValue);
        if (option)
            option.classList.remove('d-none');
    });
}

/**
 * Generates and appends assignee containers for the board overlay.
 * @param {string[]} assignedToColors - The colors of assigned contacts.
 * @param {string[]} assignedToValues - The values of assigned contacts.
 * @param {HTMLElement} assignedToList - The container for assigned contacts.
 */
function ballForBoardOverlay(assignedToColors, assignedToValues, assignedToList) {
    for (let i = 0; i < assignedToColors.length; i++) {
        const contactName = assignedToValues[i];
        const color = assignedToColors[i];
        const contact = contacts.find(c => c.name === contactName);
        if (contact) {
            const assigneeContainer = createAssigneeContainer(contactName, color);
            addAssigneeContainerEvents(assigneeContainer);
            assignedToList.appendChild(assigneeContainer);
        } else {
            console.error('Kontakt nicht gefunden für Wert:', contactName);
        }
    }
}

/**
 * Displays the task details in the board overlay for editing.
 */
function editingShowTask() {
    currentTaskId = [];
    const taskOverviewPopUp = document.getElementById('taskOverviewPopUp');
    taskOverviewPopUp.innerHTML = '';
    const task = allTasks.find(task => task.id === currentShowedTaskId);
    currentTaskId = currentShowedTaskId;
    if (!task) {
        console.error(`Task mit der ID "${taskId}" wurde nicht gefunden.`);
        return;
    }
    const descriptionText = task.description_text;
    const idDateValue = task.createdAt;
    const title = task.title;
    const assignedToOptions = task.assignedToValues.map((contact, index) => {
        return `<option value="${contact}" data-id="_${index}" data-color="${task.assignedToColors[index]}">${contact}</option>`;
    }).join('');
    debugger;
    const subtasksList = task.subtasks && task.subtasksId && task.subtasksId.map((subtasks, subtasksId) => subtasksListTemplate(subtasks, subtasksId)).join('');
    editTaskOverviewTemplate(taskOverviewPopUp, title, descriptionText, idDateValue, subtasksList);
    boardOverlayContactDropdown(assignedToOptions);
    const assignedToList = document.getElementById('ballAssignedToList');
    ballForBoardOverlay(task.assignedToColors, task.assignedToValues, assignedToList);
    clearBoardInputFields();
    boardClickEventlisteners();
    setMinDate();
    applyLineThroughAndCheckbox(currentTaskId);
}

/**
 * Generates HTML for a subtask in the task overview.
 * @param {string} subtask - The subtask description.
 * @returns {string} - HTML for the subtask.
 */
function subtasksListTemplate(subtasks, subtasksId) {
    return `<li id="${subtasksId}" class="subtask-item">
    <input type="checkbox" class="subtask-checkbox">
    ${subtasks}
    <div class="pencil_icon_div">
        <img class="addSubTaskIcons icon pencil" src="../assets/img/pencil-32.png" alt="" onclick="editSubtask(event)">
    </div>
    <div class="delete_icon_div">
        <img class="addSubTaskIcons icon delete" src="../assets/img/delete-32.png" alt="" onclick="deleteSubtask(event)">
    </div>
</li>`;
}

/**
 * Generates and displays the task overview form for editing.
 * @param {HTMLElement} taskOverviewPopUp - The task overview popup element.
 * @param {string} title - The task title.
 * @param {string} descriptionText - The task description.
 * @param {string} idDateValue - The due date of the task.
 * @param {string} subtasksList - HTML list of subtasks.
 */
function editTaskOverviewTemplate(taskOverviewPopUp, title, descriptionText, idDateValue, subtasksList) {
    taskOverviewPopUp.innerHTML = `
    <form class="taskOverviewForm" onsubmit="event.preventDefault(); boardConfirm();">
    <div class="board-vector-position"><img class="board-vector-class" src="../assets/img/Vector (1).svg" alt="" onclick="closeBoardTaskOverviewPopUp()"></div>
        <div class="add_title_section">
            <span>Title</span>
            <input required="" type="text" class="title_inputfield" id="boardOverlayTitle" placeholder="Enter a title" value="${title}">

            <div class="add_description_section">
                <span>Description</span>
                <textarea required="" type="text" class="description_inputfield" id="boardOverlaydescriptionText" placeholder="Enter a Description">${descriptionText}</textarea>

                <div class="assigned_to_section">
                    <span>Assigned to</span>
                    <label for="Select contacts to assign"></label>
                    <select required="" class="assigned_to_inputfield" name="contacts" id="boardOverlayContact">Select contacts to assign</select>
                    <div class="assignedToList" id="ballAssignedToList"></div>
                </div>
            </div>
        </div>

        <div class="date_Prio_div">
            <div class="add_date_section">
                <span class="">Due date</span>
                <input required="" type="date" Value="${idDateValue}"  class="date_inputfield" id="editedCreatedAt" placeholder="dd/mm/yy">
            </div>

            <div class="add_Prio_section">
                            <span>Prio</span>
                            <div class="prio_btn_position">
                                <button id="board_urgent_btn" class="urgent_prio_btn_characteristics">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Urgent</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio alta.svg"
                                            alt="High-Prio-Icon">
                                    </div>
                                </button>
                                <button type="button" value="urgent" id="board_clicked_urgent_btn"
                                    class="urgent_prio_btn_characteristics_onclick d-none">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Urgent</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio alta-white.svg"
                                            alt="High-Prio-Icon">
                                    </div>
                                </button>
                                <button id="board_medium_btn" class="medium_prio_btn_characteristics">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Medium</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio media.svg"
                                            alt="Medium-Prio-Icon">
                                    </div>
                                </button>
                                <button type="button" value="medium" id="board_clicked_medium_btn"
                                    class="medium_prio_btn_characteristics_onclick d-none">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Medium</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio media-white.svg"
                                            alt="Medium-Prio-Icon">
                                    </div>
                                </button>
                                <button id="board_low_btn" class="low_prio_btn_characteristics">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Low</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio baja.svg"
                                            alt="Low-Prio-Icon">
                                    </div>
                                </button>
                                <button type="button" value="low" id="board_clicked_low_btn"
                                    class="low_prio_btn_characteristics_onclick d-none">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Low</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio baja-white.svg"
                                            alt="Low-Prio-Icon">
                                    </div>
                                </button>
                            </div>
                        </div>
            <div class="task-container">
                <div class="taskContainerItemsPosition">
                    <input class="subtaskInputfield" type="text" id="subtaskBoardInput" placeholder="Add new subtask">
                    <div class="subtaskButton">
                        <img class="subtask_img" src="../assets/img/add.svg" alt="" onclick="addSubtaskToBoard()">
                    </div>
                </div>

                <ul id="boardSubtaskList" class="boardSubtaskList">
                    ${subtasksList}
                </ul>
            </div>
        </div>
    <div class="board-confirm-div">
        <button type="submit" class="board-confirm-btn">
            <span>Ok</span>
            <img src="../assets/img/check.svg" alt="">
        </button>
    </div>
    </form>`;
}

/**
 * Retrieves input values from the board overlay form.
 * @returns {object} - Object containing task details.
 */
function getBoardInputValues() {
    const taskId = currentTaskId;
    const title = document.getElementById('boardOverlayTitle').value;
    const descriptionText = document.getElementById('boardOverlaydescriptionText').value;
    const assignedToDiv = document.getElementById('ballAssignedToList');
    const dueDate = document.getElementById('editedCreatedAt').value;
    const boardOverlaySubTaskList = document.getElementById('boardSubtaskList');
    const subtaskItems = document.querySelectorAll('#boardSubtaskList .subtask-item');
    const subtasksStatusArray = [];
    const subtasksTextArray = []; // Array für Subtask-Texte
    const subtasksIdArray = []; // Array für Subtask-Id's

    subtaskItems.forEach(item => {
        const text = item.textContent.trim(); // Hier wird der Text des subtask-items genommen
        const id = item.id; // Hier wird die ID des Subtasks genommen
        subtasksStatusArray.push(item.querySelector('.subtask-checkbox').checked);
        subtasksTextArray.push(text); // Füge den Subtask-Text hinzu
        subtasksIdArray.push(id); // Füge die Subtask-ID hinzu

        // Hier kannst du die updateProgressBar-Funktion für jeden Subtask aufrufen
        updateProgressBar(taskId, id); // item.id sollte die Subtask-ID sein
    });
    boardOverlaySubTaskList.innerHTML = '';
    const subtasksArray = Array.from(subtaskItems, item => item.childNodes[0].textContent.trim());
    return { taskId, title, descriptionText, dueDate, assignedToDiv, subtasksStatusArray, subtasksTextArray, subtasksIdArray };
}

/**
 * Updates the task details in the tasks array.
 * @param {string} descriptionText - The task description.
 * @param {string} title - The task title.
 * @param {string} dueDate - The due date of the task.
 * @param {number} taskIndex - The index of the task in the array.
 * @param {string[]} updatedPriority - The updated priority array.
 * @param {string[]} subtasksArray - The array of subtasks.
 * @param {string[]} assignedToValues - The values of assigned contacts.
 * @param {string[]} assignedShortValues - The short values of assigned contacts.
 * @param {string[]} assignedToColors - The colors of assigned contacts.
 */
function updateTaskDetailsInArray(descriptionText, title, dueDate, taskIndex, updatedPriority, subtasksTextArray, assignedToValues, assignedShortValues, assignedToColors, subtasksStatusArray, subtasksIdArray) {
    const task = allTasks[taskIndex];
    task.title = title;
    task.description_text = descriptionText;
    task.createdAt = dueDate;
    task.priority = updatedPriority.slice();
    task.subtasks = subtasksTextArray.slice();
    task.assignedToValues = assignedToValues.slice();
    task.assignedShortValues = assignedShortValues.slice();
    task.assignedToColors = assignedToColors.slice();
    task.subtasksStatusArray = subtasksStatusArray;
    task.subtasksIdArray = subtasksIdArray;
}

/**
 * Handles the case when a task is not found in the tasks array.
 * @param {number|string} taskId - The ID of the task.
 */
function handleTaskNotFound(taskId) {
    console.error(`Task mit der ID "${taskId}" wurde nicht im allTasks-Array gefunden.`);
    return;
}

/**
 * Handles the submission of the board overlay form.
 */
async function boardConfirm() {
    event.preventDefault();
    const { taskId, title, descriptionText, dueDate, assignedToDiv, subtasksStatusArray, subtasksTextArray, subtasksIdArray } = getBoardInputValues();
    const taskIndex = allTasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        const assigneeContainers = assignedToDiv.getElementsByClassName('assigneeContainer');
        const assignedToValues = [];
        const assignedShortValues = [];
        const assignedToColors = [];
        for (const container of assigneeContainers) {
            const backgroundColor = container.style.backgroundColor;
            const contactValue = container.getAttribute('value');
            const contactText = container.textContent.trim();
            assignedToValues.push(contactValue);
            assignedShortValues.push(contactText);
            assignedToColors.push(backgroundColor);
        }
        const previousPriority = allTasks[taskIndex].priority;
        const updatedPriority = priorityArray.length > 0 ? priorityArray : previousPriority;
        updateTaskDetailsInArray(descriptionText, title, dueDate, taskIndex, updatedPriority, subtasksTextArray, assignedToValues, assignedShortValues, assignedToColors, subtasksStatusArray, subtasksIdArray);
        await saveTasks();
        priorityArray = [];
        currentTaskId = [];
        closeTaskOverviewPopUp();
        showTasks();
        restoreTasksFromLocalStorage();
        sortTaskIntoArrays(allTasks, tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone);
    } else {
        handleTaskNotFound(taskId);
    }
}

/**
 * Closes the task overview popup.
 */
function closeTaskOverviewPopUp() {
    inWhichContainer = [];
    const addTaskOverlaySection = document.getElementById('addTaskOverlaySection');
    const overlaySection = document.getElementById('overlaySection');
    overlaySection.classList.add('d-none');
    addTaskOverlaySection.classList.add('d-none');
}

/**
 * Clears the input fields for title and description.
 */
function clearInputFields() {
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description_text');
    titleInput.value = '';
    descriptionInput.value = '';
}

/**
 * Prevents the event from propagating to parent elements.
 * @param {Event} event - The event object.
 */
function doNotClose(event) {
    event.stopPropagation();
}

/**
 * Resets the assigned field to its default value.
 */
function resetAssignedField() {
    const assignedToSelect = document.getElementById('which_assigned_contact');
    assignedToSelect.selectedIndex = 0;
}

/**
 * Clears the date input field.
 */
function clearDateInput() {
    const dueDateInput = document.getElementById('createdAt');
    dueDateInput.value = '';
}

/**
 * Resets the priority buttons to their default state.
 */
function resetPriorityButtons() {
    const buttons = ['urgent', 'medium', 'low'];
    buttons.forEach(button => {
        const normalBtn = document.getElementById(`addTask_overlay_${button}_btn`);
        const clickedBtn = document.getElementById(`addTask_overlay_clicked_${button}_btn`);
        normalBtn.classList.remove('d-none');
        clickedBtn.classList.add('d-none');
    });
}

/**
 * Updates the category based on the selected option in the dropdown.
 */
function updateCategory() {
    const categoryDropdown = document.getElementById('categoryDropdown');
    const categoryContainer = document.getElementById('category');
    const categoryOptions = categoryDropdown.getElementsByClassName('categoryOption');
    if (categoryOptions.length >= 2) {
        const secondCategoryOption = categoryOptions[1];
        categoryContainer.innerHTML = secondCategoryOption.outerHTML;
    }
}

/**
 * Clears the subtask input and the subtask list.
 */
function clearSubtasks() {
    const subtaskInput = document.getElementById('subtaskInput');
    const subtaskList = document.getElementById('subtaskList');
    subtaskInput.value = '';
    subtaskList.innerHTML = '';
}

/**
 * Clears the input fields, resets the assigned field, clears date input, resets priority buttons, updates category, and clears subtasks.
 */
function forClearAddTaskWithBtn() {
    cancelNewCategory();
    closeCategoryDropdown();
    clearInputFields();
    resetAssignedField();
    clearDateInput();
    resetPriorityButtons();
    updateCategory();
    clearSubtasks();
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

