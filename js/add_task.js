function generateSideBar() {
    let menu = document.getElementById('content');
    menu.innerHTML = /*html*/ `<nav><img src="./assets/img/Capa 2.svg" class="logo"><a href="./summary.html" class="nav-sub"><img src="./assets/img/Icons.svg">Summary</a>
    <a href="./add_task.html" class="nav-sub"><img src="./assets/img/Icons (1).svg">Add Task</a><a href="./board.html" class="nav-sub"><img src="./assets/img/Icons (2).svg">Board</a>
    <a href="./contacts.html" class="nav-sub"><img src="./assets/img/Icons (3).svg">Contacs</a><div class="nav-bottom"><a href="#" class="nav-bottom-a">Privacy Policy</a>
    <a href="#" class="nav-bottom-a">Legal Notice</a><a href="#" class="nav-bottom-a">Log out</a></div></nav>`;

    generateHeader(menu)
}

function generateHeader(menu) {
    menu.innerHTML += /*html*/ `<header><span class="header-text">Kanban Project Management Tool</span><div class="header-icons">
        <img src="./assets/img/help.svg" class="help-icon"><img src="./assets/img/Group 5.svg" class="group-icon"></header>`;
}


let contacts = [
    {
        "name": "Anja Schulz",
        "email": "schulz@hotmail.com",
        "phone": "+49 151 1234 5678",
        "color": getRandomColor()
    },
    {
        "name": "Benedikt Ziegler",
        "email": "benedikt@gmail.com",
        "phone": "+49 172 9876 5432",
        "color": getRandomColor()
    },
    {
        "name": "David Eisenberg",
        "email": "davidberg@gmail.com",
        "phone": "+49 160 5555 9999",
        "color": getRandomColor()
    },
    {
        "name": "Eva Fischer",
        "email": "eva@gmail.com",
        "phone": "+49 157 4444 3333",
        "color": getRandomColor()
    },
    {
        "name": "Marcel Bauer",
        "email": "bauer@gmail.com",
        "phone": "+49 176 8765 4321",
        "color": getRandomColor()
    },
    {
        "name": "Emmanuel Mauer",
        "email": "emmanuelmae@gmail.com",
        "phone": "+49 162 1111 2222",
        "color": getRandomColor()
    }
];


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

    // Event-Listener, um den Ball zu entfernen und die zugehörige Option freizugeben
    assigneeContainer.addEventListener('click', () => {
        assigneeContainer.remove();

        // Suche die zugehörige Option im Dropdown
        let option = Array.from(document.getElementById('which_assigned_contact').options)
            .find(option => option.value === contact.name);

        // Freigebe die Option, indem das `disabled`-Attribut entfernt wird
        if (option) {
            option.disabled = false;

            // Entferne die Klasse 'selected' vom vorher ausgewählten Container
            document.querySelectorAll('.assigneeContainer').forEach(container => {
                container.classList.remove('selected');
            });
        }
    });

    // Event-Listener, um die ausgewählte Farbe zu speichern
    assigneeContainer.addEventListener('click', () => {
        const selectedColor = assigneeContainer.style.backgroundColor;  // Ändere dies

        // Füge die Farbe dem Array hinzu
        assignedToColorsArray.push(selectedColor);

        // Entferne die 'selected'-Klasse von allen AssigneeContainern
        document.querySelectorAll('.assigneeContainer').forEach(container => {
            container.classList.remove('selected');
        });

        // Füge die 'selected'-Klasse nur dem ausgewählten Container hinzu
        assigneeContainer.classList.add('selected');
        option.classList.remove('not_selected');  // Entferne die Klasse 'not_selected'
    });

    assignedToList.appendChild(assigneeContainer);
}
















let allTasks = [];

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
        priority: priority, // Add priority to the task
        assignedToValues: [selectedOption.value],
        assignedToColors: [assignedToColor]
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
    titleInput.value = '';
    descriptionInput.value = '';
    subtaskInput.value = '';
    createdAtInput.value = '';

    // Update the localStorage with the updated task list
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
    // Füge das aktualisierte Titel-Array dem allTasks-Objekt hinzu
    allTasks.titles = titlesArray;
    allTasks.descriptions = descriptionsArray;
    allTasks.createdAt = createdAtArray;
    allTasks.priority = priorityArray;
    allTasks.category = categoryArray;
    allTasks.categoryColors = categoryColorArray;
    allTasks.subtasks = subtasksArray;
    // Füge das aktualisierte zugewiesene Werte- und Farben-Array dem allTasks-Objekt hinzu
    allTasks.assignedToValues = assignedToValuesArray;
    allTasks.assignedToColors = assignedToColorsArray;



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



