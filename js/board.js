


async function initForBoard() {
    await loadTasks();
    generateSideBar();
    showTasks();
    restoreTasksFromLocalStorage();
    sortTaskIntoArrays(allTasks, tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone);
    addTaskOverlayClickEventlisteners();
    createContactDropdown();
    getRandomColor();
    assignOptionIDs();
    setMinDateForBoard();
}


function setMinDateForBoard() {
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


let inWhichContainer = [];


function fillEmptyCategory() {
    const defaultCategoryText = 'Keine Category ausgewählt';
    const defaultCategoryColor = '#808080'; // Hier kannst du eine beliebige Farbe angeben

    if (category === '') {
        category = defaultCategoryText;
    }

    if (categoryColorArray.length === 0) {
        categoryColorArray.push(defaultCategoryColor);
    }
}


function addTaskFromOverlay() {
    event.preventDefault();  // Verhindert das Standardverhalten des Formulars (Seitenaktualisierung)

    // Alle erforderlichen Felder sind gefüllt
    const assignedToDiv = document.getElementById('assignedToList');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description_text');
    const categorySelect = document.getElementById('category');
    const createdAtInput = document.getElementById('createdAt');
    const subtaskInput = document.getElementById('subtaskInput');
    const subtaskList = document.getElementById('subtaskList');


    // Extrahiere Subtask-Texte aus den Listenelementen im subtasksArray

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
        priority: priorityArray,
        subtasks: subtasksArray,
        categoryColors: categoryColorArray,
        assignedToValues: assignedToValuesArray,
        assignedToColors: assignedToColorsArray,
        assignedShortValues: assignedShortValues,
        // Hier erfolgt die Überprüfung, ob das inWhichContainer Array Werte enthält
        inWhichContainer: inWhichContainer.length > 0 ? inWhichContainer : ''
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

        }, 3000); // Hier können Sie die Zeit in Millisekunden anpassen

        clearAddTaskFields();

    } else {
        if (assignedToValuesArray.length === 0) {
            showBoardContactsNotification();
        } else if (priorityArray.length === 0) {
            showBoardPrioNotification();
        } else {
            // Wenn alle Arrays gefüllt sind, können Sie hier eine abschließende Benachrichtigung anzeigen.
            showBoardFinalNotification();
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





function findTask() {
    const searchInput = document.getElementById('search').value.toLowerCase();

    const pinnedTaskContainers = document.querySelectorAll('.pinned-task-container');

    pinnedTaskContainers.forEach(container => {
        const headline = container.querySelector('.pinned-task-headline');
        const taskText = headline.textContent.toLowerCase();
        if (taskText.includes(searchInput)) {
            // Wenn eine Übereinstimmung gefunden wurde, entferne die "d-none" Klasse vom Container
            container.classList.remove('d-none');
        } else {
            // Wenn keine Übereinstimmung gefunden wurde, füge die "d-none" Klasse zum Container hinzu
            container.classList.add('d-none');
        }
    });
}

let task_category = {};

let tasksToDo = [];
let tasksInProgress = [];
let tasksAwaitFeedback = [];
let tasksDone = [];


// Die anderen Funktionen (targetInProgressTableCheck, targetAwaitFeedbackTableCheck, targetDoneTableCheck) sind ähnlich aufgebaut und verwenden die entsprechenden Arrays (tasksInProgress, tasksAwaitFeedback, tasksDone).

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

task_category.toDo = tasksToDo;
task_category.progress= tasksInProgress;
task_category.feedback= tasksAwaitFeedback;
task_category.done= tasksDone;
saveTasksCategory();
}




function showTasks() {
    const taskContainer = document.getElementById('target-to-do-table');
    const feedbackTaskContainer = document.getElementById('target-await-feedback-table');
    const inProgressContainer = document.getElementById('target-in-progress-table');
    const targetDoneTable = document.getElementById('target-done-table');

    // Leere die Container, bevor wir die Aufgaben hinzufügen
    taskContainer.innerHTML = '';
    feedbackTaskContainer.innerHTML = '';
    inProgressContainer.innerHTML = '';
    targetDoneTable.innerHTML = '';

    allTasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task-item');
        taskDiv.setAttribute('id', `task-${task.id}`);
        taskDiv.setAttribute('draggable', true); // Fügen Sie das Drag-and-Drop-Attribut hinzu
        taskDiv.addEventListener('dragstart', onDragStart);

        const categorybackgroundColor = task.categoryColors[0]; // Hier nehme ich die erste Farbe im Array
        let targetContainer = taskContainer; // Standard-Zielcontainer
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
                <div class="pinnedAssigneBallPosition">
                    ${assignePinnedTaskBall}
                    </div>
                    <div class="pinnedPrioPosition">
                    <div>
                        <img class="pinnedPrioImg" src="${priorityImageSrc}" alt="Priority Image">
                    </div>
                    </div>
                </div>
            </div>`;

        // Füge das Div-Element zum richtigen Zielcontainer hinzu
        targetContainer.appendChild(taskDiv);
    });

    // Annahme: Die Zielcontainer haben die Klassen "drop-container"
    const dropContainers = document.querySelectorAll('.drop-container');

    dropContainers.forEach(container => {
        container.addEventListener('drop', onDrop);
        container.addEventListener('dragover', allowDrop);
    });

    restoreTasksFromLocalStorage();
    sortTaskIntoArrays(allTasks, tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone);
    // Speichere inWhichContainer im localStorage, um seine Werte beizubehalten
}


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






function ballForBoardOverlay(assignedToColors, assignedToValues, assignedToList) {
    for (let i = 0; i < assignedToColors.length; i++) {
        const contactName = assignedToValues[i];
        const color = assignedToColors[i];

        // Finde den Kontakt im contacts Array
        const contact = contacts.find(c => c.name === contactName);

        if (contact) {
            const assigneeContainer = document.createElement('div');
            assigneeContainer.classList.add('assigneeContainer');
            assigneeContainer.style.backgroundColor = color;

            const [firstName, lastName] = contactName.split(' ');
            assigneeContainer.innerHTML = `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`;

            // Setze den Wert als data-Attribut
            assigneeContainer.setAttribute('value', contactName);

            // Event-Listener für den Hover-Effekt
            assigneeContainer.addEventListener('mouseover', () => {
                const value = assigneeContainer.getAttribute('value');
                if (value) {
                    // Zeige den Value als Tooltip an
                    assigneeContainer.setAttribute('title', value);
                }
            });

            // Event-Listener, um den Tooltip zu entfernen
            assigneeContainer.addEventListener('mouseout', () => {
                assigneeContainer.removeAttribute('title');
            });

            // Event-Listener, um den Ball zu löschen
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

            assignedToList.appendChild(assigneeContainer);
        } else {
            console.error('Kontakt nicht gefunden für Wert:', contactName);
        }
    }
}



let currentTaskId;

function editingShowTask() {
    currentTaskId = [];
    const taskOverviewPopUp = document.getElementById('taskOverviewPopUp');
    taskOverviewPopUp.innerHTML = '';
    const task = allTasks.find(task => task.id === currentShowedTaskId);
    currentTaskId = currentShowedTaskId;

    if (!task) {
        console.error(`Task mit der ID "${taskId}" wurde nicht gefunden.`);
        return;
    }

    const descriptionText = task.description_text;
    const idDateValue = task.createdAt;

    // Extrahiere Informationen
    const title = task.title;
    const assignedToOptions = task.assignedToValues.map((contact, index) => {
        return `<option value="${contact}" data-id="_${index}" data-color="${task.assignedToColors[index]}">${contact}</option>`;
    }).join('');
    const priority = task.priority;
    const subtasksList = task.subtasks.map(subtask => {
        return `<li class="subtask-item">${subtask}<div class="pencil_icon_div"><img class="addSubTaskIcons icon pencil" src="../assets/img/pencil-32.png" alt="" onclick="editSubtask(event)"></div>
        <div class="delete_icon_div"><img class="addSubTaskIcons icon delete" src="../assets/img/delete-32.png" alt="" onclick="deleteSubtask(event)"></div></li>`;
    }).join('');



    taskOverviewPopUp.innerHTML = `
    <form class="taskOverviewForm" onsubmit="event.preventDefault(); boardConfirm();">
    <div class="board-vector-position"><img class="board-vector-class" src="../assets/img/Vector (1).svg" alt="" onclick="closeBoardTaskOverviewPopUp()"></div>
        <div class="add_title_section">
            <span>Title</span>
            <input required="" type="text" class="title_inputfield" id="boardOverlayTitle" placeholder="Enter a title" value="${title}">

            <div class="add_description_section">
                <span>Description</span>
                <textarea required="" type="text" class="description_inputfield" id="boardOverlaydescriptionText" placeholder="Enter a Description">${descriptionText}</textarea>

                <div class="assigned_to_section">
                    <span>Assigned to</span>
                    <label for="Select contacts to assign"></label>
                    <select required="" class="assigned_to_inputfield" name="contacts" id="boardOverlayContact">Select contacts to assign</select>
                    <div class="assignedToList" id="ballAssignedToList"></div>
                </div>
            </div>
        </div>

        <div class="date_Prio_div">
            <div class="add_date_section">
                <span class="">Due date</span>
                <input required="" type="date" Value="${idDateValue}"  class="date_inputfield" id="editedCreatedAt" placeholder="dd/mm/yy">
            </div>

            <div class="add_Prio_section">
                            <span>Prio</span>
                            <div class="prio_btn_position">
                                <button id="board_urgent_btn" class="urgent_prio_btn_characteristics">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Urgent</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio alta.svg"
                                            alt="High-Prio-Icon">
                                    </div>
                                </button>
                                <button type="button" value="urgent" id="board_clicked_urgent_btn"
                                    class="urgent_prio_btn_characteristics_onclick d-none">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Urgent</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio alta-white.svg"
                                            alt="High-Prio-Icon">
                                    </div>
                                </button>
                                <button id="board_medium_btn" class="medium_prio_btn_characteristics">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Medium</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio media.svg"
                                            alt="Medium-Prio-Icon">
                                    </div>
                                </button>
                                <button type="button" value="medium" id="board_clicked_medium_btn"
                                    class="medium_prio_btn_characteristics_onclick d-none">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Medium</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio media-white.svg"
                                            alt="Medium-Prio-Icon">
                                    </div>
                                </button>
                                <button id="board_low_btn" class="low_prio_btn_characteristics">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Low</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio baja.svg"
                                            alt="Low-Prio-Icon">
                                    </div>
                                </button>
                                <button type="button" value="low" id="board_clicked_low_btn"
                                    class="low_prio_btn_characteristics_onclick d-none">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Low</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio baja-white.svg"
                                            alt="Low-Prio-Icon">
                                    </div>
                                </button>
                            </div>
                        </div>
            <div class="task-container">
                <div class="taskContainerItemsPosition">
                    <input class="subtaskInputfield" type="text" id="subtaskBoardInput" placeholder="Add new subtask">
                    <div class="subtaskButton">
                        <img class="subtask_img" src="../assets/img/add.svg" alt="" onclick="addSubtaskToBoard()">
                    </div>
                </div>

                <ul id="boardSubtaskList" class="boardSubtaskList">
                    ${subtasksList}
                </ul>
            </div>
        </div>
    <div class="board-confirm-div">
        <button type="submit" class="board-confirm-btn">
            <span>Ok</span>
            <img src="../assets/img/check.svg" alt="">
        </button>
    </div>
    </form>`;
    boardOverlayContactDropdown(assignedToOptions);
    // Aufruf der Funktion, um den Ball hinzuzufügen
    const assignedToList = document.getElementById('ballAssignedToList');
    ballForBoardOverlay(task.assignedToColors, task.assignedToValues, assignedToList);
    clearBoardInputFields();
    boardClickEventlisteners();
    setMinDate();
}


function boardConfirm() {
    event.preventDefault();
    const taskId = currentTaskId;
    const title = document.getElementById('boardOverlayTitle').value;
    const descriptionText = document.getElementById('boardOverlaydescriptionText').value;
    const assignedToDiv = document.getElementById('ballAssignedToList');
    const dueDate = document.getElementById('editedCreatedAt');
    const dueDateInput = dueDate.value;
    const boardOverlaySubTaskList = document.getElementById('boardSubtaskList');
    const subtaskItems = document.querySelectorAll('#boardSubtaskList .subtask-item');
    boardOverlaySubTaskList.innerHTML = '';

    const subtasksArray = [];
    subtaskItems.forEach(item => {
        const textNode = item.childNodes[0];
        subtasksArray.push(textNode.textContent.trim());
    });

    const taskIndex = allTasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        const assigneeContainers = assignedToDiv.getElementsByClassName('assigneeContainer');
        const assignedToValues = [];
        const assignedShortValues = [];
        const assignedToColors = [];

        for (const container of assigneeContainers) {
            const backgroundColor = container.style.backgroundColor;
            const contactValue = container.getAttribute('value');
            const contactText = container.textContent.trim();

            assignedToValues.push(contactValue);
            assignedShortValues.push(contactText);
            assignedToColors.push(backgroundColor);
        }

        // Überprüfe, ob das priorityArray leer ist, und greife auf die vorherige Priorität zu, falls vorhanden
        const previousPriority = allTasks[taskIndex].priority;
        const updatedPriority = priorityArray.length > 0 ? priorityArray : previousPriority;

        // Direktes Aktualisieren der spezifischen Task-Eigenschaften als Array
        allTasks[taskIndex].title = title;
        allTasks[taskIndex].description_text = descriptionText;
        allTasks[taskIndex].createdAt = dueDateInput;
        allTasks[taskIndex].priority = updatedPriority.slice(); // Klonen des Arrays
        allTasks[taskIndex].subtasks = subtasksArray.slice(); // Klonen des Arrays
        allTasks[taskIndex].assignedToValues = assignedToValues.slice(); // Klonen des Arrays
        allTasks[taskIndex].assignedShortValues = assignedShortValues.slice(); // Klonen des Arrays
        allTasks[taskIndex].assignedToColors = assignedToColors.slice(); // Klonen des Arrays

        saveTasks();
        priorityArray = [];
        closeTaskOverviewPopUp();
        showTasks();
        restoreTasksFromLocalStorage();
        sortTaskIntoArrays(allTasks, tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone);
    } else {
        console.error(`Task mit der ID "${taskId}" wurde nicht im allTasks-Array gefunden.`);
        return;
    }
}







function getTaskId(taskId) {
    // Verwende den übergebenen Task und extrahiere die ID
    return taskId.id;
}






function closeTaskOverviewPopUp() {
    inWhichContainer = [];
    const addTaskOverlaySection = document.getElementById('addTaskOverlaySection');
    const overlaySection = document.getElementById('overlaySection');

    // Entferne die Klasse "d-none" aus dem overlaySection
    overlaySection.classList.add('d-none');
    addTaskOverlaySection.classList.add('d-none');
}

function doNotClose(event) {
    event.stopPropagation();
}

function forClearAddTaskWithBtn() {
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
    const urgentBtn = document.getElementById('addTask_overlay_urgent_btn');
    const mediumBtn = document.getElementById('addTask_overlay_medium_btn');
    const lowBtn = document.getElementById('addTask_overlay_low_btn');

    const urgentBtnClicked = document.getElementById('addTask_overlay_clicked_urgent_btn');
    const mediumBtnClicked = document.getElementById('addTask_overlay_clicked_medium_btn');
    const lowBtnClicked = document.getElementById('addTask_overlay_clicked_low_btn');

    urgentBtn.classList.remove('d-none');
    mediumBtn.classList.remove('d-none');
    lowBtn.classList.remove('d-none');

    urgentBtnClicked.classList.add('d-none')
    mediumBtnClicked.classList.add('d-none')
    lowBtnClicked.classList.add('d-none')



    const categoryDropdown = document.getElementById('categoryDropdown');
    const categoryContainer = document.getElementById('category');

    // Hole alle Div-Elemente mit der Klasse "categoryOption" im Container mit der ID "categoryDropdown"
    const categoryOptions = categoryDropdown.getElementsByClassName('categoryOption');

    // Überprüfe, ob es ein zweites Element in der Liste der "categoryOption"-Elemente gibt
    if (categoryOptions.length >= 2) {
        // Erhalte das zweite Element der "categoryOption"-Elemente
        const secondCategoryOption = categoryOptions[1];

        // Füge das zweite Element in den Container mit der ID "category" hinzu
        categoryContainer.innerHTML = secondCategoryOption.outerHTML;
    }




    // Reset subtask input and list
    const subtaskInput = document.getElementById('subtaskInput');
    const subtaskList = document.getElementById('subtaskList');
    subtaskInput.value = '';
    subtaskList.innerHTML = '';

    resetAssignedField();
}

function clearAddTaskFields() {
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
    const urgentBtn = document.getElementById('addTask_overlay_urgent_btn');
    const mediumBtn = document.getElementById('addTask_overlay_medium_btn');
    const lowBtn = document.getElementById('addTask_overlay_low_btn');

    const urgentBtnClicked = document.getElementById('addTask_overlay_clicked_urgent_btn');
    const mediumBtnClicked = document.getElementById('addTask_overlay_clicked_medium_btn');
    const lowBtnClicked = document.getElementById('addTask_overlay_clicked_low_btn');

    urgentBtn.classList.remove('d-none');
    mediumBtn.classList.remove('d-none');
    lowBtn.classList.remove('d-none');

    urgentBtnClicked.classList.add('d-none')
    mediumBtnClicked.classList.add('d-none')
    lowBtnClicked.classList.add('d-none')

    // Reset subtask input and list
    const subtaskInput = document.getElementById('subtaskInput');
    const subtaskList = document.getElementById('subtaskList');
    subtaskInput.value = '';
    subtaskList.innerHTML = '';

    subtasksArray = [];
    categoryArray = [];
    categoryColorArray = [];
    assignedToValuesArray = [];
    assignedToColorsArray = [];
    assignedShortValues = [];
    createdAtArray = [];
    priorityArray = [];

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




function openOverlay() {
    const overlaySection = document.getElementById('addTaskOverlaySection');
    const overlay = document.getElementById('add-task-form');
    overlay.classList.add('slide-in');
    overlaySection.classList.remove('d-none');
}

function addTaskForToDo() {
    const overlaySection = document.getElementById('addTaskOverlaySection');
    const overlay = document.getElementById('add-task-form');
    overlay.classList.add('slide-in');
    overlaySection.classList.remove('d-none');
    inWhichContainer.push('for-To-Do-Container'); // Füge 'for-To-Do-Container' zum Array hinzu
}


function addTaskForInProgress() {
    const overlaySection = document.getElementById('addTaskOverlaySection');
    const overlay = document.getElementById('add-task-form');
    overlay.classList.add('slide-in');
    overlaySection.classList.remove('d-none');
    inWhichContainer.push('in-Progress-Container');
}

function addTaskForAwaitFeedback() {
    const overlaySection = document.getElementById('addTaskOverlaySection');
    const overlay = document.getElementById('add-task-form');
    overlay.classList.add('slide-in');
    overlaySection.classList.remove('d-none');
    inWhichContainer.push('for-Await-Feedback-Container');
}

function closeOverlay() {
    inWhichContainer = [];
    const overlaySection = document.getElementById('addTaskOverlaySection');
    const overlay = document.getElementById('addTaskOverlaySection');
    overlay.classList.remove('slide-in');
    overlaySection.classList.add('d-none');
}







