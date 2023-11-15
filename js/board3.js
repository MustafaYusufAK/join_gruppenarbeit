
function ballForBoardOverlay(assignedToColors, assignedToValues, assignedToList) {
    for (let i = 0; i < assignedToColors.length; i++) {
        const contactName = assignedToValues[i];
        const color = assignedToColors[i];

        // Finde den Kontakt im contacts Array
        const contact = contacts.find(c => c.name === contactName);

        if (contact) {
            const assigneeContainer = document.createElement('div');
            assigneeContainer.classList.add('assigneeContainer');
            assigneeContainer.style.backgroundColor = color;

            const [firstName, lastName] = contactName.split(' ');
            assigneeContainer.innerHTML = `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`;

            // Setze den Wert als data-Attribut
            assigneeContainer.setAttribute('value', contactName);

            // Event-Listener für den Hover-Effekt
            assigneeContainer.addEventListener('mouseover', () => {
                const value = assigneeContainer.getAttribute('value');
                if (value) {
                    // Zeige den Value als Tooltip an
                    assigneeContainer.setAttribute('title', value);
                }
            });

            // Event-Listener, um den Tooltip zu entfernen
            assigneeContainer.addEventListener('mouseout', () => {
                assigneeContainer.removeAttribute('title');
            });

            // Event-Listener, um den Ball zu löschen
            assigneeContainer.addEventListener('click', () => {
                // Entferne den Ball
                assigneeContainer.remove();

                // Extrahiere den Kontaktwert
                const contactValue = assigneeContainer.getAttribute('value');

                // Finde die entsprechende Option im Dropdown
                const dropdown = document.getElementById('boardOverlayContact');
                const option = [...dropdown.options].find(opt => opt.value === contactValue);

                if (option) {
                    // Entferne die 'd-none'-Klasse von der Option
                    option.classList.remove('d-none');
                }
            });

            assignedToList.appendChild(assigneeContainer);
        } else {
            console.error('Kontakt nicht gefunden für Wert:', contactName);
        }
    }
}

let currentTaskId;

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

    // Extrahiere Informationen
    const title = task.title;
    const assignedToOptions = task.assignedToValues.map((contact, index) => {
        return `<option value="${contact}" data-id="_${index}" data-color="${task.assignedToColors[index]}">${contact}</option>`;
    }).join('');
    const priority = task.priority;
    const subtasksList = task.subtasks.map(subtask => {
        return `<li class="subtask-item">${subtask}<div class="pencil_icon_div"><img class="addSubTaskIcons icon pencil" src="../assets/img/pencil-32.png" alt="" onclick="editSubtask(event)"></div>
        <div class="delete_icon_div"><img class="addSubTaskIcons icon delete" src="../assets/img/delete-32.png" alt="" onclick="deleteSubtask(event)"></div></li>`;
    }).join('');



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
    boardOverlayContactDropdown(assignedToOptions);
    // Aufruf der Funktion, um den Ball hinzuzufügen
    const assignedToList = document.getElementById('ballAssignedToList');
    ballForBoardOverlay(task.assignedToColors, task.assignedToValues, assignedToList);
    clearBoardInputFields();
    boardClickEventlisteners();
    setMinDate();
}


