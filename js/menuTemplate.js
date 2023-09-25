
function generateSideBar() {
    let userName = getUserName();
    let menu = document.getElementById('content');
    menu.innerHTML = /*html*/ `
    <nav>
        <img src="../assets/img/Capa 2.svg" class="logo">
        <div class="nav-flex-box">
            <div class="flex-box-mobile">
                <a href="./summary.html?msg=Welcomme to Join, ${userName}" class="nav-sub summary-background"><img src="../assets/img/Icons.svg">Summary</a>
                <a href="./add_task.html?msg=Welcomme to Join, ${userName}" class="nav-sub add-task-background"><img src="../assets/img/Icons (1).svg">Add Task</a>
                <a href="./board.html?msg=Welcomme to Join, ${userName}" class="nav-sub"><img src="../assets/img/Icons (2).svg">Board</a>
                <a href="./contacts.html?msg=Welcomme to Join, ${userName}" class="nav-sub contacts-background"><img src="../assets/img/Icons (3).svg">Contacs</a>
            </div>
            <div class="nav-bottom">
                <a href="#" class="nav-bottom-a">Privacy Policy</a>
                <a href="#" class="nav-bottom-a">Legal Notice</a>
            </div>
        </div>
    </nav>`;
    generateHeader(menu, userName);
}

function generateHeader(menu, userName) {

    let userInitial = getInitials(userName)

    menu.innerHTML += /*html*/ `
        <header>
            <span class="header-text">Kanban Project Management Tool</span>
            <div class="header-icons">
                <img src="../assets/img/help.svg" class="help-icon">
                <div class="group-icon">
                    <span>${userInitial}</span>
                </div>
            </div>
        </header>`;
}

function getInitials(userName) {
    let [firstName, lastName] = userName.split(' ');

    let firstInitial = firstName[0];
    if (lastName) {
        let lastInitial = lastName[0];
        return `${firstInitial}${lastInitial}`;
    } else {
        return `${firstInitial}`;
    }

}
