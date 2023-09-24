function generateSideBar() {
    let menu = document.getElementById('content');
    let userName = getUserName();
    menu.innerHTML = /*html*/ `
    <nav>
        <img src="./assets/img/Capa 2.svg" class="logo">
        <a href="./summary.html?msg=Welcomme to Join, ${userName}" class="nav-sub summary-hoverd"><img src="./assets/img/Icons.svg">Summary</a>
        <a href="./add_task.html?msg=Welcomme to Join, ${userName}" class="nav-sub"><img src="./assets/img/Icons (1).svg">Add Task</a>
        <a href="./board.html?msg=Welcomme to Join, ${userName}" class="nav-sub"><img src="./assets/img/Icons (2).svg">Board</a>
        <a href="./contacts.html?msg=Welcomme to Join, ${userName}" class="nav-sub"><img src="./assets/img/Icons (3).svg">Contacs</a>
        <div class="nav-bottom">
            <a href="#" class="nav-bottom-a">Privacy Policy</a>
            <a href="#" class="nav-bottom-a">Legal Notice</a>
            <a href="#" class="nav-bottom-a">Log out</a>
        </div>
    </nav>`;

    generateHeader(menu)
}

function generateHeader(menu) {
    menu.innerHTML += /*html*/ `<header><span class="header-text">Kanban Project Management Tool</span><div class="header-icons">
        <img src="./assets/img/help.svg" class="help-icon"><img src="./assets/img/Group 5.svg" class="group-icon"></header>`;
}
