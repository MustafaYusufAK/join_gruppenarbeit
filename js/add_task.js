async function init() {
    await loadTasks();
    await loadContacts();
    generateSideBar();
    clickEventlisteners();
    createContactDropdown();
    getRandomColor();
    assignOptionIDs();
    setMinDate();
}

let selectedPrioButton = null;
let titlesArray = [];
let descriptionsArray = [];
let assignedToValuesArray = [];
let assignedToColorsArray = [];
let createdAtArray = [];
let priorityArray = [];
let categoryArray = [];
let categoryColorArray = [];
let subtasksArray = [];
let subTasks = [];
let assignedToIDsArray = [];
let assignedShortValues = [];
let subtaskTextsArray = [];
let subtaskIdsArray = [];
/**
 * add new Task to Contacts
 */
function addTask() {
    event.preventDefault();
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description_text');
    const createdAtInput = document.getElementById('createdAt');
    const subtaskInput = document.getElementById('subtaskInput');
    const subtaskItems = document.querySelectorAll('.subtask-item');
    const subtaskList = document.getElementById('subtaskList');
    const newCategoryContainer = document.getElementById('newCategoryContainer');
    const newCategoryInput = document.getElementById('newCategoryInput');
    const newCategoryColor = document.getElementById('newCategoryColor');
    const title = titleInput.value;
    const description = descriptionInput.value;
    const createdAt = createdAtInput.value;
    if (!newCategoryContainer.classList.contains('d-none')) {
        if (newCategoryInput && !newCategoryInput.value.trim()) {
            categoryNotification();
            return; // Beende die Funktion, um das Hinzufügen der Aufgabe zu verhindern
        }
        if (newCategoryColor && !newCategoryColor.style.backgroundColor) {
            categoryColorNotification();
            return; // Beende die Funktion, um das Hinzufügen der Aufgabe zu verhindern
        }
        if (newCategoryInput && newCategoryInput.value.trim() && newCategoryColor && newCategoryColor.style.backgroundColor) {
            confirmCategoryNotification();
            return; // Beende die Funktion, um das Hinzufügen der Aufgabe zu verhindern oder führe andere erforderliche Aktionen aus
        }
    }
    getValueForTaskContacts();
    if (title && description && createdAt && priorityArray.length > 0 && assignedToValuesArray.length > 0) {
        createTask(title, description, createdAt, createdAtInput, titleInput, descriptionInput, subtaskInput, subtaskItems);
        checkUpNewCategory();
    } else {
        showNotification();
        resetTaskInformation()
    }

}


function checkUpNewCategory() {
    // Überprüfe, ob der Div-Container "newCategoryContainer" nicht die Klasse "d-none" hat
    if (!newCategoryContainer.classList.contains('d-none')) {
        // Überprüfe, ob im Input-Feld "newCategoryInput" etwas vorhanden ist
        if (newCategoryInput && !newCategoryInput.value.trim()) {
            categoryNotification();
            return; // Beende die Funktion, um das Hinzufügen der Aufgabe zu verhindern
        }

        // Überprüfe, ob "style="background-color:"" im Div-Container "newCategoryColor" vorhanden ist
        if (newCategoryColor && !newCategoryColor.style.backgroundColor) {
            categoryColorNotification();
            return; // Beende die Funktion, um das Hinzufügen der Aufgabe zu verhindern
        }

        // Überprüfe, ob sowohl "newCategoryInput" als auch "newCategoryColor" einen Inhalt haben
        if (newCategoryInput && newCategoryInput.value.trim() && newCategoryColor && newCategoryColor.style.backgroundColor) {
            confirmCategoryNotification();
            return; // Beende die Funktion, um das Hinzufügen der Aufgabe zu verhindern oder führe andere erforderliche Aktionen aus
        }
    }
}



/**
 * generate a task
 * @param {title value} title 
 * @param {description value} description 
 * @param {due date of task} createdAt
 * @param {ID Element of due date} createdAtInput 
 * @param {title of task} titleInput 
 * @param {description of task} descriptionInput 
 * @param {ID Element of subtask input} subtaskInput 
 * @param {ID Element of subtask list} subtaskList 
 */
