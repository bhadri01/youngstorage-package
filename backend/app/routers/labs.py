from fastapi import BackgroundTasks, status, Response, APIRouter, Depends
from ..lib.docker.dockerGenerator import spawnContainer, reDeploy
from ..lib.auth.jwt import signJWT, Authenticator, UserRole
from ..database import db, mqtt_client
import subprocess
from ..lib.models.labsModels import ContainerModels
from fastapi.responses import JSONResponse
from ..lib.mqttjson import MqttMsg
import docker
import random
import string
import os

client = docker.from_env()

router = APIRouter()

# get the container status and details


@router.get("/getcontainer")
def getContainerData(data=Depends(Authenticator(True, UserRole.user).signupJWT)):
    try:
        container = db.labs.find_one({"userId": data["_id"]})
        if container:
            container["_id"] = str(container["_id"])
            return JSONResponse(content={"message": "container data", "status": True, "data": [container]}, status_code=200)
        else:
            return JSONResponse(content={"message": "container data", "status": True, "data": []}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=403)

# stop container functions


@router.get("/stopcontainer")
def stopContainer(data=Depends(Authenticator(True, UserRole.user).signupJWT)):
    try:
        container = db.labs.find_one({"userId": data["_id"]})
        if container:
            containerId = container["containerid"]
            process = subprocess.Popen(['docker', 'stop', containerId],
                                       stdout=subprocess.PIPE,
                                       stderr=subprocess.PIPE,
                                       text=True)
            stdout, stderr = process.communicate()

            # Check the return code to see if Docker stop was successful
            if process.returncode == 0:
                return JSONResponse(content={"message": "container stoped", "status": True, "data": stdout.strip()}, status_code=200)
            else:
                return JSONResponse(content={"message": "check the log", "status": True, "data": stderr.strip()}, status_code=403)
        else:
            return JSONResponse(content={"message": "no container available", "status": False}, status_code=403)
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=403)

# post to deploy new Instance or redeploy the existing Instance


@router.post("/deploy")
def createContainer(background_task: BackgroundTasks, data=Depends(Authenticator(True, UserRole.user).signupJWT)):
    try:
        # print(WireguardNetwork(userId=data["_id"],devicename="phone",ipaddress="172.0.0.2",publickey="123123").addPeer())
        container = db.labs.find_one({"userId": data["_id"]})
        # if container already exist redeploy happens
        if container:
            res = reDeploy(data["_id"], data["username"], background_task)
            return JSONResponse(content=res, status_code=200)
        else:  # container not already exist new instance will be created
            res = spawnContainer(
                data["_id"], data["username"], "Ubuntu Lab", "lab", background_task)
            return JSONResponse(content=res, status_code=200)

    except ValueError as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=403)
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=403)


@router.post("/upvscode")
def upVScode(data=Depends(Authenticator(True, UserRole.user).signupJWT)):
    try:
        # instance name
        username = data["username"]
        _id = data["_id"]

        # get the lab model
        lab = ContainerModels(_id)

        # getting image id and random passwor for the vs code in web
        imageId = str(client.images.get(username).id)
        random_string = generate_random_alphanumeric(10)

        # update the vscode details like link and password
        lab.upgradeVScode(
            f"https://{imageId[len(imageId)-32:]}.{os.getenv('DOMAIN_NAME')}", random_string)

        # command to up vscode in web
        command = f"docker exec -d {username} sh -c \"sed -i 's/^password:.*/password: {random_string}/' /home/{username}/.config/code-server/config.yaml \""
        # Execute the command using subprocess
        process = subprocess.Popen(
            command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        # print(stderr)
        
        # Check the command execution status
        if process.returncode == 0:
            # Print the command output
            mqtt_client.publish(
                f"/topic/{username}", MqttMsg("code server password updated...", True).get())
        else:
            mqtt_client.publish(
                f"/topic/{username}", MqttMsg(f"Command failed with exit code: {process.returncode}", False, isError=True).get())

        # commend to star the vs code
        docker_command = [
            "docker", "exec", "-d", "-u", username, username, 
            "code-server"
        ]
        try:
            print("enabeling")
            result = subprocess.run(
                docker_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
            # print("Command executed successfully.")
            # print("Stdout:", result.stdout)
            # print("Stderr:", result.stderr)
            mqtt_client.publish(
                f"/topic/{username}", MqttMsg("code server started running", True, isFinished=True).get())
            return JSONResponse(content={"message": f"Command executed successfully ", "status": True}, status_code=200)
        except subprocess.CalledProcessError as e:
            # print("Error:", e)
            # print("Stdout:", e.stdout)
            # print("Stderr:", e.stderr)
            mqtt_client.publish(
                f"/topic/{username}", MqttMsg(f"Command failed with exit code: {str(e)}", False, isError=True).get())
            return JSONResponse(content={"message": f'Command failed with exit code: {str(e)}', "status": False}, status_code=500)
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=500)


@router.get("/stopcontainer")
def stopContainer(data=Depends(Authenticator(True, UserRole.user).signupJWT)):
    try:
        container = client.containers.get(data["username"])
        print(container)
    except Exception as e:
        return JSONResponse(content={"message": str(e), "status": False}, status_code=500)


def generate_random_alphanumeric(length):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))


# demo : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGNkZWJjOTE2ZTE3OWVjNjZkNTViYTUiLCJ1c2VyVmVyaWZpZWQiOnRydWUsInJvbGUiOiJ1c2VyIiwiZXhwIjoxNjkxMzEwOTkyfQ.QvKH0Nw9d2ZajW7H7Xa5lJAyQya6jeBgGp6s8o2GroE
    