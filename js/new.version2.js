function editingShowTask() {


//Done
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

    const subtasksList = task.subtasks.map((subtaskText, index) => {
        const subtaskId = task.subtasksId[index]; // Abrufen der entsprechenden ID für die Unteraufgabe

        return `<li id="${subtaskId}" class="subtask-item">
            <input type="checkbox" class="subtask-checkbox">
            ${subtaskText}
            <div class="pencil_icon_div">
                <img class="addSubTaskIcons icon pencil" src="../assets/img/pencil-32.png" alt="" onclick="editSubtask(event)">
            </div>
            <div class="delete_icon_div">
                <img class="addSubTaskIcons icon delete" src="../assets/img/delete-32.png" alt="" onclick="deleteSubtask(event)">
            </div>
        </li>`;
    }).join('');

//Done

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
    applyLineThroughAndCheckbox(currentTaskId);
}
//Done

//Done
function boardConfirm() {
    event.preventDefault();
    const taskId = currentTaskId;
    const title = document.getElementById('boardOverlayTitle').value;
    const descriptionText = document.getElementById('boardOverlaydescriptionText').value;
    const assignedToDiv = document.getElementById('ballAssignedToList');
    const dueDate = document.getElementById('editedCreatedAt');
    const dueDateInput = dueDate.value;
    const boardOverlaySubTaskList = document.getElementById('boardSubtaskList');
    const subtaskItems = document.querySelectorAll('.subtask-item');

    const subtasksArray = [];
    const subtasksStatusArray = [];
    const subtasksTextArray = []; // Array für Subtask-Texte
    const subtasksIdArray = []; // Array für Subtask-Id's

    subtaskItems.forEach(item => {
        const text = item.textContent.trim(); // Hier wird der Text des subtask-items genommen
        const id = item.id; // Hier wird die ID des Subtasks genommen

        subtasksArray.push({ text }); // Füge das Subtask-Objekt hinzu
        subtasksStatusArray.push(item.querySelector('.subtask-checkbox').checked);
        subtasksTextArray.push(text); // Füge den Subtask-Text hinzu
        subtasksIdArray.push(id); // Füge die Subtask-ID hinzu

        // Hier kannst du die updateProgressBar-Funktion für jeden Subtask aufrufen
        updateProgressBar(taskId, id); // item.id sollte die Subtask-ID sein
    });
//Done
//Done
    const taskIndex = allTasks.findIndex(task => task.id === taskId);

    // Hier fügst du die Aktualisierung der Subtask-Status ein
    // allTasks[taskIndex].subtasksStatus = subtasksStatusArray.slice(); // Klonen des Arrays

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
//Done
        // Überprüfe, ob das priorityArray leer ist, und greife auf die vorherige Priorität zu, falls vorhanden
        const previousPriority = allTasks[taskIndex].priority;
        const updatedPriority = priorityArray.length > 0 ? priorityArray : previousPriority;

        // Direktes Aktualisieren der spezifischen Task-Eigenschaften als Array
        allTasks[taskIndex].title = title;
        allTasks[taskIndex].description_text = descriptionText;
        allTasks[taskIndex].createdAt = dueDateInput;
        allTasks[taskIndex].priority = updatedPriority.slice(); // Klonen des Arrays
        allTasks[taskIndex].subtasks = subtasksTextArray; // Klonen des Arrays für Texte
        allTasks[taskIndex].subtasksId = subtasksIdArray; // Klonen des Arrays für IDs
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
//Done


//Done
function forClearAddTaskWithBtn() {
    cancelNewCategory();
    closeCategoryDropdown();
    subtasksArray = [];
    categoryArray = [];
    categoryColorArray = [];
    assignedToValuesArray = [];
    assignedToColorsArray = [];
    assignedShortValues = [];
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

    resetAssignedField();
}
//Done


//Done
function checkProgressBar(taskId) {
        const task = allTasks.find(task => task.id === taskId);
        if (!task) {
            console.error(`Task mit der ID "${taskId}" wurde nicht gefunden.`);
            return;
        }
        const progressBarId = task.progressBarId;
        const progressBar = document.getElementById(`progress-bar-${progressBarId}`);
        if (!progressBar) {
            console.error(`Progress-Bar mit der ID "${progressBarId}" wurde nicht gefunden.`);
            return;
        }
        const subtasks = task.subtasks;
        const subtasksStatus = task.subtasksStatus || [];
        const filledSubtasksCount = subtasksStatus.filter(status => status).length;
        const progressPercentage = (filledSubtasksCount / subtasks.length) * 100;
        progressBar.style.transition = 'width 0.5s ease';
        progressBar.style.height = '100%';
        progressBar.style.backgroundColor = '#29ABE2';
        progressBar.style.width = `${progressPercentage}%`;
    }
//Done

//Done
    function addSubtaskToBoard() {
        const subtaskBoardInput = document.getElementById('subtaskBoardInput');
        const subtaskText = subtaskBoardInput.value.trim();
    
        if (subtaskText !== '') {
            // Erhalte eine Referenz zur Subtask-Liste auf dem Board
            const boardSubtaskList = document.getElementById('boardSubtaskList');
    
            // Erstelle ein neues Listenelement
            const listItem = document.createElement('li');
            listItem.classList.add('subtask-item'); // Füge Klasse hinzu
            const listElementId = generateUniqueID(); // Generiere eine eindeutige ID für das Listenelement
            listItem.id = listElementId;
    
            // Erstelle eine Checkbox und füge sie zum Listenelement hinzu
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('subtask-checkbox');
            listItem.appendChild(checkbox); // Füge Checkbox hinzu
    
            // Setze den Text des Listenelements basierend auf der Eingabe
            listItem.appendChild(document.createTextNode(subtaskText)); // Setze Text nach Checkbox
    
            // Erstelle das Edit-Icon und füge es zum Listenelement hinzu
            const editIcon = document.createElement('div');
            editIcon.classList.add('pencil_icon_div');
            editIcon.innerHTML = `<img class="addSubTaskIcons icon pencil" src="../assets/img/pencil-32.png" alt="" onclick="editSubtask(event)">`;
    
            // Erstelle das Delete-Icon und füge es zum Listenelement hinzu
            const deleteIcon = document.createElement('div');
            deleteIcon.classList.add('delete_icon_div');
            deleteIcon.innerHTML = `<img class="addSubTaskIcons icon delete" src="../assets/img/delete-32.png" alt="" onclick="deleteSubtask(event)">`;
    //Done
            // Füge Icons zum Listenelement hinzu
            listItem.appendChild(editIcon);
            listItem.appendChild(deleteIcon);
    
            // Füge das Listenelement zur Subtask-Liste auf dem Board hinzu
            boardSubtaskList.appendChild(listItem);
    
            // Füge das Listenelement dem subtasksArray hinzu
            subtasksArray.push(subtaskText);
    
            // Leere das Eingabefeld nach Hinzufügen des Subtasks
            subtaskBoardInput.value = '';
        }
    }
