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

function initContacts() {
    generateSideBar();
    showContacts();
}

function showContacts() {
    const contactContent = document.getElementById('new-contacts');
    contactContent.innerHTML = '';
    const { sortedFirstLetters, firstLettersMap } = generateFirstLetters();

    sortedFirstLetters.forEach(letter => {
        const contactIndices = firstLettersMap.get(letter);
        if (contactIndices) {
            addFirstLetter(contactContent, letter);
            addSeparateContactsDiv(contactContent, contactIndices);
            addContacts(contactContent, contactIndices);
        }
    });
}

function addFirstLetter(contactContent, letter) {
    contactContent.innerHTML += `<div class="first-letter">${letter}</div>`;
}

function addSeparateContactsDiv(contactContent, contactIndices) {
    const divId = `div-separate-contacts-${contactIndices[0]}`;
    contactContent.innerHTML += `<div class="separate-contacts" id="${divId}"></div>`;
}

function addContacts(contactContent, contactIndices) {
    contactIndices.forEach(index => {
        const contact = contacts[index];
        const id = `contact-icon-${index}`;
        const randomColor = contact.color;
        const initials = generateInitials(contact.name);

        contactContent.innerHTML += contactContentTemplate(contact, index,  randomColor, initials, id);

        const element = document.getElementById(id);
        element.style.backgroundColor = randomColor;
    });
}

function contactContentTemplate(contact, index, randomColor, initials, id) {
    return /*html*/ `<div class="new-contact-box" onclick="openContact('${contact['name']}', '${contact['email']}', '${index}', '${randomColor}')">
        <span class="small-contact-icon" id="${id}">${initials}</span>
        <div>
            <div class="name">${contact['name']}</div>
            <div class="email">${contact['email']}</div>
        </div>
    </div>`;
}

function openContact(contactName, contactEmail, i, randomColor) {
    const selectedContact = document.querySelector(`#contact-icon-${i}`);
    if (selectedContact) {
        document.querySelectorAll('.new-contact-box').forEach(contact => contact.classList.remove('selected-contact'));
        selectedContact.parentElement.classList.add('selected-contact');
    }

    let showContact = document.getElementById('show-contact');
    const initials = generateInitials(contactName);
    showContact.innerHTML = '';
    showContact.innerHTML = showContactTemplate(contactName, contactEmail, i, randomColor, initials);
    document.getElementById('change-color-icon').innerHTML = /*html*/ `<div class="big-contact-icon" id="color-icon-change-${i}"></div>`
    const bigContactIcon = document.getElementById(`big-contact-icon-${i}`);
    bigContactIcon.style.backgroundColor = randomColor;
}

function showContactTemplate(contactName, contactEmail, i, randomColor, initials) {
    return /*html*/ `<div class="flex-box"><span class="big-contact-icon margin-left" id="big-contact-icon-${i}">${initials}</span>
    <div class="flex-box-contact"><div class="name-contact">${contactName}</div><div class="edit-box"><div class="edit-image" onclick="showOverlayEdit('${i}', '${randomColor}', '${initials}')">
    </div><div class="delete-image" onclick="deleteContact(${i})"></div>
    </div></div></div><p class="contact-info">Contact Information</p><b class="email-headline">Email</b><p class="email margin-left">${contactEmail}</p>
    <b class="margin-left">Phone</b><p class="margin-left">${contacts[i]['phone']}</p>`;
}

function addNewContact() {
    const nameInput = document.getElementById('add-name');
    const emailInput = document.getElementById('add-email');
    let phoneInput = document.getElementById('add-phone');
    
    const name = nameInput.value;
    const email = emailInput.value;
    let phone = phoneInput.value;

    if (!validateName(name) || !validateEmail(email) || !validatePhone(phone)) {
        return;
    }
    
    const randomColor = getRandomColor();
    const newContact = createContact(name, email, phone, randomColor);
    addContactAndUpdateUI(newContact);
}

function validateName(name) {
    if (!/^[A-Za-z\s\-ÄÜÖäüö]+$/.test(name)) {
        alert("Name should contain only letters, spaces, hyphens, and umlauts.");
        return false;
    }
    return true;
}

function validateEmail(email) {
    if (!email || email.indexOf('@') === -1) {
        alert("A valid email address is needed.");
        return false;
    }
    return true;
}

function validatePhone(phone) {
    if (!/^\+?\d+(\s\d+)*$/.test(phone)) {
        alert("Phone number should contain digits with optional spaces and can start with '+'.");
        return false;
    }
    return true;
}

function createContact(name, email, phone, color) {
    return { "name": name, "email": email, "phone": phone, "color": color };
}

function addContactAndUpdateUI(contact) {
    contacts.push(contact);
    sortContacts();
    generateFirstLettersAndUpdateSidebar();
    hideOverlay();
    emptyInput();
}

function generateFirstLettersAndUpdateSidebar() {
    generateFirstLetters().sortedFirstLetters.forEach((letter, index) => {
        const letterElement = document.getElementById(`first-letter-${index}`);
        if (letterElement) {
            letterElement.innerHTML = `${letter}<div class="separate-contacts"></div>`;
        }
    });

    generateSideBar();
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
    const editName = editNameInput.value;
    const editEmail = editEmailInput.value;
    const editPhone = editPhoneInput.value;

    // Überprüfe, ob der Name, die E-Mail und die Telefonnummer gültig sind
    if (!validateName(editName) || !validateEmail(editEmail) || !validatePhone(editPhone)) {
        return;
    }

    const currentColor = contacts[i].color;
    contacts[i] = createContact(editName, editEmail, editPhone, currentColor);
    generateSideBar();
    hideOverlayEdit();
    openContact(contacts[i].name, contacts[i].email, i, currentColor);
}

function validatePhone(phone) {
    // Überprüfe, ob die Telefonnummer ungültige Zeichen (Buchstaben) enthält oder nicht mit '+' beginnt
    if (!/^\+?\d+(\s\d+)*$/.test(phone)) {
        alert("Phone number should start with '+' and contain only digits with optional spaces.");
        return false;
    }
    return true;
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

    const deleteButton = document.querySelector('.delete-button'); // Füge diese Zeile hinzu
    deleteButton.onclick = () => deleteContact(i); // Füge diese Zeile hinzu
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

    do {
        color = '#'; 
        for (let i = 0; i < 6; i++) {
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
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts[1] : ''; // Hier prüfen, ob es einen Nachnamen gibt
    let initials = (firstName[0] || '') + (lastName[0] || ''); // Entferne das 'X' für den Nachnamen

    // Falls keine Initials erstellt wurden, setze einen Standardbuchstaben (z.B. 'X')
    if (initials.length === 0) {
        initials = 'X';
    }

    return initials;
}


function generateFirstLetters() {
    const firstLettersMap = new Map();

    contacts.forEach((contact, i) => {
        const [firstName] = contact.name.split(' ').map(part => part[0].toUpperCase());
        firstLettersMap.set(firstName, [...(firstLettersMap.get(firstName) || []), i]);
    });

    const sortedFirstLetters = [...firstLettersMap.keys()].sort();
    return { sortedFirstLetters, firstLettersMap };
}


function highlightContact(index) {
    // Entferne die Hervorhebung von allen Kontakten
    const allContacts = document.querySelectorAll('.new-contact-box');
    allContacts.forEach(contact => {
        contact.classList.remove('selected-contact');
    });

    // Füge die Hervorhebung zum ausgewählten Kontakt hinzu
    const selectedContact = document.querySelector(`#contact-icon-${index}`);
    if (selectedContact) {
        selectedContact.parentElement.classList.add('selected-contact');
    }
}



