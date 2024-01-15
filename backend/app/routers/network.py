from fastapi import APIRouter, Depends
from pydantic import BaseModel
from ..lib.wg.wireguard import addWireguard
from ..lib.auth.jwt import Authenticator, UserRole
from ..lib.docker.dockerGenerator import IpRange65535
from ..database import db
from ..lib.models.networkModels import DomainNetwork
from fastapi.responses import JSONResponse
from ..lib.wg.getpeerdata import GetPeerData
from fastapi.responses import FileResponse, StreamingResponse
from ..lib.wg.wireguard import SanitizeFolderName
from enum import Enum
from fastapi import Path, Query
import subprocess
import socket
expected_ip = "103.78.167.103"

router = APIRouter()


class Devices(BaseModel):
    deviceName: str
    deviceType: str


class Domain(BaseModel):
    domainName: str


class DomainMap(BaseModel):
    domainName: str
    mapstatus: bool = False
    mapto: str | None = None
    port: str | None = None
    folder: str | None = None

# this is for to get the entire network list


@router.get("/networks")
def getUserPeer(data: dict = Depends(Authenticator(True, UserRole.user).signupJWT)):
    try:
        network = db.network.find_one({"userId": str(data["_id"])})
        if network:
            network["_id"] = str(network["_id"])
            return JSONResponse(content={"message": "list of network", "status": True, "data": [network]}, status_code=200)
        else:
            return JSONResponse(content={"message": "No network", "status": True, "data": []}, status_code=200)
    except Exception as e:
        # Return error response with a status code of 500
        return JSONResponse(content={"message": str(e), "status": False}, status_code=500)


# this function is to add new peer for the user
@router.post("/addpeer")
def addUserPeer(devices: Devices, data: dict = Depends(Authenticator(True, UserRole.user).signupJWT)):
    try:
        baselist = list(db.baselist.find())
        if len(baselist) == 1:
            ip = baselist[0]["ip"]
            ipdata = IpRange65535(ip)
            if ipdata["status"]:
                ip = ipdata["message"]
                network = db.network.find_one({"userId": str(data["_id"])})
                status = {}
                if network:
                    if network["currentPeer"] < network["maxPeer"]:
                        status = addWireguard(data["_id"], data["username"], ip, deviceName=str(
                            devices.deviceName), deviceType=str(devices.deviceType), client=True)
                    else:
                        raise ValueError("max peer reached")
                else:
                    status = addWireguard(data["_id"], data["username"], ip, deviceName=str(
                        devices.deviceName), deviceType=str(devices.deviceType), client=True)

                if status["status"]:
                    db.baselist.update_one({"_id": baselist[0]["_id"]}, {
                        "$set": {"ip": ip, "ipissued": baselist[0]["ipissued"]+1}})
                    return JSONResponse(content=status, status_code=200)
        else:
            raise ValueError("Please check the baselist")
    except ValueError as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=500)

    except Exception as e:
        # Return error response with a status code of 500
        return JSONResponse(content={"message": str(e), "status": False}, status_code=500)


# this function is to add new domain -- all the CURD domain stuff happens here
@router.post("/addomain")
def addDomain(domain: Domain, data: dict = Depends(Authenticator(True, UserRole.user).signupJWT)):
    try:
        DomainNetwork(
            str(data["_id"]), domain.domainName).addDomain()
        return JSONResponse(content={"message": f"{domain.domainName} added successfully", "status": True}, status_code=201)
    except ValueError as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=403)
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=500)

# this function is to add new domain -- all the CURD domain stuff happens here


def verify_domain(domain, eip):
    try:
        ip = socket.gethostbyname(domain)
        return ip == eip
    except Exception as e:
        print(f"Error resolving DNS for {domain}: {e}")
        return False


@router.post("/addcustomdomain")
def addDomain(domain: Domain, data: dict = Depends(Authenticator(True, UserRole.user).signupJWT)):
    try:
        if (verify_domain(domain.domainName, expected_ip)):
            DomainNetwork(
                str(data["_id"]), domain.domainName).addDomain()
            return JSONResponse(content={"message": f"{domain.domainName} added successfully", "status": True}, status_code=201)
        else:
            return JSONResponse(content={"message": "Domain name not verified", "status": False}, status_code=400)
    except ValueError as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=403)
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=500)


