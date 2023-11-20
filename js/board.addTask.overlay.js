/**
 * Adds click event listeners to priority buttons in the add task overlay.
 * @function
 * @returns {void}
 */
function addTaskOverlayClickEventlisteners() {
    document.getElementById('addTask_overlay_urgent_btn').addEventListener('click', (event) => {
        event.preventDefault();
        handleBoardPrioButtonClick('urgent');
    });
    document.getElementById('addTask_overlay_medium_btn').addEventListener('click', (event) => {
        event.preventDefault();
        handleBoardPrioButtonClick('medium');
    });
    document.getElementById('addTask_overlay_low_btn').addEventListener('click', (event) => {
        event.preventDefault();
        handleBoardPrioButtonClick('low');
    });
}

/**
 * Resets the styling of a priority button.
 * @function
 * @param {string} prio - The priority value ('urgent', 'medium', or 'low').
 * @returns {void}
 */
function resetPriorityButton(prio) {
    const normalButtonId = `addTask_overlay_${prio}_btn`;
    const clickedButtonId = `addTask_overlay_clicked_${prio}_btn`;
    document.getElementById(normalButtonId).classList.remove('d-none');
    document.getElementById(clickedButtonId).classList.add('d-none');
}

/**
 * Handles the click event for a priority button in the add task overlay.
 * @function
 * @param {string} prio - The priority value ('urgent', 'medium', or 'low').
 * @returns {void}
 */
function handleBoardPrioButtonClick(prio) {
    priorityArray = [];
    if (selectedPrioButton === prio) {
        selectedPrioButton = null;
        resetPriorityButton(prio);
        const index = priorityArray.indexOf(prio);
        if (index !== -1)
            priorityArray.splice(index, 1);
    } else {
        if (selectedPrioButton)
            resetPriorityButton(selectedPrioButton);
        selectedPrioButton = prio;
        document.getElementById(`addTask_overlay_${prio}_btn`).classList.add('d-none');
        document.getElementById(`addTask_overlay_clicked_${prio}_btn`).classList.remove('d-none');
        priorityArray.push(prio);
    }
}
