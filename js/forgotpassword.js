async function sendMail() {
    let forgotPasswordSuccesfully = document.getElementById('forgot_password_succesfully');
    let forgotPasswordEmail = document.getElementById('email_password_forgot');
    let users = JSON.parse(await getItem('users'));
    let user = users.find(u => u.email == forgotPasswordEmail.value.toLowerCase())

    if (user) {
        forgotPasswordSuccesfully.classList.remove('d-none');
        forgotPasswordSuccesfully.style.animation = 'signUpSuccesfull 125ms ease-in-out forwards';

        // Hier wird die HTTP-Anfrage an die PHP-Datei gesendet
        fetch('../sendmail.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'email=' + encodeURIComponent(document.getElementById('email').value) + '&username=' + encodeURIComponent(user.name),
        })
            .then(response => response.text())
            .then(data => console.log(data)) // Zeige die Antwort der PHP-Datei in der Konsole an
            .catch(error => console.error('Error:', error));

        setTimeout(function () { window.location.href = 'index.html' }, 800)
    } else {
        let email = document.getElementById('email');
        email.classList.add('log-in-wrong');
        console.log('User nicht gefunden');
    }
}