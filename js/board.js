async function init() {
    await loadTasks();
    updateHTML()
    generateSideBar();
    showTasks();
}

let currentDraggedElement;

function showTasks() {
    const taskContainer = document.getElementById('to-do-table');

    // Leere den Container, bevor wir die Aufgaben hinzufügen
    taskContainer.innerHTML = '';

    allTasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task-item');
        taskDiv.setAttribute('id', `task-${task.id}`); // Eindeutige ID für das Task-div

        // ... (bestehender Code)

        // Füge Drag-and-Drop-Event-Listener hinzu
        taskDiv.setAttribute('draggable', true);
        taskDiv.addEventListener('dragstart', onDragStart);
        taskDiv.addEventListener('drag', onDrag);
        taskDiv.addEventListener('dragend', onDragEnd);

        taskContainer.appendChild(taskDiv);


        const categorybackgroundColor = task.categoryColors[0]; // Hier nehme ich die erste Farbe im Array

        // Überprüfe die Priorität und setze das entsprechende Bild
        let priorityImageSrc = '';
        if (task.priority.includes('low')) {
            priorityImageSrc = '../assets/img/Prio baja.svg';
        } else if (task.priority.includes('medium')) {
            priorityImageSrc = '../assets/img/Prio media.svg';
        } else if (task.priority.includes('urgent')) {
            priorityImageSrc = '../assets/img/Prio alta.svg';
        }

        // Füge den Inhalt zur Aufgabe hinzu
        taskDiv.innerHTML = `
        <div class="pinned-task-container" onclick="showTasksInOverViev('${task.id}')">
                <div class="category-background-color" style="background-color: ${categorybackgroundColor}">
                    <div class="category-div-text">${task.task_category}</div>
                </div>
                <h3 class="pinned-task-headline">${task.title}</h3>
                <p class="pinned-task-discription">${task.description_text}</p>
                <div class="ball-and-prio-img-div">
                    <div class="assigne-ball" style="background-color: ${task.assignedToColors}">
                        <div>${task.which_assigned_contact}</div>
                    </div>
                    <div>
                    <img src="${priorityImageSrc}" alt="Priority Image">
                    </div>
                </div>
            </div>`;

        // Füge das Div-Element zur Aufgabenanzeige hinzu
        taskContainer.appendChild(taskDiv);
    });

    // Annahme: Die Zielcontainer haben die Klassen "drop-container"
    const dropContainers = document.querySelectorAll('.drop-container');

    dropContainers.forEach(container => {
        container.addEventListener('drop', onDrop);
        container.addEventListener('dragover', allowDrop);
    });

}

function onDrag(event) {
    event.target.style.transform = 'rotate(10deg)';
}

function onDragEnd(event) {
    event.target.style.transform = ''; // Zurücksetzen der Transformation nach dem Ziehen

}






function moveTo(taskId, targetContainerId) {
    // Finde den Task basierend auf der ID
    const taskDiv = document.getElementById(taskId);
    const targetContainer = document.getElementById(targetContainerId);

    if (!taskDiv || !targetContainer) {
        console.error('Task or target container not found.');
        return;
    }

    // Ändere den Container des Tasks
    const task = allTasks.find(task => task.id === parseInt(taskId));
    // Überprüfe, ob es sich um einen validen Container handelt
    if (
        targetContainerId !== 'to-do-table' &&
        targetContainerId !== 'in-progress-table' &&
        targetContainerId !== 'await-feedback-table' &&
        targetContainerId !== 'done-table'
    ) {
        console.error('Invalid target container:', targetContainerId);
        return;
    }

    // Hänge das Task-Div an das Ziel-Container an
    targetContainer.appendChild(taskDiv);
    updateHTML();
}

// Event-Handler für den Start des Dragging
function onDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

// Event-Handler für das Drop-Ereignis
function onDrop(event) {
    event.preventDefault();

    const closestTaskContainer = event.target.closest('.task-container');

    // Überprüfe, ob ein passendes Container-Element gefunden wurde
    if (closestTaskContainer) {
        const taskId = event.dataTransfer.getData('text/plain');
        const targetContainerId = closestTaskContainer.id;

        moveTo(taskId, targetContainerId);
    } else {
        console.error('No valid task container found.');
    }
}


