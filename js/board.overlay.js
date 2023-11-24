const assignedValuesSet = new Set();

function boardOverlayContactDropdown(assignedToOptions) {
    let dropdown = document.getElementById('boardOverlayContact');
    let defaultOption = document.createElement('option');
    generateContactsForBoardOverlay(assignedToOptions, dropdown);
    generateOptionValueDropdown(dropdown, defaultOption);
    dropdown.addEventListener('change', (event) => {
        let selectedContact = contacts.find(contact => contact.name === event.target.value);
        if (selectedContact) {
            generateBallForBoardOverlay(selectedContact);
            generateSelectValueForBoardOverlay(defaultOption, dropdown);
        }
    });
}

async function generateContactsForBoardOverlay(assignedToOptions, dropdown) {
    contacts.forEach(contact => {
        let isContactInDropdown = [...dropdown.options].some(option => option.value === contact.name);
        let option = document.createElement('option');
        fillOptionDropdownForBoardOverlay(option, contact, isContactInDropdown);
        if (assignedToOptions.includes(contact.name)) {
            option.classList.add('d-none');
        }
        option.disabled = isContactInDropdown;
        dropdown.appendChild(option, contact);
    });
}

function fillOptionDropdownForBoardOverlay(option, contact, isContactInDropdown) {
    let isContactAssigned = assignedValuesSet.has(contact.name);
    option.value = contact.name;
    option.textContent = contact.name;
    option.classList.add(isContactAssigned ? 'd-none' : 'not_selected');
    option.disabled = isContactInDropdown;
}

function generateOptionValueDropdown(dropdown, defaultOption) {
    defaultOption.value = 'Select contacts to assign';
    defaultOption.textContent = 'Select contacts to assign';
    defaultOption.selected = true;
    dropdown.insertBefore(defaultOption, dropdown.firstChild);
}

function generateSelectValueForBoardOverlay(defaultOption, dropdown) {
    let selectedValue = event.target.value;
    let selectedOption = dropdown.querySelector(`option[value="${selectedValue}"]`);
    selectedOption.classList.add('d-none');
    defaultOption.textContent = selectedValue;
    assignedValuesSet.add(selectedValue);
}

function generateBallForBoardOverlay(contact) {
    let ballAssignedToList = document.getElementById('ballAssignedToList');
    let assigneeContainer = document.createElement('div');
    styleAssigneeContainerForBoardOverlay(contact, assigneeContainer);
    ballAssignedToList.appendChild(assigneeContainer);
    addEventListenerMouseOverAndOut();
}

function styleAssigneeContainerForBoardOverlay(contact, assigneeContainer) {
    assigneeContainer.classList.add('assigneeContainer');
    const [firstName, lastName] = contact.name.split(' ');
    const randomColor = randomColorGenerator();
    assigneeContainer.style.backgroundColor = randomColor;
    assigneeContainer.innerHTML = `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`;
    assigneeContainer.setAttribute('value', contact.name);
    assigneeContainer.addEventListener('click', () => {
        eventlisterAssigneeContainerForBoardOverlay(assigneeContainer);

    });
}

function eventlisterAssigneeContainerForBoardOverlay(assigneeContainer) {
    assigneeContainer.remove();
    const contactValue = assigneeContainer.getAttribute('value');
    const dropdown = document.getElementById('boardOverlayContact');
    const option = [...dropdown.options].find(opt => opt.value === contactValue);

    if (option) {
        option.classList.remove('d-none');
    }
}

function addEventListenerMouseOverAndOut() {
    document.addEventListener('mouseover', (event) => {
        if (event.target.classList.contains('assigneeContainer')) {
            event.target.setAttribute('title', event.target.getAttribute('value'));
        }
    });
    document.addEventListener('mouseout', (event) => {
        if (event.target.classList.contains('assigneeContainer')) {
            event.target.removeAttribute('title');
        }
    });
}

function randomColorGenerator() {
    const getRandomColorComponent = () => Math.floor(Math.random() * 200);
    const r = getRandomColorComponent();
    const g = getRandomColorComponent();
    const b = getRandomColorComponent();
    return `rgb(${r},${g},${b})`;
}

function boardClickEventlisteners() {
    document.getElementById('board_urgent_btn').addEventListener('click', (event) => {
        event.preventDefault();
        handleBoardOverlayPrioButtonClick('urgent');
    });
    document.getElementById('board_medium_btn').addEventListener('click', (event) => {
        event.preventDefault();
        handleBoardOverlayPrioButtonClick('medium');
    });
    document.getElementById('board_low_btn').addEventListener('click', (event) => {
        event.preventDefault();
        handleBoardOverlayPrioButtonClick('low');
    });
}

