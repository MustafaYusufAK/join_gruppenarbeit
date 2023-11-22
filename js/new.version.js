// Board



function addTask() {


















    //Done
    // All required fields are filled, proceed to create the task
    const categoryColor = categorySelect ? categorySelect.querySelector('.categoryColor').style.backgroundColor : '';
    const title = titleInput.value;
    const description = descriptionInput.value;
    const category = categorySelect ? categorySelect.innerText : '';
    const createdAt = createdAtInput.value;
    //Done




    //Done
    // Prüfe, ob "Select task category" ausgewählt wurde
    const categoryText = categorySelect ? categorySelect.innerText.trim() : '';
    if (categoryText === 'Select task category') {
        selectCategoryNotification();
        return; // Beende die Funktion, um das Hinzufügen der Aufgabe zu verhindern
    }
    //Done


    //DOne
    // Create a unique ID for the task
    const id = generateUniqueID();

    let task = {
        id: id,
        title: title,
        description_text: description,
        task_category: category,
        createdAt: createdAt,
        priority: priorityArray, // Add priority to the task
        // subtasks: subtaskTextsArray,
        // subtasksId: subtaskIdsArray,
        categoryColors: categoryColorArray,
        assignedToValues: assignedToValuesArray,  // Füge die Werte hinzu
        assignedToColors: assignedToColorsArray,  // Füge die Farben hinzu
        assignedShortValues: assignedShortValues  // Füge die Texte hinzu
    };
    //Done


    //Done
    // Überprüfe, ob die erforderlichen Felder gefüllt sind
    if (title && description && createdAt && priorityArray.length > 0) {
        // Wenn alles erforderliche gefüllt ist und das priorityArray nicht leer ist
        titlesArray.push(title);
        descriptionsArray.push(description);
        createdAtArray.push(createdAtInput.value);
        categoryArray.push(category);
        categoryColorArray.push(categoryColor);

        allTasks.push(task);
        saveTasks();
        //Done

        //Done
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
        //Done

        //Done
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
        //Done

        //Done
        showFinalNotification();
        // Führe die Weiterleitung nach einer kurzen Verzögerung aus
        setTimeout(() => {
            redirectToBoard();
            // }, 1500); // Hier können Sie die Zeit in Millisekunden anpassen

            clearInputFields();

        } else {
            // if (priorityArray.length === 0) {
            showPrioNotification();
        } else {
            // Wenn alle Arrays gefüllt sind, können Sie hier eine abschließende Benachrichtigung anzeigen.
            showFinalNotification();
        }
//Done


//Done
        // Zurücksetzen der Arrays
        subtasksArray = [];
        categoryArray = [];
        categoryColorArray = [];
        assignedToValuesArray = [];
        assignedToColorsArray = [];
        assignedShortValues = [];
        createdAtArray = [];
    }
    //Done

}


//Done
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
    //Done

    //Done

    document.getElementById('category').onclick = closeCategoryDropdown;
    // Event-Listener, der auf Klicks irgendwo auf der Seite reagiert
    document.addEventListener('click', function (event) {
        var categoryDiv = document.getElementById('category');
        var targetElement = event.target;

        // Überprüfe, ob das geklickte Element nicht der categoryDiv ist und nicht innerhalb des categoryDiv liegt
        if (targetElement !== categoryDiv && !categoryDiv.contains(targetElement)) {
            closeCategoryDropdown(); // Funktion wird aufgerufen, wenn außerhalb des categoryDiv geklickt wird
        }
    });
}
//Done

