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
    let userName = getUserName();
    const link = `./board.html?msg=Welcomme to Join, ${userName}`;
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