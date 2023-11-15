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
    event.preventDefault();  // Verhindert das Standardverhalten des Formulars (Seitenaktualisierung)

    const assignedToDiv = document.getElementById('assignedToList');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description_text');
    const categorySelect = document.getElementById('category');
    const createdAtInput = document.getElementById('createdAt');
    const subtaskInput = document.getElementById('subtaskInput');
    const subtaskList = document.getElementById('subtaskList');

    const assigneeContainers = assignedToDiv.getElementsByClassName('assigneeContainer');

    for (const container of assigneeContainers) {
        const backgroundColor = container.style.backgroundColor;
        const contactValue = container.getAttribute('data-contact-value');
        const contactText = container.textContent.trim();

        // Füge die Werte den entsprechenden Arrays hinzu
        assignedToColorsArray.push(backgroundColor);
        assignedToValuesArray.push(contactValue);
        assignedShortValues.push(contactText);
    }

    // All required fields are filled, proceed to create the task
    const categoryColor = categorySelect ? categorySelect.querySelector('.categoryColor').style.backgroundColor : '';
    const title = titleInput.value;
    const description = descriptionInput.value;
    const category = categorySelect ? categorySelect.innerText : '';
    const createdAt = createdAtInput.value;

    // Create a unique ID for the task
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

    // Überprüfe, ob die erforderlichen Felder gefüllt sind
    if (title && description && createdAt && priorityArray.length > 0 && assignedToValuesArray.length > 0) {
        // Wenn alles erforderliche gefüllt ist und das priorityArray nicht leer ist
        titlesArray.push(title);
        descriptionsArray.push(description);
        createdAtArray.push(createdAtInput.value);
        categoryArray.push(category);
        categoryColorArray.push(categoryColor);

        allTasks.push(task);
        saveTasks();

        // Reset the input fields
        createdAtInput.value = '';
        titleInput.value = '';
        descriptionInput.value = '';
        subtaskInput.value = '';
        subtaskList.innerHTML = '';

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

        showFinalNotification();
        // Führe die Weiterleitung nach einer kurzen Verzögerung aus
        setTimeout(() => {
            redirectToBoard();
        }, 3000); // Hier können Sie die Zeit in Millisekunden anpassen

        clearInputFields();

    } else {
        if (assignedToValuesArray.length === 0) {
            showContactsNotification();
        } else if (priorityArray.length === 0) {
            showPrioNotification();
        } else {
            // Wenn alle Arrays gefüllt sind, können Sie hier eine abschließende Benachrichtigung anzeigen.
            showFinalNotification();
        }

        // Zurücksetzen der Arrays
        subtasksArray = [];
        categoryArray = [];
        categoryColorArray = [];
        assignedToValuesArray = [];
        assignedToColorsArray = [];
        assignedShortValues = [];
        createdAtArray = [];
    }

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
    // Erstelle ein Date-Objekt für das heutige Datum
    const today = new Date();

    // Holen Sie das Jahr, den Monat und den Tag
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Monat ist 0-basiert, daher +1
    const day = String(today.getDate()).padStart(2, '0');

    // Formatieren Sie das Datum im richtigen Format (YYYY-MM-DD)
    const currentDate = `${year}-${month}-${day}`;

    // Setze das "min"-Attribut des Date-Elements auf das heutige Datum
    document.getElementById('createdAt').min = currentDate;
}

function resetAssignedField() {
    // Zugriff auf den Div-Container mit der ID "assignedToList"
    const assignedToList = document.getElementById('assignedToList');

    // Alle Bälle im Container auswählen
    const assigneeBalls = assignedToList.querySelectorAll('.assigneeContainer');

    // Event-Objekt erstellen
    const clickEvent = new Event('click', { bubbles: true });

    // Event-Listener für jeden Ball manuell auslösen
    assigneeBalls.forEach(ball => {
        ball.dispatchEvent(clickEvent);
    });
}