function init() {
    render();
    generateSideBar();
    clickEventlisteners();
    openDatepicker();
    createContactDropdown();
    getRandomColor();
    assignOptionIDs();
}


// Die render() Funktion generiert den HTML-Code und fügt ihn in das Dokument ein.
function render() {
    let renderContent = document.getElementById('render_content');
    renderContent.innerHTML = '';

    // Erstellen Sie das HTML für die Benutzeroberfläche und fügen Sie es in das Dokument ein.
    renderContent.innerHTML = /*html*/ `


<div class="title_description_div">
        <div class="add_title_section">
            <h6>Title</h6>
            <input required type="text" class="title_inputfield" id="title" placeholder="Enter a title">
        </div>

        <div class="add_description_section">
            <h6>Description</h6>
            <textarea required type="text" class="description_inputfield" id="description_text"
                placeholder="Enter a Description">
        </textarea>
        </div>

        <div class="assigned_to_section">
            <h6>Assigned to</h6>
            <label for="Select contacts to assign"></label>
            <select required class="assigned_to_inputfield" name="contacts" id="which_assigned_contact">
                <option value="Select contacts to assign">Select contacts to assign</option>
                <option id="rgb(91,61,94)" value="Augustus Arndt">Augustus Arndt</option>
        
            <option id="" value="Johannes Diether">Johannes Diether</option>
        
            <option id="" value="Connell Sky">Connell Sky</option>
        
            <option id="" value="Paquito Marlowe">Paquito Marlowe</option>
        
            <option id="" value="Curt Jordin">Curt Jordin</option>
        
            <option id="" value="Thomas Grahame">Thomas Grahame</option>
        
            <option id="" value="Dale Coy">Dale Coy</option>
        
            <option id="" value="Maximilian Mustermann">Maximilian Mustermann</option>
        
            <option id="" value="Hubertus Arsenio">Hubertus Arsenio</option>
        
            <option id="" value="Jed Lindy">Jed Lindy</option>
        
            <option id="" value="Otto Warwick">Otto Warwick</option>
        
            <option id="" value="Gyles Owen">Gyles Owen</option>
        
            <option id="" value="Shanon Kerry">Shanon Kerry</option>
        
            <option id="" value="Justin Devyn">Justin Devyn</option>
        
            <option id="" value="Ewald Ross">Ewald Ross</option>
            </select>
            <div class="assignedToList" id="assignedToList"></div>
        </div>

</div>



<div class="date_Prio_div">
    <div class="add_date_section">
        <h6 class="">Due date</h6>
        <input required type="text" class="date_inputfield" id="createdAt" placeholder="dd/mm/yy">
    </div>




    <div class="add_Prio_section">
        <h6>Prio</h6>
        <div class="prio_btn_position">
            <button id="normal_urgent_btn" class="urgent_prio_btn_characteristics">
                <div class="prio_btn_text_icon">
                    <h6 class="prio_btn_text_position">Urgent</h6>
                    <img class="prio_icon_position" src="assets/img/Prio alta.svg" alt="High-Prio-Icon">
                </div>
            </button>
            <button type="button" value="urgent" id="clicked_urgent_btn" class="urgent_prio_btn_characteristics_onclick d-none">
                <div class="prio_btn_text_icon">
                    <h6 class="prio_btn_text_position">Urgent</h6>
                    <img class="prio_icon_position" src="assets/img/Prio alta-white.svg" alt="High-Prio-Icon">
                </div>
            </button>
            <button id="normal_medium_btn" class="medium_prio_btn_characteristics">
                <div class="prio_btn_text_icon">
                    <h6 class="prio_btn_text_position">Medium</h6>
                    <img class="prio_icon_position" src="assets/img/Prio media.svg" alt="Medium-Prio-Icon">
                </div>
            </button>
            <button type="button" value="medium" id="clicked_medium_btn" class="medium_prio_btn_characteristics_onclick d-none">
                <div class="prio_btn_text_icon">
                    <h6 class="prio_btn_text_position">Medium</h6>
                    <img class="prio_icon_position" src="assets/img/Prio media-white.svg"
                        alt="Medium-Prio-Icon">
                </div>
            </button>
            <button id="normal_low_btn" class="low_prio_btn_characteristics">
                <div class="prio_btn_text_icon">
                    <h6 class="prio_btn_text_position">Low</h6>
                    <img class="prio_icon_position" src="assets/img/Prio baja.svg" alt="Low-Prio-Icon">
                </div>
            </button>
            <button type="button" value="low" id="clicked_low_btn" class="low_prio_btn_characteristics_onclick d-none">
                <div class="prio_btn_text_icon">
                    <h6 class="prio_btn_text_position">Low</h6>
                    <img class="prio_icon_position" src="assets/img/Prio baja-white.svg" alt="Low-Prio-Icon">
                </div>
            </button>
        </div>
    </div>



    <div class="categoryAndSelect">
                    <h6>Category</h6>
                    
                    <div class="newCategoryContainer d-none" id="newCategoryContainer">
                        <input placeholder="New category name" id="newCategoryInput">
                        <div class="newCategoryColorContainer">
                            <div class="categoryColor" id="newCategoryColor"></div>
                        </div>
                        <button type="button" class="cancelButton" onclick="cancelNewCategory()">
                            <img src="assets/img/Vector (1).png">
                        </button>
                        <button type="button" class="checkButton" onclick="confirmNewCategory()">
                            <img src="assets/img/add.svg">
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
                    
                    <div class="category" id="category" onclick="openCategoryDropdown()" style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; border-bottom: 1px solid rgb(209, 209, 209); display: flex;">Select task category</div>
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


    <div class="task-container">
        <div class="taskContainerItemsPosition">
            <input  class="subtaskInputfield" type="text" id="subtaskInput" placeholder="Add new subtask">
            <div class="subtaskButton">
                <img class="subtask_img" src="assets/img/add.svg" alt="" onclick="addSubtask()">
            </div>
        </div>

        <ul id="subtaskList"></ul>
    </div>


    <div class="clear_and_create_task_position" id="twoButtonsContainer">
        <div class="clear_and_create_task_btn">
            <button id="reset" type="reset" class="clear_button" onclick="clearInputFields()"
                onmouseover="changeClearBtnIconToHover('clearIconDefault', 'clearIconHover')"
                onmouseout="changeClearBtnIconToDefault('clearIconHover', 'clearIconDefault')">
                Clear
                <img src="assets/img/Vector (2).svg" id="clearIconDefault" class="">
                <img src="assets/img/Vector blue.svg" id="clearIconHover" class="d-none">
            </button>

            <button type="submit" class="create_task_button" id="createTask" onclick="addTask()">
                Create Task
                <img src="assets/img/check.svg">
            </button>
        </div>
    </div>

    `;
}

