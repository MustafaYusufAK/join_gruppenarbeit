let users = [
    {
        'email': 'guest@guest.com',
        'password': '12345678'
    },
]

function init() {
    loadUsers();
    playAnimation();
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
            wrongEnter(email.value, password.value);
        }
    }
}

function wrongEnter(emailValue, passwordValue) {
    let emailInput = document.getElementById('log_in_email')
    let passwordInput = document.getElementById('log_in_password')
    let email = users.find(u => u.email == emailValue);
    let password = users.find(u => u.password == passwordValue);

if(email && !password) {
    console.log('email korrekt');
    passwordInput.classList.add('log-in-wrong')
}
if (!email && password){
    console.log('password korrekt');
    emailInput.classList.add('log-in-wrong')

}
if (!email && !password){
    console.log('alles falsch');
    emailInput.classList.add('log-in-wrong')
    passwordInput.classList.add('log-in-wrong')
}
}


function resetWrongEnter() {
    document.getElementById('log_in_email').classList.remove('log-in-wrong');
    document.getElementById('log_in_password').classList.remove('log-in-wrong');
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

function showPasswordIcon() {
    document.getElementById('password_icon').src = './assets/img/mail.svg'
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

function playAnimation() {
    let logo = document.getElementById('join_logo');
    let startscreenLogo = document.getElementById('startscreen_logo');
    startscreenLogo.style.animation = 'reduceBackground 1s ease-in-out forwards'
    logo.style.animation = 'reduceLogo 1s ease-in-out forwards';
}


function signUp() {
    let name = document.getElementById('name_sign_up');
    let email = document.getElementById('email_sign_up');
    let password1 = document.getElementById('password1_sign_up');
    let password2 = document.getElementById('password2_sign_up');

    if (password1.value == password2.value) {
        console.log('User angelegt');
    } else {
        console.log('User password nicht gleich');
    } 

}