let taskAtBoard = 0;

function initSummary() {
    generateSideBar()
    generateUserName()
    fillSummary()
}

//------------------------------------------------------------------------------//
//---------------------------------on Mouse over--------------------------------//
//------------------------------------------------------------------------------//

function hoverOverSummaryTasks(id, section, imgSrc) {
    document.getElementById(`${id}`).classList.remove('summary-progress-none-hover');
    document.getElementById(`${id}_count`).classList.remove('color-000000');
    document.getElementById(`${id}_section`).classList.remove('color-2A3647');


    document.getElementById(`${id}`).classList.add('summary-progress-hover');
    document.getElementById(`${id}_count`).classList.add('color-FFFFFF');
    document.getElementById(`${id}_section`).classList.add('color-FFFFFF');


    if (section == 'to_do_and_done') {
        hoverOverToDoAndDone(id, imgSrc);
    };

    if (section == 'urgend-tasks') {
        hoverOverUrgendTask(id);
    };

    if (section == 'summary-task-board') {
        hoverOverTaskCounts(id);
    };
}


function hoverOverToDoAndDone(id, imgSrc) {
    document.getElementById(`${id}`).classList.remove('to-do-and-done-taskarea');
    document.getElementById(`${id}`).classList.add('to-do-and-done-taskarea-hover');
    document.getElementById(`${id}_img`).src = `../assets/img/summary_${imgSrc}_hover.svg`;
}


function hoverOverUrgendTask(id) {
    document.getElementById(`${id}_taskfield`).classList.remove('summary-urgend');
    document.getElementById(`${id}_date`).classList.remove('color-2A3647');
    document.getElementById(`${id}_deadline`).classList.remove('color-2A3647');

    document.getElementById(`${id}_taskfield`).classList.add('summary-urgend-hover');
    document.getElementById(`${id}_date`).classList.add('color-FFFFFF');
    document.getElementById(`${id}_deadline`).classList.add('color-FFFFFF');
}


function hoverOverTaskCounts(id) {
    document.getElementById(`${id}`).classList.remove('urgent-task-overview');
    document.getElementById(`${id}`).classList.add('urgent-task-overview-hover');
}

//------------------------------------------------------------------------------//
//---------------------------------on Mouse leave-------------------------------//
//------------------------------------------------------------------------------//

function hoverLeaveSummaryTasks(id, section, imgSrc) {
    document.getElementById(`${id}`).classList.remove('summary-progress-hover');
    document.getElementById(`${id}_count`).classList.remove('color-FFFFFF');
    document.getElementById(`${id}_section`).classList.remove('color-FFFFFF');

    document.getElementById(`${id}`).classList.add('summary-progress-none-hover');
    document.getElementById(`${id}_count`).classList.add('color-000000');
    document.getElementById(`${id}_section`).classList.add('color-2A3647');

    if (section == 'to_do_and_done') {
        hoverLeaveToDoAndDone(id, imgSrc);
    };

    if (section == 'urgend-tasks') {
        hoverLeaveUrgendTask(id);
    };

    if (section == 'summary-task-board') {
        hoverLeaveTaskCounts(id);
    };
}


//------------------------------------------------------------------------------//
//--------------------------------Leave To and Done-----------------------------//
//------------------------------------------------------------------------------//

function hoverLeaveToDoAndDone(id, imgSrc) {
    document.getElementById(`${id}`).classList.remove('to-do-and-done-taskarea-hover');
    document.getElementById(`${id}`).classList.add('to-do-and-done-taskarea');
    document.getElementById(`${id}_img`).src = `../assets/img/summary_${imgSrc}.svg`;
}


//------------------------------------------------------------------------------//
//--------------------------------Leave Urgend Tasks----------------------------//
//------------------------------------------------------------------------------//

