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
    createSpecificNoTaskDivs();
    createNoTaskDiv();




    allTasks.forEach(task => {
        // Create a unique ID for the progress bar
        const progressBarId = generateUniqueID();
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task-item');
        taskDiv.setAttribute('id', `task-${task.id}`);
        taskDiv.setAttribute('draggable', true); // Fügen Sie das Drag-and-Drop-Attribut hinzu
        taskDiv.addEventListener('dragstart', onDragStart);
        task.progressBarId = progressBarId; // Füge die progressBarId zum Task hinzu

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
                // Initialen auf Basis der Logik für Namen erstellen
                let initials = '';

                if (nameParts.length >= 2) {
                    initials = nameParts[0][0] + nameParts[1][0];
                } else if (nameParts.length === 1) {
                    initials = nameParts[0][0];
                }
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
                <div class="progress-bar-container">
                    <div class="progress-bar" id="progress-bar-${progressBarId}"></div>
                </div>
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
        // Rufe die Funktion checkProgressBar auf, um den Fortschritt zu aktualisieren
        checkProgressBar(task.id);
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
    const newCategoryContainer = document.getElementById('newCategoryContainer');
    const newCategoryInput = document.getElementById('newCategoryInput');
    const newCategoryColor = document.getElementById('newCategoryColor');

    // Erstellen von Arrays für die Unteraufgaben-Texte und IDs
    let subtaskTextsArray = [];
    let subtaskIdsArray = [];

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
        subtasks: subtaskTextsArray,
        subtasksId: subtaskIdsArray,
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

        }, 1500); // Hier können Sie die Zeit in Millisekunden anpassen

        clearAddTaskFields();

    } else {
        if (priorityArray.length === 0) {
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

function findTask() {
    const searchInput = document.getElementById('search').value.toLowerCase();

    const pinnedTaskContainers = document.querySelectorAll('.pinned-task-container');

    pinnedTaskContainers.forEach(container => {
        const headline = container.querySelector('.pinned-task-headline');
        const taskText = headline.textContent.toLowerCase();
        const description = container.querySelector('.pinned-task-discription');
        const taskDescription = description.textContent.toLowerCase();

        if (taskText.includes(searchInput) || taskDescription.includes(searchInput)) {
            // Wenn eine Übereinstimmung in Text oder Beschreibung gefunden wurde, entferne die "d-none" Klasse vom Container
            container.classList.remove('d-none');
        } else {
            // Wenn keine Übereinstimmung in Text oder Beschreibung gefunden wurde, füge die "d-none" Klasse zum Container hinzu
            container.classList.add('d-none');
        }
    });
}

function createNoTaskDiv() {
    // Erstelle das div-Element für "No Task Available"
    let noTaskDiv = document.createElement('div');
    noTaskDiv.id = 'noTask';
    noTaskDiv.className = 'no_tasks_class';
    noTaskDiv.textContent = 'No Task Available';

    // Finde die Container, in die du das noTaskDiv-Element einfügen möchtest
    let noTaskInToDo = document.getElementById('noTaskInToDo');
    let noTaskInAwait = document.getElementById('noTaskInAwait');
    let noTaskInProgress = document.getElementById('noTaskInProgress');
    let noTaskInDone = document.getElementById('noTaskInDone');

    // Füge das noTaskDiv-Element als Unter-Container in die Ziel-Container ein
    noTaskInToDo.appendChild(noTaskDiv);
    noTaskInAwait.appendChild(noTaskDiv.cloneNode(true));
    noTaskInProgress.appendChild(noTaskDiv.cloneNode(true));
    noTaskInDone.appendChild(noTaskDiv.cloneNode(true));
}

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

function clearAllTasks() {
    allTasks = [];
    saveTasks();
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
        const subTasks = task.subtasks.text;
        // Extrahiere die Initialen aus dem Namen


        let subTasksHTML = '';

        if (task.subtasks && task.subtasksId && task.subtasks.length > 0) {
            subTasksHTML += '<ul class="edit-subTask">';
            const subtaskId = task.subtasksId;
            task.subtasks.forEach((subTask, index) => {
                const subtaskStatus = task.subtasksStatus ? task.subtasksStatus[index] : false; // Status des aktuellen Subtasks (falls vorhanden)

                // Füge jeden Subtask als Listenelement (li) hinzu, weise ihm die ID zu und prüfe den Status, wenn vorhanden
                subTasksHTML += `<li id="${subtaskId[index]}" class="subTaskAlignment"><div class="${subtaskStatus ? 'lineThrough' : ''}">${subTask}</div></li>`;
            });

            subTasksHTML += '</ul>';
        }




        let taskPopUpSingleAssignmentContainer = ''; // Deklariere die Variable außerhalb der if-Bedingung

        const colorValues = colorOfAssignedment.toString().split(',');

        // Entferne die Leerzeichen und schließende Klammern von den Werten
        const cleanedColors = colorValues.map(color => color.replace(/\s/g, '').replace(')', ''));

        if (assignedTo && assignedTo.length > 0) {


            task.assignedToValues.forEach((assignment, index) => {
                const nameParts = assignment.trim().split(' ');
                // Initialen auf Basis der Logik für Namen erstellen
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

function checkProgressBar(taskId) {
    const task = allTasks.find(task => task.id === taskId);
    if (!task) {
        console.error(`Task mit der ID "${taskId}" wurde nicht gefunden.`);
        return;
    }
    const progressBarId = task.progressBarId;
    const progressBar = document.getElementById(`progress-bar-${progressBarId}`);
    if (!progressBar) {
        console.error(`Progress-Bar mit der ID "${progressBarId}" wurde nicht gefunden.`);
        return;
    }
    const subtasks = task.subtasks;
    const subtasksStatus = task.subtasksStatus || [];
    const filledSubtasksCount = subtasksStatus.filter(status => status).length;
    const progressPercentage = (filledSubtasksCount / subtasks.length) * 100;
    progressBar.style.transition = 'width 0.5s ease';
    progressBar.style.height = '100%';
    progressBar.style.backgroundColor = '#29ABE2';
    progressBar.style.width = `${progressPercentage}%`;
}