// Event-Handler für das Erlauben des Drop-Ereignisses
function allowDrop(event) {
    event.preventDefault();
}



function updateHTML() {
    // ... (bestehender Code)

    allTasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task-item');
        taskDiv.setAttribute('id', `task-${task.id}`); // Eindeutige ID für das Task-Div

        let taskContainer;  // Deklaration des taskContainer

        if (task.container && task.container === 'to-do-table') {
            taskContainer = document.getElementById('to-do-table');
        } else if (task.container && task.container === 'in-progress-table') {
            taskContainer = document.getElementById('in-progress-table');
        } else if (task.container && task.container === 'await-feedback-table') {
            taskContainer = document.getElementById('await-feedback-table');
        } else if (task.container && task.container === 'done-table') {
            taskContainer = document.getElementById('done-table');
        } else {
            console.error('Invalid task container:', task.container);
            return;  // Bei ungültigem Container abbrechen
        }


        // ... (bestehender Code)

        taskContainer.appendChild(taskDiv);
    });
}




function showTasksInOverViev(taskId) {
    const taskOverviewPopUp = document.getElementById('taskOverviewPopUp');
    const overlaySection = document.getElementById('overlaySection');



    // Entferne die Klasse "d-none" aus dem overlaySection
    overlaySection.classList.remove('d-none');
    taskOverviewPopUp.innerHTML = '';  // Leere den Container, bevor neue Einträge hinzugefügt werden

    // Finde den Task basierend auf der ID
    const task = allTasks.find(task => task.id === taskId);

    if (task) {
        const categorybackgroundColor = task.categoryColors[0];
        const category = task.task_category;
        const title = task.title;
        const description = task.description_text;
        const date = task.createdAt;
        const priority = task.priority.join(', ');
        const assignedTo = task.assignedToValues.join(', ');
        const initialsOfAssigned = task.which_assigned_contact;
        const colorOfAssignedment = task.assignedToColors;
        const subTasks = task.subtasks;


        let subTasksHTML = '';  // Hier werden die HTML-Elemente für die Subtasks gesammelt

        if (subTasks && subTasks.length > 0) {
            // Erstelle eine ungeordnete Liste (ul) für die Subtasks
            subTasksHTML += '<ul>';

            subTasks.forEach(subTask => {
                // Füge jeden Subtask als Listenelement (li) hinzu
                subTasksHTML += `<li>${subTask}</li>`;
            });

            // Schließe die ungeordnete Liste (ul)
            subTasksHTML += '</ul>';
        }






        // Zeige die Details des angeklickten Containers im taskOverviewPopUp an
        taskOverviewPopUp.innerHTML = /*html*/ `
        <div class="wholeTaskOverview" id="wholeTaskOverview">
        <div class="categoryHeaderDiv">
        <div class="categoryHeaderPosition">
        <img class="vector-class" src="../assets/img/Vector (1).svg" alt="" onclick="closeTaskOverviewPopUp()"><div class="category-background-color" style="background-color: red">
        
            <div class="category">Development</div>
            
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
                ${priority} <img id="modify${priority}Icon">
            </div>
            </div>
            <div class="taskPopUpAssignments" id="taskPopUpAssignments">
            <div class="assignedToHeadline"><b>Assigned to:</b></div>
            
            </div>
            <div id="taskPopUpAssignmentsList" class="taskPopUpAssignmentsList">
            <div class="taskPopUpSingleAssignmentContainer">
            <div class="assigne-ball" style="background-color:${colorOfAssignedment}">
                ${initialsOfAssigned}
                </div><div>${assignedTo}</div>
                </div>
            </div>
            <div class="subtasksOverview" id="subtasksOverview">
            <div><b>Subtasks</b></div>
            <div class="subTaskContainer">
                ${subTasksHTML}
            </div>
        </div>

        <div class="overviewButtons">
            <div class="popUpButtonsContainer">
                <div class="taskPopUpButton leftBtn btn-border" onclick="deleteTask('2')">
                    <img class="" id="deleteTask-Img" src="../assets/img/delete-32.png" alt="">
                    <img class="d-none" id="deleteTask-light-Img" src="./img/delete-light.png" alt="">

                </div>

                <div class="taskPopUpButton rightBtn btn-bg" onclick="taskEditingMenu()">
                    <img class="popUpPen" src="./img/pen.png" alt="">
                    <img class="popUpPenTriangel" src="../assets/img/pencil-32.png" alt="">
                </div>
            </div>
        </div>
    </div>`;
    }
}