function clearInputFields() {
    // Reset title and description input fields
    const titleInput = document.getElementById('title_text');
    const descriptionInput = document.getElementById('description_text');
    titleInput.value = '';
    descriptionInput.value = '';

    // Reset assigned to dropdown
    const assignedToSelect = document.getElementById('all_selectable_contacts');
    assignedToSelect.selectedIndex = 0;

    // Reset due date input
    const dueDateInput = document.getElementById('due_date_input');
    dueDateInput.value = '';

    // Reset priority buttons
    const priorityButtons = document.querySelectorAll('.priority-button');
    priorityButtons.forEach(button => button.classList.remove('clicked-priority'));

    // Reset category dropdown
    const categorySelect = document.getElementById('task_category');
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
        listItem.textContent = subtaskText;  // Setze den Text des Listenelements basierend auf der Eingabe

        // Erstelle das Edit-Icon und füge es zum Listenelement hinzu
        const editIcon = document.createElement('div');
        editIcon.classList.add('pencil_icon_div');
        editIcon.innerHTML = `<img class="addSubTaskIcons icon pencil" src="assets/img/pencil-32.png" alt="" onclick="editSubtask(event)">`;

        // Erstelle das Delete-Icon und füge es zum Listenelement hinzu
        const deleteIcon = document.createElement('div');
        deleteIcon.classList.add('delete_icon_div');
        deleteIcon.innerHTML = `<img class="addSubTaskIcons icon delete" src="assets/img/delete-32.png" alt="" onclick="deleteSubtask(event)">`;

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
    checkmarkIcon.src = 'assets/img/check-mark-3-32.png';
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
        deleteIcon.innerHTML = `<img class="addSubTaskIcons icon delete" src="assets/img/delete-32.png" alt="" onclick="deleteSubtask(event)">`;
        subtaskItem.appendChild(deleteIcon);
    }
}




function createEditIcon() {
    const editIconContainer = document.createElement('div');  // Div für das Edit-Icon
    editIconContainer.classList.add('edit-icon-container');

    const editIcon = document.createElement('img');
    editIcon.classList.add('addSubTaskIcons', 'icon', 'pencil');
    editIcon.src = 'assets/img/pencil-32.png';
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
    deleteIcon.src = 'assets/img/delete-32.png';
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