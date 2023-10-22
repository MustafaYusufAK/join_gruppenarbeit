const assignedValuesSet = new Set();

function boardOverlayContactDropdown(assignedToOptions) {
    let dropdown = document.getElementById('boardOverlayContact');

    // Füge Optionen für jeden Kontakt hinzu
    contacts.forEach(contact => {
        // Überprüfe, ob der Kontakt bereits im Dropdown vorhanden ist
        let isContactInDropdown = [...dropdown.options].some(option => option.value === contact.name);

        // Überprüfe, ob der Kontakt bereits von editingShowTask übergeben wurde
        let isContactAssigned = assignedValuesSet.has(contact.name);

        let option = document.createElement('option');
        option.value = contact.name;
        option.textContent = contact.name;
        option.classList.add(isContactAssigned ? 'd-none' : 'not_selected');  // Füge die Klasse hinzu
        option.disabled = isContactInDropdown;  // Deaktiviere, wenn bereits im Dropdown

        // Überprüfe, ob dieser Kontakt auch in assignedToOptions vorkommt
        if (assignedToOptions.includes(contact.name)) {
            option.classList.add('d-none');
        }

        option.disabled = isContactInDropdown;  // Deaktiviere, wenn bereits im Dropdown

        dropdown.appendChild(option);
    });

    // Füge eine Standardoption hinzu
    let defaultOption = document.createElement('option');
    defaultOption.value = 'Select contacts to assign';
    defaultOption.textContent = 'Select contacts to assign';
    defaultOption.selected = true;  // Wähle diese Option aus
    dropdown.insertBefore(defaultOption, dropdown.firstChild); // Füge vor dem ersten Element ein

    // Hinzufügen eines Event-Listeners, um die Option zu deaktivieren und aus dem Dropdown zu entfernen
    dropdown.addEventListener('change', (event) => {
        let selectedContact = contacts.find(contact => contact.name === event.target.value);
        if (selectedContact) {
            // Hier wird die generateBallForBoardOverlay-Funktion aufgerufen
            generateBallForBoardOverlay(selectedContact);

            // Speichere den ausgewählten Wert
            let selectedValue = event.target.value;

            // Füge der ausgewählten Option die Klasse "d-none" hinzu
            let selectedOption = dropdown.querySelector(`option[value="${selectedValue}"]`);
            selectedOption.classList.add('d-none');

            // Aktualisiere den Dropdown-Text mit der zuletzt ausgewählten Option
            defaultOption.textContent = selectedValue;

            // Füge den übergebenen Wert zum Set hinzu
            assignedValuesSet.add(selectedValue);
        }
    });
}








function generateBallForBoardOverlay(contact) {
    let ballAssignedToList = document.getElementById('ballAssignedToList');
    let assigneeContainer = document.createElement('div');
    assigneeContainer.classList.add('assigneeContainer');

    // Extrahiere Informationen aus dem Kontakt
    const [firstName, lastName] = contact.name.split(' ');

    // Generiere eine zufällige Farbe
    const randomColor = randomColorGenerator();

    // Verwende die generierte Farbe
    assigneeContainer.style.backgroundColor = randomColor;

    // Füge die Anfangsbuchstaben hinzu
    assigneeContainer.innerHTML = `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`;

    // Füge das value-Attribut hinzu
    assigneeContainer.setAttribute('value', contact.name);

    // Event-Listener, um den Ball zu entfernen
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

    ballAssignedToList.appendChild(assigneeContainer);

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
    // Generiere eine zufällige Farbe, die nicht zu hell ist (kein Weiß)
    const getRandomColorComponent = () => Math.floor(Math.random() * 200);  // Begrenzt auf 0-199, um Weiß zu vermeiden

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
    const normalButtonId = `board_${prio}_btn`;
    const clickedButtonId = `board_clicked_${prio}_btn`;

    if (selectedPrioButton === prio) {
        // Wenn der ausgewählte Prio-Button erneut geklickt wird, setzen Sie ihn zurück
        selectedPrioButton = null;
        document.getElementById(normalButtonId).classList.remove('d-none');
        document.getElementById(clickedButtonId).classList.add('d-none');

        // Entferne die Priorität aus dem priorityArray
        const index = priorityArray.indexOf(prio);
        if (index !== -1) {
            priorityArray.splice(index, 1);
        }

    } else {
        // Aktivieren Sie den ausgewählten Prio-Button und setzen Sie die anderen zurück
        if (selectedPrioButton) {
            const prevNormalButtonId = `board_${selectedPrioButton}_btn`;
            const prevClickedButtonId = `board_clicked_${selectedPrioButton}_btn`;
            document.getElementById(prevNormalButtonId).classList.remove('d-none');
            document.getElementById(prevClickedButtonId).classList.add('d-none');
        }

        selectedPrioButton = prio;
        document.getElementById(normalButtonId).classList.add('d-none');
        document.getElementById(clickedButtonId).classList.remove('d-none');

        // Füge die Priorität zum priorityArray hinzu
        priorityArray.push(prio);
    }
}



