function showTaskFromArray() {
    const task = allTasks[allTasks.length - 1]; // Holt die zuletzt hinzugefügte Aufgabe

    const taskContainer = document.getElementById('target-to-do-table');
    const feedbackTaskContainer = document.getElementById('target-await-feedback-table');
    const inProgressContainer = document.getElementById('target-in-progress-table');

    let targetContainer = taskContainer; // Standard-Zielcontainer
    const categorybackgroundColor = task.categoryColors[0];
    const inWhichContainer = task.inWhichContainer;

    if (inWhichContainer && inWhichContainer.includes('for-To-Do-Container')) {
        targetContainer = taskContainer;
    } else if (inWhichContainer && inWhichContainer.includes('in-Progress-Container')) {
        targetContainer = inProgressContainer;
    } else if (inWhichContainer && inWhichContainer.includes('for-Await-Feedback-Container')) {
        targetContainer = feedbackTaskContainer;
    } else {
        const categorybackgroundColor = task.categoryColors[0];

        if (categorybackgroundColor === 'blueviolet') {
            targetContainer = inProgressContainer;
        }

        if (categorybackgroundColor === 'darkmagenta') {
            targetContainer = feedbackTaskContainer;
        }
    }

    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-item');
    taskDiv.setAttribute('id', `task-${task.id}`);
    taskDiv.setAttribute('draggable', true);
    taskDiv.addEventListener('dragstart', onDragStart);

    // Überprüfe die Priorität und setze das entsprechende Bild
    let priorityImageSrc = '';
    if (task.priority.includes('low')) {
        priorityImageSrc = '../assets/img/Prio baja.svg';
    } else if (task.priority.includes('medium')) {
        priorityImageSrc = '../assets/img/Prio media.svg';
    } else if (task.priority.includes('urgent')) {
        priorityImageSrc = '../assets/img/Prio alta.svg';
    }

    let assignePinnedTaskBall = ''; // Hier sammeln wir die Zuweisungen

    if (task.assignedToValues && task.assignedToValues.length > 0) {
        const maxAssignmentsToShow = 3;
        const assignmentsToDisplay = task.assignedToValues.slice(0, maxAssignmentsToShow);
        let additionalAssignmentsCount = task.assignedToValues.length - maxAssignmentsToShow;

        assignmentsToDisplay.forEach((assignment, index) => {
            const nameParts = assignment.trim().split(' ');
            const initials = nameParts.map(part => part[0]).join('');
            const color = task.assignedToColors[index]; // Farbe für diese Zuweisung

            const assignmentHTML = `
                <div class="assigne-ball" style="background-color: ${color}">
                    <div>${initials}</div>
                </div>
            `;

            assignePinnedTaskBall += assignmentHTML;
        });

        if (additionalAssignmentsCount > 0) {
            // Fügen Sie den zusätzlichen Ball für "+X" hinzu
            assignePinnedTaskBall += `
                <div class="assigne-ball" style="background-color: rgb(0, 0, 0)">
                    +${additionalAssignmentsCount}
                </div>
            `;
        }
    }

    // Füge den Inhalt zur Aufgabe hinzu
    taskDiv.innerHTML = `
        <div class="pinned-task-container" onclick="showTasksInOverViev('${task.id}')">
            <div class="category-background-color" style="background-color: ${categorybackgroundColor}">
                <div class="category-div-text">${task.task_category}</div>
            </div>
            <h3 class="pinned-task-headline">${task.title}</h3>
            <p class="pinned-task-discription">${task.description_text}</p>
            <div id="ball-and-prio-img-div" class="ball-and-prio-img-div">
                ${assignePinnedTaskBall}
                <div>
                    <img src="${priorityImageSrc}" alt="Priority Image">
                </div>
            </div>
        </div>`;

    // Füge das Div-Element zum richtigen Zielcontainer hinzu
    targetContainer.appendChild(taskDiv);

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

function onDrag(event) {
    event.target.style.transform = 'rotate(10deg)';
}

function onDragEnd(event) {
    event.target.style.transform = ''; // Zurücksetzen der Transformation nach dem Ziehen

}

function moveTo(taskId, targetContainerId) {
    const taskDiv = document.getElementById(taskId);
    const targetContainer = document.getElementById(targetContainerId);

    if (taskDiv && targetContainer) {
        targetContainer.appendChild(taskDiv);

        // Aktualisieren Sie den Status der verschobenen Aufgabe im localStorage
        updateTaskStatusInLocalStorage(taskId, targetContainerId);
    }
    // Vor jedem Aufruf der Funktion die Arrays leeren
    sortTaskIntoArrays(allTasks, tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone);
}

function updateTaskStatusInLocalStorage(taskId, targetContainerId) {
    tasksToDo = [];
    tasksInProgress = [];
    tasksAwaitFeedback = [];
    tasksDone = [];
    // Holen Sie die aktuellen Aufgabenstatus aus localStorage (falls vorhanden)
    let tasksStatus = JSON.parse(localStorage.getItem('tasksStatus')) || {};

    // Aktualisieren Sie den Aufgabenstatus mit dem neuen Container
    tasksStatus[taskId] = targetContainerId;

    // Speichern Sie den aktualisierten Aufgabenstatus in localStorage
    localStorage.setItem('tasksStatus', JSON.stringify(tasksStatus));

    // Aktualisieren Sie die Arrays basierend auf dem neuen Container
}

// Diese Funktion wird aufgerufen, um die Aufgaben beim Laden der Seite aus dem localStorage wiederherzustellen
function restoreTasksFromLocalStorage() {
    const tasksStatus = JSON.parse(localStorage.getItem('tasksStatus'));

    if (tasksStatus) {
        for (const taskId in tasksStatus) {
            const targetContainerId = tasksStatus[taskId];
            moveTo(taskId, targetContainerId); // Bewegen Sie den Div-Container
        }
    }
}

// Event-Handler für den Start des Dragging
function onDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function onDrop(event) {
    event.preventDefault();
    const targetContainer = event.target.closest('.drop-container');

    if (targetContainer) {
        const taskId = event.dataTransfer.getData('text/plain');
        const targetContainerId = targetContainer.id;
        moveTo(taskId, targetContainerId);
    }
    event.target.classList.remove('drag-over'); // Zurücksetzen des visuellen Feedbacks
}

function allowDrop(event) {
    event.preventDefault();
    if (event.target.classList.contains('drop-container')) {
        event.target.classList.add('drag-over'); // Visual Feedback für gültige Ziele
    }
}

function clearAllTasks() {
    allTasks = [];  // Leere das Array
    // Hier kannst du weitere Aktionen ausführen, z.B. UI aktualisieren
    // ...
    saveTasks();  // Speichere die leeren Tasks (optional)
}

function deleteTask(taskId) {
    const taskElement = document.getElementById('task-' + taskId);
    if (taskElement) {
        // Entferne das HTML-Element des Tasks
        taskElement.remove();
    } else {
        console.error('HTML Task element not found for deletion');
    }

    // Finde den Index des Tasks basierend auf der ID
    const taskIndex = allTasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        // Entferne den Task aus dem Array
        allTasks.splice(taskIndex, 1);

        // Hier kannst du weitere Aktionen ausführen, z.B. UI aktualisieren
        // ...

        // Schließe das Overlay oder aktualisiere die Ansicht
        hideOverlay();
    } else {
        console.error('Task not found for deletion');
    }

    saveTasks();
}

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
        const category = task.task_category;
        const title = task.title;
        const description = task.description_text;
        const date = task.createdAt;
        const priority = task.priority.join(', ');
        const assignedTo = task.assignedToValues.join(', ');
        const colorOfAssignedment = task.assignedToColors;
        const subTasks = task.subtasks;
        // Extrahiere die Initialen aus dem Namen


        let subTasksHTML = '';  // Hier werden die HTML-Elemente für die Subtasks gesammelt

        if (subTasks && subTasks.length > 0) {
            // Erstelle eine ungeordnete Liste (ul) für die Subtasks
            subTasksHTML += '<ul class="edit-subTask">';

            subTasks.forEach(subTask => {
                // Füge jeden Subtask als Listenelement (li) hinzu
                subTasksHTML += `<li>${subTask}</li>`;
            });

            // Schließe die ungeordnete Liste (ul)
            subTasksHTML += '</ul>';
        }

        let taskPopUpSingleAssignmentContainer = ''; // Deklariere die Variable außerhalb der if-Bedingung

        const colorValues = colorOfAssignedment.toString().split(',');

        // Entferne die Leerzeichen und schließende Klammern von den Werten
        const cleanedColors = colorValues.map(color => color.replace(/\s/g, '').replace(')', ''));

        if (assignedTo && assignedTo.length > 0) {


            task.assignedToValues.forEach((assignment, index) => {
                const nameParts = assignment.trim().split(' ');
                const initials = nameParts.map(part => part[0]).join('');

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