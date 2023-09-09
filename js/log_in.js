let users = [
    {
        'email': 'guest@guest.com',
        'password': '12345678'
    },
]

function init() {
    loadUsers();
}

async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }

}

//log in funktion

function logIn(guestemail, guestpassword) {
    let email = document.getElementById('email_log_in');
    let password = document.getElementById('password_log_in');

    if (guestemail == 'guest@guest.com') {
        email.value = guestemail;
        password.value = guestpassword;
        console.log('Guest Log in')

    } else {
        let user = users.find(u => u.email == email.value && u.password == password.value);
        console.log(user);
        if (user) {
            console.log('User gefunden');
        } else {
            console.log('User nicht gefunden');
        }
    }
}

async function register() {
    //register_button.disabled = true;
    let email = document.getElementById('email_log_in');
    let password = document.getElementById('password_log_in');
    users.push({
        email: email.value,
        password: password.value,
    })
    await setItem('users', JSON.stringify(users));
    //resetForm();
    //window.location.href = 'login.html?msg=Du hast dich erfolgreich registiert';
}

function resetForm() {
    email.value = '';
    password.value = '';
    register_button.disabled = false;
}


function registerSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');

    if(msg) {
        let msgBox = document.getElementById('msg_box');
        msgBox.innerHTML = msg;
    }
}

async function deleteUser(email) {
    users = users.filter(u => u.email !== email);
    await setItem('users', JSON.stringify(users));
}