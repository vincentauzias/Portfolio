<?php

    if ($_SERVER['REQUEST_METHOD']=='POST') {
     
      $name = htmlentities($_POST['name']); 
      $phone = htmlentities($_POST['phone']);
      $email = htmlentities($_POST['email']);
      $subject = htmlentities($_POST['subject']);
      $message = htmlentities($_POST['message']);
     
      $destinataire = 'codeur.auzias@gmail.com';
      $content = '<html><head><title> '.$subject.' </title></head><body>';
      $content .= '<p>Tu as un nouveau message !</p>';
      $content .= '<p><strong>Nom</strong>: '.$name.'</p>';
      $content .= '<p><strong>Tel</strong>: '.$phone.'</p>';
      $content .= '<p><strong>Email</strong>: '.$email.'</p>';
      $content .= '<p><strong>Message</strong>: '.$message.'</p>';
      $content .= '</body></html>'; 

      $headers = 'MIME-Version: 1.0'."\r\n";
      $headers .= 'Content-type: text/html; charset=iso-8859-1'."\r\n";

      mail($destinataire, $subject, $content, $headers);
      header("location:index.html"); 
    }
?>
