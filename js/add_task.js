let allTasks = [];

function addTask() {
    let description = document.getElementById('description').value;
    let category = document.getElementById('category').value;

    let task = {
        'description': description,
        'category': category,
        'createdAt': new Date().getTime()
    };

    allTasks.push(task);

    let allTasksAsString = JSON.stringify(allTasks);
    localStorage.setItem('allTasks', allTasksAsString);
}

function loadAllTasks() {
    let allTasksAsString = localStorage.getItem('allTasks');

    if (allTasksAsString) {
        allTasks = JSON.parse(allTasksAsString);
        console.log('Loaded all Tasks', allTasks);
    } else {
        console.log('No tasks found in localStorage.');
    }
}
