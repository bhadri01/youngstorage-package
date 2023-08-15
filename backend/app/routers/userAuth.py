from fastapi import APIRouter, Depends, Response
from fastapi.responses import JSONResponse
from ..database import db
from ..lib.models.userModels import Signup, Signin, pwd_context, password_regex
from ..lib.auth.jwt import signJWT, Authenticator, UserRole, changepskJWT
from ..lib.auth.email_sender import send_email_async, changepasswordid
from bson import ObjectId
import re
from pydantic import BaseModel

router = APIRouter()


@router.post("/signup")
async def signup(data: Signup):
    try:
        if db.user.find_one({"email": data.email}):
            return JSONResponse(content={"message": "email already exists", "status": False}, status_code=401)
        elif db.user.find_one({"phone": data.phone}):
            return JSONResponse(content={"message": "phone number already exists", "status": False}, status_code=401)
        else:
            _id = db.user.insert_one(data.create_user()).inserted_id
            await send_email_async("User verification", data.email, signJWT(str(_id), 15))
            return JSONResponse(content={"message": "User Signed Up Successfully. Now check the email", "status": True}, status_code=201)
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=401)


@router.get("/userverify")
def user_verify(_id=Depends(Authenticator(False, UserRole.user).signupJWT)):
    try:
        print("say somthing:", _id)
        if db.user.update_one({"_id": ObjectId(_id)}, {"$set": {"userVerified": True}}):
            return JSONResponse(content={"message": "User Verified Successfully", "status": True}, status_code=200)
        else:
            return JSONResponse(content={"message": "User Not Verified", "status": False}, status_code=401)
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=401)


class ForgotPasswordRequest(BaseModel):
    email: str


@router.post("/fotgotpassword")
async def signup(data: ForgotPasswordRequest):
    try:
        user = db.user.find_one({"email": data.email})
        if user:
            await changepasswordid("Change password", data.email, changepskJWT(str(user["_id"]), 15))
            return JSONResponse(content={"message": "Now check the email to change the password", "status": True}, status_code=200)
        else:
            return JSONResponse(content={"message": "email not exist", "status": False}, status_code=401)
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=401)


class GetPassword(BaseModel):
    password: str
    confirmpassword: str


@router.post("/changepassword")
def user_verify(password: GetPassword, data=Depends(Authenticator(True, UserRole.user).ChangePassword)):
    try:
        if re.match(password_regex, str(password.password)):
            if db.user.update_one({"_id": ObjectId(data["_id"])}, {"$set": {"password": pwd_context.hash(password.password)}}):
                return JSONResponse(content={"message": "password updated Successfully", "status": True}, status_code=200)
            else:
                return JSONResponse(content={"message": "User Not Verified", "status": False}, status_code=401)
        else:
            return JSONResponse(content={"message": "Please enter a password that meets the required pattern", "status": False}, status_code=401)
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=500)


@router.post("/signin")
async def signup(data: Signin):
    try:
        user = db.user.find_one({"email": data.email})
        if user is not None:
            data.verify_user(user["password"])
            if "_id" in user and data:
                if user["userVerified"] == True:
                    return JSONResponse(content={"message": "User Signin Successfull", "status": True, "username": user["username"], "authorization": f"Bearer {signJWT(str(user['_id']),userVerified=True)}"}, status_code=200)
                else:
                    return JSONResponse(content={"message": "User Not Verified", "status": False}, status_code=401)
            else:
                return JSONResponse(content={"message": "Invalid Credentials", "status": False}, status_code=401)
        else:
            return JSONResponse(content={"message": "Invalid Credentials", "status": False}, status_code=401)
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=500)


@router.get("/user/{username}")
def user(username: str, data=Depends(Authenticator(True, UserRole.user).signupJWT)):
    if username == data["username"]:
        return JSONResponse(content={"message": "user details", "status": True, "data": data}, status_code=200)
    else:
        return JSONResponse(content={"message": f"not a valied token for {username}", "status": False}, status_code=401)
