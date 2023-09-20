let contacts = [
    {
        "name": "Anja Schulz",
        "email": "schulz@hotmail.com",
        "phone": "+49 151 1234 5678"
    },
    {
        "name": "Benedikt Ziegler",
        "email": "benedikt@gmail.com",
        "phone": "+49 172 9876 5432"
    },
    {
        "name": "David Eisenberg",
        "email": "davidberg@gmail.com",
        "phone": "+49 160 5555 9999"
    },
    {
        "name": "Eva Fischer",
        "email": "eva@gmail.com",
        "phone": "+49 157 4444 3333"
    },
    {
        "name": "Marcel Bauer",
        "email": "bauer@gmail.com",
        "phone": "+49 176 8765 4321"
    },
    {
        "name": "Emmanuel Mauer",
        "email": "emmanuelmae@gmail.com",
        "phone": "+49 162 1111 2222"
    }
];

function generateSideBar() {
    let menu = document.getElementById('content');
    menu.innerHTML = /*html*/ `<nav><img src="./assets/img/Capa 2.svg" class="logo"><div class="nav-flex-box"><div><a href="./summary.html" class="nav-sub">
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

function showContacts() {
    let contactContent = document.getElementById('new-contacts');
    contactContent.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        const id = `contact-icon-${i}`;
        const randomColor = getRandomColor();
        contactContent.innerHTML += /*html*/ `<div class="seperate-contacts"></div><div class="new-contact-box" onclick="openContact('${contact['name']}', '${contact['email']}', '${i}', '${randomColor}')">
        <span class="small-contact-icon" id="${id}">AS</span><div><div class="name">${contact['name']}</div>
        <div class="email">${contact['email']}</div></div></div>`;
        const element = document.getElementById(id);
        element.style.backgroundColor = randomColor;
    }
}

function openContact(contactName, contactEmail, i, randomColor) {
    let showContact = document.getElementById('show-contact');
    showContact.innerHTML = '';
    showContact.innerHTML = /*html*/ `<div class="flex-box"><span class="big-contact-icon margin-left" id="big-contact-icon-${i}">AS</span>
    <div class="flex-box-contact"><div class="name-contact">${contactName}</div><div class="edit-box"><div class="cursor" onclick="showOverlayEdit('${i}', '${randomColor}')">
    <img src="./assets/img/edit.svg" class="margin-right">Edit</div><div class="cursor" onclick="deleteContact(${i})"><img src="./assets/img/delete.svg"> Delete</div>
    </div></div></div><p class="contact-info">Contact Information</p><b class="email-headline">Email</b><p class="email margin-left">${contactEmail}</p>
    <b class="margin-left">Phone</b><p class="margin-left">${contacts[i]['phone']}</p>`;
    document.getElementById('change-color-icon') .innerHTML = /*html*/ `<div class="big-contact-icon" id="color-icon-change-${i}"></div>`
    const bigContactIcon = document.getElementById(`big-contact-icon-${i}`);
    bigContactIcon.style.backgroundColor = randomColor;
}

function addNewContact() {
    let name = document.getElementById('add-name').value;
    let email = document.getElementById('add-email').value;
    let phone = document.getElementById('add-phone').value;

    if (!name || !email || !phone || email.indexOf('@') === -1) return alert("All fields are required, and a valid email address is needed.");

    phone = '+49 ' + phone;

    contacts.push({ "name": name, "email": email, "phone": phone });
    sortContacts();
    generateSideBar();
    hideOverlay();
}

function showOverlay() {
    let overlay = document.getElementById('overlay-add-contact');
    overlay.classList.add('show-overlay');
}

function hideOverlay() {
    let overlay = document.getElementById('overlay-add-contact');
    overlay.classList.remove('show-overlay');
}

function showOverlayEdit(i, randomColor) {
    const bigContactIcon = document.getElementById(`color-icon-change-${i}`);
    bigContactIcon.style.backgroundColor = randomColor;
    let overlay = document.getElementById('overlay-edit-contact');
    overlay.classList.add('show-overlay');

}

function hideOverlayEdit() {
    let overlay = document.getElementById('overlay-edit-contact');
    overlay.classList.remove('show-overlay');
}

function deleteContact(i) {
    contacts.splice(i, 1);
    generateSideBar();
    document.getElementById('show-contact').innerHTML = '';
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';

    // Schleife, bis eine ausreichend dunkle Farbe generiert wird
    do {
        color = '#'; // Zurücksetzen der Farbe auf den Anfangswert
        for (let i = 0; i < 6; i++) {
            // Generiere einen zufälligen Buchstaben aus '0123456789ABCDEF'
            const randomLetter = letters[Math.floor(Math.random() * 16)];
            color += randomLetter;
        }
    } while (isTooLight(color)); // Überprüfe, ob die Farbe zu hell ist

    return color;
}

function isTooLight(color) {
    // Berechne die Helligkeit der Farbe (YIQ-Berechnung)
    const hex = color.substring(1); // Entferne das führende #
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    // Eine Farbe ist zu hell, wenn ihre Helligkeit über einem bestimmten Schwellenwert liegt
    return yiq > 128;
}

function sortContacts() {
    contacts.sort((a, b) => {
        const firstNameA = a.name.split(' ')[0];
        const firstNameB = b.name.split(' ')[0];
        return firstNameA.localeCompare(firstNameB);
    });
}



