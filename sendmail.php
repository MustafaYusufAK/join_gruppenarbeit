<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = $_POST["email"];
    $subject = "Reset Your Password";

    // Benutzernamen abrufen
    $username = $_POST["username"];
    
    // HTML-Template einlesen
    $message = file_get_contents('assets/templates/email_template.html');
    
    // Platzhalter in der Vorlage ersetzen
    $message = str_replace('{{reset_link}}', 'https://jan-horstmann.developerakademie.net/join_gruppenarbeit/resetpassword.html?' . $_POST["email"], $message);
    
    // Platzhalter für den Benutzernamen ersetzen
    $message = str_replace('{{username}}', $username, $message);
    
    $headers = "From: webmaster@example.com\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=utf-8\r\n";

    if (mail($to, $subject, $message, $headers)) {
        echo "E-Mail wurde erfolgreich versandt.";
    } else {
        echo "E-Mail konnte nicht versandt werden. Fehler: " . error_get_last()['message'];
    }
}
?>

