let inWhichContainer = [];
let task_category = {};
let tasksToDo = [];
let tasksInProgress = [];
let tasksAwaitFeedback = [];
let tasksDone = [];

async function initForBoard() {
    await loadTasks();
    await loadContacts();
    generateSideBar();
    showTasks();
    restoreTasksFromLocalStorage();
    sortTaskIntoArrays(allTasks, tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone);
    addTaskOverlayClickEventlisteners();
    createContactDropdown();
    getRandomColor();
    assignOptionIDs();
    setMinDateForBoard();
    checkAndHandleEmptyArrays();
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

function checkAndHandleEmptyArrays() {
    const arrays = [tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone];

    arrays.forEach((array, index) => {
        let container = array[index];
        let emptyDiv;

        if (!container) {
            emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-message';
            emptyDiv.textContent = 'Dieser Abschnitt ist leer.';
            array.push(emptyDiv);
        } else {
            if (emptyDiv) {
                // Beachte: Hier entferne ich nicht nur das leere Div, sondern das gesamte Array-Element
                tasksToDo.splice(index, 1);
            }
        }
    });
}

