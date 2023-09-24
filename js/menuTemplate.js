
function generateSideBar() {
    let menu = document.getElementById('content');
    menu.innerHTML = /*html*/ `<nav><img src="./assets/img/Capa 2.svg" class="logo"><div class="nav-flex-box"><div class="flex-box-mobile"><a href="./summary.html" class="nav-sub">
    <img src="./assets/img/Icons.svg">Summary</a><a href="./add_task.html" class="nav-sub"><img src="./assets/img/Icons (1).svg">Add Task</a><a href="./board.html" class="nav-sub">
    <img src="./assets/img/Icons (2).svg">Board</a><a href="./contacts.html" class="contact-background contacts-background"><img src="./assets/img/Icons (3).svg">Contacs</a></div><div class="nav-bottom">
    <a href="#" class="nav-bottom-a">Privacy Policy</a><a href="#" class="nav-bottom-a">Legal Notice</a></div></div></nav>`;
    generateHeader(menu);
    showContacts();
}

function generateHeader(menu) {
    menu.innerHTML += /*html*/ `<header><span class="header-text">Kanban Project Management Tool</span><div class="header-icons">
        <img src="./assets/img/help.svg" class="help-icon"><img src="./assets/img/Group 5.svg" class="group-icon"></header>`;
}