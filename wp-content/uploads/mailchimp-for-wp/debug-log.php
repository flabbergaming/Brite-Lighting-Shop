<?php exit; ?>
[2021-02-16 10:04:23] WARNING: Form 3610 > dyla*********@gm***.com is already subscribed to the selected list(s)
[2021-02-16 10:04:36] ERROR: Form 3610 > Mailchimp API error: 400 Bad Request. Invalid Resource. test@gm***.com looks fake or invalid, please enter a real email address.

Request: 
POST https://us20.api.mailchimp.com/3.0/lists/7250b193ca/members

{"status":"pending","email_address":"test@gm***.com","interests":{},"merge_fields":{},"email_type":"html","ip_signup":"::1","tags":[]}

Response: 
400 Bad Request
{"type":"https://mailchimp.com/developer/marketing/docs/errors/","title":"Invalid Resource","status":400,"detail":"test@gm***.com looks fake or invalid, please enter a real email address.","instance":"7a0e0724-a34a-40ef-89e8-9786b76cbc4d"}