function taskEditingMenu() {
    const taskOverviewPopUp = document.getElementById('taskOverviewPopUp');
    const wholeTaskOverview = document.getElementById('wholeTaskOverview');

    // Entferne die Klasse "d-none" aus wholeTaskOverview
    wholeTaskOverview.classList.remove('d-none');
    taskOverviewPopUp.innerHTML = '';

    // Hinzufügen des HTML-Codes zu taskOverviewPopUp
    taskOverviewPopUp.innerHTML = `
        <div class="add_title_section">
                        <span>Title</span>
                        <input required="" type="text" class="title_inputfield" id="title" placeholder="Enter a title">

                        <div class="add_description_section">
                            <span>Description</span>
                            <textarea required="" type="text" class="description_inputfield" id="description_text" placeholder="Enter a Description"></textarea>

                            <div class="assigned_to_section">
                                <span>Assigned to</span>
                                <label for="Select contacts to assign"></label>
                                <select required="" class="assigned_to_inputfield" name="contacts" id="which_assigned_contact"><option value="Select contacts to assign" data-id="_udlygp4ve" data-color="">Select contacts to assign</option><option value="Anja Schulz" class="not_selected" data-id="_fse1c48hs" data-color="">Anja Schulz</option><option value="Benedikt Ziegler" class="not_selected" data-id="_z2k0rzqyh" data-color="">Benedikt Ziegler</option><option value="David Eisenberg" class="not_selected" data-id="_u1ks8t0mj" data-color="">David Eisenberg</option><option value="Eva Fischer" class="not_selected" data-id="_sab29nq55" data-color="">Eva Fischer</option><option value="Marcel Bauer" class="not_selected" data-id="_0n5zhc5jb" data-color="">Marcel Bauer</option><option value="Emmanuel Mauer" class="not_selected" data-id="_po0t5zdg6" data-color="">Emmanuel Mauer</option></select>
                                <div class="assignedToList" id="assignedToList"></div>
                            </div>
                            <div class="categoryAndSelect">
                                <span>Category</span>

                                <div class="newCategoryContainer d-none" id="newCategoryContainer">
                                    <input placeholder="New category name" id="newCategoryInput">
                                    <div class="newCategoryColorContainer">
                                        <div class="categoryColor" id="newCategoryColor"></div>
                                    </div>
                                    <button type="button" class="cancelButton" onclick="cancelNewCategory()">
                                        <img src="../assets/img/Vector (2).svg">
                                    </button>
                                    <button type="button" class="checkButton" onclick="confirmNewCategory()">
                                        <img src="../assets/img/add.svg">
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

                                <div class="category" id="category" onclick="openCategoryDropdown()" style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; border-bottom: 1px solid rgb(209, 209, 209);">
                                    Development
                                    <div class="categoryColor" style="background-color: red; margin-left: 10px"></div>
                                </div>
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
                        </div>
                    </div>

<div class="date_Prio_div">
                        <div class="add_date_section">
                            <span class="">Due date</span>
                            <input required="" type="date" class="date_inputfield" id="createdAt" placeholder="dd/mm/yy">
                        </div>




                        <div class="add_Prio_section">
                            <span>Prio</span>
                            <div class="prio_btn_position">
                                <button id="normal_urgent_btn" class="urgent_prio_btn_characteristics">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Urgent</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio alta.svg" alt="High-Prio-Icon">
                                    </div>
                                </button>
                                <button type="button" value="urgent" id="clicked_urgent_btn" class="urgent_prio_btn_characteristics_onclick d-none">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Urgent</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio alta-white.svg" alt="High-Prio-Icon">
                                    </div>
                                </button>
                                <button id="normal_medium_btn" class="medium_prio_btn_characteristics">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Medium</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio media.svg" alt="Medium-Prio-Icon">
                                    </div>
                                </button>
                                <button type="button" value="medium" id="clicked_medium_btn" class="medium_prio_btn_characteristics_onclick d-none">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Medium</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio media-white.svg" alt="Medium-Prio-Icon">
                                    </div>
                                </button>
                                <button id="normal_low_btn" class="low_prio_btn_characteristics">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Low</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio baja.svg" alt="Low-Prio-Icon">
                                    </div>
                                </button>
                                <button type="button" value="low" id="clicked_low_btn" class="low_prio_btn_characteristics_onclick d-none">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Low</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio baja-white.svg" alt="Low-Prio-Icon">
                                    </div>
                                </button>
                            </div>
                        </div>





                        <div class="task-container">
                            <div class="taskContainerItemsPosition">
                                <input class="subtaskInputfield" type="text" id="subtaskInput" placeholder="Add new subtask">
                                <div class="subtaskButton">
                                    <img class="subtask_img" src="../assets/img/add.svg" alt="" onclick="addSubtask()">
                                </div>
                            </div>

                            <ul id="subtaskList"></ul>
                        </div>
    `;

    // ... (weiterer Code, z.B. Event Listener, falls benötigt) ...
}