function createTask(title, description, createdAt, createdAtInput, titleInput, descriptionInput, subtaskInput, subtaskItems) {
    subtaskItems.forEach(subtask => {
        const subtaskText = subtask.textContent.trim(); // Text der Unteraufgabe
        const subtaskId = subtask.id; // ID des li-Elements
        if (subtaskText && subtaskId) {
            subtaskTextsArray.push(subtaskText);
            subtaskIdsArray.push(subtaskId);
        }
    });

    const categorySelect = document.getElementById('category');
    const categoryColor = categorySelect ? categorySelect.querySelector('.categoryColor').style.backgroundColor : '';
    const category = categorySelect ? categorySelect.innerText.trim() : '';
    if (category === 'Select task category') {
        selectCategoryNotification();
        return; // Beende die Funktion, um das Hinzufügen der Aufgabe zu verhindern

    }
    pushAndSaveTaskToUser(title, description, createdAt, category, categoryColor, subtaskInput, subtaskItems);
    resetInputFields(createdAtInput, titleInput, descriptionInput, subtaskInput, subtaskList);
    resetSubTaskItems()
    removeStylefromPrirorityButton();
    addStylefromPrirorityButton();
    showFinalNotification();
    setTimeout(() => {
        redirectToBoard();
    }, 1600);
    clearInputFields();
}

/**
 * value of assignee Contacts
 */
function getValueForTaskContacts() {
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
 * set stats of task
 * @param {title value} title 
 * @param {description value} description 
 * @param {category for task} category 
 * @param {due date of task} createdAt 
 * @returns 
 */
function createTaskArray(title, description, category, createdAt) {
    const id = generateUniqueID();
    let task = {
        id: id,
        title: title,
        description_text: description,
        task_category: category,
        createdAt: createdAt,
        priority: priorityArray,
        subtasks: subtaskTextsArray,
        subtasksId: subtaskIdsArray,
        categoryColors: categoryColorArray,
        assignedToValues: assignedToValuesArray,
        assignedToColors: assignedToColorsArray,
        assignedShortValues: assignedShortValues,
    };
    return task;
}

/**
 * push and save task for user
 * @param {title value} title 
 * @param {description value} description 
 * @param {due date of task} createdAt 
 * @param {category for task} category 
 * @param {color of category} categoryColor 
 */
function pushAndSaveTaskToUser(title, description, createdAt, category, categoryColor, subtaskInput) {
    if (title && description && createdAt && priorityArray.length > 0) {
        let task = createTaskArray(title, description, category, createdAt);
        titlesArray.push(title);
        descriptionsArray.push(description);
        createdAtArray.push(createdAt);
        categoryArray.push(category);
        categoryColorArray.push(categoryColor);

        allTasks.push(task);
        saveTasks();
    }
}

/**
 * reset inputfields
 * @param {ID Element of due date} createdAtInput 
 * @param {ID Element of title} titleInput 
 * @param {ID Element of description} descriptionInput 
 * @param {ID Element of subtask input} subtaskInput 
 * @param {ID Element of subtask list} subtaskList 
 */
function resetInputFields(createdAtInput, titleInput, descriptionInput, subtaskInput, subtaskList) {
    createdAtInput.value = '';
    titleInput.value = '';
    descriptionInput.value = '';
    subtaskInput.value = '';
    subtaskList.innerHTML = '';
}

/**
 * reset Subtasks
 */
function resetSubTaskItems() {
    let subtaskItems = document.getElementsByClassName('subtask-item');
    for (let i = 0; i < subtaskItems.length; i++) {
        subtaskItems[i].innerHTML = '';
    }
}

/**
 * reset style from prirorty Button
 */
function removeStylefromPrirorityButton() {
    const urgentBtn = document.getElementById('normal_urgent_btn');
    const mediumBtn = document.getElementById('normal_medium_btn');
    const lowBtn = document.getElementById('normal_low_btn');
    if (urgentBtn) {
        urgentBtn.classList.remove('d-none');
    }
    if (mediumBtn) {
        mediumBtn.classList.remove('d-none');
    }
    if (lowBtn) {
        lowBtn.classList.remove('d-none');
    }
}

/**
 * add style from prirorty Button
 */
function addStylefromPrirorityButton() {
    const clickedUrgentBtn = document.getElementById('clicked_urgent_btn');
    const clickedMediumBtn = document.getElementById('clicked_medium_btn');
    const clickedLowBtn = document.getElementById('clicked_low_btn');
    if (clickedUrgentBtn) {
        clickedUrgentBtn.classList.add('d-none');
    }
    if (clickedMediumBtn) {
        clickedMediumBtn.classList.add('d-none');
    }
    if (clickedLowBtn) {
        clickedLowBtn.classList.add('d-none');
    }
}

/**
 * notfication of emptyinput
 */
function showNotification() {
    if (priorityArray.length === 0) {
        showPrioNotification();
    } else {
        showFinalNotification();
    }
}

/**
 * reset Task Information
 */
function resetTaskInformation() {
    subtasksArray = [];
    categoryArray = [];
    categoryColorArray = [];
    assignedToValuesArray = [];
    assignedToColorsArray = [];
    assignedShortValues = [];
    createdAtArray = [];
}

/**
 * generate a unique ID
 * @returns random ID
 */
function generateUniqueID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function clickEventlisteners() {
    document.getElementById('normal_urgent_btn').addEventListener('click', (event) => {
        event.preventDefault();
        handlePrioButtonClick('urgent');
    });
    document.getElementById('normal_medium_btn').addEventListener('click', (event) => {
        event.preventDefault();
        handlePrioButtonClick('medium');
    });
    document.getElementById('normal_low_btn').addEventListener('click', (event) => {
        event.preventDefault();
        handlePrioButtonClick('low');
    });
    document.getElementById('category').onclick = closeCategoryDropdown;
    document.addEventListener('click', function (event) {
        var categoryDiv = document.getElementById('category');
        var targetElement = event.target;
        if (targetElement !== categoryDiv && !categoryDiv.contains(targetElement)) {
            closeCategoryDropdown(); // Funktion wird aufgerufen, wenn außerhalb des categoryDiv geklickt wird
        }
    });
}

/**
 * Setting a minimum selectable date
 */
function setMinDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Monat ist 0-basiert, daher +1
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    document.getElementById('createdAt').min = currentDate;
}