function hoverLeaveUrgendTask(id) {
    document.getElementById(`${id}_taskfield`).classList.remove('summary-urgend-hover');
    document.getElementById(`${id}_date`).classList.remove('color-FFFFFF');
    document.getElementById(`${id}_deadline`).classList.remove('color-FFFFFF');

    document.getElementById(`${id}_taskfield`).classList.add('summary-urgend');
    document.getElementById(`${id}_date`).classList.add('color-2A3647');
    document.getElementById(`${id}_deadline`).classList.add('color-2A3647');
}

function hoverLeaveTaskCounts(id) {
    document.getElementById(`${id}`).classList.remove('urgent-task-overview-hover');
    document.getElementById(`${id}`).classList.add('urgent-task-overview');
}


//------------------------------------------------------------------------------//
//---------------------------------Summary Animation----------------------------//
//------------------------------------------------------------------------------//

function playSummaryGreetingAnimation() {
    setTimeout(function () {
        let greetingUser = document.getElementById('greeting_user');
        let greetingBackground = document.getElementById('greeting_background');

        greetingUser.style.animation = 'reduceGreeting 2s ease-in-out forwards'
        greetingBackground.style.animation = 'reduceGreetingBg 2s ease-in-out forwards'
    }, 500)

    /* setTimeout(function () {
         document.getElementById('greeting_user_background').classList.add('d-none')
     }, 500)*/


}


//------------------------------------------------------------------------------//
//------------------------generate Name for greeting----------------------------//
//------------------------------------------------------------------------------//

function generateUserName() {
    let userName = getUserName()
    let greeting = getGreeting();

    document.getElementById('user_name').innerHTML = `${userName}`;
    document.getElementById('user_greeting').innerHTML = `${greeting}`;
    playSummaryGreetingAnimation();
}


//------------------------------------------------------------------------------//
//-----------------------------generate Greeting--------------------------------//
//------------------------------------------------------------------------------//

function getGreeting() {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour >= 0 && currentHour < 12) {
        return "Good morning,";
    } else if (currentHour >= 12 && currentHour < 18) {
        return "Good afternoon,";
    } else {
        return "Good evening,";
    }
}


//------------------------------------------------------------------------------//
//---------------------------------open Board-----------------------------------//
//------------------------------------------------------------------------------//

function openTaskBoard() {
    let userName = getUserName();
    window.location.href = `board.html?msg=Welcomme to Join, ${userName}`;
}


//------------------------------------------------------------------------------//
//--------------------------------fill Summary----------------------------------//
//------------------------------------------------------------------------------//

async function fillSummary() {
    let userName = getUserName();
    console.log('userName:', userName);

    let users = JSON.parse(await getItem('users'));
    console.log('users:', users);

    let user = users.find(u => u.name == userName);
    console.log('user:', user);

    //ToDo//
    countTasks(user, 'task_category', 'ToDo', 'to_do_count');

    //Done//
    countTasks(user, 'task_category', 'Done', 'done_count');

    //urgend//
    countTasks(user, 'priority', 'urgend', 'urgend_count');

    //Task Progress//
    countTasks(user, 'task_category', 'TaskProgess', 'task_progress_count');

    //Task Await Feedback//
    countTasks(user, 'task_category', 'TaskFeedback', 'task_feedback_count');

    //Tasks at Board//
    countBoardTasks(user, 'task_board_count');
}


//------------------------------------------------------------------------------//
//---------------------------Count Tasks for Summary----------------------------//
//------------------------------------------------------------------------------//

function countTasks(user, taskcategory, status, containerID) {
    let taskCount = 0;
    for (let i = 0; i < user['tasks'].length; i++) {
        const task = user['tasks'][i];
        if (task[taskcategory] == status) {
            taskCount++;
        }
    }
    document.getElementById(containerID).innerHTML = countTask;
}


//------------------------------------------------------------------------------//
//-------------------------------Count all Tasks--------------------------------//
//------------------------------------------------------------------------------//

function countBoardTasks(user, containerID) {
    for (let i = 0; i < user['tasks'].length; i++) {
        taskAtBoard++
    }
    document.getElementById(containerID).innerHTML = taskAtBoard;
}