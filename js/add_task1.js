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

function createContactDropdown() {
    let dropdown = document.getElementById('which_assigned_contact');

    // Entferne vorhandene Optionen
    dropdown.innerHTML = '';

    // Füge eine Standardoption hinzu
    let defaultOption = document.createElement('option');
    defaultOption.value = 'Select contacts to assign';
    defaultOption.textContent = 'Select contacts to assign';
    dropdown.appendChild(defaultOption);

    // Hinzufügen eines Event-Listeners, um die Option auszublenden
    dropdown.addEventListener('change', (event) => {
        const selectedOption = event.target.options[event.target.selectedIndex];

        // Überprüfe, ob die ausgewählte Option nicht die Standardoption ist
        if (selectedOption.value !== 'Select contacts to assign') {
            selectedOption.classList.add('d-none');  // Füge die Klasse hinzu

            // Rufe die Funktion createAssigneeBall auf und übergebe den Value
            createAssigneeBall(selectedOption.textContent, selectedOption.value);
        }
    });

    // Füge Optionen für jeden Kontakt hinzu
    contacts.forEach(contact => {
        let option = document.createElement('option');
        option.value = contact.name;
        option.textContent = contact.name;
        dropdown.appendChild(option);
    });
}



function createAssigneeBall(contactName, contactValue) {
    let assignedToList = document.getElementById('assignedToList');
    let assigneeContainer = document.createElement('div');
    assigneeContainer.classList.add('assigneeContainer');

    // Teile den Namen in Vorname und Nachname
    let [firstName, lastName] = contactName.split(' ');

    // Füge die Anfangsbuchstaben hinzu
    assigneeContainer.innerHTML = `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`;

    // Füge den Value als Attribut hinzu
    assigneeContainer.setAttribute('data-contact-value', contactValue);

    // Rufe die getRandomColor-Funktion auf, um die Hintergrundfarbe zu erhalten
    let backgroundColor = getRandomColor();
    assigneeContainer.style.backgroundColor = backgroundColor; // Setze die Hintergrundfarbe

    // Event-Listener, um den Ball zu entfernen und die zugehörige Option freizugeben
    assigneeContainer.addEventListener('click', () => {
        assigneeContainer.remove();

        // Finde die Option im Dropdown anhand des Kontakt-Werts
        let option = Array.from(document.getElementById('which_assigned_contact').options)
            .find(opt => opt.value === contactValue);

        // Wenn die Option gefunden wurde, entferne die Klasse 'd-none'
        if (option) {
            option.classList.remove('d-none');
        }
    });

    // Event-Listener für hover
    assigneeContainer.addEventListener('mouseover', (event) => {
        // Zeige den Kontaktwert als Tooltip an
        const contactValue = event.target.getAttribute('data-contact-value');
        event.target.setAttribute('title', `${contactValue}`);
    });

    // Event-Listener um Tooltip auszublenden
    assigneeContainer.addEventListener('mouseout', (event) => {
        // Entferne den Tooltip, wenn der Hover beendet ist
        event.target.removeAttribute('title');
    });

    assignedToList.appendChild(assigneeContainer);
}






function priorityPush() {
    const priorityButtons = document.querySelectorAll('.prio_btn_characteristics');
    for (const button of priorityButtons) {
        if (!button.classList.contains('d-none')) {
            let priority = button.value;



            // Füge den letzten gefundenen Wert hinzu, wenn vorhanden
            if (priority) {
                priorityArray.push(priority);
            }
        }
    }
}


function showFinalNotification() {
    if (window.innerWidth <= 1200) {
        return; // Ignoriere die Anzeige der Benachrichtigung bei Bildschirmbreiten unter oder gleich 1200px
    }

    const notificationBackground = document.getElementById('show_final_notification_background');
    const notification = document.getElementById('show_final_notification');
    notificationBackground.style.display = 'flex';
    notification.style.display = 'flex';
    setTimeout(() => {
        notificationBackground.style.opacity = '1';
        notification.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        HideShowFinalNotification();
    }, 3000);  // Benachrichtigung verschwindet nach 2 Sekunden
}


function HideShowFinalNotification() {
    const notificationBackground = document.getElementById('show_final_notification_background');
    const notification = document.getElementById('show_final_notification');
    notificationBackground.style.opacity = '0';
    notification.style.opacity = '0';
    setTimeout(() => {
        notificationBackground.style.display = 'none';
        notification.style.display = 'none';
    }, 500);  // Fade-Effekt-Dauer: 0,5 Sekunden
}