function boardConfirm() {
    event.preventDefault();
    const taskId = currentTaskId;
    const title = document.getElementById('boardOverlayTitle').value;
    const descriptionText = document.getElementById('boardOverlaydescriptionText').value;
    const assignedToDiv = document.getElementById('ballAssignedToList');
    const dueDate = document.getElementById('editedCreatedAt');
    const dueDateInput = dueDate.value;
    const boardOverlaySubTaskList = document.getElementById('boardSubtaskList');
    const subtaskItems = document.querySelectorAll('#boardSubtaskList .subtask-item');
    boardOverlaySubTaskList.innerHTML = '';

    const subtasksArray = [];
    subtaskItems.forEach(item => {
        const textNode = item.childNodes[0];
        subtasksArray.push(textNode.textContent.trim());
    });

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

        // Überprüfe, ob das priorityArray leer ist, und greife auf die vorherige Priorität zu, falls vorhanden
        const previousPriority = allTasks[taskIndex].priority;
        const updatedPriority = priorityArray.length > 0 ? priorityArray : previousPriority;

        // Direktes Aktualisieren der spezifischen Task-Eigenschaften als Array
        allTasks[taskIndex].title = title;
        allTasks[taskIndex].description_text = descriptionText;
        allTasks[taskIndex].createdAt = dueDateInput;
        allTasks[taskIndex].priority = updatedPriority.slice(); // Klonen des Arrays
        allTasks[taskIndex].subtasks = subtasksArray.slice(); // Klonen des Arrays
        allTasks[taskIndex].assignedToValues = assignedToValues.slice(); // Klonen des Arrays
        allTasks[taskIndex].assignedShortValues = assignedShortValues.slice(); // Klonen des Arrays
        allTasks[taskIndex].assignedToColors = assignedToColors.slice(); // Klonen des Arrays

        saveTasks();
        priorityArray = [];
        currentTaskId = [];
        closeTaskOverviewPopUp();
        showTasks();
        restoreTasksFromLocalStorage();
        sortTaskIntoArrays(allTasks, tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone);
        // initForBoard();
    } else {
        console.error(`Task mit der ID "${taskId}" wurde nicht im allTasks-Array gefunden.`);
        return;
    }
}

function getTaskId(taskId) {
    // Verwende den übergebenen Task und extrahiere die ID
    return taskId.id;
}

function closeTaskOverviewPopUp() {
    inWhichContainer = [];
    const addTaskOverlaySection = document.getElementById('addTaskOverlaySection');
    const overlaySection = document.getElementById('overlaySection');

    // Entferne die Klasse "d-none" aus dem overlaySection
    overlaySection.classList.add('d-none');
    addTaskOverlaySection.classList.add('d-none');
}

function doNotClose(event) {
    event.stopPropagation();
}

function forClearAddTaskWithBtn() {
    // Reset title and description input fields
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description_text');
    titleInput.value = '';
    descriptionInput.value = '';

    // Reset assigned to dropdown
    const assignedToSelect = document.getElementById('which_assigned_contact');
    assignedToSelect.selectedIndex = 0;

    // Reset due date input
    const dueDateInput = document.getElementById('createdAt');
    dueDateInput.value = '';

    // Reset priority buttons
    // Reset priority buttons
    const urgentBtn = document.getElementById('addTask_overlay_urgent_btn');
    const mediumBtn = document.getElementById('addTask_overlay_medium_btn');
    const lowBtn = document.getElementById('addTask_overlay_low_btn');

    const urgentBtnClicked = document.getElementById('addTask_overlay_clicked_urgent_btn');
    const mediumBtnClicked = document.getElementById('addTask_overlay_clicked_medium_btn');
    const lowBtnClicked = document.getElementById('addTask_overlay_clicked_low_btn');

    urgentBtn.classList.remove('d-none');
    mediumBtn.classList.remove('d-none');
    lowBtn.classList.remove('d-none');

    urgentBtnClicked.classList.add('d-none')
    mediumBtnClicked.classList.add('d-none')
    lowBtnClicked.classList.add('d-none')



    const categoryDropdown = document.getElementById('categoryDropdown');
    const categoryContainer = document.getElementById('category');

    // Hole alle Div-Elemente mit der Klasse "categoryOption" im Container mit der ID "categoryDropdown"
    const categoryOptions = categoryDropdown.getElementsByClassName('categoryOption');

    // Überprüfe, ob es ein zweites Element in der Liste der "categoryOption"-Elemente gibt
    if (categoryOptions.length >= 2) {
        // Erhalte das zweite Element der "categoryOption"-Elemente
        const secondCategoryOption = categoryOptions[1];

        // Füge das zweite Element in den Container mit der ID "category" hinzu
        categoryContainer.innerHTML = secondCategoryOption.outerHTML;
    }
    // Reset subtask input and list
    const subtaskInput = document.getElementById('subtaskInput');
    const subtaskList = document.getElementById('subtaskList');
    subtaskInput.value = '';
    subtaskList.innerHTML = '';

    resetAssignedField();
}