function clearInputFields() {
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
    const urgentBtn = document.getElementById('normal_urgent_btn');
    const mediumBtn = document.getElementById('normal_medium_btn');
    const lowBtn = document.getElementById('normal_low_btn');

    const urgentBtnClicked = document.getElementById('clicked_urgent_btn');
    const mediumBtnClicked = document.getElementById('clicked_medium_btn');
    const lowBtnClicked = document.getElementById('clicked_low_btn');

    urgentBtn.classList.remove('d-none');
    mediumBtn.classList.remove('d-none');
    lowBtn.classList.remove('d-none');

    urgentBtnClicked.classList.add('d-none')
    mediumBtnClicked.classList.add('d-none')
    lowBtnClicked.classList.add('d-none')

    // Clear the content of assignedToList
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

function addSubtask() {
    const subtaskInput = document.getElementById('subtaskInput');
    const subtaskText = subtaskInput.value.trim();

    if (subtaskText !== '') {
        // Erhalte eine Referenz zur Subtask-Liste
        const subtaskList = document.getElementById('subtaskList');

        // Erstelle ein neues Listenelement
        const listItem = document.createElement('li');
        listItem.classList.add('subtask-item');  // Füge Klasse hinzu
        listItem.id = 'listElementId';
        listItem.textContent = subtaskText; // • steht für das Aufzählungszeichen


        // Erstelle das Edit-Icon und füge es zum Listenelement hinzu
        const editIcon = document.createElement('div');
        editIcon.classList.add('pencil_icon_div');
        editIcon.innerHTML = `<img class="addSubTaskIcons icon pencil" src="../assets/img/pencil-32.png" alt="" onclick="editSubtask(event)">`;

        // Erstelle das Delete-Icon und füge es zum Listenelement hinzu
        const deleteIcon = document.createElement('div');
        deleteIcon.classList.add('delete_icon_div');
        deleteIcon.innerHTML = `<img class="addSubTaskIcons icon delete" src="../assets/img/delete-32.png" alt="" onclick="deleteSubtask(event)">`;

        // Füge Icons zum Listenelement hinzu
        listItem.appendChild(editIcon);
        listItem.appendChild(deleteIcon);

        // Füge das Listenelement zur Subtask-Liste hinzu
        subtaskList.appendChild(listItem);

        // Füge das Listenelement dem subtasksArray hinzu
        subtasksArray.push(subtaskText);

        // Leere das Eingabefeld nach Hinzufügen des Subtasks
        subtaskInput.value = '';
    }
}

function editSubtask(event) {
    const subtaskItem = event.target.closest('.subtask-item');
    const subtaskText = subtaskItem.textContent.trim();

    // Erstellen eines Input-Felds zum Bearbeiten
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = subtaskText;

    // Erstellen des Checkmark-Icons
    const checkmarkIcon = document.createElement('img');
    checkmarkIcon.classList.add('addSubTaskIcons', 'icon', 'checkmark');
    checkmarkIcon.src = '../assets/img/check-mark-3-32.png';
    checkmarkIcon.alt = 'Apply Changes';
    checkmarkIcon.onclick = applyChanges;

    // Event-Handler hinzufügen, um die Bearbeitung abzuschließen
    checkmarkIcon.addEventListener('click', () => {
        const editedText = inputField.value.trim();
        subtaskItem.textContent = editedText;
        subtaskItem.appendChild(createEditIcon());
        subtaskItem.appendChild(createDeleteIcon());
    });

    // Das Listenelement durch das Input-Feld und das Checkmark-Icon ersetzen
    subtaskItem.innerHTML = '';
    subtaskItem.appendChild(inputField);
    subtaskItem.appendChild(checkmarkIcon);
    inputField.focus(); // Den Fokus auf das Input-Feld setzen
}

function applyChanges(event) {
    const subtaskItem = event.target.closest('.subtask-item');

    // Überprüfen, ob subtaskItem existiert und Kinder hat
    if (subtaskItem) {
        // Entferne das "Änderungen anwenden"-Icon
        subtaskItem.removeChild(event.target);

        // Füge das Edit-Icon wieder hinzu
        const editIcon = document.createElement('div');
        editIcon.classList.add('pencil_icon_div');
        editIcon.innerHTML = `<img class="addSubTaskIcons icon pencil" src="assets/img/pencil-32.png" alt="" onclick="editSubtask(event)">`;
        subtaskItem.appendChild(editIcon);

        // Füge das Delete-Icon wieder hinzu
        const deleteIcon = document.createElement('div');
        deleteIcon.classList.add('delete_icon_div');
        deleteIcon.innerHTML = `<img class="addSubTaskIcons icon delete" src="assets/img/pencil-32.png" alt="" onclick="deleteSubtask(event)">`;
        subtaskItem.appendChild(deleteIcon);
    }
}

function createEditIcon() {
    const editIconContainer = document.createElement('div');  // Div für das Edit-Icon
    editIconContainer.classList.add('edit-icon-container');

    const editIcon = document.createElement('img');
    editIcon.classList.add('addSubTaskIcons', 'icon', 'pencil');
    editIcon.src = '../assets/img/pencil-32.png';
    editIcon.alt = '';
    editIcon.onclick = editSubtask;

    editIconContainer.appendChild(editIcon);

    return editIconContainer;
}

function createDeleteIcon() {
    const deleteIconContainer = document.createElement('div');  // Div für das Delete-Icon
    deleteIconContainer.classList.add('delete-icon-container');

    const deleteIcon = document.createElement('img');
    deleteIcon.classList.add('addSubTaskIcons', 'icon', 'delete');
    deleteIcon.src = '../assets/img/delete-32.png';
    deleteIcon.alt = '';
    deleteIcon.onclick = deleteSubtask;

    deleteIconContainer.appendChild(deleteIcon);

    return deleteIconContainer;
}

function deleteSubtask(event) {
    const subtaskItem = event.target.closest('.subtask-item');
    subtaskItem.remove();
}

function handlePrioButtonClick(prio) {
    // Leere das priorityArray, bevor ein neuer Wert hinzugefügt wird
    priorityArray = [];

    const normalButtonId = `normal_${prio}_btn`;
    const clickedButtonId = `clicked_${prio}_btn`;

    if (selectedPrioButton === prio) {
        // Wenn der ausgewählte Prio-Button erneut geklickt wird, setzen Sie ihn zurück
        selectedPrioButton = null;
        document.getElementById(normalButtonId).classList.remove('d-none');
        document.getElementById(clickedButtonId).classList.add('d-none');
    } else {
        // Aktivieren Sie den ausgewählten Prio-Button und setzen Sie die anderen zurück
        if (selectedPrioButton) {
            const prevNormalButtonId = `normal_${selectedPrioButton}_btn`;
            const prevClickedButtonId = `clicked_${selectedPrioButton}_btn`;
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