function resetAssignedField() {
    const assignedToList = document.getElementById('assignedToList');
    const assigneeBalls = assignedToList.querySelectorAll('.assigneeContainer');
    const clickEvent = new Event('click', { bubbles: true });
    assigneeBalls.forEach(ball => {
        ball.dispatchEvent(clickEvent);
    });
}

function clearInputFields() {
    cancelNewCategory();
    closeCategoryDropdown();
    resetTaskInformation();
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description_text');
    titleInput.value = '';
    descriptionInput.value = '';
    const assignedToSelect = document.getElementById('which_assigned_contact');
    assignedToSelect.selectedIndex = 0;
    const dueDateInput = document.getElementById('createdAt');
    dueDateInput.value = '';
    resetAssignedField();
}

function resetToNormalButton() {
    const urgentBtn = document.getElementById('normal_urgent_btn');
    const mediumBtn = document.getElementById('normal_medium_btn');
    const lowBtn = document.getElementById('normal_low_btn');
    urgentBtn.classList.remove('d-none');
    mediumBtn.classList.remove('d-none');
    lowBtn.classList.remove('d-none');
}

function resetToClickedButton() {
    const urgentBtnClicked = document.getElementById('clicked_urgent_btn');
    const mediumBtnClicked = document.getElementById('clicked_medium_btn');
    const lowBtnClicked = document.getElementById('clicked_low_btn');
    urgentBtnClicked.classList.add('d-none')
    mediumBtnClicked.classList.add('d-none')
    lowBtnClicked.classList.add('d-none')
}

function changeClearBtnIconToDefault(IdHover, IdDefault) {
    document.getElementById(IdHover).classList.add('d-none');
    document.getElementById(IdDefault).classList.remove('d-none');
}

function changeClearBtnIconToHover(IdDefault, IdHover) {
    document.getElementById(IdDefault).classList.add('d-none');
    document.getElementById(IdHover).classList.remove('d-none');
}

function addSubtask() {
    const subtaskInput = document.getElementById('subtaskInput');
    const subtaskText = subtaskInput.value.trim();
    if (subtaskText !== '') {
        const subtaskId = generateUniqueID();
        subtaskTextsArray.push(subtaskText);
        subtaskIdsArray.push(subtaskId);
        const subtaskList = document.getElementById('subtaskList');
        const checkbox = document.createElement('input');
        const listItem = document.createElement('li');
        listItem.classList.add('subtask-item');
        const listElementId = generateUniqueID();
        listItem.id = listElementId;
        const editIcon = document.createElement('div');
        const deleteIcon = document.createElement('div');
        styleCheckbox(checkbox);
        styleListItem(listItem);
        styleEditIcon(editIcon);
        styleDeleteIcon(deleteIcon);
        createAppendChildElement(listItem, editIcon, deleteIcon, subtaskList, subtaskText, checkbox, listElementId);
        subtaskInput.value = '';
    }
}

function createListItem(listItem, subtaskText, listElementId) {
    listItem.classList.add('subtask-item');
    listItem.id = listElementId;
    listItem.textContent = subtaskText;
}

function buildEditIcon(editIcon) {
    editIcon.classList.add('pencil_icon_div');
    editIcon.innerHTML = `<img class="addSubTaskIcons icon pencil" src="../assets/img/pencil-32.png" alt="" onclick="editSubtask(event)">`;
}

function buildDeleteIcon(deleteIcon) {
    deleteIcon.classList.add('delete_icon_div');
    deleteIcon.innerHTML = `<img class="addSubTaskIcons icon delete" src="../assets/img/delete-32.png" alt="" onclick="deleteSubtask(event)">`;
}

