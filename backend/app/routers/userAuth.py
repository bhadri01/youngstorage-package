from fastapi import APIRouter, Depends, Response
from fastapi.responses import JSONResponse
from ..database import db
from ..lib.models.userModels import Signup, Signin, pwd_context, password_regex, GetPassword, ForgotPasswordRequest
from ..lib.auth.jwt import signJWT, Authenticator, UserRole, changepskJWT
from ..lib.auth.email_sender import send_email_async, changepasswordid
from bson import ObjectId
import re
from pydantic import BaseModel

router = APIRouter()


@router.post("/signup")
async def signup(data: Signup):
    try:
        user = db.user.find_one(
            {"$or": [{"email": data.email}, {"phone": data.phone}]})
        if user is None:
            _id = db.user.insert_one(data.create_user()).inserted_id
            await send_email_async("User verification", data.email, signJWT(str(_id), 15))
            return JSONResponse(content={"message": "User Signed Up Successfully. Now check the email", "status": True}, status_code=201)
        else:
            if user["email"] == data.email:
                raise Exception("email already exists")
            elif user["phone"] == data.phone:
                raise Exception("phone number already exists")
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=401)


@router.get("/userverify")
def user_verify(_id=Depends(Authenticator(False, UserRole.user).signupJWT)):
    try:
        if db.user.update_one({"_id": ObjectId(_id)}, {"$set": {"userVerified": True}}):
            return JSONResponse(content={"message": "User Verified Successfully", "status": True}, status_code=200)
        else:
            raise Exception("User Not Verified")
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=401)


@router.post("/fotgotpassword")
async def signup(data: ForgotPasswordRequest):
    try:
        user = db.user.find_one({"email": data.email})
        if user:
            await changepasswordid("Change password", data.email, changepskJWT(str(user["_id"]), 15))
            return JSONResponse(content={"message": "Now check the email to change the password", "status": True}, status_code=200)
        else:
            raise Exception("email not exist")
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=401)


@router.post("/changepassword")
def user_verify(password: GetPassword, data=Depends(Authenticator(True, UserRole.user).ChangePassword)):
    try:
        if re.match(password_regex, str(password.password)):
            if db.user.update_one({"_id": ObjectId(data["_id"])}, {"$set": {"password": pwd_context.hash(password.password)}}):
                return JSONResponse(content={"message": "password updated Successfully", "status": True}, status_code=200)
            else:
                raise Exception("User Not Verified")
        else:
            raise Exception(
                "Please enter a password that meets the required pattern")
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=500)


@router.post("/signin")
async def signup(data: Signin):
    try:
        user = db.user.find_one({"email": data.email})
        if user is not None:
            passwd = data.verify_user(user["password"])
            print(passwd)
            if "_id" in user and passwd:
                if user["userVerified"] == True:
                    return JSONResponse(content={"message": "User Signin Successfull", "status": True, "username": user["username"], "authorization": f"Bearer {signJWT(str(user['_id']),userVerified=True)}"}, status_code=200)
                else:
                    raise Exception("User Not Verified")
            else:
                raise Exception("Invalid Credentials")
        else:
            raise Exception("Invalid Credentials")
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=500)


@router.get("/user/{username}")
def user(username: str, data=Depends(Authenticator(True, UserRole.user).signupJWT)):
    if username == data["username"]:
        return JSONResponse(content={"message": "user details", "status": True, "data": data}, status_code=200)
    else:
        return JSONResponse(content={"message": f"not a valied token for {username}", "status": False}, status_code=401)
