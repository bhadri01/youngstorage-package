from pydantic import BaseModel, EmailStr, validator
from ...database import db
import re
from passlib.context import CryptContext
from datetime import datetime


password_regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$"
phone_regex = r"^[0-9]{10}$"

# Create an instance of the password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class GetPassword(BaseModel):
    password: str
    confirmpassword: str


class ForgotPasswordRequest(BaseModel):
    email: str


class Signup(BaseModel):
    email: EmailStr
    password: str
    phone: str

    @validator("email")
    def email_validation(cls, email):
        verify = email.split("@")
        allowed = ["gmail.com", "hotmail.com", "outlook.com",
                   "icloud.com", "protonmail.com", "live.com"]
        if verify[1] not in allowed:
            raise ValueError("Please enter a valid email domain")
        return email

    @validator("password")
    def password_validation(cls, password):
        if not re.match(password_regex, password):
            raise ValueError(
                "Please enter a password that meets the required pattern")
        return password

    @validator("phone")
    def phone_validation(cls, phone):
        if not re.match(phone_regex, phone):
            raise ValueError("Please enter a valid phone number")
        return phone

    def create_user(self):
        # Hash the password
        hashed_password = pwd_context.hash(self.password)

        # Save the user to the database (example code)
        user_data = {
            "username":self.email.split("@")[0],
            "email": self.email,
            "password": hashed_password,
            "phone": self.phone,
            "userVerified": False,
            "role": "user",
            "createAt":int(datetime.now().timestamp())
        }
        # Save user_data to the database using your preferred method

        # Return the created user (example code)
        return user_data


class Signin(BaseModel):
    email: EmailStr
    password: str

    def verify_user(self, hash_password):
        return pwd_context.verify(self.password, hash_password)
