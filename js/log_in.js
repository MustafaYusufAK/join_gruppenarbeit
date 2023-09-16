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

//log in funktion

function logIn(guest) {
    let email = document.getElementById('email_log_in');
    let password = document.getElementById('password1_input');

    if (guest == 'guest@guest.com') {
        let user = users.find(u => u.email == guest)
        email.value = user.email;
        password.value = user.password;

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
    let email = users.find(u => u.email == emailValue.toLowerCase());
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
    let password1 = document.getElementById('password1_input');
    let password2 = document.getElementById('password2_input');
    let emailChecked = users.find(u => u.email == email.value.toLowerCase());
    let signUpSuccesfully = document.getElementById('sign_up_succesfully');
    if (!emailChecked) {
        if (password1.value == password2.value) {
            users.push({
                name: name.value,
                email: email.value.toLowerCase(),
                password: password1.value,
            })
            //await setItem('users', JSON.stringify(users));
            signUpSuccesfully.classList.remove('d-none')
            signUpSuccesfully.style.animation = 'signUpSuccesfull 125ms ease-in-out forwards'
            console.log('Done');
            
        } else if (password1.value != password2.value) {
            document.getElementById('password2').classList.add('log-in-wrong');
        }
    } else {
        document.getElementById('email').classList.add('log-in-wrong');
    }
    setTimeout(function() {window.location.href = 'index.html?msg=Welcomme to Join'}, 800)
}

function showPasswordIcon(password) {
    let password1 = document.getElementById('password1')
    let password2 = document.getElementById('password2')
    if (password == 'password1') {
        password1.innerHTML = `
        <input required type="password" class="" id="password1_input" placeholder="Password" onmouseup="resetWrongEnter('password1');">
        <div class="input-icon"><img onclick="showPassword('password1')" id="password1_icon" src="./assets/img/visibility_off.svg" alt=""></div>
        <label for="content">Wrong password Ups! Try again.</label>`
    }
    if (password == 'password2') {
        password2.innerHTML = `
        <input required type="password" class="" id="password2_input" placeholder="Password" onmouseup="resetWrongEnter('password2');">
        <div class="input-icon"><img onclick="showPassword('password2')" id="password2_icon" src="./assets/img/visibility_off.svg" alt=""></div>
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

function showForgotPassword() {
    let lognInCard = document.getElementById('log_in_card');
    let signUpCard = document.getElementById('sign_up_btn_card');
    let forgotPasswordCard = document.getElementById('forgot_password_card');

    lognInCard.classList.add('d-none');
    signUpCard.classList.add('d-none');
    forgotPasswordCard.classList.remove('d-none');
}

function resetPassword() {
    let password1 = document.getElementById('password1_input');
    let password2 = document.getElementById('password2_input');
    //let msgBox = document.getElementById('msg_box');
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');

    //console.log('Password erfolgreich zurückgesetzt', msg)
    if (password1.value == password2.value) {
        let user = users.find(u => u.email === msg);
        console.log('Password erfolgreich zurückgesetzt', user)
        user.password = password1.value;
        setItem('users', JSON.stringify(users));

    } else if (password1.value != password2.value) {
        document.getElementById('password2').classList.add('log-in-wrong');
    }
}

