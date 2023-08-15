from ...database import db


class ContainerModels:
    def __init__(self, userId: str) -> None:
        self.db = db
        self.userId = userId

    def addLab(self, ipaddress: str, dockerip: str, username: str, password: str, labname: str):
        try:
            document = {
                "userId": self.userId,
                "wgipAddress": ipaddress,
                "dockerip": dockerip,
                "labname": labname,
                "username": username,
                "password": password,
                "vsCode": None,
                "vsPassword": None,
                "imageid": None,
                "containerid": None,
            }
            self.db.labs.insert_one(document)
        except Exception as e:
            raise (e)

    def upgradeVScode(self, vscode: str, vsPassword: str):
        try:
            self.db.labs.update_one({"userId": self.userId}, {
                "$set": {"vsCode": vscode, "vsPassword": vsPassword}})
        except Exception as e:
            raise (e)

    def upgradeContainerDetails(self, containerid: str, imageid: str):
        try:
            self.db.labs.update_one({"userId": self.userId}, {
                "$set": {"containerid": containerid, "imageid": imageid,
                         "vsCode": None, "vsPassword": None}})
        except Exception as e:
            raise (e)