function handleBoardOverlayPrioButtonClick(prio) {
    if (selectedPrioButton === prio) {
        prioButtonIsPrio(prio);
    } else {
        if (selectedPrioButton) {
            const prevNormalButtonId = `board_${selectedPrioButton}_btn`;
            const prevClickedButtonId = `board_clicked_${selectedPrioButton}_btn`;
            document.getElementById(prevNormalButtonId).classList.remove('d-none');
            document.getElementById(prevClickedButtonId).classList.add('d-none');
        }
        updatePriority(prio);
    }
}

function prioButtonIsPrio(prio) {
    selectedPrioButton = null;
    document.getElementById(`board_${prio}_btn`).classList.remove('d-none');
    document.getElementById(`board_clicked_${prio}_btn`).classList.add('d-none');
    const index = priorityArray.indexOf(prio);
    if (index !== -1) {
        priorityArray.splice(index, 1);
    }
}

function updatePriority(prio) {
    selectedPrioButton = prio;
    document.getElementById(`board_${prio}_btn`).classList.add('d-none');
    document.getElementById(`board_clicked_${prio}_btn`).classList.remove('d-none');
    priorityArray.push(prio);
}

function addSubtaskToBoard() {
    const subtaskBoardInput = document.getElementById('subtaskBoardInput');
    const subtaskText = subtaskBoardInput.value.trim();
    if (subtaskText !== '') {
        const boardSubtaskList = document.getElementById('boardSubtaskList');
        const listItem = document.createElement('li');
        const checkbox = document.createElement('input');
        const editIcon = document.createElement('div');
        const deleteIcon = document.createElement('div');
        styleCheckbox(checkbox);
        styleListItem(listItem, subtaskText);
        styleEditIcon(editIcon);
        styleDeleteIcon(deleteIcon);
        listItem.appendChild(checkbox);
        listItem.appendChild(document.createTextNode(subtaskText));
        listItem.appendChild(editIcon);
        listItem.appendChild(deleteIcon);
        boardSubtaskList.appendChild(listItem);
        subtaskBoardInput.value = '';
    }
}

function styleCheckbox(checkbox) {
    checkbox.type = 'checkbox';
    checkbox.classList.add('subtask-checkbox');
}

function styleListItem(listItem) {
    listItem.classList.add('subtask-item');
    const listElementId = generateUniqueID();
    listItem.id = listElementId;
}

function styleEditIcon(editIcon) {
    editIcon.classList.add('pencil_icon_div');
    editIcon.innerHTML = `<img class="addSubTaskIcons icon pencil" src="../assets/img/pencil-32.png" alt="" onclick="editSubtask(event)">`;
}

function styleDeleteIcon(deleteIcon) {
    deleteIcon.classList.add('delete_icon_div');
    deleteIcon.innerHTML = `<img class="addSubTaskIcons icon delete" src="../assets/img/delete-32.png" alt="" onclick="deleteSubtask(event)">`;
}

function appendChildForSubTextElements(checkbox, subtaskText, listItem, editIcon, deleteIcon, boardSubtaskList) {
    boardSubtaskList.appendChild(checkbox);
    listItem.textContent = subtaskText;
    listItem.appendChild(editIcon);
    listItem.appendChild(deleteIcon);
    boardSubtaskList.appendChild(listItem);
}

function closeBoardTaskOverviewPopUp() {
    const addTaskOverlaySection = document.getElementById('addTaskOverlaySection');
    const overlaySection = document.getElementById('overlaySection');
    overlaySection.classList.add('d-none');
    addTaskOverlaySection.classList.add('d-none');
}

function clearBoardInputFields() {
    const dropdown = document.getElementById('boardOverlayContact');
    const options = dropdown.options;
    const assigneeContainers = document.querySelectorAll('.assigneeContainer');
    for (let i = 0; i < options.length; i++) {
        const optionValue = options[i].value;
        const isValueMatched = Array.from(assigneeContainers).some(container => container.getAttribute('value') === optionValue);
        if (isValueMatched) {
            options[i].classList.add('d-none');
        } else {
            options[i].classList.remove('d-none');
        }
    }
}

function addFlexDirectionColumn(notification) {
    notification.style.flexDirection = 'column';
}

function setMinDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    document.getElementById('editedCreatedAt').min = currentDate;
}