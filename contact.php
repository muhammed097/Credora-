<?php
// ============================================================
//  contact.php — Credora Finance Contact Form Handler
//  Uses PHPMailer with SMTP (no Composer required)
// ============================================================

// ── Load PHPMailer (manual, no Composer) ────────────────────
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

// ── Only allow POST requests ─────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact-us.html');
    exit;
}

// ── Sanitize inputs ──────────────────────────────────────────
function clean($value) {
    return htmlspecialchars(strip_tags(trim($value)));
}

$full_name = clean($_POST['full_name'] ?? '');
$phone     = clean($_POST['phone']     ?? '');
$service   = clean($_POST['service']   ?? '');
$message   = clean($_POST['message']   ?? '');

// ── Basic validation ─────────────────────────────────────────
if (empty($full_name) || empty($phone) || empty($service)) {
    header('Location: contact-us.html?status=error');
    exit;
}

// ============================================================
//  ✏️  SMTP CONFIGURATION — Fill in your details below
// ============================================================
$smtp_host     = 'smtp.hostinger.com';       // Hostinger outgoing mail server
$smtp_username = 'info@thewriterslaundry.com';  // Your Hostinger email address
$smtp_password = 'Mrbai@#00';      // Your Hostinger email password
$smtp_port     = 465;                        // Hostinger uses port 465 with SSL

$from_email    = 'info@thewriterslaundry.com';  // Must match smtp_username on Hostinger
$from_name     = 'The Writer Laundry Website';
$to_email      = 'mrbaiwriting@gmail.com';   // Where you want to RECEIVE the emails
$to_name       = 'The Writer Laundry';
// ============================================================

// ── Build HTML email body ────────────────────────────────────
$email_html = "
<!DOCTYPE html>
<html>
<head>
  <meta charset='UTF-8'>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #3b0764, #7c3aed); padding: 30px 40px; }
    .header h1 { color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px; }
    .header p { color: rgba(255,255,255,0.75); margin: 5px 0 0; font-size: 13px; }
    .body { padding: 35px 40px; }
    .field { margin-bottom: 22px; }
    .field label { display: block; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #7c3aed; margin-bottom: 6px; }
    .field p { margin: 0; font-size: 15px; color: #1a1a2e; background: #f8f5ff; padding: 12px 16px; border-radius: 8px; border-left: 3px solid #7c3aed; }
    .footer { background: #f8f5ff; padding: 20px 40px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #ede9fe; }
  </style>
</head>
<body>
  <div class='wrapper'>
    <div class='header'>
      <h1>📬 New Contact Form Submission</h1>
      <p>Received from the Credora Finance website</p>
    </div>
    <div class='body'>
      <div class='field'>
        <label>Full Name</label>
        <p>$full_name</p>
      </div>
      <div class='field'>
        <label>Phone Number</label>
        <p>$phone</p>
      </div>
      <div class='field'>
        <label>Service Interested In</label>
        <p>$service</p>
      </div>
      <div class='field'>
        <label>Message</label>
        <p>" . (empty($message) ? '<em style=\"color:#aaa\">No message provided</em>' : nl2br($message)) . "</p>
      </div>
    </div>
    <div class='footer'>
      Submitted on " . date('d M Y \a\t H:i') . " (Server Time) &nbsp;|&nbsp; Credora Finance, Dubai UAE
    </div>
  </div>
</body>
</html>
";

// ── Send via PHPMailer ───────────────────────────────────────
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = $smtp_host;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtp_username;
    $mail->Password   = $smtp_password;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // SSL for port 465 (Hostinger)
    $mail->Port       = $smtp_port;

    // Sender & recipient
    $mail->setFrom($from_email, $from_name);
    $mail->addAddress($to_email, $to_name);
    $mail->addReplyTo($from_email, $from_name);

    // Email content
    $mail->isHTML(true);
    $mail->Subject = "New Enquiry from $full_name — Credora Finance";
    $mail->Body    = $email_html;
    $mail->AltBody = "Name: $full_name\nPhone: $phone\nService: $service\nMessage: $message";

    $mail->send();
    header('Location: contact-us.html?status=success');

} catch (Exception $e) {
    // Uncomment the line below during testing to see the exact error:
    // error_log("PHPMailer Error: " . $mail->ErrorInfo);
    header('Location: contact-us.html?status=error');
}
exit;
?>
