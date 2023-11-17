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
let categoryArray = [];  // Array für die Kategorien
let categoryColorArray = [];  // Array für die Kategoriefarben
let subtasksArray = [];  // Array für Subtasks
let assignedToIDsArray = [];
let assignedShortValues = [];

function addTask() {
    event.preventDefault();
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description_text');
    const categorySelect = document.getElementById('category');
    const createdAtInput = document.getElementById('createdAt');
    const subtaskInput = document.getElementById('subtaskInput');
    const subtaskList = document.getElementById('subtaskList');

    const categoryColor = categorySelect ? categorySelect.querySelector('.categoryColor').style.backgroundColor : '';
    const title = titleInput.value;
    const description = descriptionInput.value;
    const category = categorySelect ? categorySelect.innerText : '';
    const createdAt = createdAtInput.value;
    getValueForTaskContacts();

    // Überprüfe, ob die erforderlichen Felder gefüllt sind
    if (title && description && createdAt && priorityArray.length > 0 && assignedToValuesArray.length > 0) {
        createTask(title, description, createdAt, category, categoryColor, createdAtInput, titleInput, descriptionInput, subtaskInput, subtaskList);

    } else {
        showNotification();
        // Zurücksetzen der Arrays
        resetTaskInformation()
    }

} // end of addTask

function createTask(title, description, createdAt, category, categoryColor, createdAtInput, titleInput, descriptionInput, subtaskInput, subtaskList) {
    pushAndSaveTaskToUser(title, description, createdAt, category, categoryColor);
    resetInputFields(createdAtInput, titleInput, descriptionInput, subtaskInput, subtaskList);
    resetSubTaskItems()
    removeStylefromPrirorityButton();
    addStylefromPrirorityButton();
    showFinalNotification();
    setTimeout(() => {
        redirectToBoard();
    }, 3000);
    clearInputFields();
}

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

function createTaskArray(title, description, category, createdAt) {
    const id = generateUniqueID();
    let task = {
        id: id,
        title: title,
        description_text: description,
        task_category: category,
        createdAt: createdAt,
        priority: priorityArray, // Add priority to the task
        subtasks: subtasksArray,
        categoryColors: categoryColorArray,
        assignedToValues: assignedToValuesArray,  // Füge die Werte hinzu
        assignedToColors: assignedToColorsArray,  // Füge die Farben hinzu
        assignedShortValues: assignedShortValues  // Füge die Texte hinzu
    };
    return task;
}

function pushAndSaveTaskToUser(title, description, createdAt, category, categoryColor) {
    let task = createTaskArray(title, description, category, createdAt);
    titlesArray.push(title);
    descriptionsArray.push(description);
    createdAtArray.push(createdAt);
    categoryArray.push(category);
    categoryColorArray.push(categoryColor);
    allTasks.push(task);
    saveTasks();
}

function resetInputFields(createdAtInput, titleInput, descriptionInput, subtaskInput, subtaskList) {
    createdAtInput.value = '';
    titleInput.value = '';
    descriptionInput.value = '';
    subtaskInput.value = '';
    subtaskList.innerHTML = '';
}

function resetSubTaskItems() {
    let subtaskItems = document.getElementsByClassName('subtask-item');
    for (let i = 0; i < subtaskItems.length; i++) {
        subtaskItems[i].innerHTML = '';
    }
}

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

function showNotification() {
    if (assignedToValuesArray.length === 0) {
        showContactsNotification();
    } else if (priorityArray.length === 0) {
        showPrioNotification();
    } else {
        // Wenn alle Arrays gefüllt sind, können Sie hier eine abschließende Benachrichtigung anzeigen.
        showFinalNotification();
    }
}

function resetTaskInformation() {
    subtasksArray = [];
    categoryArray = [];
    categoryColorArray = [];
    assignedToValuesArray = [];
    assignedToColorsArray = [];
    assignedShortValues = [];
    createdAtArray = [];
}

// Hilfsfunktion zur Generierung einer eindeutigen ID (hier als Beispiel)
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
}

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
        const subtaskList = document.getElementById('subtaskList');
        const listItem = document.createElement('li');
        const editIcon = document.createElement('div');
        const deleteIcon = document.createElement('div');
        createListItem(listItem, subtaskText);
        buildEditIcon(editIcon);
        buildDeleteIcon(deleteIcon);
        createAppendChildElement(listItem, editIcon, deleteIcon, subtaskList, subtaskInput, subtaskText);
    }
}

function createListItem(listItem, subtaskText) {
    listItem.classList.add('subtask-item');  // Füge Klasse hinzu
    listItem.id = 'listElementId';
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

function createAppendChildElement(listItem, editIcon, deleteIcon, subtaskList, subtaskInput, subtaskText) {
    listItem.appendChild(editIcon);
    listItem.appendChild(deleteIcon);
    subtaskList.appendChild(listItem);
    subtasksArray.push(subtaskText);
    subtaskInput.value = '';
}

function editSubtask(event) {
    const subtaskItem = event.target.closest('.subtask-item');
    const subtaskText = subtaskItem.textContent.trim();
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
        subtaskItem.textContent = editedText;
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