function generateAssignmentsHTML(task) {
    let assignmentsHTML = '';

    if (Array.isArray(task.assignedTo)) {
        task.assignedTo.forEach(assignment => {
            assignmentsHTML += `
                <div class="taskPopUpSingleAssignmentContainer">
                    <div class="taskPopUpSingleAssignmentInitals contactContainer" style="background-color: ${assignment.assignedToColor}">
                        ${getInitials(assignment.which_assigned_contact)}
                    </div>
                    <div class="taskPopUpSingleAssignmentName">${assignment.which_assigned_contact}</div>
                </div>
            `;
        });
    }

    return assignmentsHTML;
}

function getInitials(name) {
    const initials = name.split(' ').map(part => part[0]).join('');
    return initials.toUpperCase();
}



document.addEventListener('DOMContentLoaded', function () {
    const priorityDivs = document.querySelectorAll('.prioContainer');

    priorityDivs.forEach(div => {
        const priority = div.id.replace('modify', '');
        displayPrioContent(priority);
    });
});


function displayPrioContent(priority) {
    const prioContainer = document.getElementById(`modify${priority}`);
    prioContainer.innerHTML = '';  // Leere den Container

    if (priority === 'low') {
        // HTML-Inhalt für low priority
        prioContainer.innerHTML = `<div id="modifylow" class="low prioContainer">low<img id="modifyMediumIcon" src="../assets/img/Prio baja.svg">
        </div>`;
    } else if (priority === 'medium') {
        // HTML-Inhalt für medium priority
        prioContainer.innerHTML = `<div id="modifyMedium" class="medium prioContainer">medium<img id="modifyMediumIcon" src="../assets/img/Prio media-white.svg"></div>`;
    } else if (priority === 'urgent') {
        // HTML-Inhalt für urgent priority
        prioContainer.innerHTML = `<div id="modifyurgent" class="urgent prioContainer">urgent<img id="modifyMediumIcon" src="../assets/img/Prio alta-white.svg">
        </div>`;
    }
}






function closeTaskOverviewPopUp() {
    const overlaySection = document.getElementById('overlaySection');

    // Entferne die Klasse "d-none" aus dem overlaySection
    overlaySection.classList.add('d-none');
}

function doNotClose(event) {
    event.stopPropagation();
}










function openOverlay() {
    const overlay = document.querySelector('.add-task-overlay');
    overlay.classList.add('slide-in');

    var overlaySection = document.getElementById("overlay-section");
    overlaySection.classList.remove("d-none");
}

function closeOverlay() {
    const overlay = document.querySelector('.add-task-overlay');
    overlay.classList.remove('slide-in');

    var overlaySection = document.getElementById("overlay-section");
    overlaySection.classList.add("d-none");
}






