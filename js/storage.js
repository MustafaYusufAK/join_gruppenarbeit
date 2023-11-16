const STORAGE_TOKEN = '6JWGFSP8ZA4Y8JE2FOVSN7ZO8Z67IFY8GHNHPA6B'
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item'

let lokalUsers = [];
let allTasks = [];

//------------------------------------------------------------------------------//
//-----------------------------save User at Backend-----------------------------//
//------------------------------------------------------------------------------//

/**
 * save User at Backend
 * @async
 * @param {string} key 
 * @param {string} value 
 * @returns 
 */
async function setItem(key, value){
    const payload = {key, value, token: STORAGE_TOKEN};
    return fetch(STORAGE_URL, {method: 'POST', body: JSON.stringify(payload)})
    .then(res => res.json());
}


//------------------------------------------------------------------------------//
//-----------------------------get User from Backend----------------------------//
//------------------------------------------------------------------------------//

/**
 * get User from Backend
 * @async
 * @param {string} key 
 * @returns 
 */
async function getItem(key){
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json().then(res => res.data.value));
}


//------------------------------------------------------------------------------//
//-----------------------------get Username from URL----------------------------//
//------------------------------------------------------------------------------//

/**
 * get Username from URL
 * @returns 
 */
function getUserName() {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    if (msg){
        let userName = msg.split(', ');
        return userName[1];
    } else {
        return 'Guest'
    }
}


//------------------------------------------------------------------------------//
//----------------------------load User from Backend----------------------------//
//------------------------------------------------------------------------------//

/**
 * load User from Backend
 * @async
 * @returns 
 */
async function loadUsers() {
    try {
        let users = JSON.parse(await getItem('users'));
        return users
    } catch (e) {
        console.error('Loading error:', e);
    }
}


//------------------------------------------------------------------------------//
//-------------------------load User from local Storage-------------------------//
//------------------------------------------------------------------------------//

/**
 * load User from local Storage
 * @returns 
 */
function loadUsersFromLocalStorage() {
    return lokalUsers = JSON.parse(localStorage.getItem('users')) || [];
}


//------------------------------------------------------------------------------//
//--------------------------save User at local Storage--------------------------//
//------------------------------------------------------------------------------//

/**
 * save User at local Storage
 * @async
 */
async function saveUserToLocalStorage() {
    let emailValue = document.getElementById('email_log_in')
    let users = JSON.parse(await getItem('users'));
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

//------------------------------------------------------------------------------//
//-------------------------delete User at local Storage-------------------------//
//------------------------------------------------------------------------------//

/**
 * delete User at local Storage
 */
function clearLocalStorage() {
    localStorage.removeItem('users');
}


//------------------------------------------------------------------------------//
//----------------------------------delete User---------------------------------//
//------------------------------------------------------------------------------//

/**
 * delete User
 * @async
 * @param {string} email 
 */
async function deleteUser(email) {
    let users = JSON.parse(await getItem('users'));
    users = users.filter(u => u.email !== email.toLowerCase());
    await setItem('users', JSON.stringify(users));
}


//------------------------------------------------------------------------------//
//---------------------------save Contacts at Backend---------------------------//
//------------------------------------------------------------------------------//

/**
 * save Contacts at Backend
 * @async
 */
async function saveContacts() {
    let users = JSON.parse(await getItem('users'));
    let userName = getUserName();

    let userIndex = users.findIndex(u => u.name === userName);
    users[userIndex].contacts = contacts; 
    await setItem('users', JSON.stringify(users));
}


//------------------------------------------------------------------------------//
//--------------------------load Contacts from Backend--------------------------//
//------------------------------------------------------------------------------//

/**
 * load Contacts from Backend
 * @async
 */
async function loadContacts() {
    let users = JSON.parse(await getItem('users'));
    let userName = getUserName();

    let userIndex = users.findIndex(u => u.name === userName);
    let userContacts = users[userIndex].contacts
    if (userContacts == undefined) {
        contacts = []
    } else {
        contacts = userContacts
    }
}


//------------------------------------------------------------------------------//
//-----------------------------save Tasks at Backend----------------------------//
//------------------------------------------------------------------------------//

/**
 * save Tasks at Backend
 * @async
 */
async function saveTasks() {
    let users = JSON.parse(await getItem('users'));
    let userName = getUserName();

    let userIndex = users.findIndex(u => u.name === userName);
    users[userIndex].tasks = allTasks; 
    await setItem('users', JSON.stringify(users));
}

async function saveTasksCategory() {
    let users = JSON.parse(await getItem('users'));
    let userName = getUserName();

    let userIndex = users.findIndex(u => u.name === userName);
    users[userIndex].sortTasks = task_category; 
    await setItem('users', JSON.stringify(users));
}


//------------------------------------------------------------------------------//
//-----------------------------load Tasks at Backend----------------------------//
//------------------------------------------------------------------------------//

/**
 * load Tasks at Backend
 * @async
 */
async function loadTasks() {
    let users = JSON.parse(await getItem('users'));
    let userName = getUserName();

    let userIndex = users.findIndex(u => u.name === userName);
    let userTasks = users[userIndex].tasks;
    let usersortTasks = users[userIndex].sortTasks;
    if (userTasks == undefined) {
        allTasks = [];        
        await saveTasks();   
    }
    if(usersortTasks == undefined) {
        task_category = {
            'toDo': '',
            'progress': '',
            'feedback': '',
            'done': '',
        };
        await saveTasksCategory();
    } else {
        allTasks = userTasks;
        sortTasks = usersortTasks;
    }
}