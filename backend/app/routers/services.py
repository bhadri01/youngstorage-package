from fastapi import APIRouter, Depends
from ..lib.auth.jwt import Authenticator, UserRole
from fastapi.responses import JSONResponse
from ..lib.models.databaseModels import CreateDB, CreateUser, DataBaseTypes, DatabaseServices
from ..database import db
import subprocess
import re

router = APIRouter()

''''
one operation for all the services 
Enum - services
1. mysql
2. mongodb
3. postgreSqlreturn JSONResponse(content={"message": str(e)}, status_code=400)

This one function will call all the db services by Enum Selection
'''

# get the entire users and database details of the userId


@router.get("/{database}/getdata")
def get_database_details(database: DataBaseTypes, user: dict = Depends(Authenticator(True, UserRole.user).signupJWT)):
    try:
        database_services = DatabaseServices(user=user)
        dbUsers = database_services.get_user()
        dbUsers["_id"] = str(dbUsers["_id"])
        return JSONResponse(status_code=200, content={"message": f"{database} details", "status": True, "data": dbUsers})
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=400)


# add new user to the database id
@router.post("/{database}/addUser")
def add_user_to_database(database: DataBaseTypes, data: CreateUser, user: dict = Depends(Authenticator(True, UserRole.user).signupJWT)):
    try:
        database_services = DatabaseServices(user)
        if not database_services.check_user_exist(data.username):
            if not database_services.is_max_user():
                out = subprocess.run(["docker", "exec", "-it", "mysql.youngstorage.in", "bash", "-c",
                                      f"./root/mysql_user_creation.sh {data.username} {data.password}"], capture_output=True)

                print(str(out))
                status_code_match = re.search(r'status_code=(\d+)', str(out))
                out_code = int(status_code_match.group(1))
                print(out_code)

                if (out_code == 401):
                    raise Exception("User Creation Operation failed")
                elif (out_code == 200):
                    dbUsers = database_services.add_user(data)
                    dbUsers["_id"] = str(dbUsers["_id"])
                    return JSONResponse(status_code=200, content={"message": f"{data.username} user added to {database}", "status": True, "data": dbUsers})
            else:
                raise Exception("max user reached")
        else:
            raise Exception(f"{data.username} - user already exist")
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=400)

# drop user from the database id


@router.delete("/{database}/dropUser/{username}")
def drop_user_from_database(database: DataBaseTypes, username: str, user: dict = Depends(Authenticator(True, UserRole.user).signupJWT)):
    try:
        out = subprocess.run(["docker", "exec", "-it", "mysql.youngstorage.in", "bash",
                             "-c", f"./root/mysql_drop_user.sh {username}"], capture_output=True)
        status_code_match = re.search(r'status_code=(\d+)', str(out))
        out_code = int(status_code_match.group(1))
        if (out_code == 200):
            database_services = DatabaseServices(user)
            dbUsers = database_services.drop_user(username)
            if dbUsers:
                return JSONResponse(status_code=200, content={"message": f"{username} - user removed from {database}", "status": True})
            else:
                raise Exception(f"{username} user not found in the {database}")
        elif (out_code == 401):
            raise Exception(f"{username} user drop operation failed")
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=400)


@router.post("/{database}/{username}/addDatabase")
def add_database_to_user(database: DataBaseTypes, username: str, data: CreateDB, user: dict = Depends(Authenticator(True, UserRole.user).signupJWT)):
    try:
        database_services = DatabaseServices(user)
        if database_services.check_user_exist(username):
            if not database_services.is_max_database():
                if not database_services.check_database_exist(f"{data.username}_{data.database}"):
                    out = subprocess.run(["docker", "exec", "-it", "mysql.youngstorage.in", "bash", "-c",
                                          f"./root/mysql_db_creation.sh {data.username}_{data.database} {data.username}"], capture_output=True)
                    print(str(out))
                    status_code_match = re.search(
                        r'status_code=(\d+)', str(out))
                    out_code = int(status_code_match.group(1))
                    if (out_code == 200):
                        if database_services.add_database_to_user(data):
                            return JSONResponse(content={"message": f"{data.username}_{data.database} database created successfully", "status": True}, status_code=200)
                    elif (out_code == 401):
                        raise Exception(
                            f"{data.username}_{data.database} database creation failed in {database}")
                else:
                    raise Exception(
                        f"{data.username}_{data.database} database already exist in {database}")
            else:
                raise Exception(f"Max database limit reached in {database}")
        else:
            raise Exception(f"{username} user not exist")
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=400)


@router.delete("/{database}/{username}/dropDatabase")
def drop_database_from_user(database: DataBaseTypes, username: str, data: CreateDB, user: dict = Depends(Authenticator(True, UserRole.user).signupJWT)):
    try:
        database_services = DatabaseServices(user)
        if database_services.check_user_exist(username):
            if database_services.check_database_exist(f"{data.username}_{data.database}"):
                out = subprocess.run(["docker", "exec", "-it", "mysql.youngstorage.in", "bash", "-c",
                                      f"./root/mysql_drop_db.sh {data.username}_{data.database}"], capture_output=True)
                print(str(out))
                status_code_match = re.search(r'status_code=(\d+)', str(out))
                out_code = int(status_code_match.group(1))
                if (out_code == 200):
                    if database_services.drop_database_from_user(data):
                        return JSONResponse(content={"message": f"{data.username}_{data.database} database dropped successfully", "status": True}, status_code=200)
                elif (out_code == 401):
                    raise Exception(
                        f"{data.username}_{data.database} database drop failed")
            else:
                raise Exception(
                    f"{data.username}_{data.database} database not exist in {database}")
        else:
            raise Exception(f"{username} user not exist")
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=400)
