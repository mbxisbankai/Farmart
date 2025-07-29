import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_order_confirmation(to_email, subject, content):
    message = Mail(
        from_email=os.getenv('FROM_EMAIL'),
        to_emails=to_email,
        subject=subject,
        html_content=content
    )

    try:
        sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
        response = sg.send(message)
        return response.status_code
    except Exception as e:
        print(f"SendGrid Error: {e}")
        return None