function addSubtaskToBoard() {
    const subtaskBoardInput = document.getElementById('subtaskBoardInput');
    const subtaskText = subtaskBoardInput.value.trim();

    if (subtaskText !== '') {
        // Erhalte eine Referenz zur Subtask-Liste
        const boardSubtaskList = document.getElementById('boardSubtaskList');

        // Erstelle ein neues Listenelement
        const listItem = document.createElement('li');
        listItem.classList.add('subtask-item');  // Füge Klasse hinzu
        listItem.id = 'listElementId';

        // Setze den Text des Listenelements basierend auf der Eingabe
        listItem.textContent = '• ' + subtaskText; // • steht für das Aufzählungszeichen

        // Erstelle das Edit-Icon und füge es zum Listenelement hinzu
        const editIcon = document.createElement('div');
        editIcon.classList.add('pencil_icon_div');
        editIcon.innerHTML = `<img class="addSubTaskIcons icon pencil" src="../assets/img/pencil-32.png" alt="" onclick="editSubtask(event)">`;

        // Erstelle das Delete-Icon und füge es zum Listenelement hinzu
        const deleteIcon = document.createElement('div');
        deleteIcon.classList.add('delete_icon_div');
        deleteIcon.innerHTML = `<img class="addSubTaskIcons icon delete" src="../assets/img/delete-32.png" alt="" onclick="deleteSubtask(event)">`;

        // Füge alles zum Listenelement hinzu
        listItem.appendChild(editIcon);
        listItem.appendChild(deleteIcon);

        // Füge das Listenelement zur Subtask-Liste hinzu
        boardSubtaskList.appendChild(listItem);

        // Füge das Listenelement dem subtasksArray hinzu
        subtasksArray.push(subtaskText);

        // Leere das Eingabefeld nach Hinzufügen des Subtasks
        subtaskBoardInput.value = '';
    }
}


function closeBoardTaskOverviewPopUp() {
    const addTaskOverlaySection = document.getElementById('addTaskOverlaySection');
    const overlaySection = document.getElementById('overlaySection');

    // Entferne die Klasse "d-none" aus dem overlaySection
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









function addTaskFromBoardOverlay() {
    // Get references to the required form elements
    let titleInput = document.getElementById('title');
    let descriptionInput = document.getElementById('description_text');
    let categorySelect = document.getElementById('category');
    let createdAtInput = document.getElementById('createdAt');

    // Extrahiere assignedToValues aus den div-Containern mit der ID "ballAssignedToList"
    const assignedToValues = [];
    const assignedToDivs = document.querySelectorAll('#ballAssignedToList .assigneeContainer');
    assignedToDivs.forEach(div => {
        const assignedValue = div.getAttribute('value');
        if (assignedValue) {
            assignedToValues.push(assignedValue);
        }
    });





    // Check if all required fields are filled

    let categoryColor = categorySelect.querySelector('.categoryColor').style.backgroundColor;        // All required fields are filled, proceed to create the task
    let title = titleInput.value;
    let description = descriptionInput.value;
    let category = categorySelect.innerText;
    let assignedTo = assignedToDiv.innerText;  // Änderung hier
    let createdAt = createdAtInput.value;








    const selectedAssigneeContainer = document.querySelector('.assigneeContainer');
    let assignedToColor = null;

    if (selectedAssigneeContainer && !selectedAssigneeContainer.classList.contains('not_selected')) {
        // Ändere dies, um die Hintergrundfarbe des Containers zu extrahieren
        assignedToColor = selectedAssigneeContainer.style.backgroundColor;
        assignedToColorsArray.push(assignedToColor);
    }
    // Create a unique ID for the task
    let id = generateUniqueID();

    // Get the selected priority
    let priority = null;
    const priorityButtons = document.querySelectorAll('.prio_btn_characteristics');
    for (const button of priorityButtons) {
        if (!button.classList.contains('d-none')) {
            priority = button.value;
            priorityArray.push(priority);  // Push priority to the priorityArray
            break;
        }
    }

    let task = {
        id: id,
        title: title,
        description_text: description,
        task_category: category,
        which_assigned_contact: assignedTo,  // Änderung hier
        createdAt: createdAt,
        priority: priorityArray, // Add priority to the task
        assignedToValues: assignedToValues, // Füge assignedToValues hinzu,
        assignedToColors: [assignedToColor],
        subtasks: subtasksArray,
        categoryColors: categoryColorArray
    };



    // Hinzufügen des Subtasks zuerst zum subtasksArray und dann zu allTasks
    allTasks.push(task);
    titlesArray.push(title);
    descriptionsArray.push(description);
    createdAtArray.push(createdAtInput.value);
    categoryArray.push(categorySelect.innerText);
    categoryColorArray.push(categoryColor);

    // Push assigned value to the array
    const assignedValue = selectedOption.value;
    // Push assigned values to the array
    assignedToValuesArray.push(...assignedToValues);







    // Reset the input fields
    createdAtInput.value = '';
    titleInput.value = '';
    descriptionInput.value = '';
    subtaskInput.value = '';
    which_assigned_contact.value = '';
    // Annahme: "subtaskItems" ist die Klasse der Elemente, die du löschen möchtest
    let subtaskItems = document.getElementsByClassName('subtask-item');
    for (let i = 0; i < subtaskItems.length; i++) {
        subtaskItems[i].innerHTML = ''; // Hier wird der Inhalt jedes Elements geleert
    }

    // Setze die Prioritätsbuttons zurück
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

    // Setze die Prioritätsbuttons zurück
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



    // Füge die gewünschte Option zum Select-Element hinzu
    const whichAssignedContactSelect = document.getElementById('which_assigned_contact');
    const newOption = document.createElement('option');
    newOption.value = 'Select contacts to assign';
    newOption.setAttribute('data-id', '_igorovhy5');
    newOption.setAttribute('data-color', '');
    newOption.innerText = 'Select contacts to assign';

    // Füge die neue Option hinzu
    whichAssignedContactSelect.add(newOption);


    saveTasks();

}