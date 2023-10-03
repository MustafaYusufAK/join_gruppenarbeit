





[
    {
        "id": "_qz0tt3nyt", // Die individuelle Id der Aufgabe
        "title": "Hier ist der Titel", // Titel der Aufgabe
        "description_text": "Hier ist die Description", // die Beschreibung der Aufgabe
        "task_category": "Development", // Zu weöcher Kategorie die Aufgabe eingeteilt wurd
        "which_assigned_contact": "AS", // Die Kürzel der eingetragenen Person
        "createdAt": "2023-09-30", // Hier ist das Datum
        "priority": [
            "urgent" // Hier steht die Priorität des Tasks
        ],
        "assignedToValues": [
            "Anja Schulz" // Der Name der Person
        ],
        "assignedToColors": [
            "rgb(227, 9, 1)" // Hier steht die Farbe der eingetragenen Person
        ]
    }
]









function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';

    do {
        color = '#';
        for (let i = 0; i < 6; i++) {
            const randomLetter = letters[Math.floor(Math.random() * 16)];
            color += randomLetter;
        }
    } while (isTooLight(color)); // Überprüfe, ob die Farbe zu hell ist

    return color;
}

function isTooLight(color) {
    // Berechne die Helligkeit der Farbe (YIQ-Berechnung)
    const hex = color.substring(1); // Entferne das führende #
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    // Eine Farbe ist zu hell, wenn ihre Helligkeit über einem bestimmten Schwellenwert liegt
    return yiq > 128;
}

function createContactDropdown() {
    let dropdown = document.getElementById('which_assigned_contact');

    // Entferne vorhandene Optionen
    dropdown.innerHTML = '';

    // Füge eine Standardoption hinzu
    let defaultOption = document.createElement('option');
    defaultOption.value = 'Select contacts to assign';
    defaultOption.textContent = 'Select contacts to assign';
    dropdown.appendChild(defaultOption);

    // Füge Optionen für jeden Kontakt hinzu
    contacts.forEach(contact => {
        let option = document.createElement('option');
        option.value = contact.name;
        option.textContent = contact.name;
        option.classList.add('not_selected');  // Füge die Klasse hinzu
        dropdown.appendChild(option);
    });

    // Hinzufügen eines Event-Listeners, um die Option zu deaktivieren und aus dem Dropdown zu entfernen
    dropdown.addEventListener('change', (event) => {
        let selectedContact = contacts.find(contact => contact.name === event.target.value);
        if (selectedContact) {
            createAssigneeBall(selectedContact);
            event.target.options[event.target.selectedIndex].disabled = true;  // Deaktiviere die ausgewählte Option

            // Aktualisiere den Dropdown-Text mit der zuletzt ausgewählten Option
            dropdown.firstChild.textContent = event.target.value;
        }
    });
}

