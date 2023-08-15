from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from dotenv import load_dotenv
import os

load_dotenv()


conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_DEFAULT_SENDER"),
    MAIL_PORT=os.getenv("MAIL_PORT"),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_FROM_NAME=os.getenv("MAIL_TITLE"),
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
    )

async def send_email_async(subject: str, email_to: str, body: str):
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body= f"<a  href='{os.getenv('FRONTEND_URL')}/auth/uidverify?uid={body}'>verify</a>",
        subtype='html',
    )
    
    fm = FastMail(conf)
    await fm.send_message(message)

async def changepasswordid(subject: str, email_to: str, body: str):
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body= f"<a  href='{os.getenv('FRONTEND_URL')}/auth/newpsk?uid={body}'>verify</a>",
        subtype='html',
    )
    
    fm = FastMail(conf)
    await fm.send_message(message)
