<?php
if( isset($_POST) ){

    //form validation vars
    $formok = true;
    $errors = array();

    //submission data
    $ipaddress = $_SERVER['REMOTE_ADDR'];
    $date = date('d/m/Y');
    $time = date('H:i:s');

    //form data
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    //validate form data

    //validate name is not empty
    if(empty($name)){
        $formok = false;
        $errors[] = "You have not entered a name";
    }

    //validate email address is not empty
    if(empty($email)){
        $formok = false;
        $errors[] = "You have not entered an email address";
    //validate email address is valid
    }elseif(!filter_var($email, FILTER_VALIDATE_EMAIL)){
        $formok = false;
        $errors[] = "You have not entered a valid email address";
    }

    //validate message is not empty
    if(empty($message)){
        $formok = false;
        $errors[] = "You have not entered a message";
    }
    //validate message is greater than 20 characters
    elseif(strlen($message) < 20){
        $formok = false;
        $errors[] = "Your message must be greater than 20 characters";
    }

    //send email if all is ok
    if($formok){
        $headers = "From: {$email}" . "\r\n";
        $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

        $emailbody = "<p>You have received a new message from the enquiries form on your website.</p>
                      <p><strong>Name: </strong> {$name} </p>
                      <p><strong>Email Address: </strong> {$email} </p>
                      <p><strong>Message: </strong> {$message} </p>
                      <p>This message was sent from the IP Address: {$ipaddress} on {$date} at {$time}</p>";

        mail("info@ryck.me","Web Form Contact",$emailbody,$headers);

    }

    //what we need to return back to our form
    $returndata = array(
        'posted_form_data' => array(
            'name' => $name,
            'email' => $email,
            'message' => $message
        ),
        'form_ok' => $formok,
        'errors' => $errors
    );

    //if this is not an ajax request
    if(empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) !== 'xmlhttprequest'){
        //set session variables
        session_start();
        $_SESSION['cf_returndata'] = $returndata;

        //redirect back to form
        header('location: ' . $_SERVER['HTTP_REFERER']);
    }
}

