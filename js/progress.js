// Für Board 
function showTasks() {
    const id = generateUniqueID();
    const taskContainer = document.getElementById('target-to-do-table');
    const feedbackTaskContainer = document.getElementById('target-await-feedback-table');
    const inProgressContainer = document.getElementById('target-in-progress-table');
    const targetDoneTable = document.getElementById('target-done-table');

    taskContainer.innerHTML = '';
    feedbackTaskContainer.innerHTML = '';
    inProgressContainer.innerHTML = '';
    targetDoneTable.innerHTML = '';
    createSpecificNoTaskDivs();
    createNoTaskDiv();

    allTasks.forEach(task => {
        const progressBarId = generateUniqueID();
        const taskDiv = createTaskDiv(task);
        const targetContainer = determineTargetContainer(task);

        targetContainer.appendChild(taskDiv);
        checkProgressBar(task.id);
    });

    const dropContainers = document.querySelectorAll('.drop-container');
    dropContainers.forEach(container => {
        container.addEventListener('drop', onDrop);
        container.addEventListener('dragover', allowDrop);
    });

    restoreAndSortTasks();
}

function determineTargetContainer(task) {
    let targetContainer = document.getElementById('target-to-do-table');

    const targetContainersMap = {
        'for-To-Do-Container': 'target-to-do-table',
        'in-Progress-Container': 'target-in-progress-table',
        'for-Await-Feedback-Container': 'target-await-feedback-table'
    };

    for (const containerKey in targetContainersMap) {
        if (task.inWhichContainer && task.inWhichContainer.includes(containerKey)) {
            targetContainer = document.getElementById(targetContainersMap[containerKey]);
            break;
        } else {
            const categorybackgroundColor = task.categoryColors[0];
            if (categorybackgroundColor === 'blueviolet') {
                targetContainer = document.getElementById('target-in-progress-table');
            }
            if (categorybackgroundColor === 'darkmagenta') {
                targetContainer = document.getElementById('target-await-feedback-table');
            }
        }
    }

    return targetContainer;
}


function createNoTaskDivs() {
    const taskContainers = [
        document.getElementById('target-to-do-table'),
        document.getElementById('target-await-feedback-table'),
        document.getElementById('target-in-progress-table'),
        document.getElementById('target-done-table')
    ];

    taskContainers.forEach(container => {
        if (container && container.innerHTML === '') {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = 'Keine Aufgaben vorhanden';
            messageDiv.classList.add('empty-message'); // Füge eine Klasse hinzu, um das Styling zu steuern
            container.appendChild(messageDiv);
        }
    });
}


function createTaskDiv(task) {
    const progressBarId = generateUniqueID();
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-item');
    taskDiv.setAttribute('id', `task-${task.id}`);
    taskDiv.setAttribute('draggable', true);
    taskDiv.addEventListener('dragstart', onDragStart);
    task.progressBarId = progressBarId;

    let targetContainer = document.getElementById('target-to-do-table');
    const inWhichContainer = task.inWhichContainer;

    if (inWhichContainer && inWhichContainer.includes('for-To-Do-Container')) {
        targetContainer = document.getElementById('target-to-do-table');
    } else if (inWhichContainer && inWhichContainer.includes('in-Progress-Container')) {
        targetContainer = document.getElementById('target-in-progress-table');
    } else if (inWhichContainer && inWhichContainer.includes('for-Await-Feedback-Container')) {
        targetContainer = document.getElementById('target-await-feedback-table');
    } else {
        const categorybackgroundColor = task.categoryColors[0];

        if (categorybackgroundColor === 'blueviolet') {
            targetContainer = document.getElementById('target-in-progress-table');
        }

        if (categorybackgroundColor === 'darkmagenta') {
            targetContainer = document.getElementById('target-await-feedback-table');
        }
    }

    let priorityImageSrc = '';
    if (task.priority.includes('low')) {
        priorityImageSrc = '../assets/img/Prio baja.svg';
    } else if (task.priority.includes('medium')) {
        priorityImageSrc = '../assets/img/Prio media.svg';
    } else if (task.priority.includes('urgent')) {
        priorityImageSrc = '../assets/img/Prio alta.svg';
    }

    let assignePinnedTaskBall = '';

    if (task.assignedToValues && task.assignedToValues.length > 0) {
        const maxAssignmentsToShow = 3;
        const assignmentsToDisplay = task.assignedToValues.slice(0, maxAssignmentsToShow);
        let additionalAssignmentsCount = task.assignedToValues.length - maxAssignmentsToShow;

        assignmentsToDisplay.forEach((assignment, index) => {
            const nameParts = assignment.trim().split(' ');
            let initials = '';

            if (nameParts.length >= 2) {
                initials = nameParts[0][0] + nameParts[1][0];
            } else if (nameParts.length === 1) {
                initials = nameParts[0][0];
            }
            const color = task.assignedToColors[index];

            const assignmentHTML = `
                <div class="assigne-ball" style="background-color: ${color}">
                    <div>${initials}</div>
                </div>
            `;

            assignePinnedTaskBall += assignmentHTML;
        });

        if (additionalAssignmentsCount > 0) {
            assignePinnedTaskBall += `
                <div class="assigne-ball" style="background-color: rgb(0, 0, 0)">
                    +${additionalAssignmentsCount}
                </div>
            `;
        }
    }

    taskDiv.innerHTML = `
        <div class="pinned-task-container" onclick="showTasksInOverViev('${task.id}')">
            <div class="category-background-color" style="background-color: ${task.categoryColors[0]}">
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

    targetContainer.appendChild(taskDiv);
    checkProgressBar(task.id);
}

function setDragAndDropFunctionality() {
    const dropContainers = document.querySelectorAll('.drop-container');

    dropContainers.forEach(container => {
        container.addEventListener('drop', onDrop);
        container.addEventListener('dragover', allowDrop);
    });
}


function restoreAndSortTasks() {
    restoreTasksFromLocalStorage();
    sortTaskIntoArrays(allTasks, tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone);
}


