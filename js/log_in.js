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
    let password = document.getElementById('password1_input');

    if (guestemail == 'guest@guest.com') {
        email.value = guestemail;
        password.value = guestpassword;

    } else {
        let user = users.find(u => u.email == email.value && u.password == password.value);
        console.log(user);
        if (user) {
            window.location.href = 'summary.html?msg=Welcomme to Join';
        } else {
            wrongEnter(email.value, password.value);
        }
    }
}

function wrongEnter(emailValue, passwordValue) {
    let emailInput = document.getElementById('email')
    let passwordInput = document.getElementById('password1')
    let email = users.find(u => u.email == emailValue);
    let password = users.find(u => u.password == passwordValue);

    if (email && !password) {
        passwordInput.classList.add('log-in-wrong')
    }
    if (!email && password) {
        emailInput.classList.add('log-in-wrong')

    }
    if (!email && !password) {
        emailInput.classList.add('log-in-wrong')
        passwordInput.classList.add('log-in-wrong')
    }
}


function resetWrongEnter(id) {
    if (id) {
        document.getElementById(id).classList.remove('log-in-wrong');
    }
}


async function signUp() {
    //register_button.disabled = true;
    let name = document.getElementById('name_sign_up');
    let email = document.getElementById('email_sign_up');
    let password1 = document.getElementById('password1_sign_up');
    let password2 = document.getElementById('password2_sign_up');
    let emailChecked = users.find(u => u.email == email.value.toLowerCase());
    if (!emailChecked) {
        if (password1.value == password2.value) {
            users.push({
                name: name.value,
                email: email.value.toLowerCase(),
                password: password1.value,
            })
            await setItem('users', JSON.stringify(users));
            //window.location.href = 'summary.html?msg=Du hast dich erfolgreich registiert';
        } else if (password1.value != password2.value) {
            document.getElementById('password2').classList.add('log-in-wrong');
        }
    } else {
        document.getElementById('email').classList.add('log-in-wrong');
    }
}

function showPasswordIcon(password) {
    let password1 = document.getElementById('password1')
    let password2 = document.getElementById('password2')
    if (password == 'password1') {
        password1.innerHTML = `
        <input required type="password" class="" id="password1_input" placeholder="Password" onmouseup="resetWrongEnter('password1');">
        <div class="password-icon"><img onclick="showPassword('password1')" id="password1_icon" src="./assets/img/visibility_off.svg" alt=""></div>
        <label for="content">Wrong password Ups! Try again.</label>`
    }
    if (password == 'password2') {
        password2.innerHTML = `
        <input required type="password" class="" id="password2_input" placeholder="Password" onmouseup="resetWrongEnter('password2');">
        <div class="password-icon"><img onclick="showPassword('password2')" id="password2_icon" src="./assets/img/visibility_off.svg" alt=""></div>
        <label for="content">Wrong password Ups! Try again.</label>`
        
    }
}

function showPassword(password) {
    console.log('passwort anzeigen', password)
    let password1 = document.getElementById('password1_icon')
    let password2 = document.getElementById('password2_icon')
    if (password == 'password1') {
        password1.src = './assets/img/visibility.svg'
        password1.onclick = function () { hidePassword('password1'); };
        document.getElementById('password1_input').type = "text";
    }
    if (password == 'password2') {
        password2.src = './assets/img/visibility.svg'
        password2.onclick = function () { hidePassword('password2'); };
        document.getElementById('password2_input').type = "text";
    }
}

function hidePassword(password) {
    let password1 = document.getElementById('password1_icon')
    let password2 = document.getElementById('password2_icon')
    if (password == 'password1') {
        password1.src = './assets/img/visibility_off.svg'
        password1.onclick = function () { showPassword('password1'); };
        document.getElementById('password1_input').type = "password";
    }
    if (password == 'password2') {
        password2.src = './assets/img/visibility_off.svg'
        password2.onclick = function () { showPassword('password2'); };
        document.getElementById('password2_input').type = "password";
    }
}

function resetForm() {
    email.value = '';
    password.value = '';
    register_button.disabled = false;
}


function registerSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');

    if (msg) {
        let msgBox = document.getElementById('msg_box');
        msgBox.innerHTML = msg;
    }
}

async function deleteUser(email) {
    users = users.filter(u => u.email !== email.toLowerCase());
    await setItem('users', JSON.stringify(users));
}

function playAnimation() {
    let logo = document.getElementById('join_logo');
    let startscreenLogo = document.getElementById('startscreen_logo');
    startscreenLogo.style.animation = 'reduceBackground 1s ease-in-out forwards'
    logo.style.animation = 'reduceLogo 1s ease-in-out forwards';
}


/*function signUp() {
    let name = document.getElementById('name_sign_up');
    let email = document.getElementById('email_sign_up');
    let password1 = document.getElementById('password1');
    let password2 = document.getElementById('password2');

    if (password1.value == password2.value) {
        console.log('User angelegt');
    } else {
        console.log('User password nicht gleich');
    }

}*/