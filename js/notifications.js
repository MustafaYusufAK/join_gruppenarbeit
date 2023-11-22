function showFinalNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notificationBackground = document.getElementById('show_final_notification_background');
    const notification = document.getElementById('show_final_notification');
    notificationBackground.style.display = 'flex';
    notification.style.display = 'flex';
    noteWindow.style.display = 'flex';
    setTimeout(() => {
        notificationBackground.style.opacity = '1';
        notification.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        HideShowFinalNotification();
    }, 1000);
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

function confirmCategoryNotification() {
    const button = document.getElementById('category_confirm_btn');
    const noteWindow = document.getElementById('noteWindow');
    const notification = document.getElementById('confirm_category_notification');
    notification.style.display = 'block';
    noteWindow.style.display = 'flex';
    if (window.innerWidth <= 850) {
        button.style.display = 'none'
    }
    if (window.innerWidth > 850) {
        button.style.display = 'inline-block'
    }
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        HideConfirmedCategoryNotification();
    }, 4000);  // Benachrichtigung verschwindet nach 2 Sekunden
}

function HideConfirmedCategoryNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notification = document.getElementById('confirm_category_notification');
    notification.style.opacity = '0';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 500);  // Fade-Effekt-Dauer: 0,5 Sekunden
}

function showPrioNotification() {
    const button = document.getElementById('select_prio_btn');
    const noteWindow = document.getElementById('noteWindow');
    const notification = document.getElementById('prio_notification');
    notification.style.display = 'block';
    noteWindow.style.display = 'flex';
    if (window.innerWidth <= 850) {
        button.style.display = 'none'
    }
    if (window.innerWidth > 850) {
        button.style.display = 'inline-block'
    }
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        prioHideNotification();
    }, 4000);  // Benachrichtigung verschwindet nach 2 Sekunden
}

function prioHideNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notification = document.getElementById('prio_notification');
    notification.style.opacity = '0';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 500);  // Fade-Effekt-Dauer: 0,5 Sekunden
}

function selectCategoryNotification() {
    const button = document.getElementById('select_category_btn');
    const noteWindow = document.getElementById('noteWindow');
    const notification = document.getElementById('select_category_notification');
    noteWindow.style.display = 'flex';
    notification.style.display = 'flex';
    notification.style.justifyContent = 'center';
    notification.style.alignItems = 'center';
    if (window.innerWidth <= 850) {
        button.style.display = 'none'
    }
    if (window.innerWidth > 850) {
        button.style.display = 'inline-block'
    }
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        selectCategoryHideNotification();
    }, 4000);  // Benachrichtigung verschwindet nach 2 Sekunden
}

function selectCategoryHideNotification() {
    const notification = document.getElementById('select_category_notification');
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
    }, 1500);  // Benachrichtigung verschwindet nach 2 Sekunden
}

function boardHideShowFinalNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notificationBackground = document.getElementById('show_final_board_notification_background');
    const notification = document.getElementById('show_final_board_notification');
    notificationBackground.style.opacity = '0';
    notification.style.opacity = '0';
    setTimeout(() => {
        notificationBackground.style.display = 'none';
        notification.style.display = 'none';
    }, 500);  // Fade-Effekt-Dauer: 0,5 Sekunden

    if (window.innerWidth <= 850) {
        resetFlexDirection(notification); // Setze Flex Direction zurück, nachdem die Benachrichtigung verschwunden ist
    }
}

function categoryColorNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notification = document.getElementById('category_color_notification');
    const button = document.getElementById('category_color_btn');
    if (window.innerWidth <= 850) {
        button.style.display = 'none'
    }
    if (window.innerWidth > 850) {
        button.style.display = 'inline-block'
    }
    noteWindow.style.display = 'flex';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center'; // Füge align-items: center hinzu
    notification.style.justifyContent = 'center'; // Füge align-items: center hinzu
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        categoryColorHideNotification();
    }, 4000);  // Benachrichtigung verschwindet nach 2 Sekunden
}

function categoryColorHideNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notification = document.getElementById('category_color_notification');
    notification.style.opacity = '0';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 500);  // Fade-Effekt-Dauer: 0,5 Sekunden

    if (window.innerWidth <= 850) {
        resetFlexDirection(notification); // Setze Flex Direction zurück, nachdem die Benachrichtigung verschwunden ist
    }
}

function categoryNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notification = document.getElementById('category_notification');
    const button = document.getElementById('category_board_btn');
    if (window.innerWidth <= 850) {
        button.style.display = 'none'
    }
    if (window.innerWidth > 850) {
        button.style.display = 'inline-block'
    }
    noteWindow.style.display = 'flex';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center'; // Füge align-items: center hinzu
    notification.style.justifyContent = 'center'; // Füge align-items: center hinzu
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        categoryHideNotification();
    }, 4000);  // Benachrichtigung verschwindet nach 2 Sekunden
}

function categoryHideNotification() {
    const notification = document.getElementById('category_notification');
    notification.style.opacity = '0';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 500);  // Fade-Effekt-Dauer: 0,5 Sekunden
    if (window.innerWidth <= 850) {
        resetFlexDirection(notification); // Setze Flex Direction zurück, nachdem die Benachrichtigung verschwunden ist
    }
}

function resetFlexDirection(notification) {
    setTimeout(() => {
        notification.style.flexDirection = 'row'; // Setze es auf den Standardwert zurück
    }, 500);

}