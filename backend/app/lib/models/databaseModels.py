from ...database import db
from pydantic import BaseModel
import pymongo
from enum import Enum
from datetime import datetime


class DataBaseTypes(str, Enum):
    Mysql = "mysql"
    Mariadb = "mariadb"
    Mongodb = "mongodb"


class CreateUser(BaseModel):
    username: str
    password: str


class CreateDB(BaseModel):
    username: str
    database: str
    collation: str
    charset: str


class DatabaseServices:
    def __init__(self, user: dict, max_names=5, max_users=3):
        self.db = db
        self.userId = user["_id"]
        self.dbUsers = {
            "userId": self.userId,
            "dbusers": [],
            "maxUsers": max_users,
            "currentUsers": 0,
            "createdAt": int(datetime.now().timestamp())
        }
        self.dbNames = {
            "username": "",
            "password": "",
            "dbNames": [],
            "currentNames": 0,
            "maxNames": max_names,
            "createdAt": int(datetime.now().timestamp())
        }
        self.dbTypes = {
            "database": "",
            "collation": "",
            "charset": "",
            "createdAt": int(datetime.now().timestamp())
        }

    def services(self):
        try:
            services = list(self.db.services.find())
            if services is None:
                return []
            for index, _ in enumerate(services):
                services[index]["_id"] = str(services[index]["_id"])
            return services
        except pymongo.errors.PyMongoError as e:
            raise Exception(str(e))

    def get_user(self, database: str):
        try:
            db_users = self.db[database].find_one({"userId": self.userId})
            if db_users is None:
                self.db[database].insert_one(self.dbUsers)
                db_users = self.db[database].find_one({"userId": self.userId})
            return db_users
        except pymongo.errors.PyMongoError as e:
            raise Exception(str(e))

    def check_user_exist(self, username: str, database: str):
        try:
            db_users = self.db[database].find_one(
                {"dbusers.username": username})
            if db_users is None:
                return False
            return True
        except pymongo.errors.PyMongoError as e:
            raise Exception(str(e))

    def is_max_user(self, database: str):
        try:
            db_users = self.db[database].find_one(
                {"$expr": {"$lt": ['$currentUsers', '$maxUsers']}})
            print(db_users)
            if db_users is None:
                return True
            return False
        except pymongo.errors.PyMongoError as e:
            raise Exception(str(e))

    def add_user(self, data: CreateUser, database: str):
        try:
            getusers = self.get_user(database)
            if self.db[database].find_one({"dbusers.username": data.username}):
                raise Exception(f"username - {data.username} already exist")
            else:
                dbuser = self.dbNames
                dbuser["username"] = data.username
                dbuser["password"] = data.password
                getusers["dbusers"].append(dbuser)
                getusers["currentUsers"] += 1
                self.db[database].update_one({"userId": self.userId},
                                             {"$set": getusers}
                                             )
                return self.db[database].find_one({"userId": self.userId})
        except pymongo.errors.PyMongoError as e:
            raise Exception(str(e))

    def drop_user(self, username: str, database: str):
        try:
            if not self.db[database].find_one({"dbusers.username": username}):
                raise Exception(f"username - {username} not exist")
            else:
                self.db[database].update_one({"userId": self.userId}, {"$pull": {"dbusers": {
                    "username": username}}, "$inc": {"currentUsers": -1}})
                return self.db[database].find_one({"userId": self.userId})
        except pymongo.errors.PyMongoError as e:
            raise Exception(str(e))

    # database function for the users
    def check_database_exist(self, db: str, database: str):
        try:
            db_users = self.db[database].find_one(
                {"dbusers.dbNames.database": db})
            if db_users is None:
                return False
            return True
        except pymongo.errors.PyMongoError as e:
            raise Exception(str(e))

    def is_max_database(self, database: str):
        try:
            db_users = self.db[database].find_one(
                {"$expr": {"$lt": ['$dbusers.currentNames', '$dbusers.maxNames']}})
            if db_users is None:
                return True
            return False
        except pymongo.errors.PyMongoError as e:
            raise Exception(str(e))

    def add_database_to_user(self, data: CreateDB, database: str):
        try:
            dbtype = self.dbTypes
            dbtype["database"] = f"{data.username}_{data.database}"
            dbtype["collation"] = data.collation
            dbtype["charset"] = data.charset
            result = self.db[database].update_one(
                {"dbusers.username": data.username},
                {"$push": {"dbusers.$.dbNames": dbtype},
                    "$inc": {"dbusers.$.currentNames": +1}}
            )
            if result.matched_count > 0 and result.modified_count > 0:
                return True
            else:
                raise Exception(
                    f"failed to add database {data.username}_{data.database}")
        except pymongo.errors.PyMongoError as e:
            raise Exception(str(e))
        except Exception as e:
            raise Exception(str(e))

    def drop_database_from_user(self, data: CreateDB, database: str):
        try:
            result = self.db[database].update_one(
                {"dbusers.username": data.username},
                {"$pull": {"dbusers.$.dbNames": {"database": f"{data.username}_{data.database}"}},
                    "$inc": {"dbusers.$.currentNames": -1}}
            )
            if result.matched_count > 0 and result.modified_count > 0:
                return True
            else:
                raise Exception(
                    f"failed to remove database {data.username}_{data.database}")
        except pymongo.errors.PyMongoError as e:
            raise Exception(str(e))
        except Exception as e:
            raise Exception(str(e))
