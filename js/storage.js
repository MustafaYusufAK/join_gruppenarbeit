const STORAGE_TOKEN = '6JWGFSP8ZA4Y8JE2FOVSN7ZO8Z67IFY8GHNHPA6B'
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item'

async function setItem(key, value){
    const payload = {key, value, token: STORAGE_TOKEN};
    return fetch(STORAGE_URL, {method: 'POST', body: JSON.stringify(payload)})
    .then(res => res.json());
}

async function getItem(key){
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json().then(res => res.data.value));
}

async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }

}

function loadUsersFromLocalStorage() {
    return lokalUsers = JSON.parse(localStorage.getItem('users')) || [];
}

function saveUserToLocalStorage() {
    debugger;
    let emailValue = document.getElementById('email_log_in')
    let user = users.find(u => u.email == emailValue.value.toLowerCase())
    let userNumber = lokalUsers.find(l => l.email == emailValue.value.toLowerCase())

    if (userNumber != undefined) {
        lokalUsers.splice(0);
        lokalUsers.push(user);
    } else {
        lokalUsers.push(user);
    }
    localStorage.setItem('users', JSON.stringify(lokalUsers));
}

async function deleteUser(email) {
    users = users.filter(u => u.email !== email.toLowerCase());
    await setItem('users', JSON.stringify(users));
}