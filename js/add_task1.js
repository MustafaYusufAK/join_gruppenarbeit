function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    do {
        color = '#';
        for (let i = 0; i < 6; i++) {
            const randomLetter = letters[Math.floor(Math.random() * 16)];
            color += randomLetter;
        }
    } while (isTooLight(color));
    return color;
}

function isTooLight(color) {
    const hex = color.substring(1); // remove # from Colorcode
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq > 128;
}

function createContactDropdown() {
    let dropdown = document.getElementById('which_assigned_contact');
    dropdown.innerHTML = '';
    let defaultOption = document.createElement('option');
    defaultOption.value = 'Select contacts to assign';
    defaultOption.textContent = 'Select contacts to assign';
    dropdown.appendChild(defaultOption);
    dropdown.addEventListener('change', (event) => {
        removeOptionDropdownContacts(event);

    });
    createOptionDropdownContacts(dropdown);
}

function removeOptionDropdownContacts(event) {
    const selectedOption = event.target.options[event.target.selectedIndex];
    if (selectedOption.value !== 'Select contacts to assign') {
        selectedOption.classList.add('d-none');
        createAssigneeBall(selectedOption.textContent, selectedOption.value);
    }
}

function createOptionDropdownContacts(dropdown) {
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
    getInitalsFromContact(contactName, contactValue, assigneeContainer);
    let backgroundColor = getRandomColor();
    assigneeContainer.style.backgroundColor = backgroundColor;
    assigneeContainer.addEventListener('click', () => {
        assigneeContainer.remove();
        removeAssigneeContainer(contactValue);
    });
    eventListenerMouseOver(assigneeContainer);
    eventListenerMouseOut(assigneeContainer);
    assignedToList.appendChild(assigneeContainer);
}

function getInitalsFromContact(contactName, contactValue, assigneeContainer) {
    let [firstName, lastName] = contactName.split(' ');
    assigneeContainer.innerHTML = `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`;
    assigneeContainer.setAttribute('data-contact-value', contactValue);
}

function removeAssigneeContainer(contactValue) {
    let option = Array.from(document.getElementById('which_assigned_contact').options)
        .find(opt => opt.value === contactValue);
    if (option) {
        option.classList.remove('d-none');
    }
}

function eventListenerMouseOver(assigneeContainer) {
    assigneeContainer.addEventListener('mouseover', (event) => {
        const contactValue = event.target.getAttribute('data-contact-value');
        event.target.setAttribute('title', `${contactValue}`);
    });
}

function eventListenerMouseOut(assigneeContainer) {
    assigneeContainer.addEventListener('mouseout', (event) => {
        event.target.removeAttribute('title');
    });
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



// noch nötig?
// function checkMustHaveEntries() {
//     console.log('Checking must have entries...');
//     const mustHaveArrays = fillMustHaveArray()
//     for (const array of mustHaveArrays) {
//         if (array.length === 0) {
//             showNotification();
//             return false;
//         }
//     }
//     return true;
// }

// function fillMustHaveArray() {
//      return [
//         priorityArray,
//         categoryArray,
//         categoryColorArray,
//         assignedToValuesArray,
//         assignedToColorsArray,
//         assignedShortValues,
//     ];
// }