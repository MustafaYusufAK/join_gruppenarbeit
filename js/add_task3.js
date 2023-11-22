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

function editFirstSubtask(event) {
    const subtaskItem = event.target.closest('.subtask-item');
    const subtaskText = subtaskItem.textContent.trim();
    if (subtaskItem.classList.contains('lineThrough')) {
        subtaskItem.classList.remove('lineThrough');
    }
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = subtaskText;
    const checkmarkIcon = document.createElement('img');
    checkmarkIcon.classList.add('addSubTaskIcons', 'icon', 'checkmark');
    checkmarkIcon.src = '../assets/img/check-mark-3-32.png';
    checkmarkIcon.alt = 'Apply Changes';
    checkmarkIcon.addEventListener('click', () => {
        const editedText = inputField.value.trim();
        subtaskItem.innerHTML = '';
        subtaskItem.appendChild(document.createTextNode(editedText)); // Füge den bearbeiteten Text hinzu
        subtaskItem.appendChild(createFirstEditIcon()); // Füge Edit-Icon hinzu
        subtaskItem.appendChild(createDeleteIcon()); // Füge Delete-Icon hinzu
    });
    subtaskItem.innerHTML = '';
    subtaskItem.appendChild(inputField);
    subtaskItem.appendChild(checkmarkIcon);
    inputField.focus(); // Den Fokus auf das Input-Feld setzen
}

function createFirstEditIcon() {
    const editIconContainer = document.createElement('div');  // Div für das Edit-Icon
    editIconContainer.classList.add('edit-icon-container');
    const editIcon = document.createElement('img');
    editIcon.classList.add('addSubTaskIcons', 'icon', 'pencil');
    editIcon.src = '../assets/img/pencil-32.png';
    editIcon.alt = '';
    editIcon.onclick = editFirstSubtask;
    editIconContainer.appendChild(editIcon);
    return editIconContainer;
}