function mustHaveNotification() {
    if (window.innerWidth <= 1200) {
        return; // Ignoriere die Anzeige der Benachrichtigung bei Bildschirmbreiten unter oder gleich 1200px
    }

    const notification = document.getElementById('must_have_notification');
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        mustHaveHideNotification();
    }, 3000);  // Benachrichtigung verschwindet nach 2 Sekunden
}

function mustHaveHideNotification() {
    const notification = document.getElementById('must_have_notification');
    notification.style.opacity = '0';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 500);  // Fade-Effekt-Dauer: 0,5 Sekunden
}

function showDateNotification() {
    if (window.innerWidth <= 1200) {
        return; // Ignoriere die Anzeige der Benachrichtigung bei Bildschirmbreiten unter oder gleich 1200px
    }

    const notification = document.getElementById('date_notification');
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        dateHideNotification();
    }, 3000);  // Benachrichtigung verschwindet nach 2 Sekunden
}

function dateHideNotification() {
    const notification = document.getElementById('date_notification');
    notification.style.opacity = '0';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 500);  // Fade-Effekt-Dauer: 0,5 Sekunden
}

function showDescriptionNotification() {
    if (window.innerWidth <= 1200) {
        return; // Ignoriere die Anzeige der Benachrichtigung bei Bildschirmbreiten unter oder gleich 1200px
    }

    const notification = document.getElementById('description_notification');
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        descriptionHideNotification();
    }, 3000);  // Benachrichtigung verschwindet nach 2 Sekunden
}

function descriptionHideNotification() {
    const notification = document.getElementById('description_notification');
    notification.style.opacity = '0';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 500);  // Fade-Effekt-Dauer: 0,5 Sekunden
}

function showTitleNotification() {
    if (window.innerWidth <= 1200) {
        return; // Ignoriere die Anzeige der Benachrichtigung bei Bildschirmbreiten unter oder gleich 1200px
    }

    const notification = document.getElementById('title_notification');
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        titleHideNotification();
    }, 3000);  // Benachrichtigung verschwindet nach 2 Sekunden
}

function titleHideNotification() {
    const notification = document.getElementById('title_notification');
    notification.style.opacity = '0';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 500);  // Fade-Effekt-Dauer: 0,5 Sekunden
}

function showPrioNotification() {
    if (window.innerWidth <= 1200) {
        return; // Ignoriere die Anzeige der Benachrichtigung bei Bildschirmbreiten unter oder gleich 1200px
    }

    const notification = document.getElementById('prio_notification');
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        prioHideNotification();
    }, 3000);  // Benachrichtigung verschwindet nach 2 Sekunden
}

function prioHideNotification() {
    const notification = document.getElementById('prio_notification');
    notification.style.opacity = '0';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 500);  // Fade-Effekt-Dauer: 0,5 Sekunden
}


function showContactsNotification() {
    if (window.innerWidth <= 1200) {
        return; // Ignoriere die Anzeige der Benachrichtigung bei Bildschirmbreiten unter oder gleich 1200px
    }

    const notification = document.getElementById('contacts_notification');
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        contactsHideNotification();
    }, 3000);  // Benachrichtigung verschwindet nach 2 Sekunden
}

function contactsHideNotification() {
    const notification = document.getElementById('contacts_notification');
    notification.style.opacity = '0';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 500);  // Fade-Effekt-Dauer: 0,5 Sekunden
}



function checkCreatedAt() {
    const mustHaveArrays = [
        createdAtArray,
    ];

    for (const array of mustHaveArrays) {
        if (array.length === 0) {
            showNotification();
            return false;
        }
    }

    return true;
}



function checkMustHaveEntriesText() {
    const mustHaveArrays = [
        titlesArray,
        descriptionsArray,
    ];

    for (const array of mustHaveArrays) {
        if (!containsLetter(array)) {
            showSecondNotification();
            return false;
        }
    }

    return true;
}

function containsLetter(array) {
    for (const item of array) {
        if (/[a-zA-Z]/.test(item)) {
            return true;
        }
    }
    return false;
}


function redirectToBoard() {
    const link = "./board.html?msg=Welcome%20to%20Join,%20Guest";
    window.location.href = link;

}




function checkMustHaveEntries() {
    console.log('Checking must have entries...');
    const mustHaveArrays = [
        priorityArray,
        categoryArray,
        categoryColorArray,
        assignedToValuesArray,
        assignedToColorsArray,
        assignedShortValues,
    ];

    for (const array of mustHaveArrays) {
        if (array.length === 0) {
            showNotification();
            return false;
        }
    }

    return true;
}