from ...database import db
import pymongo
from datetime import datetime


class NetworkModel:
    def __init__(self, userId: str) -> None:
        self.db = db
        self.userId = userId
        self.getNetwork()

    def getNetwork(self):
        user = self.db.network.find_one({"userId": self.userId})
        if user:
            self.labPeer = user["labPeer"]
            self.peerList = user["peerList"]
            self.domainList = user["domainList"]
            self.currentPeer = user["currentPeer"]
            self.maxPeer = user["maxPeer"]
            self.currentDomain = user["currentDomain"]
            self.maxDomain = user["maxDomain"]
            self.createdAt = user["createdAt"]
            self.haveNetwork = True
        else:
            self.labPeer = []
            self.peerList = []
            self.domainList = []
            self.currentPeer = 0
            self.maxPeer = 3
            self.currentDomain = 0
            self.maxDomain = 5
            self.haveNetwork = False
            self.createdAt = int(datetime.now().timestamp())


class WireguardNetwork(NetworkModel):
    def __init__(self, userId: str, ipaddress: str, publickey: str, devicename: str, devicetype: str) -> None:
        super().__init__(userId)
        self.ipAddress = ipaddress
        self.publicKey = publickey
        self.deviceName = devicename
        self.devicetype = devicetype

    def addLabPeer(self):
        self.labPeer.append({
            "ipAddress": self.ipAddress,
            "publicKey": self.publicKey,
            "deviceName": self.deviceName,
            "deviceType": self.devicetype,
            "createdAt": int(datetime.now().timestamp())
        })

        document = {
            'userId': self.userId,
            'labPeer': self.labPeer,  # Fix the labPeer assignment here
            'peerList': self.peerList,
            'domainList': self.domainList,
            'currentPeer': self.currentPeer,
            'maxPeer': self.maxPeer,
            'currentDomain': self.currentDomain,
            'maxDomain': self.maxDomain,
            'createdAt': self.createdAt
        }
        # Use bulk_write for improved performance
        bulk_operations = [
            pymongo.UpdateOne({"userId": self.userId}, {
                              "$set": document}, upsert=True)
        ]
        self.db.network.bulk_write(bulk_operations)

    def addPeer(self):
        # Example: Save network model data to the database
        if (self.currentPeer < self.maxPeer):
            self.peerList.append({
                "ipAddress": self.ipAddress,
                "publicKey": self.publicKey,
                "deviceName": self.deviceName,
                "deviceType": self.devicetype,
                "createdAt": int(datetime.now().timestamp())
            })
            self.currentPeer += 1

            document = {
                'userId': self.userId,
                'labPeer': self.labPeer,
                'peerList': self.peerList,
                'domainList': self.domainList,
                'currentPeer': self.currentPeer,
                'maxPeer': self.maxPeer,
                'currentDomain': self.currentDomain,
                'maxDomain': self.maxDomain,
                'createdAt': self.createdAt
            }
            # Use bulk_write for improved performance
            bulk_operations = [
                pymongo.UpdateOne({"userId": self.userId}, {
                                  "$set": document}, upsert=True)
            ]
            self.db.network.bulk_write(bulk_operations)
        else:
            raise ValueError("max peer reached")


class DomainNetwork(NetworkModel):
    def __init__(self, userId: str, domainName: str) -> None:
        super().__init__(userId)
        self.domainName = domainName

    def addDomain(self):
        # Example: Save network model data to the database
        if (self.currentDomain < self.maxDomain):
            existing_domain = self.db.network.find_one(
                {"domainList.domainName": {
                    "$regex": f'^{self.domainName}$', "$options": 'i'}}
            )
            if existing_domain:
                raise ValueError(f"{self.domainName} already taken")
            self.domainList.append({
                "domainName": self.domainName,
                "mapstatus":False,
                "mapto":None,
                "port":None,
                "folder":None,
                "createdAt":int(datetime.now().timestamp())
            })
            self.currentDomain += 1

            document = {
                'userId': self.userId,
                'labPeer': self.labPeer,
                'peerList': self.peerList,
                'domainList': self.domainList,
                'currentPeer': self.currentPeer,
                'maxPeer': self.maxPeer,
                'currentDomain': self.currentDomain,
                'maxDomain': self.maxDomain,
                'createdAt': self.createdAt
            }
            bulk_operations = [
                pymongo.UpdateOne({"userId": self.userId}, {
                                  "$set": document}, upsert=True)
            ]
            self.db.network.bulk_write(bulk_operations)
            return self.currentDomain
        else:
            raise ValueError("max domain reached")

    def updateDomain(self,updateDomain):
        update = self.db.network.update_one(
                {"userId": self.userId,"domainList.domainName": self.domainName},
                {"$set":{
                    "domainList.$.mapstatus":updateDomain.mapstatus,
                    "domainList.$.mapto":updateDomain.mapto,
                    "domainList.$.port":updateDomain.port,
                    "domainList.$.folder":updateDomain.folder
                }}
            )
        if update.matched_count == 0:
            raise ValueError(f"{self.domainName} domain name not available")
        
        return True
    
    def DropDomain(self):     
        find_domain = self.db.network.update_one(
                {"userId": self.userId}, {"$pull": {'domainList': {'domainName': self.domainName}}, "$set": {"currentDomain": self.currentDomain - 1}})
        if find_domain.matched_count == 0:
            raise ValueError(f"{self.domainName} domain name not available")
        
        return True