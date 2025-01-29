<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Confirmation</title>
</head>
<body>
    <h1>Thank you for your payment, {{ $user->name }}!</h1>
    <p>Your subscription for {{ $surveys }} survey(s) has been successfully processed.</p>
    <p>Your subscription will be active for one month from today.</p>
    <p>If you have any questions, please don't hesitate to contact our support team.</p>
    <p>Best regards,<br>WebWizardTool Team</p>
</body>
</html>