@router.patch("/updatedomain")
def updateDomain(domain: DomainMap, data: dict = Depends(Authenticator(True, UserRole.user).signupJWT)):
    try:
        DomainNetwork(
            str(data["_id"]), domain.domainName).updateDomain(domain)
        return JSONResponse(content={"message": f"{domain.domainName} update successfully", "status": True}, status_code=201)
    except ValueError as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=403)
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=500)


@router.delete("/dropdomain")
def dropDomain(domain: Domain, data: dict = Depends(Authenticator(True, UserRole.user).signupJWT)):
    try:
        DomainNetwork(
            str(data["_id"]), domain.domainName).DropDomain()
        return JSONResponse(content={"message": f"{domain.domainName} droped successfully", "status": True}, status_code=201)
    except ValueError as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=403)
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=500)


@router.get("/getwgpeer")
def getwgpeer(data: dict = Depends(Authenticator(True, UserRole.user).signupJWT)):
    try:
        userId = str(data["_id"])
        userdata = db.network.find_one({"userId": userId})
        labpeerdata = []
        if userdata:
            # get the client peer list
            clientPeer = userdata["peerList"]

            if len(clientPeer) > 0:
                labpeerdata.extend(
                    [GetPeerData(i["publicKey"]).GetPeer() for i in clientPeer])

            # get the client peer list
            labPeer = userdata["labPeer"]
            if len(labPeer) > 0:
                labpeerdata.extend(
                    [GetPeerData(i["publicKey"]).GetPeer() for i in labPeer])

        return JSONResponse(content={"message": "wg peer handshake data", "status": True, "data": labpeerdata}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=403)


class FileType(str, Enum):
    Conf = "conf"
    Qr = "png"


class PeerRequest(BaseModel):
    publicKey: str


@router.post("/wgpeer/{filetype}")
def getpeerconf(publicKey: PeerRequest, filetype: FileType = Path(...), data: dict = Depends(Authenticator(True, UserRole.user).signupJWT)):
    try:
        userId = str(data["_id"])
        username = data["username"]
        network = db.network.find_one({"userId": userId})
        if network:
            getpeer = {}
            for item in network["labPeer"]:
                if item.get('publicKey') == publicKey.publicKey:
                    getpeer = item
            if not getpeer:
                for item in network["peerList"]:
                    if item.get('publicKey') == publicKey.publicKey:
                        getpeer = item
            if getpeer:
                return FileResponse(f"./source/wgClients/{username}/{SanitizeFolderName(getpeer['deviceName'])}/wg0.{filetype}")
            else:
                return JSONResponse(content={"message": "public key not found in the list", "status": False}, status_code=404)
        return JSONResponse(content={"message": "please Verify the user", "status": False}, status_code=401)
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=500)

# ping -c 1 172.20.0.107 -W 0.1


@router.get("/peerstatus/{ipaddress}")
def getpeerconf(ipaddress: str, data: dict = Depends(Authenticator(True, UserRole.user).signupJWT)):
    try:
        tx = "docker stats --no-stream | grep " + \
            data["username"]+"  | awk '{print "'"cpu "'" $3} {print "'"Memory_Usage "'" $4 $5 $6} {print "'"Memory_Percentage "'" $7} {print "'"Net_I "'" $8 $9 $10} {print "'"Block_I "'" $11 $12 $13} {print "'"PID "'" $14}'"
        sent = subprocess.run(
            tx, shell=True, capture_output=True, encoding="utf-8")
        sent2 = sent.stdout
        memdata = {}
        for i in sent2.split("\n"):
            j = i.split(" ")
            if len(j) == 2:
                memdata[j[0]] = j[1]
        # Execute the ping command and capture the output
        result = subprocess.run(
            ["ping", "-c", "1", ipaddress, "-W", "1"], capture_output=True, text=True, timeout=5)
        # Check the return code to determine success or failure
        if result.returncode == 0:
            return JSONResponse(content={"message": str(result.stdout), "status": True, "data": memdata}, status_code=200)
        else:
            return JSONResponse(content={"message": str(result.stderr), "status": False}, status_code=403)
    except subprocess.TimeoutExpired:
        return False, "Ping request timed out."
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=500)
