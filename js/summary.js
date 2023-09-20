function hoverOverSummaryTasks(id, imgSrc) {
    document.getElementById(`${id}`).classList.remove('summary-progress-none-hover');
    document.getElementById(`${id}_count`).classList.remove('color-000000');
    document.getElementById(`${id}_section`).classList.remove('color-2A3647');

    document.getElementById(`${id}`).classList.add('summary-progress-hover');
    document.getElementById(`${id}_count`).classList.add('color-FFFFFF');
    document.getElementById(`${id}_section`).classList.add('color-FFFFFF');


    document.getElementById(`${id}_img`).src = `./assets/img/summary_${imgSrc}_hover.svg`;
}

function hoverLeaveSummaryTasks(id, imgSrc) {
    document.getElementById(`${id}`).classList.remove('summary-progress-hover');
    document.getElementById(`${id}_count`).classList.remove('color-FFFFFF');
    document.getElementById(`${id}_section`).classList.remove('color-FFFFFF');

    document.getElementById(`${id}`).classList.add('summary-progress-none-hover');
    document.getElementById(`${id}_count`).classList.add('color-000000');
    document.getElementById(`${id}_section`).classList.add('color-2A3647');

    


    document.getElementById(`${id}_img`).src = `./assets/img/summary_${imgSrc}.svg`;

}