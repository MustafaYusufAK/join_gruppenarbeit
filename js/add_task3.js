/**
 * Adds a subtask to the list.
 */
function addFirstSubtask() {
    const subtaskInput = document.getElementById('subtaskInput');
    const subtaskText = subtaskInput.value.trim();
    if (subtaskText !== '') {
        const subtaskList = document.getElementById('subtaskList');
        const listElementId = generateUniqueID();
        const listItem = document.createElement('li');
        listItem.classList.add('subtask-item');
        listItem.id = listElementId;
        listItem.appendChild(document.createTextNode(subtaskText));
        const editIcon = document.createElement('div');
        editIcon.classList.add('pencil_icon_div');
        editIcon.innerHTML = `<img class="addSubTaskIcons icon pencil" src="../assets/img/pencil-32.png" alt="" onclick="editFirstSubtask(event)">`;
        const deleteIcon = document.createElement('div');
        deleteIcon.classList.add('delete_icon_div');
        deleteIcon.innerHTML = `<img class="addSubTaskIcons icon delete" src="../assets/img/delete-32.png" alt="" onclick="deleteSubtask(event)">`;
        listItem.appendChild(editIcon);
        listItem.appendChild(deleteIcon);
        subtaskList.appendChild(listItem);
        subtasksArray.push({ id: listElementId, text: subtaskText });
        subtaskInput.value = '';
    }
}

/**
 * Creates an edit icon for subtasks.
 * @returns {HTMLDivElement} - The created edit icon container.
 */
function createEditIcon() {
    const editIconContainer = document.createElement('div');
    editIconContainer.classList.add('pencil_icon_div');
    const editIcon = document.createElement('img');
    editIcon.src = '../assets/img/pencil-32.png';
    editIcon.alt = '';
    editIcon.classList.add('addSubTaskIcons', 'icon', 'pencil');
    editIcon.onclick = editFirstSubtask;
    editIconContainer.appendChild(editIcon);
    return editIconContainer;
}

/**
 * Creates a delete icon for subtasks.
 * @returns {HTMLDivElement} - The created delete icon container.
 */
function createDeleteIcon() {
    const deleteIconContainer = document.createElement('div');
    deleteIconContainer.classList.add('delete_icon_div');
    const deleteIcon = document.createElement('img');
    deleteIcon.src = '../assets/img/delete-32.png';
    deleteIcon.alt = '';
    deleteIcon.classList.add('addSubTaskIcons', 'icon', 'delete');
    deleteIcon.onclick = deleteSubtask;
    deleteIconContainer.appendChild(deleteIcon);
    return deleteIconContainer;
}


/**
 * Edits the first subtask.
 * @param {Event} event - The event object.
 */
function editFirstSubtask(event) {
    const subtaskItem = event.target.closest('.subtask-item');
    const subtaskText = subtaskItem.textContent.trim();
    if (subtaskItem.classList.contains('lineThrough')) 
        subtaskItem.classList.remove('lineThrough');
    const inputField = createInputField(subtaskText);
    const checkmarkIcon = createCheckmarkIcon(inputField);
    subtaskItem.innerHTML = '';
    subtaskItem.appendChild(inputField);
    subtaskItem.appendChild(checkmarkIcon);
    inputField.focus();
}

/**
 * Creates an input field for editing.
 * @param {string} value - The initial value of the input field.
 * @returns {HTMLInputElement} - The created input field element.
 */
function createInputField(value) {
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = value;
    return inputField;
}

/**
 * Creates a checkmark icon for confirming changes.
 * @param {HTMLInputElement} inputField - The associated input field.
 * @returns {HTMLImageElement} - The created checkmark icon element.
 */
function createCheckmarkIcon(inputField) {
    const checkmarkIcon = document.createElement('img');
    checkmarkIcon.classList.add('addSubTaskIcons', 'icon', 'checkmark');
    checkmarkIcon.src = '../assets/img/check-mark-3-32.png';
    checkmarkIcon.alt = 'Apply Changes';
    checkmarkIcon.addEventListener('click', () => {
        const editedText = inputField.value.trim();
        subtaskItem.innerHTML = '';
        subtaskItem.appendChild(document.createTextNode(editedText));
        subtaskItem.appendChild(createEditIcon());
        subtaskItem.appendChild(createDeleteIcon());
    });
    return checkmarkIcon;
}

/**
 * Styles the checkbox for the subtask in the board overlay.
 * @param {HTMLInputElement} checkbox - Checkbox element for the subtask.
 */
function styleCheckbox(checkbox) {
    checkbox.type = 'checkbox';
    checkbox.classList.add('subtask-checkbox');
}