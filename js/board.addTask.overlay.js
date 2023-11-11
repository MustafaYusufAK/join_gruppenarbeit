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


function handleBoardPrioButtonClick(prio) {
<<<<<<< HEAD
    priorityArray = [];

=======
>>>>>>> 39d36ac64bdf993867c60fee9b0cca582612aa7d
    const normalButtonId = `addTask_overlay_${prio}_btn`;
    const clickedButtonId = `addTask_overlay_clicked_${prio}_btn`;

    if (selectedPrioButton === prio) {
        // Wenn der ausgewählte Prio-Button erneut geklickt wird, setzen Sie ihn zurück
        selectedPrioButton = null;
        document.getElementById(normalButtonId).classList.remove('d-none');
        document.getElementById(clickedButtonId).classList.add('d-none');

        // Entferne die Priorität aus dem priorityArray
        const index = priorityArray.indexOf(prio);
        if (index !== -1) {
            priorityArray.splice(index, 1);
        }

    } else {
        // Aktivieren Sie den ausgewählten Prio-Button und setzen Sie die anderen zurück
        if (selectedPrioButton) {
            const prevNormalButtonId = `addTask_overlay_${selectedPrioButton}_btn`;
            const prevClickedButtonId = `addTask_overlay_clicked_${selectedPrioButton}_btn`;
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