function createAppendChildElement(listItem, editIcon, deleteIcon, subtaskList, subtaskText, checkbox, listElementId) {
    listItem.appendChild(checkbox);
    listItem.appendChild(document.createTextNode(subtaskText));
    listItem.appendChild(editIcon);
    listItem.appendChild(deleteIcon);
    subtaskList.appendChild(listItem);
    subtasksArray.push({ id: listElementId, text: subtaskText });
    subtaskIdsArray.push();
}

function editSubtask(event) {
    const subtaskItem = event.target.closest('.subtask-item');
    const subtaskText = subtaskItem.textContent.trim();
    if (subtaskItem.classList.contains('lineThrough')) {
        subtaskItem.classList.remove('lineThrough');
    }
    const inputField = document.createElement('input');
    const checkmarkIcon = document.createElement('img');
    inputField.type = 'text';
    inputField.value = subtaskText;
    createCheckMarkIcon(inputField, subtaskItem, checkmarkIcon);
    subtaskItem.innerHTML = '';
    subtaskItem.appendChild(inputField);
    subtaskItem.appendChild(checkmarkIcon);
    inputField.focus(); // Den Fokus auf das Input-Feld setzen
}

function createCheckMarkIcon(inputField, subtaskItem, checkmarkIcon) {
    checkmarkIcon.classList.add('addSubTaskIcons', 'icon', 'checkmark');
    checkmarkIcon.src = '../assets/img/check-mark-3-32.png';
    checkmarkIcon.alt = 'Apply Changes';
    checkmarkIcon.onclick = applyChanges;
    checkmarkIcon.addEventListener('click', () => {
        const editedText = inputField.value.trim();
        // Checkbox erstellen
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('subtask-checkbox');
        subtaskItem.innerHTML = '';
        subtaskItem.appendChild(checkbox);
        subtaskItem.appendChild(document.createTextNode(editedText));
        subtaskItem.appendChild(createEditIcon());
        subtaskItem.appendChild(createDeleteIcon());
    });
}

function applyChanges(event) {
    const subtaskItem = event.target.closest('.subtask-item');
    if (subtaskItem) {
        subtaskItem.removeChild(event.target);
        const editIcon = document.createElement('div');
        buildEditIcon(editIcon)
        subtaskItem.appendChild(editIcon);
        const deleteIcon = document.createElement('div');
        buildDeleteIcon(deleteIcon)
        subtaskItem.appendChild(deleteIcon);
    }
}

function createEditIcon() {
    const editIconContainer = document.createElement('div');
    editIconContainer.classList.add('edit-icon-container');
    const editIcon = document.createElement('img');
    addAttributesForIcons(editIcon, 'pencil');
    editIcon.onclick = editSubtask;
    editIconContainer.appendChild(editIcon);
    return editIconContainer;
}

function createDeleteIcon() {
    const deleteIconContainer = document.createElement('div');  // Div für das Delete-Icon
    deleteIconContainer.classList.add('delete-icon-container');
    const deleteIcon = document.createElement('img');
    addAttributesForIcons(deleteIcon, 'delete');
    deleteIcon.onclick = deleteSubtask;
    deleteIconContainer.appendChild(deleteIcon);
    return deleteIconContainer;
}

function addAttributesForIcons(icon, path) {
    icon.classList.add('addSubTaskIcons', 'icon', `${path}`);
    icon.src = `../assets/img/${path}-32.png`;
    icon.alt = '';
    icon.onclick = editSubtask;
}

function deleteSubtask(event) {
    const subtaskItem = event.target.closest('.subtask-item');
    subtaskItem.remove();
}

function handlePrioButtonClick(prio) {
    priorityArray = [];
    const normalButtonId = `normal_${prio}_btn`;
    const clickedButtonId = `clicked_${prio}_btn`;
    if (selectedPrioButton === prio) {
        selectedPrioButton = null;
        styleToPrevButton(clickedButtonId, normalButtonId);
    } else {
        if (selectedPrioButton) {
            prevButton(selectedPrioButton)
        };
        selectedPrioButton = prio;
        styleToPrevButton(normalButtonId, clickedButtonId);
        priorityArray.push(prio);
    }
}

function styleToPrevButton(addToButton, removeFromButton) {
    document.getElementById(addToButton).classList.add('d-none');
    document.getElementById(removeFromButton).classList.remove('d-none');
}

function prevButton(selectedPrioButton) {
    const prevNormalButtonId = `normal_${selectedPrioButton}_btn`;
    const prevClickedButtonId = `clicked_${selectedPrioButton}_btn`;
    document.getElementById(prevNormalButtonId).classList.remove('d-none');
    document.getElementById(prevClickedButtonId).classList.add('d-none');
}