function createAssigneeBall(contact) {
    let assignedToList = document.getElementById('assignedToList');
    let assigneeContainer = document.createElement('div');
    assigneeContainer.classList.add('assigneeContainer');
    assigneeContainer.style.backgroundColor = contact.color;

    // Teile den Namen in Vorname und Nachname
    let [firstName, lastName] = contact.name.split(' ');

    // Füge die Anfangsbuchstaben hinzu
    assigneeContainer.innerHTML = `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`;

    let option;  // Definition der option-Variablen

    // Event-Listener, um den Ball zu entfernen und die zugehörige Option freizugeben
    assigneeContainer.addEventListener('click', () => {
        assigneeContainer.remove();

        // Freigebe die Option, indem das `disabled`-Attribut entfernt wird
        if (option) {
            option.disabled = false;

            // Entferne die Klasse 'selected' vom vorher ausgewählten Container
            document.querySelectorAll('.assigneeContainer').forEach(container => {
                container.classList.remove('selected');
            });
        }
    });

    // Füge Event-Listener hinzu, um die Option hinzuzufügen bzw. zu entfernen
    assigneeContainer.addEventListener('click', () => {
        if (option) {
            if (assigneeContainer.classList.contains('selected')) {
                // Wenn der Container bereits ausgewählt ist, entferne ihn und füge die Option wieder hinzu
                assigneeContainer.remove();
                option.disabled = false;
                option.classList.remove('not_selected');
            } else {
                // Wenn der Container nicht ausgewählt ist, füge die Option hinzu und deaktiviere sie
                assignedToList.appendChild(assigneeContainer);
                option.disabled = true;
                option.classList.add('not_selected');
            }
        }
    });

    // Suche die zugehörige Option im Dropdown
    option = Array.from(document.getElementById('which_assigned_contact').options)
        .find(opt => opt.value === contact.name);

    assignedToList.appendChild(assigneeContainer);
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

function addTask() {
    // Get references to the required form elements
    const selectedOption = document.getElementById('which_assigned_contact').options[document.getElementById('which_assigned_contact').selectedIndex];
    let assignedToDiv = document.getElementById('assignedToList');  // Änderung hier
    let titleInput = document.getElementById('title');
    let descriptionInput = document.getElementById('description_text');
    let categorySelect = document.getElementById('category');
    let createdAtInput = document.getElementById('createdAt');

    // Extrahiere Subtask-Texte aus den Listenelementen im subtasksArray





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
        assignedToValues: [selectedOption.value],
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
    assignedToValuesArray.push(assignedValue);







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



async function init() {
    await loadTasks()
    generateSideBar();
    clickEventlisteners();
    openDatepicker();
    createContactDropdown();
    getRandomColor();
    assignOptionIDs();
}


async function initForBoard() {
    await loadTasks();
    updateHTML()
    generateSideBar();
    showTasks();
    clickEventlisteners();
    openDatepicker();
    createContactDropdown();
    getRandomColor();
    assignOptionIDs();
}


function clearInputFields() {
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


    // Reset category dropdown
    const categorySelect = document.getElementById('category');
    categorySelect.selectedIndex = 0;

    // Reset subtask input and list
    const subtaskInput = document.getElementById('subtaskInput');
    const subtaskList = document.getElementById('subtaskList');
    subtaskInput.value = '';
    subtaskList.innerHTML = '';
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
        listItem.textContent = subtaskText;  // Setze den Text des Listenelements basierend auf der Eingabe

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







function toggleDropdown() {
    var dropdown = document.getElementById('task_category');
    var selectedValue = dropdown.value;

    if (selectedValue === 'default') {
        // Change the selected option to 'Select task category' and show the dropdown
        dropdown.value = 'default';
    } else {
        // Show the selected option in the dropdown
        dropdown.value = selectedValue;
    }
}






function handlePrioButtonClick(prio) {
    const normalButtonId = `normal_${prio}_btn`;
    const clickedButtonId = `clicked_${prio}_btn`;

    if (selectedPrioButton === prio) {
        // Wenn der ausgewählte Prio-Button erneut geklickt wird, setzen Sie ihn zurück
        selectedPrioButton = null;
        document.getElementById(normalButtonId).classList.remove('d-none');
        document.getElementById(clickedButtonId).classList.add('d-none');
        toggleDropdown(); // Hier wird das Dropdown zurückgesetzt

        // Entferne die Priorität aus dem priorityArray
        const index = priorityArray.indexOf(prio);
        if (index !== -1) {
            priorityArray.splice(index, 1);
        }

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



// Function to open the datepicker
function openDatepicker() {
    const input = document.getElementById('createdAt');
    input.type = 'date';
}








function cancelNewCategory() {
    document.getElementById('newCategoryInput').value = '';
    document.getElementById('newCategoryColor').style.backgroundColor = '';
    document.getElementById('newCategoryContainer').classList.add('d-none');
    document.getElementById('newCategoryColors').classList.add('d-none');
    document.getElementById('category').style.display = 'flex';
    document.getElementById('category').innerHTML = 'Select task category';
}


/**
 * This function confirms the new category if the input field isn't empty.
 */
function confirmNewCategory() {
    let newCategory = document.getElementById('newCategoryInput').value;
    let newCategoryColor = document.getElementById('newCategoryColor').style.backgroundColor;
    let newCategoryInput = document.getElementById('newCategoryInput');

    if (newCategoryInput.value == '') {
        newCategoryInput.focus();
    } else {
        selectedCategory(newCategory, newCategoryColor);
        document.getElementById('newCategoryInput').value = '';
        document.getElementById('newCategoryColor').style.backgroundColor = '';
        document.getElementById('newCategoryContainer').classList.add('d-none');
        document.getElementById('newCategoryColors').classList.add('d-none');
        document.getElementById('category').style.display = 'flex';
    }
}

function openCategoryDropdown() {
    document.getElementById('categoryDropdown').classList.remove('d-none');
    document.getElementById('category').style.cssText = `
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
        border-bottom: none;
    `;
    document.getElementById('category').onclick = closeCategoryDropdown;
}

function newCategory() {
    closeCategoryDropdown();
    document.getElementById('newCategoryContainer').classList.remove('d-none');
    document.getElementById('newCategoryColors').classList.remove('d-none');
    document.getElementById('category').style.display = 'none';
}

function newCategoryOverlay() {
    closeCategoryDropdownOverlay();
    document.getElementById('newCategoryContainerOverlay').classList.remove('d-none');
    document.getElementById('newCategoryColorsOverlay').classList.remove('d-none');
    document.getElementById('categoryOverlay').style.display = 'none';
}

function cancelNewCategoryOverlay() {
    document.getElementById('newCategoryInputOverlay').value = '';
    document.getElementById('newCategoryColorOverlay').style.backgroundColor = '';
    document.getElementById('newCategoryContainerOverlay').classList.add('d-none');
    document.getElementById('newCategoryColorsOverlay').classList.add('d-none');
    document.getElementById('categoryOverlay').style.display = 'flex';
    document.getElementById('categoryOverlay').innerHTML = 'Select task category';
}

function clearFields() {
    allSubtasks = [];
    assignedToNames = [];
    contactsColors = [];
    objIds = [];
    dateArray = [];
    document.getElementById('category').innerHTML = 'Select task category';
    document.getElementById('assignedToList').innerHTML = '';
    document.getElementById('subtasksList').innerHTML = '';
    closeCategoryDropdown();
    cancelNewCategory();
    enableContactsForAssignedTo();
}

function closeCategoryDropdown() {
    document.getElementById('categoryDropdown').classList.add('d-none');
    document.getElementById('category').style.cssText = `
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        border-bottom: 1px solid #D1D1D1;
    `;
    document.getElementById('category').onclick = openCategoryDropdown;
}

function selectedCategory(category, color) {
    category = category.charAt(0).toUpperCase() + category.slice(1);
    document.getElementById('category').innerHTML = /*html*/ `
        <div id="_xak1l2uph" class="categoryContainer">
            ${category}
            <div class="categoryColor" style="background-color: ${color}; margin-left: 10px"></div>
        </div>
    `;
    closeCategoryDropdown();

    // Return the selected color
    return color;
}



function addColorToNewCategory(color) {
    document.getElementById('newCategoryColor').style.backgroundColor = color;
}

function confirmNewCategoryOverlay() {
    let newCategory = document.getElementById('newCategoryInputOverlay').value;
    let newCategoryColor = document.getElementById('newCategoryColorOverlay').style.backgroundColor;
    let newCategoryInput = document.getElementById('newCategoryInputOverlay');

    if (newCategoryInput.value == '') {
        newCategoryInput.focus();
    } else {
        selectedCategoryOverlay(newCategory, newCategoryColor);
        document.getElementById('newCategoryInputOverlay').value = '';
        document.getElementById('newCategoryColorOverlay').style.backgroundColor = '';
        document.getElementById('newCategoryContainerOverlay').classList.add('d-none');
        document.getElementById('newCategoryColorsOverlay').classList.add('d-none');
        document.getElementById('categoryOverlay').style.display = 'flex';
    }
}

function addColorToNewCategoryOverlay(color) {
    document.getElementById('newCategoryColorOverlay').style.backgroundColor = color;
}


function assignOptionIDs() {
    const selectElement = document.getElementById('which_assigned_contact');
    const options = selectElement.getElementsByTagName('option');

    // Loop through options and assign IDs and colors
    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const color = option.style.backgroundColor; // Get the color

        // Generate a unique ID for the option
        const optionID = generateUniqueID();

        // Set the ID and color as data attributes
        option.setAttribute('data-id', optionID);
        option.setAttribute('data-color', color);
    }
}






function openCategoryDropdownOverlay() {
    document.getElementById('categoryDropdownOverlay').classList.remove('d-none');
    document.getElementById('categoryOverlay').style.cssText = `
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
        border-bottom: none;
    `;
    document.getElementById('categoryOverlay').onclick = closeCategoryDropdownOverlay;
}


function selectedCategoryOverlay(category, color) {
    category = category.charAt(0).toUpperCase() + category.slice(1);
    document.getElementById('categoryOverlay').innerHTML = /*html*/ `
        ${category}
        <div class="categoryColor" style="background-color: ${color}; margin-left: 10px"></div>
    `;
    closeCategoryDropdownOverlay();
}

function generateContentLeftAndRightContainerOverlay() {
    return /*html*/ `
        <div class="contentLeftAndRight contentLeftAndRightOverlay">
            <div class="contentLeft">
                <div class="titleAndInput">
                    <span>Title</span>
                    <input id="title" type="text" required placeholder="Enter a title">
                </div>

                <div class="descriptionAndTextarea">
                    <span>Description</span>
                    <textarea id="description" type="text" required placeholder="Enter a Description"></textarea>
                </div>

                <div class="categoryAndSelect">
                    <span>Category</span>
                    
                    <div class="newCategoryContainer d-none" id="newCategoryContainerOverlay">
                        <input placeholder="New category name" id="newCategoryInputOverlay">
                        <div class="newCategoryColorContainer">
                            <div class="categoryColor" id="newCategoryColorOverlay"></div>
                        </div>
                        <button type="button" class="cancelButton" onclick="cancelNewCategoryOverlay()">
                            <img src="assets/img/Vector (2).svg">
                        </button>
                        <button type="button" class="checkButton" onclick="confirmNewCategoryOverlay()">
                            <img src="assets/img/add.svg">
                        </button>
                    </div>

                    <div class="newCategoryColors d-none" id="newCategoryColorsOverlay">
                        <p class="categoryColor" style="background-color: red" onclick="addColorToNewCategoryOverlay('red')"></p>
                        <p class="categoryColor" style="background-color: orange" onclick="addColorToNewCategoryOverlay('orange')"></p>
                        <p class="categoryColor" style="background-color: pink" onclick="addColorToNewCategoryOverlay('pink')"></p>
                        <p class="categoryColor" style="background-color: turquoise" onclick="addColorToNewCategoryOverlay('turquoise')"></p>
                        <p class="categoryColor" style="background-color: goldenrod" onclick="addColorToNewCategoryOverlay('goldenrod')"></p>
                        <p class="categoryColor" style="background-color: blue" onclick="addColorToNewCategoryOverlay('blue')"></p>
                    </div>
                    
                    <div id="categoryOverlay" onclick="openCategoryDropdownOverlay()">Select task category</div>
                    <div id="categoryDropdownOverlay" class="categoryDropdown d-none">
                        <div class="categoryOption" onclick="newCategoryOverlay()">
                            New category
                        </div>

                        <div class="categoryOption" value="development" onclick="selectedCategoryOverlay('development', 'red')">
                            Development
                            <div class="categoryColor" style="background-color: red"></div>
                        </div>

                        <div class="categoryOption" value="design" onclick="selectedCategoryOverlay('design', 'orange')">
                            Design
                            <div class="categoryColor" style="background-color: orange"></div>
                        </div>

                        <div class="categoryOption" value="sales" onclick="selectedCategoryOverlay('sales', 'pink')">
                            Sales
                            <div class="categoryColor" style="background-color: pink"></div>
                        </div>

                        <div class="categoryOption" value="backoffice" onclick="selectedCategoryOverlay('backoffice', 'turquoise')">
                            Backoffice
                            <div class="categoryColor" style="background-color: turquoise"></div>
                        </div>

                        <div class="categoryOption" value="media" onclick="selectedCategoryOverlay('media', 'goldenrod')">
                            Media
                            <div class="categoryColor" style="background-color: goldenrod"></div>
                        </div>

                        <div class="categoryOption" value="marketing" onclick="selectedCategoryOverlay('marketing', 'blue')">
                            Marketing
                            <div class="categoryColor" style="background-color: blue"></div>
                        </div>
                    </div>
                </div>

                <div class="assignedToAndSelect">
                    <span>Assigned to</span>
                    <select id="assignedToOverlay" required> 
                        <option value="" disabled selected>Select contacts to assign</option>
                    </select>
                </div>

                <div class="assignedToList" id="assignedToListOverlay">

                </div>
            </div>

            <div class="borderlineOverlay"></div>

            <div class="contentRight">
                <div class="dueDateAndInput">
                    <span>Due Date</span>
                    <input type="date" id="dateOverlay" required placeholder="dd/mm/yyyy" onchange="pushDateOverlay()">
                </div>

                <div class="prio">
                    <span>Prio</span>
                    <div class="prioButtons">
                        <button type="button" id="urgentOverlay" value="urgent">
                            Urgent
                            <img id="urgentIconOverlay" src="./img/urgentIcon.png">
                        </button>

                        <button type="button" id="mediumOverlay" value="medium">
                            Medium
                            <img id="mediumIconOverlay" src="./img/mediumIcon.png">
                        </button>

                        <button type="button" id="lowOverlay" value="low">
                            Low
                            <img id="lowIconOverlay" src="./img/lowIcon.png">
                        </button>
                    </div>
                </div>

                <div class="subtasksAndInput">
                    <span>Subtasks</span>

                    <div class="inputAndButton">
                        <input id="subtasks" placeholder="Add new subtask">
                        <button type="button" onclick="newSubtask()">
                            <img src="./img/subtaskIcon.png">
                        </button>
                    </div>
                </div>

                <div class="subtasksList" id="subtasksList">

                </div>
            </div>
        </div>
    `;
}


function generateContentLeftAndRightContainer() {
    return /*html*/ `
        <div class="contentLeftAndRight">
            <div class="contentLeft">
                <div class="titleAndInput">
                    <span>Title</span>
                    <input id="title" type="text" required placeholder="Enter a title">
                </div>

                <div class="descriptionAndTextarea">
                    <span>Description</span>
                    <textarea id="description" type="text" required placeholder="Enter a Description"></textarea>
                </div>

                <div class="categoryAndSelect">
                    <span>Category</span>
                    
                    <div class="newCategoryContainer d-none" id="newCategoryContainer">
                        <input placeholder="New category name" id="newCategoryInput">
                        <div class="newCategoryColorContainer">
                            <div class="categoryColor" id="newCategoryColor"></div>
                        </div>
                        <button type="button" class="cancelButton" onclick="cancelNewCategory()">
                            <img src="assets/img/Vector (2).svg">
                        </button>
                        <button type="button" class="checkButton" onclick="confirmNewCategory()">
                            <img src="./img/blackCheckIcon.png">
                        </button>
                    </div>

                    <div class="newCategoryColors d-none" id="newCategoryColors">
                        <p class="categoryColor" style="background-color: red" onclick="addColorToNewCategory('red')"></p>
                        <p class="categoryColor" style="background-color: orange" onclick="addColorToNewCategory('orange')"></p>
                        <p class="categoryColor" style="background-color: pink" onclick="addColorToNewCategory('pink')"></p>
                        <p class="categoryColor" style="background-color: turquoise" onclick="addColorToNewCategory('turquoise')"></p>
                        <p class="categoryColor" style="background-color: goldenrod" onclick="addColorToNewCategory('goldenrod')"></p>
                        <p class="categoryColor" style="background-color: blue" onclick="addColorToNewCategory('blue')"></p>
                    </div>
                    
                    <div class="category" id="category" onclick="openCategoryDropdown()">Select task category</div>
                    <div id="categoryDropdown" class="categoryDropdown d-none">
                        <div class="categoryOption" onclick="newCategory()">
                            New category
                        </div>

                        <div class="categoryOption" value="development" onclick="selectedCategory('development', 'red')">
                            Development
                            <div class="categoryColor" style="background-color: red"></div>
                        </div>

                        <div class="categoryOption" value="design" onclick="selectedCategory('design', 'orange')">
                            Design
                            <div class="categoryColor" style="background-color: orange"></div>
                        </div>

                        <div class="categoryOption" value="sales" onclick="selectedCategory('sales', 'pink')">
                            Sales
                            <div class="categoryColor" style="background-color: pink"></div>
                        </div>

                        <div class="categoryOption" value="backoffice" onclick="selectedCategory('backoffice', 'turquoise')">
                            Backoffice
                            <div class="categoryColor" style="background-color: turquoise"></div>
                        </div>

                        <div class="categoryOption" value="media" onclick="selectedCategory('media', 'goldenrod')">
                            Media
                            <div class="categoryColor" style="background-color: goldenrod"></div>
                        </div>

                        <div class="categoryOption" value="marketing" onclick="selectedCategory('marketing', 'blue')">
                            Marketing
                            <div class="categoryColor" style="background-color: blue"></div>
                        </div>
                    </div>
                </div>

                <div class="assignedToAndSelect">
                    <span>Assigned to</span>
                    <select id="assignedTo" required> 
                        <option value="" disabled selected>Select contacts to assign</option>
                    </select>
                </div>

                <div class="assignedToList" id="assignedToList">

                </div>
            </div>

            <div class="borderline"></div>

            <div class="contentRight">
                <div class="dueDateAndInput">
                    <span>Due Date</span>
                    <input type="date" id="date" required placeholder="dd/mm/yyyy" onchange="pushDate()">
                </div>

                <div class="prio">
                    <span>Prio</span>
                    <div class="prioButtons">
                        <button type="button" id="urgent" value="urgent">
                            Urgent
                            <img id="urgentIcon" src="./img/urgentIcon.png">
                        </button>

                        <button type="button" id="medium" value="medium">
                            Medium
                            <img id="mediumIcon" src="./img/mediumIcon.png">
                        </button>

                        <button type="button" id="low" value="low">
                            Low
                            <img id="lowIcon" src="./img/lowIcon.png">
                        </button>
                    </div>
                </div>

                <div class="subtasksAndInput">
                    <span>Subtasks</span>

                    <div class="inputAndButton">
                        <input id="subtasks" placeholder="Add new subtask">
                        <button type="button" onclick="newSubtask()">
                            <img src="./img/subtaskIcon.png">
                        </button>
                    </div>
                </div>

                <div class="subtasksList" id="subtasksList">

                </div>
            </div>
        </div>
    `;
}