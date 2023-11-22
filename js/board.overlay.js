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
            // Zeige den Value als Tooltip an
            event.target.setAttribute('title', event.target.getAttribute('value'));
        }
    });
    document.addEventListener('mouseout', (event) => {
        if (event.target.classList.contains('assigneeContainer')) {
            // Entferne den Tooltip, wenn der Hover beendet ist
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
        const checkbox = document.createElement('input');
        const listItem = document.createElement('li');
        const editIcon = document.createElement('div');
        const deleteIcon = document.createElement('div');
        styleCheckbox(checkbox);
        styleListItem(listItem, subtaskText);
        styleEditIcon(editIcon);
        styleDeleteIcon(deleteIcon);
        appendChildForSubTextElements(checkbox, subtaskText, listItem, editIcon, deleteIcon, boardSubtaskList);
        subtaskBoardInput.value = '';
    }
}

function styleCheckbox(checkbox) {
    checkbox.type = 'checkbox';
    checkbox.classList.add('subtask-checkbox');
}

function styleListItem(listItem, subtaskText) {
    listItem.classList.add('subtask-item');
    const listElementId = generateUniqueID(); // Generiere eine eindeutige ID für das Listenelement
    listItem.id = listElementId;
    listItem.textContent = subtaskText;
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
    listItem.appendChild(checkbox); // Füge Checkbox hinzu
    listItem.appendChild(editIcon);
    listItem.appendChild(deleteIcon);
    boardSubtaskList.appendChild(listItem);
    subtasksArray.push(subtaskText);
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


//-------------------------------------------------Macht diese Funktion nichts?-------------------------------------------------//
// function addTaskFromBoardOverlay() {
//     let titleInput = document.getElementById('title');
//     let descriptionInput = document.getElementById('description_text');
//     let categorySelect = document.getElementById('category');
//     let createdAtInput = document.getElementById('createdAt');
//     let assignedToValues = [];
//     const assignedToDivs = document.querySelectorAll('#ballAssignedToList .assigneeContainer');
//     assignedToDivs.forEach(div => {
//         const assignedValue = div.getAttribute('value');
//         if (assignedValue) {
//             assignedToValues.push(assignedValue);
//         }
//     });

//     let categoryColor = categorySelect.querySelector('.categoryColor').style.backgroundColor;
//     let title = titleInput.value;
//     let description = descriptionInput.value;
//     let category = categorySelect.innerText;
//     let assignedTo = assignedToDiv.innerText;
//     let createdAt = createdAtInput.value;

//     const selectedAssigneeContainer = document.querySelector('.assigneeContainer');
//     let assignedToColor = null;

//     if (selectedAssigneeContainer && !selectedAssigneeContainer.classList.contains('not_selected')) {
//         assignedToColor = selectedAssigneeContainer.style.backgroundColor;
//         assignedToColorsArray.push(assignedToColor);
//     }
//     let id = generateUniqueID();
//     let priority = null;
//     const priorityButtons = document.querySelectorAll('.prio_btn_characteristics');
//     for (const button of priorityButtons) {
//         if (!button.classList.contains('d-none')) {
//             priority = button.value;
//             priorityArray.push(priority);
//             break;
//         }
//     }

//     let task = {
//         id: id,
//         title: title,
//         description_text: description,
//         task_category: category,
//         which_assigned_contact: assignedTo,
//         createdAt: createdAt,
//         priority: priorityArray,
//         assignedToValues: assignedToValues,
//         assignedToColors: [assignedToColor],
//         subtasks: subtasksArray,
//         categoryColors: categoryColorArray
//     };

//     allTasks.push(task);
//     titlesArray.push(title);
//     descriptionsArray.push(description);
//     createdAtArray.push(createdAtInput.value);
//     categoryArray.push(categorySelect.innerText);
//     categoryColorArray.push(categoryColor);

//     // Push assigned value to the array
//     const assignedValue = selectedOption.value;
//     // Push assigned values to the array
//     assignedToValuesArray.push(...assignedToValues);







//     // Reset the input fields
//     createdAtInput.value = '';
//     titleInput.value = '';
//     descriptionInput.value = '';
//     subtaskInput.value = '';
//     which_assigned_contact.value = '';
//     // Annahme: "subtaskItems" ist die Klasse der Elemente, die du löschen möchtest
//     let subtaskItems = document.getElementsByClassName('subtask-item');
//     for (let i = 0; i < subtaskItems.length; i++) {
//         subtaskItems[i].innerHTML = ''; // Hier wird der Inhalt jedes Elements geleert
//     }

//     // Setze die Prioritätsbuttons zurück
//     const urgentBtn = document.getElementById('normal_urgent_btn');
//     const mediumBtn = document.getElementById('normal_medium_btn');
//     const lowBtn = document.getElementById('normal_low_btn');

//     if (urgentBtn) {
//         urgentBtn.classList.remove('d-none');
//     }

//     if (mediumBtn) {
//         mediumBtn.classList.remove('d-none');
//     }

//     if (lowBtn) {
//         lowBtn.classList.remove('d-none');
//     }

//     // Setze die Prioritätsbuttons zurück
//     const clickedUrgentBtn = document.getElementById('clicked_urgent_btn');
//     const clickedMediumBtn = document.getElementById('clicked_medium_btn');
//     const clickedLowBtn = document.getElementById('clicked_low_btn');

//     if (clickedUrgentBtn) {
//         clickedUrgentBtn.classList.add('d-none');
//     }

//     if (clickedMediumBtn) {
//         clickedMediumBtn.classList.add('d-none');
//     }

//     if (clickedLowBtn) {
//         clickedLowBtn.classList.add('d-none');
//     }



//     // Füge die gewünschte Option zum Select-Element hinzu
//     const whichAssignedContactSelect = document.getElementById('which_assigned_contact');
//     const newOption = document.createElement('option');
//     newOption.value = 'Select contacts to assign';
//     newOption.setAttribute('data-id', '_igorovhy5');
//     newOption.setAttribute('data-color', '');
//     newOption.innerText = 'Select contacts to assign';

//     // Füge die neue Option hinzu
//     whichAssignedContactSelect.add(newOption);


//     saveTasks();

// }





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