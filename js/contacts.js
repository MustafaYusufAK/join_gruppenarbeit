let contacts = [
    {
        "name": "Anja Schulz",
        "email": "schulz@hotmail.com",
        "phone": "+49 151 1234 5678",
        "color": getRandomColor()
    },
    {
        "name": "Benedikt Ziegler",
        "email": "benedikt@gmail.com",
        "phone": "+49 172 9876 5432",
        "color": getRandomColor()
    },
    {
        "name": "David Eisenberg",
        "email": "davidberg@gmail.com",
        "phone": "+49 160 5555 9999",
        "color": getRandomColor()
    },
    {
        "name": "Eva Fischer",
        "email": "eva@gmail.com",
        "phone": "+49 157 4444 3333",
        "color": getRandomColor()
    },
    {
        "name": "Marcel Bauer",
        "email": "bauer@gmail.com",
        "phone": "+49 176 8765 4321",
        "color": getRandomColor()
    },
    {
        "name": "Emmanuel Mauer",
        "email": "emmanuelmae@gmail.com",
        "phone": "+49 162 1111 2222",
        "color": getRandomColor()
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
    const { sortedFirstLetters, firstLettersMap } = generateFirstLetters();

    sortedFirstLetters.forEach(letter => {
        const contactIndices = firstLettersMap.get(letter);
        if (contactIndices) {
            contactIndices.forEach(index => {
                const contact = contacts[index];
                const id = `contact-icon-${index}`;
                const randomColor = contact.color;
                const initials = generateInitials(contact.name);

                // Hier generieren Sie eindeutige IDs für die Anfangsbuchstaben und die Trenndivs
                const letterId = `first-letter-${index}`;
                const divId = `div-separate-contacts-${index}`;

                contactContent.innerHTML += /*html*/ `<div class="first-letter" id="${letterId}">${letter}<div class="separate-contacts" id="${divId}"></div></div><div class="new-contact-box" onclick="openContact('${contact['name']}', '${contact['email']}', '${index}', '${randomColor}')">
                    <span class="small-contact-icon" id="${id}">${initials}</span>
                    <div>
                        <div class="name">${contact['name']}</div>
                        <div class="email">${contact['email']}</div>
                    </div>
                </div>`;

                const element = document.getElementById(id);
                element.style.backgroundColor = randomColor;
            });
        }
    });
}


function openContact(contactName, contactEmail, i, randomColor) {
    let showContact = document.getElementById('show-contact');
    const initials = generateInitials(contactName);
    showContact.innerHTML = '';
    showContact.innerHTML = /*html*/ `<div class="flex-box"><span class="big-contact-icon margin-left" id="big-contact-icon-${i}">${initials}</span>
    <div class="flex-box-contact"><div class="name-contact">${contactName}</div><div class="edit-box"><div class="edit-image" onclick="showOverlayEdit('${i}', '${randomColor}', '${initials}')">
    </div><div class="delete-image" onclick="deleteContact(${i})"></div>
    </div></div></div><p class="contact-info">Contact Information</p><b class="email-headline">Email</b><p class="email margin-left">${contactEmail}</p>
    <b class="margin-left">Phone</b><p class="margin-left">${contacts[i]['phone']}</p>`;
    document.getElementById('change-color-icon').innerHTML = /*html*/ `<div class="big-contact-icon" id="color-icon-change-${i}"></div>`
    const bigContactIcon = document.getElementById(`big-contact-icon-${i}`);
    bigContactIcon.style.backgroundColor = randomColor;
}

function addNewContact() {
    let name = document.getElementById('add-name').value;
    let email = document.getElementById('add-email').value;
    let phone = document.getElementById('add-phone').value;

    if (!name || !email || !phone || email.indexOf('@') === -1) return alert("All fields are required, and a valid email address is needed.");

    phone = '+49 ' + phone;

    const randomColor = getRandomColor();
    const newContact = { "name": name, "email": email, "phone": phone, "color": randomColor };
    contacts.push(newContact);

    // Sortieren Sie die Kontakte
    sortContacts();

    // Nach dem Hinzufügen eines neuen Kontakts die Anfangsbuchstaben neu generieren
    const { sortedFirstLetters } = generateFirstLetters(); // Änderung hier

    sortedFirstLetters.forEach((letter, index) => {
        const letterElement = document.getElementById(`first-letter-${index}`);
        if (letterElement) {
            letterElement.innerHTML = `${letter}<div class="separate-contacts"></div>`;
        }
    });
    generateSideBar();
    hideOverlay();
    emptyInput();
}



function emptyInput() {
    document.getElementById('add-name').value = '';
    document.getElementById('add-email').value = '';
    document.getElementById('add-phone').value = '';
}

function EditContact(i) {
    if (i < 0 || i >= contacts.length) return alert('Ungültiger Index');
    const editNameInput = document.getElementById('edit-name');
    const editEmailInput = document.getElementById('edit-email');
    const editPhoneInput = document.getElementById('edit-phone');

    if (!editEmailInput.value || editEmailInput.value.indexOf('@') === -1 || !editNameInput.value || !editPhoneInput.value) {
        alert('Bitte füllen Sie alle Felder korrekt aus.');
        return;
    }

    // Aktuelle Farbe des bearbeiteten Kontakts speichern
    const currentColor = contacts[i].color;

    // Kontakt aktualisieren und die Farbe beibehalten
    contacts[i] = { ...contacts[i], name: editNameInput.value, email: editEmailInput.value, phone: editPhoneInput.value, color: currentColor };

    generateSideBar();
    hideOverlayEdit();
    openContact(contacts[i].name, contacts[i].email, i, currentColor);
}




function showOverlay() {
    let overlay = document.getElementById('overlay-add-contact');
    overlay.classList.add('show-overlay');
}

function hideOverlay() {
    let overlay = document.getElementById('overlay-add-contact');
    overlay.classList.remove('show-overlay');
}

function showOverlayEdit(i, randomColor, initials) {
    const bigContactIcon = document.getElementById(`color-icon-change-${i}`);
    bigContactIcon.innerHTML = initials;
    bigContactIcon.style.backgroundColor = randomColor;
    let overlay = document.getElementById('overlay-edit-contact');
    overlay.classList.add('show-overlay');
    showContactValue(i);
    const saveButton = document.querySelector('.save-button');
    saveButton.onclick = () => EditContact(i);
}

function showContactValue(i) {
    const selectedContact = contacts[i];
    const editNameInput = document.getElementById('edit-name');
    const editEmailInput = document.getElementById('edit-email');
    const editPhoneInput = document.getElementById('edit-phone');

    editNameInput.value = selectedContact.name;
    editEmailInput.value = selectedContact.email;
    editPhoneInput.value = selectedContact.phone;
}


function hideOverlayEdit() {
    let overlay = document.getElementById('overlay-edit-contact');
    overlay.classList.remove('show-overlay');
}

function deleteContact(i) {
    contacts.splice(i, 1);
    generateSideBar();
    document.getElementById('show-contact').innerHTML = '';
    hideOverlayEdit();
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

function generateInitials(name) {
    const nameParts = name.split(' ');
    if (nameParts.length >= 1) {
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts[1] : '';
        let initials = '';

        if (firstName.length > 0) {
            initials += firstName[0];
        }

        if (lastName.length > 0) {
            initials += lastName[0];
        }

        // Falls keine Initials erstellt wurden, setze einen Standardbuchstaben (z.B. 'X')
        if (initials.length === 0) {
            initials = 'X';
        }

        return initials;
    }

    // Falls kein Name vorhanden ist, gib einen Standardbuchstaben (z.B. 'X') zurück
    return 'X';
}



function generateFirstLetters() {
    const firstLettersMap = new Map();

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        const nameParts = contact.name.split(' ');
        if (nameParts.length > 0) {
            const firstName = nameParts[0][0].toUpperCase(); // Konvertieren Sie den Buchstaben in Großbuchstaben
            if (!firstLettersMap.has(firstName)) {
                firstLettersMap.set(firstName, []);
            }
            firstLettersMap.get(firstName).push(i);
        }
    }

    const sortedFirstLetters = Array.from(firstLettersMap.keys()).sort();
    return { sortedFirstLetters, firstLettersMap };
}





