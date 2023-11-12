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

function showBoardFinalNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notificationBackground = document.getElementById('show_final_board_notification_background');
    const notification = document.getElementById('show_final_board_notification');
    noteWindow.style.display = 'flex';
    notificationBackground.style.display = 'flex';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center'; // Füge align-items: center hinzu
    notification.style.justifyContent = 'center'; // Füge align-items: center hinzu
    setTimeout(() => {
        notificationBackground.style.opacity = '1';
        notification.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        boardHideShowFinalNotification();
    }, 3000);  // Benachrichtigung verschwindet nach 2 Sekunden
}


function boardHideShowFinalNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notificationBackground = document.getElementById('show_final_board_notification_background');
    const notification = document.getElementById('show_final_board_notification');
    notificationBackground.style.opacity = '0';
    notification.style.opacity = '0';
    setTimeout(() => {
        noteWindow.style.display = 'none';
        notificationBackground.style.display = 'none';
        notification.style.display = 'none';
    }, 500);  // Fade-Effekt-Dauer: 0,5 Sekunden

    if (window.innerWidth <= 850) {
        resetFlexDirection(notification); // Setze Flex Direction zurück, nachdem die Benachrichtigung verschwunden ist
    }
}

function categoryColorNotification() {
    const notification = document.getElementById('category_color_notification');
    const button = document.getElementById('category_color_btn');
    if (window.innerWidth <= 850) {
        button.style.display = 'none'
    }
    if (window.innerWidth > 850) {
        button.style.display = 'flex'
    }
    notification.style.display = 'flex';
    notification.style.alignItems = 'center'; // Füge align-items: center hinzu
    notification.style.justifyContent = 'center'; // Füge align-items: center hinzu
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        categoryColorHideNotification();
    }, 3000);  // Benachrichtigung verschwindet nach 2 Sekunden
}

function categoryColorHideNotification() {
    const notification = document.getElementById('category_color_notification');
    notification.style.opacity = '0';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 500);  // Fade-Effekt-Dauer: 0,5 Sekunden

    if (window.innerWidth <= 850) {
        resetFlexDirection(notification); // Setze Flex Direction zurück, nachdem die Benachrichtigung verschwunden ist
    }
}

function showBoardCategoryNotification() {
    const notification = document.getElementById('board_category_notification');
    const button = document.getElementById('category_board_btn');
    if (window.innerWidth <= 850) {
        button.style.display = 'none'
    }
    if (window.innerWidth > 850) {
        button.style.display = 'flex'
    }
    notification.style.display = 'flex';
    notification.style.alignItems = 'center'; // Füge align-items: center hinzu
    notification.style.justifyContent = 'center'; // Füge align-items: center hinzu
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        categoryBoardHideNotification();
    }, 3000);  // Benachrichtigung verschwindet nach 2 Sekunden
}

function categoryBoardHideNotification() {
    const notification = document.getElementById('board_category_notification');
    notification.style.opacity = '0';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 500);  // Fade-Effekt-Dauer: 0,5 Sekunden

    if (window.innerWidth <= 850) {
        resetFlexDirection(notification); // Setze Flex Direction zurück, nachdem die Benachrichtigung verschwunden ist
    }
}

function showBoardPrioNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notification = document.getElementById('prio_board_notification');
    const button = document.getElementById('prio_board_btn');
    if (window.innerWidth <= 850) {
        button.style.display = 'none'
    }
    if (window.innerWidth > 850) {
        button.style.display = 'flex'
    }
    noteWindow.style.display = 'flex';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center'; // Füge align-items: center hinzu
    notification.style.justifyContent = 'center'; // Füge align-items: center hinzu
    setTimeout(() => {
        notification.style.opacity = '1';
        // Überprüfung der Fensterbreite
    }, 100);
    setTimeout(() => {
        prioBoardHideNotification();
    }, 3000); // Benachrichtigung verschwindet nach 3 Sekunden

}


function prioBoardHideNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notification = document.getElementById('prio_board_notification');
    notification.style.opacity = '0';
    setTimeout(() => {
        noteWindow.style.display = 'none';
        notification.style.display = 'none';
    }, 500);  // Fade-Effekt-Dauer: 0,5 Sekunden


    if (window.innerWidth <= 850) {
        resetFlexDirection(notification); // Setze Flex Direction zurück, nachdem die Benachrichtigung verschwunden ist
    }
}


function showBoardContactsNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notification = document.getElementById('board_contacts_notification');
    const button = document.getElementById('contacts_board_btn');
    if (window.innerWidth <= 850) {
        button.style.display = 'none'
    }
    if (window.innerWidth > 850) {
        button.style.display = 'flex'
    }
    noteWindow.style.display = 'flex';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center'; // Füge align-items: center hinzu
    notification.style.justifyContent = 'center'; // Füge align-items: center hinzu
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        contactsBoardHideNotification();
    }, 3000);  // Benachrichtigung verschwindet nach 2 Sekunden
}

function contactsBoardHideNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notification = document.getElementById('board_contacts_notification');
    notification.style.opacity = '0';
    setTimeout(() => {
        noteWindow.style.display = 'none';
        notification.style.display = 'none';
    }, 500);  // Fade-Effekt-Dauer: 0,5 Sekunden

    if (window.innerWidth <= 850) {
        resetFlexDirection(notification); // Setze Flex Direction zurück, nachdem die Benachrichtigung verschwunden ist
    }
}

// Funktion zum Zurücksetzen der Flex Direction
function resetFlexDirection(notification) {
    setTimeout(() => {
        notification.style.flexDirection = 'row'; // Setze es auf den Standardwert zurück
    }, 500);

}