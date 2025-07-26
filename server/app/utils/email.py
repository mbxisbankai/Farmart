import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv

load_dotenv()  # Ensure environment variables are loaded

def send_order_confirmation(to_email, order_summary):
    message = Mail(
        from_email=os.getenv('SENDGRID_FROM_EMAIL', 'noreply@farmart.com'),
        to_emails=to_email,
        subject='Order Confirmation - Farmart',
        html_content=f"""
        <h2>Thank you for your order!</h2>
        <p>Here are your order details:</p>
        <pre>{order_summary}</pre>
        <p>We’ll be in touch when your order is on the way.</p>
        """
    )

    try:
        sg = SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
        response = sg.send(message)
        print(f"Email sent to {to_email}: {response.status_code}")
        return response.status_code
    except Exception as e:
        print(f"SendGrid Error: {e}")
        return None