//Done
function clearInputFields() {
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
    // const subtaskList = document.getElementById('subtaskList');
    titleInput.value = '';
    descriptionInput.value = '';

    // Reset assigned to dropdown
    const assignedToSelect = document.getElementById('which_assigned_contact');
    assignedToSelect.selectedIndex = 0;

    // Reset due date input
    const dueDateInput = document.getElementById('createdAt');
    dueDateInput.value = '';
    // subtaskList.innerHTML = '';

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
//Done


//Done
function addSubtask() {
    const subtaskInput = document.getElementById('subtaskInput');
    const subtaskText = subtaskInput.value.trim();

    if (subtaskText !== '') {
        // Erhalte eine Referenz zur Subtask-Liste
        const subtaskList = document.getElementById('subtaskList');

        // // Erstelle eindeutige ID für das Listenelement
        const listElementId = generateUniqueID();

        // Erstelle ein neues Listenelement
        const listItem = document.createElement('li');
        listItem.classList.add('subtask-item'); // Füge Klasse hinzu
        listItem.id = listElementId;

        // // Erstelle eine Checkbox und füge sie zum Listenelement hinzu
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('subtask-checkbox');
        listItem.appendChild(checkbox); // Füge Checkbox hinzu

        // // Setze den Text des Listenelements
        listItem.appendChild(document.createTextNode(subtaskText)); // Setze Text nach Checkbox

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
        subtasksArray.push({ id: listElementId, text: subtaskText });

        // Leere das Eingabefeld nach Hinzufügen des Subtasks
        subtaskInput.value = '';
    }
}
//Done


//Done
function addFirstSubtask() {
    const subtaskInput = document.getElementById('subtaskInput');
    const subtaskText = subtaskInput.value.trim();

    if (subtaskText !== '') {
        // Erhalte eine Referenz zur Subtask-Liste
        const subtaskList = document.getElementById('subtaskList');

        // Erstelle eindeutige ID für das Listenelement
        const listElementId = generateUniqueID();

        // Erstelle ein neues Listenelement
        const listItem = document.createElement('li');
        listItem.classList.add('subtask-item'); // Füge Klasse hinzu
        listItem.id = listElementId;

        // Setze den Text des Listenelements
        listItem.appendChild(document.createTextNode(subtaskText)); // Setze Text

        // Erstelle das Edit-Icon und füge es zum Listenelement hinzu
        const editIcon = document.createElement('div');
        editIcon.classList.add('pencil_icon_div');
        editIcon.innerHTML = `<img class="addSubTaskIcons icon pencil" src="../assets/img/pencil-32.png" alt="" onclick="editFirstSubtask(event)">`;

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
        subtasksArray.push({ id: listElementId, text: subtaskText });

        // Leere das Eingabefeld nach Hinzufügen des Subtasks
        subtaskInput.value = '';
    }
}
//Done


//Done
function editFirstSubtask(event) {
    const subtaskItem = event.target.closest('.subtask-item');
    const subtaskText = subtaskItem.textContent.trim();

    // Überprüfen, ob die 'lineThrough'-Klasse vorhanden ist, und entfernen, wenn sie vorhanden ist
    if (subtaskItem.classList.contains('lineThrough')) {
        subtaskItem.classList.remove('lineThrough');
    }

    // Erstellen eines Input-Felds zum Bearbeiten
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = subtaskText;

    // Erstellen des Checkmark-Icons
    const checkmarkIcon = document.createElement('img');
    checkmarkIcon.classList.add('addSubTaskIcons', 'icon', 'checkmark');
    checkmarkIcon.src = '../assets/img/check-mark-3-32.png';
    checkmarkIcon.alt = 'Apply Changes';

    checkmarkIcon.addEventListener('click', () => {
        const editedText = inputField.value.trim();

        // Aktualisierten HTML-Code hinzufügen
        subtaskItem.innerHTML = '';
        subtaskItem.appendChild(document.createTextNode(editedText)); // Füge den bearbeiteten Text hinzu
        subtaskItem.appendChild(createFirstEditIcon()); // Füge Edit-Icon hinzu
        subtaskItem.appendChild(createDeleteIcon()); // Füge Delete-Icon hinzu
    });

    // Das Listenelement durch das Input-Feld und das Checkmark-Icon ersetzen
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
//Done   


//Done 
function editSubtask(event) {
    const subtaskItem = event.target.closest('.subtask-item');
    const subtaskText = subtaskItem.textContent.trim();

    // Überprüfen, ob die 'lineThrough'-Klasse vorhanden ist, und entfernen, wenn sie vorhanden ist
    if (subtaskItem.classList.contains('lineThrough')) {
        subtaskItem.classList.remove('lineThrough');
    }

    // Erstellen eines Input-Felds zum Bearbeiten
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = subtaskText;

    // Erstellen des Checkmark-Icons
    const checkmarkIcon = document.createElement('img');
    checkmarkIcon.classList.add('addSubTaskIcons', 'icon', 'checkmark');
    checkmarkIcon.src = '../assets/img/check-mark-3-32.png';
    checkmarkIcon.alt = 'Apply Changes';

    checkmarkIcon.addEventListener('click', () => {
        const editedText = inputField.value.trim();

        // Checkbox erstellen
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('subtask-checkbox');
        checkbox.setAttribute('onchange', `updateProgressBar('${currentTaskId}')`);

        // Aktualisierten HTML-Code hinzufügen
        subtaskItem.innerHTML = '';
        subtaskItem.appendChild(checkbox);
        subtaskItem.appendChild(document.createTextNode(editedText)); // Füge den bearbeiteten Text hinzu
        subtaskItem.appendChild(createEditIcon()); // Füge Edit-Icon hinzu
        subtaskItem.appendChild(createDeleteIcon()); // Füge Delete-Icon hinzu
    });

    // Das Listenelement durch das Input-Feld und das Checkmark-Icon ersetzen
    subtaskItem.innerHTML = '';
    subtaskItem.appendChild(inputField);
    subtaskItem.appendChild(checkmarkIcon);
    inputField.focus(); // Den Fokus auf das Input-Feld setzen
}
//Done 

//Done 
function applyChanges(event) {
    const subtaskItem = event.target.closest('.subtask-item');
    if (subtaskItem) {
        subtaskItem.removeChild(event.target);
        const editIcon = document.createElement('div');
        editIcon.classList.add('pencil_icon_div');
        editIcon.innerHTML = `<img class="addSubTaskIcons icon pencil" src="../assets/img/pencil-32.png" alt="" onclick="editSubtask(event)">`;
        subtaskItem.appendChild(editIcon);
        const deleteIcon = document.createElement('div');
        deleteIcon.classList.add('delete_icon_div');
        deleteIcon.innerHTML = `<img class="addSubTaskIcons icon delete" src="../assets/img/pencil-32.png" alt="" onclick="deleteSubtask(event)">`;
        subtaskItem.appendChild(deleteIcon);
    }
}
//Done 

//Done 
function cancelNewCategory() {
    document.getElementById('newCategoryInput').value = '';
    document.getElementById('newCategoryColor').style.backgroundColor = '';
    document.getElementById('newCategoryContainer').classList.add('d-none');
    document.getElementById('newCategoryColors').classList.add('d-none');
    document.getElementById('category').style.display = 'flex';
    document.getElementById('category').innerHTML = 'Select task category';
    document.getElementById('category').classList.remove('d-none');
    closeCategoryDropdown();
}
//Done 

//Done
function confirmNewCategory() {
    let newCategory = document.getElementById('newCategoryInput').value;
    let newCategoryColor = document.getElementById('newCategoryColor').style.backgroundColor;
    let newCategoryInput = document.getElementById('newCategoryInput');

    if (newCategoryInput.value === '') {
        newCategoryInput.focus();
        categoryNotification();
    } else if (newCategoryColor === '') {
        categoryColorNotification();
    } else {
        selectedCategory(newCategory, newCategoryColor);
        document.getElementById('newCategoryInput').value = '';
        document.getElementById('newCategoryColor').style.backgroundColor = '';
        document.getElementById('newCategoryContainer').classList.add('d-none');
        document.getElementById('newCategoryColors').classList.add('d-none');
        document.getElementById('category').style.display = 'flex';
        document.getElementById('category').classList.remove('d-none');
    }
}
//Done

//Done
function openCategoryDropdown() {
    document.getElementById('categoryDropdown').classList.remove('d-none');
    document.getElementById('category').style.cssText = `
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
        border-bottom: none;
    `;
    document.getElementById('category').onclick = closeCategoryDropdown;
    document.addEventListener('mouseup', function (event) {
        var categoryDiv = document.getElementById('category');
        var targetElement = event.target;
        if (targetElement !== categoryDiv && !categoryDiv.contains(targetElement)) {
            closeCategoryDropdown(); // Funktion wird aufgerufen, wenn außerhalb des categoryDiv geklickt wird
        }
    });
}
//Done


//Done
function newCategory() {
    closeCategoryDropdown();
    document.getElementById('newCategoryContainer').classList.remove('d-none');
    document.getElementById('newCategoryColors').classList.remove('d-none');
    document.getElementById('category').style.display = 'none';
    // document.getElementById('category').classList.add('d-none');
}

function closeCategoryDropdown() {
    document.getElementById('categoryDropdown').classList.add('d-none');
    document.getElementById('category').style.cssText = `
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        border-bottom: 1px solid #D1D1D1;
    `;

    // Überprüfe, ob das Element mit der ID "categoryColor" bereits vorhanden ist
    let categoryColor = document.getElementById('categoryColor');

    if (!categoryColor) {
        // Erstelle ein neues Element für den categoryColor-Container, falls noch nicht vorhanden
        categoryColor = document.createElement('div');
        categoryColor.id = 'categoryColor';
        categoryColor.className = 'categoryColor';
        categoryColor.style.backgroundColor = '#FFFFFF';

        // Füge das erstellte Element zum DOM hinzu
        const category = document.getElementById('category');
        category.appendChild(categoryColor);
    } else {
        // Wenn das Element bereits vorhanden ist, ändere einfach die Hintergrundfarbe
        categoryColor.style.backgroundColor = '#FFFFFF';
    }

    document.getElementById('category').onclick = openCategoryDropdown;
}
//Done

function addTaskFromOverlay() {
    event.preventDefault();  // Verhindert das Standardverhalten des Formulars (Seitenaktualisierung)
    //Done
    // Alle erforderlichen Felder sind gefüllt
    // const assignedToDiv = document.getElementById('assignedToList');
    // const titleInput = document.getElementById('title');
    // const descriptionInput = document.getElementById('description_text');
    // const categorySelect = document.getElementById('category');
    // const createdAtInput = document.getElementById('createdAt');
    //Done
    const subtaskInput = document.getElementById('subtaskInput');
    const subtaskList = document.getElementById('subtaskList');
    //Done
    const newCategoryContainer = document.getElementById('newCategoryContainer');
    const newCategoryInput = document.getElementById('newCategoryInput');
    const newCategoryColor = document.getElementById('newCategoryColor');
    //Done

    //Done
    // Erstellen von Arrays für die Unteraufgaben-Texte und IDs
    let subtaskTextsArray = [];
    let subtaskIdsArray = [];
    //Done

    //Done
    // Sammeln der Informationen aus den Unteraufgaben
    const subtaskItems = document.querySelectorAll('.subtask-item');
    subtaskItems.forEach(subtask => {
        const subtaskText = subtask.textContent.trim(); // Text der Unteraufgabe
        const subtaskId = subtask.id; // ID des li-Elements

        // Hinzufügen der Texte und IDs zu den entsprechenden Arrays, wenn sie vorhanden sind
        if (subtaskText && subtaskId) {
            subtaskTextsArray.push(subtaskText);
            subtaskIdsArray.push(subtaskId);
        }
    });
    //Done

    //Done
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
    //Done


    //Done
    // Filtere die Informationen aus den Bällen im Container 'assignedToList'
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
    //Done

    //Done
    // All required fields are filled, proceed to create the task
    const categoryColor = categorySelect ? categorySelect.querySelector('.categoryColor').style.backgroundColor : '';
    const title = titleInput.value;
    const description = descriptionInput.value;
    const category = categorySelect ? categorySelect.innerText : '';
    const createdAt = createdAtInput.value;

    // Prüfe, ob "Select task category" ausgewählt wurde
    const categoryText = categorySelect ? categorySelect.innerText.trim() : '';
    if (categoryText === 'Select task category') {
        selectCategoryNotification();
        return; // Beende die Funktion, um das Hinzufügen der Aufgabe zu verhindern
    }

    // Create a unique ID for the task
    const id = generateUniqueID();




    let task = {
        id: id,
        title: title,
        description_text: description,
        task_category: category,
        createdAt: createdAt,
        priority: priorityArray,
        // subtasks: subtaskTextsArray,
        // subtasksId: subtaskIdsArray,
        categoryColors: categoryColorArray,
        assignedToValues: assignedToValuesArray,
        assignedToColors: assignedToColorsArray,
        assignedShortValues: assignedShortValues,
        // Hier erfolgt die Überprüfung, ob das inWhichContainer Array Werte enthält
        inWhichContainer: inWhichContainer.length > 0 ? inWhichContainer : ''
    };
    //Done

    //Done
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
        //Done

        //Done
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
        const urgentBtn = document.getElementById('addTask_overlay_urgent_btn');
        const mediumBtn = document.getElementById('addTask_overlay_medium_btn');
        const lowBtn = document.getElementById('addTask_overlay_low_btn');

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
        const clickedUrgentBtn = document.getElementById('addTask_overlay_clicked_urgent_btn');
        const clickedMediumBtn = document.getElementById('addTask_overlay_clicked_medium_btn');
        const clickedLowBtn = document.getElementById('addTask_overlay_clicked_low_btn');

        if (clickedUrgentBtn) {
            clickedUrgentBtn.classList.add('d-none');
        }

        if (clickedMediumBtn) {
            clickedMediumBtn.classList.add('d-none');
        }

        if (clickedLowBtn) {
            clickedLowBtn.classList.add('d-none');
        }

        showBoardFinalNotification();
        // Führe die Weiterleitung nach einer kurzen Verzögerung aus
        setTimeout(() => {

            closeOverlay();
            showTasks();
            restoreTasksFromLocalStorage();
            sortTaskIntoArrays(allTasks, tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone);

            // Zurücksetzen der Arrays
            subtasksArray = [];
            categoryArray = [];
            categoryColorArray = [];
            assignedToValuesArray = [];
            assignedToColorsArray = [];
            assignedShortValues = [];
            createdAtArray = [];
            priorityArray = [];

            // }, 1500); // Hier können Sie die Zeit in Millisekunden anpassen

            clearAddTaskFields();

        } else {
            // if (priorityArray.length === 0) {
            //     showPrioNotification();
        } else {
            // Wenn alle Arrays gefüllt sind, können Sie hier eine abschließende Benachrichtigung anzeigen.
            // showFinalNotification();
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
//Done

//Done
function findTask() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const pinnedTaskContainers = document.querySelectorAll('.pinned-task-container');
    pinnedTaskContainers.forEach(container => {
        const headline = container.querySelector('.pinned-task-headline');
        const taskText = headline.textContent.toLowerCase();
        const description = container.querySelector('.pinned-task-discription');
        const taskDescription = description.textContent.toLowerCase();
        if (taskText.includes(searchInput) || taskDescription.includes(searchInput)) {
            container.classList.remove('d-none');
        } else {
            container.classList.add('d-none');
        }
    });
}
//Done


//Done
function showNoTaskMessage(container, tasksArray, text) {
    const noTaskContainer = document.createElement('div');
    noTaskContainer.textContent = text;
    const tasksExist = tasksArray.some(existingTask => container.id === `task-${existingTask.id}`);
    if (!tasksExist) {
        container.appendChild(noTaskContainer);
    } else {
        // Falls Tasks vorhanden sind, entferne den "no Task" Container
        const existingNoTaskContainer = container.querySelector('.no-task-message');
        if (existingNoTaskContainer) {
            container.removeChild(existingNoTaskContainer);
        }
    }
}
//Done

//Done
function sortTaskIntoArrays(allTasks, tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone) {
    allTasks.forEach(task => {
        const taskDiv = document.getElementById(`task-${task.id}`);

        if (!taskDiv) {
            return; // Die Aufgabe existiert nicht in den sichtbaren Container-DIVs
        }

        let shouldAddTask = true; // Standardmäßig sollte die Aufgabe hinzugefügt werden

        if (taskDiv.parentElement.id === 'target-to-do-table') {
            shouldAddTask = !tasksToDo.some(existingTask => existingTask.id === task.id);
            if (shouldAddTask) {
                tasksToDo.push(task);
            }
        } else if (taskDiv.parentElement.id === 'target-in-progress-table') {
            shouldAddTask = !tasksInProgress.some(existingTask => existingTask.id === task.id);
            if (shouldAddTask) {
                tasksInProgress.push(task);
            }
        } else if (taskDiv.parentElement.id === 'target-await-feedback-table') {
            shouldAddTask = !tasksAwaitFeedback.some(existingTask => existingTask.id === task.id);
            if (shouldAddTask) {
                tasksAwaitFeedback.push(task);
            }
        } else if (taskDiv.parentElement.id === 'target-done-table') {
            shouldAddTask = !tasksDone.some(existingTask => existingTask.id === task.id);
            if (shouldAddTask) {
                tasksDone.push(task);
            }
        }
    });
    //Done       






    //Done 
    task_category.toDo = tasksToDo;
    task_category.progress = tasksInProgress;
    task_category.feedback = tasksAwaitFeedback;
    task_category.done = tasksDone;
    saveTasksCategory();
}

//Done 



//Done 
function createNoTaskDiv() {
    let noTaskDiv = document.createElement('div');
    noTaskDiv.id = 'noTask';
    noTaskDiv.className = 'no_tasks_class';
    noTaskDiv.textContent = 'No Task Available';
    let noTaskInToDo = document.getElementById('noTaskInToDo');
    let noTaskInAwait = document.getElementById('noTaskInAwait');
    let noTaskInProgress = document.getElementById('noTaskInProgress');
    let noTaskInDone = document.getElementById('noTaskInDone');
    noTaskInToDo.appendChild(noTaskDiv);
    noTaskInAwait.appendChild(noTaskDiv.cloneNode(true));
    noTaskInProgress.appendChild(noTaskDiv.cloneNode(true));
    noTaskInDone.appendChild(noTaskDiv.cloneNode(true));
}
//Done 

//Done 
function createSpecificNoTaskDivs() {
    let noTaskInToDo = document.createElement('div');
    noTaskInToDo.id = 'noTaskInToDo';
    let noTaskInAwait = document.createElement('div');
    noTaskInAwait.id = 'noTaskInAwait';
    let noTaskInProgress = document.createElement('div');
    noTaskInProgress.id = 'noTaskInProgress';
    let noTaskInDone = document.createElement('div');
    noTaskInDone.id = 'noTaskInDone';
    let taskContainer = document.getElementById('target-to-do-table');
    let feedbackTaskContainer = document.getElementById('target-await-feedback-table');
    let inProgressContainer = document.getElementById('target-in-progress-table');
    let targetDoneTable = document.getElementById('target-done-table');
    taskContainer.appendChild(noTaskInToDo);
    feedbackTaskContainer.appendChild(noTaskInAwait);
    inProgressContainer.appendChild(noTaskInProgress);
    targetDoneTable.appendChild(noTaskInDone);
}
//Done 


//Done 
function updateProgressBar(taskId) {
    const task = allTasks.find(task => task.id === taskId);
    const progressBarId = task.progressBarId;
    const progressBar = document.getElementById(`progress-bar-${progressBarId}`);
    if (!progressBar) {
        console.error(`Progress-Bar mit der ID "${progressBarId}" wurde nicht gefunden.`);
        return;
    }
    const checkedSubtasks = task.subtasks.filter(subtask => subtask.checked);
    const progressPercentage = (checkedSubtasks.length / task.subtasks.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

//Done 
//Done 

function applyLineThroughAndCheckbox(currentTaskId) {
    const task = allTasks.find(task => task.id === currentTaskId);
    if (!task) {
        console.error(`Aufgabe mit der ID "${currentTaskId}" wurde nicht gefunden.`);
        return;
    }
    const subtasksStatus = task.subtasksStatus || [];
    subtasksStatus.forEach((subtaskStatus, index) => {
        const subtaskId = task.subtasksId[index];
        const subtaskElement = document.getElementById(subtaskId);
        const checkboxElement = subtaskElement.querySelector('.subtask-checkbox');
        if (subtaskElement && checkboxElement) {
            if (subtaskStatus === true) {
                subtaskElement.classList.add('lineThrough');
                checkboxElement.checked = true;
            } else {
                subtaskElement.classList.remove('lineThrough');
                checkboxElement.checked = false;
            }
        }
    });
}
//Done 


function clearAllTasks() {
    //     allTasks = [];
    //     saveTasks();
    // }


    //Done 
    function hideOverlay() {
        const overlaySection = document.getElementById('overlaySection');
        overlaySection.classList.add('d-none');
    }

    let currentShowedTaskId;

    function showTasksInOverViev(taskId) {
        currentShowedTaskId = [];
        const taskOverviewPopUp = document.getElementById('taskOverviewPopUp');
        const overlaySection = document.getElementById('overlaySection');



        // Entferne die Klasse "d-none" aus dem overlaySection
        overlaySection.classList.remove('d-none');
        taskOverviewPopUp.innerHTML = '';  // Leere den Container, bevor neue Einträge hinzugefügt werden

        // Finde den Task basierend auf der ID
        const task = allTasks.find(task => task.id === taskId);
        currentShowedTaskId = taskId;

        if (task) {
            const currentId = task.id;
            const categorybackgroundColor = task.categoryColors[0];
            const title = task.title;
            const description = task.description_text;
            const date = task.createdAt;
            const priority = task.priority.join(', ');
            const assignedTo = task.assignedToValues.join(', ');
            const colorOfAssignedment = task.assignedToColors;


            let subTasksHTML = '';
            if (task.subtasks && task.subtasksId && task.subtasks.length > 0) {
                subTasksHTML += '<ul class="edit-subTask">';
                const subtaskId = task.subtasksId;
                task.subtasks.forEach((subTask, index) => {
                    const subtaskStatus = task.subtasksStatus ? task.subtasksStatus[index] : false;
                    subTasksHTML += `<li id="${subtaskId[index]}" class="subTaskAlignment"><div class="${subtaskStatus ? 'lineThrough' : ''}">${subTask}</div></li>`;
                });
                subTasksHTML += '</ul>';
            }

            //Done 
            let taskPopUpSingleAssignmentContainer = ''; // Deklariere die Variable außerhalb der if-Bedingung

            const colorValues = colorOfAssignedment.toString().split(',');

            // Entferne die Leerzeichen und schließende Klammern von den Werten
            const cleanedColors = colorValues.map(color => color.replace(/\s/g, '').replace(')', ''));

            if (assignedTo && assignedTo.length > 0) {


                task.assignedToValues.forEach((assignment, index) => {
                    const nameParts = assignment.trim().split(' ');
                    let initials = '';
                    if (nameParts.length >= 2) {
                        initials = nameParts[0][0] + nameParts[1][0];
                    } else if (nameParts.length === 1) {
                        initials = nameParts[0][0];
                    }

                    // Hier können Sie die Farbe aus dem separaten Array verwenden
                    const color = task.assignedToColors[index]; // Farbe für diese Zuweisung

                    const assignmentHTML = `
                                                <div class="taskPopUpSingleAssignmentContainer">
                                                    <div class="assigne-ball" style="background-color:${color}">
                                                        ${initials}
                                                    </div>
                                                    <div class="taskPopUpNameContainer">${assignment}</div>
                                                </div>
                                            `;

                    taskPopUpSingleAssignmentContainer += assignmentHTML;
                });

            }
            //Done 






            // Zeige die Details des angeklickten Containers im taskOverviewPopUp an
            taskOverviewPopUp.innerHTML = /*html*/ `
                                    <div class="wholeTaskOverview" id="wholeTaskOverview">
                                     <div class="categoryHeaderDiv">
                                    <div class="categoryHeaderPosition">
                                    <img class="vector-class" src="../assets/img/Vector (1).svg" alt="" onclick="closeTaskOverviewPopUp()"><div class="categoryOvervievPopUp" style="background-color: ${categorybackgroundColor}">
                                    
                                        <div class="category">${task.task_category}</div>
                                        
                                    </div>
                                    </div>
                                        </div>
                                        <div class="taskPopUpHeadline"> ${title}</div>
                                        <div class="taskPopUpDiscription"> ${description}</div>
                                        <div class="taskPopUpRow">
                                        <div class="taskPopUpLeftTd"><b>Due Date:</b></div>
                                        <div class="taskPopUpRightTd">${date}</div>
                                        </div>
                                        <div class="taskPopUpRow">
                                        <div class="taskPopUpLeftTd"><b>Priority:</b></div>
                                        <div id="modify${priority}" class="prioContainer">
                                            ${priority} <div id="modify${priority}Icon"></div>
                                        </div>
                                        </div>
                                        <div class="taskPopUpAssignments" id="taskPopUpAssignments">
                                        <div class="assignedToHeadline"><b>Assigned to:</b></div>
                                        
                                        </div>
                                        <div id="taskPopUpAssignmentsList" class="taskPopUpAssignmentsList">
                                            ${taskPopUpSingleAssignmentContainer}
                                    </div>
                                        <div class="subtasksOverview" id="subtasksOverview">
                                        <div class="edit-subTask-titel"><b>Subtasks</b></div>
                                        <div id="overViewAssignedToList" class="subTaskContainer">
                                            ${subTasksHTML}
                                        </div>
                                    </div>
                            
                                    <div class="overviewButtons">
                                        <div class="popUpButtonsContainer">
                                            <div class="taskPopUpButton leftBtn btn-border" onclick="deleteTask('${currentId}') ">
                                                <img class="" id="deleteTask-Img" src="../assets/img/delete-32.png" alt="">
                                            </div>
                            
                                            <div class="taskPopUpButton rightBtn btn-bg" onclick="editingShowTask('${currentId}')">
                                                <img class="popUpPenTriangel" src="../assets/img/pencil-32.png" alt="">
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
        }
    }