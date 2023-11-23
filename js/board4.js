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

function showNoTaskMessage(container, tasksArray, text) {
    const noTaskContainer = document.createElement('div');
    noTaskContainer.textContent = text;
    const tasksExist = tasksArray.some(existingTask => container.id === `task-${existingTask.id}`);
    if (!tasksExist) {
        container.appendChild(noTaskContainer);
    } else {
        const existingNoTaskContainer = container.querySelector('.no-task-message');
        if (existingNoTaskContainer) {
            container.removeChild(existingNoTaskContainer);
        }
    }
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

function hideOverlay() {
    const overlaySection = document.getElementById('overlaySection');
    overlaySection.classList.add('d-none');
}

function checkProgressBar(taskId, progressBarId) {
    const task = allTasks.find(task => task.id === taskId);
    if (!task) {
        console.error(`Task mit der ID "${taskId}" wurde nicht gefunden.`);
        return;
    }

    const progressBar = document.getElementById(`progress-bar-${progressBarId}`);
    if (!progressBar) {
        console.error(`Progress-Bar mit der ID "${progressBarId}" wurde nicht gefunden.`);
        return;
    }
    const subtasks = task.subtasks;//Done
    const subtasksStatus = task.subtasksStatus || [];
    const filledSubtasksCount = subtasksStatus.filter(status => status).length;
    const progressPercentage = (filledSubtasksCount / subtasks.length) * 100;
    progressBar.style.transition = 'width 0.5s ease';
    progressBar.style.height = '100%';
    progressBar.style.backgroundColor = '#29ABE2';
    progressBar.style.width = `${progressPercentage}%`;
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
    return color;
}