function clearAddTaskFields() {
    // Reset title and description input fields
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description_text');
    titleInput.value = '';
    descriptionInput.value = '';

    // Reset assigned to dropdown
    const assignedToSelect = document.getElementById('which_assigned_contact');
    assignedToSelect.selectedIndex = 0;

    // Reset due date input
    const dueDateInput = document.getElementById('createdAt');
    dueDateInput.value = '';

    // Reset priority buttons
    // Reset priority buttons
    const urgentBtn = document.getElementById('addTask_overlay_urgent_btn');
    const mediumBtn = document.getElementById('addTask_overlay_medium_btn');
    const lowBtn = document.getElementById('addTask_overlay_low_btn');

    const urgentBtnClicked = document.getElementById('addTask_overlay_clicked_urgent_btn');
    const mediumBtnClicked = document.getElementById('addTask_overlay_clicked_medium_btn');
    const lowBtnClicked = document.getElementById('addTask_overlay_clicked_low_btn');

    urgentBtn.classList.remove('d-none');
    mediumBtn.classList.remove('d-none');
    lowBtn.classList.remove('d-none');

    urgentBtnClicked.classList.add('d-none')
    mediumBtnClicked.classList.add('d-none')
    lowBtnClicked.classList.add('d-none')

    // Reset subtask input and list
    const subtaskInput = document.getElementById('subtaskInput');
    const subtaskList = document.getElementById('subtaskList');
    subtaskInput.value = '';
    subtaskList.innerHTML = '';

    subtasksArray = [];
    categoryArray = [];
    categoryColorArray = [];
    assignedToValuesArray = [];
    assignedToColorsArray = [];
    assignedShortValues = [];
    createdAtArray = [];
    priorityArray = [];

    resetAssignedField();
}

function changeClearBtnIconToDefault(IdHover, IdDefault) {
    document.getElementById(IdHover).classList.add('d-none');
    document.getElementById(IdDefault).classList.remove('d-none');
}

function changeClearBtnIconToHover(IdDefault, IdHover) {
    document.getElementById(IdDefault).classList.add('d-none');
    document.getElementById(IdHover).classList.remove('d-none');
}

function openOverlay() {
    const overlaySection = document.getElementById('addTaskOverlaySection');
    const overlay = document.getElementById('add-task-form');
    overlay.classList.add('slide-in');
    overlaySection.classList.remove('d-none');
}

function addTaskForToDo() {
    const overlaySection = document.getElementById('addTaskOverlaySection');
    const overlay = document.getElementById('add-task-form');
    overlay.classList.add('slide-in');
    overlaySection.classList.remove('d-none');
    inWhichContainer.push('for-To-Do-Container'); // Füge 'for-To-Do-Container' zum Array hinzu
}

function addTaskForInProgress() {
    const overlaySection = document.getElementById('addTaskOverlaySection');
    const overlay = document.getElementById('add-task-form');
    overlay.classList.add('slide-in');
    overlaySection.classList.remove('d-none');
    inWhichContainer.push('in-Progress-Container');
}

function addTaskForAwaitFeedback() {
    const overlaySection = document.getElementById('addTaskOverlaySection');
    const overlay = document.getElementById('add-task-form');
    overlay.classList.add('slide-in');
    overlaySection.classList.remove('d-none');
    inWhichContainer.push('for-Await-Feedback-Container');
}

function closeOverlay() {
    inWhichContainer = [];
    const overlaySection = document.getElementById('addTaskOverlaySection');
    const overlay = document.getElementById('addTaskOverlaySection');
    overlay.classList.remove('slide-in');
    overlaySection.classList.add('d-none');
}

