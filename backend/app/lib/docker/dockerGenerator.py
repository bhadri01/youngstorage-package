import os
import subprocess
from ..wg.wireguard import addWireguard
from .traefik import labelGenerator, domainLableGenerator
from ...database import db, mqtt_client
from fastapi import BackgroundTasks
from ...lib.models.labsModels import ContainerModels
import docker
from docker.errors import NotFound
from ..mqttjson import MqttMsg
from ..wg.wireguard import SanitizeFolderName

client = docker.from_env()

# create new container


def spawnContainer(_id: str, username: str, deviceName: str , deviceType: str, background_task: BackgroundTasks):
    try:
        mqtt_client.publish(
            f"/topic/{username}", MqttMsg("New Instances Started.....", True).get())
        baselist = list(db.baselist.find())
        if len(baselist) == 1:
            ip = baselist[0]["ip"]
            # this function will happens very first time
            # create two peer
            # 1-container
            ipdata = IpRange65535(ip)
            if ipdata["status"]:
                ip = ipdata["message"]
                # very first time will create the network
                # peer-1 for the container
                print("still worcking fine......")
                addWireguard(_id, username, ip,deviceName, deviceType)

            # this will create an new collection in the mongodb
            lab = ContainerModels(_id)
            # default lab name is ubuntu
            lab.addLab(ip, username, f"{username}@321", "ubuntu")

            # base list update for the ip issued log
            db.baselist.update_one({"_id": baselist[0]["_id"]}, {
                                   "$set": {"ip": ip, "ipissued": baselist[0]["ipissued"]+1, "no_client": baselist[0]["no_client"]+1}})

            source = os.path.join(os.getcwd(), "source")

            # create new docker file with giver username and peer vpn connection
            with open(os.path.join(source, "Dockerfile"), "w")as dockerfile:
                dockerfile.write(dockerGenerator(username, deviceName))
                dockerfile.close()

            # create setup.sh file to run inside the docker container after container
            # has been spawn
            with open(os.path.join(source, "setup.sh"), "w")as setup:
                setup.write(setupSh(username))
                setup.close()


            # both image build and container run happens in single shot
            # this will happens in the background task
            
            background_task.add_task(imageBuild, _id, username)

            return {"message": "Container process in background", "status": True}
        return {"message": "Issue in baselist data find", "status": False}
    except Exception as e:
        raise (e)

# redeploy the existing image


def reDeploy(_id: str, username: str,background_task: BackgroundTasks):
    try:
        mqtt_client.publish(
            f"/topic/{username}", MqttMsg(f"Container reDeploy starts.....{username}", True).get())
        # mqtt_client.publish("/topic/sample", "")
        # both image build and container run happens in single shot
        # this will happens in the background task
        background_task.add_task(containerRun, _id, username)
        return {"message": "Container rebuild process in background", "status": True}
    except Exception as e:
        raise (e)


# docker generator template
def dockerGenerator(username: str, deviceName: str):
    deviceName = SanitizeFolderName(deviceName)
    return f'''FROM ubuntu:latest
RUN apt update
ARG S6_OVERLAY_VERSION=3.1.0.1
RUN apt install -y openssh-server nano htop lsof python3-pip
RUN apt install -y sudo figlet lolcat bash-completion
ENV DEBIAN_FRONTEND noninteractive
RUN apt install -y ufw net-tools netcat curl apache2
RUN apt install -y inetutils-ping php libapache2-mod-php
RUN apt install -y iproute2 default-jre bc
RUN apt install -y build-essential git
RUN apt install -y wireguard 
RUN apt install -y zsh
RUN apt -y install xz-utils
RUN curl -fsSL https://deb.nodesource.com/setup_18.x |sudo -E bash - && \
    sudo apt install -y nodejs
RUN sudo -S npm install -g --unsafe-perm node-red
RUN service ssh start
RUN echo 'root:admin' | chpasswd
COPY wireguard /etc/init.d/
RUN echo "clear" >> /etc/bash.bashrc
RUN echo "figlet -t -c youngstorage | lolcat" >> /etc/bash.bashrc
RUN echo "echo ''" >> /etc/bash.bashrc
RUN curl -fsSL https://code-server.dev/install.sh | sh
COPY /code-server/login.html /usr/lib/code-server/src/browser/pages/
COPY /code-server/login.css /usr/lib/code-server/src/browser/pages/
COPY /code-server/global.css /usr/lib/code-server/src/browser/pages/
COPY /code-server/logo.png /usr/lib/code-server/src/browser/media/
COPY /code-server/workbench.html /usr/lib/code-server/lib/vscode/out/vs/code/browser/workbench/
COPY /index.html /var/www/html/
COPY setup.sh /
RUN chmod +x setup.sh
# peer variable
COPY {os.path.join("wgClients", username, deviceName,"wg0.conf")} /etc/wireguard/wg0.conf
# username variable
RUN adduser {username} --gecos "" --disabled-password
RUN echo "{username}:{username}@321" | sudo chpasswd
RUN usermod -aG sudo {username}
COPY .bashrc /home/{username}/
COPY /settings.js /home/{username}/.node-red/
CMD ["./setup.sh"]
'''

def setupSh(username: str):
    return f'''#!/bin/sh
#services start
wg-quick up wg0 #Peer Variable
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
sudo iptables -A FORWARD  -p tcp -i wg0 --dst 172.20.0.0/16
wget https://github.com/just-containers/s6-overlay/releases/download/v3.1.0.1/s6-overlay-noarch.tar.xz /tmp
tar -Jxpf s6-overlay-noarch.tar.xz
wget https://github.com/just-containers/s6-overlay/releases/download/v3.1.0.1/s6-overlay-x86_64.tar.xz /tmp
nohup tar -Jxpf s6-overlay-x86_64.tar.xz
rm -rf /tmp s6-overlay-noarch.tar.xz
rm -rf /tmp s6-overlay-x86_64.tar.xz
mkdir /tmp
chmod 777 /tmp
service ssh start

# htdocs symlink
mkdir /home/{username}/htdocs #username variable
cp /var/www/html/index.html /home/{username}/htdocs/
rm -rf /var/www/html
ln -s /home/{username}/htdocs/ /var/www/html #username variable


#apache config file symlink
mkdir /home/{username}/htconfig/
cp -rn /etc/apache2/sites-available/* /home/{username}/htconfig
rm -rf /etc/apache2/sites-available
ln -s /home/{username}/htconfig /etc/apache2/sites-available

# change permissions to htdocs
cd /home
chmod 775 {username} #username variable
chown -R {username}:{username} /home/{username}/htdocs #username variable
adduser www-data {username} #username variable
# echo "Options +FollowSymLinks +SymLinksIfOwnerMatch" > /home/{username}/htdocs/html/.htaccess #username variable
chmod o+x /home/{username}/htdocs/* #username variable

#chaning permissions to htconfig
chown -R {username}:{username} /home/{username}/htconfig
chown -R {username}:{username} /home/{username}/.ssh
chown -R {username}:{username} /home/{username}/.bashrc

#remove password
echo "{username} ALL=(ALL:ALL) NOPASSWD: /usr/sbin/a2ensite" | sudo tee -a /etc/sudoers.d/{username} > /dev/null
echo "{username} ALL=(ALL:ALL) NOPASSWD: /usr/sbin/a2enmod" | sudo tee -a /etc/sudoers.d/{username} > /dev/null
echo "{username} ALL=(ALL:ALL) NOPASSWD: /usr/sbin/a2dismod" | sudo tee -a /etc/sudoers.d/{username} > /dev/null
echo "{username} ALL=(ALL:ALL) NOPASSWD: /usr/sbin/a2dissite" | sudo tee -a /etc/sudoers.d/{username} > /dev/null

cd /home/{username}
touch init.sh
chmod +x  init.sh
chown -R {username}:{username} init.sh
./init.sh

#code-server configuration
cd /home/{username} #username variable
mkdir .config
mkdir .config/code-server
cd .config/code-server

#username variable
whoami >> id
echo "bind-addr: 0.0.0.0:1111
auth: password
password: {username}@321 
cert: false" > config.yaml
service apache2 start
chown -R {username}:{username} /home/{username}/.node-red/
npm i bcryptjs -g

#username variable
su {username} <<EOF 
chown {username}:{username} .ssh/
cd /home/{username} && ./init.sh
tail -f /dev/null
EOF
'''


def IpRange65535(ipaddress):
    try:
        ip = list(map(int, str(ipaddress).split(".")))
        for i in ip:
            if i > 255:
                raise ValueError("not a ipv4 format")
        if len(ip) == 4:
            if ip[3] < 255:
                ip[3] += 1
            elif ip[3] == 255:
                if ip[2] < 255:
                    ip[3] = 0
                    ip[2] += 1
                else:
                    raise ValueError("End of ipv4 list")
            ip = list(map(str, ip))
            return {"message": ".".join(ip), "status": True}
        else:
            raise ValueError("not a ipv4 format")
    except ValueError as e:
        raise (e)

# docker image build function


def imageBuild(_id: str, username: str):
    try:
        source = os.path.join(os.getcwd(), "source")
        cmd = ["docker", "build", "-t", f"{username}", f"{source}"]
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE)

        mqtt_client.publish(
            f"/topic/{username}", MqttMsg("image build started.....", True).get())
        # Read and print the output
        for line in process.stdout:
            print(line.decode().rstrip())

        # Wait for the process to finish
        process.wait()
        mqtt_client.publish(f"/topic/{username}",
                            MqttMsg("image build done!!", True).get())
        # docker run happens
        containerRun(_id, username)
    except Exception as e:
        mqtt_client.publish(f"/topic/{username}", str(e))

# docker container run function


def containerRun(_id: str, username: str):
    try:

        # container already exist flesh process
        exContainer = client.containers.get(username)
        if exContainer.id:
            exContainer.remove(force=True)
            mqtt_client.publish(
                f"/topic/{username}", MqttMsg(f"Removed existing container......", True).get())
            raise NotFound(f"{username} container removed")

    # container not found build new one
    except NotFound:
        # get the build image id
        imageId = str(client.images.get(username).id)

        # generate default trafik lable
        trafikLables = labelGenerator(imageId[len(imageId)-32:])

        # if domain exist add domain lables in traefik
        network = db.network.find_one({"userId": _id})
        if network["domainList"]:
            trafikLables.update(domainLableGenerator(
                username, network["domainList"]))

        mqtt_client.publish(f"/topic/{username}",
                            MqttMsg(f"build Id {imageId}........", True).get()
                            )
        mqtt_client.publish(
            f"/topic/{username}", MqttMsg("container run started.....", True).get())

        container = client.containers.run(image=imageId,
                                          hostname="youngstorage",
                                          labels=trafikLables,
                                          name=username,
                                          cap_add=["NET_ADMIN"],
                                          network="youngstorage_heart",
                                          cpuset_cpus= "1",
                                          mem_limit="1024M",
                                          restart_policy={"Name": "always"},
                                          volumes=[
                                              f'{username}:/home/{username}'],
                                          detach=True
                                          )

        # getting the ipaddress of the docker container using exec
        command = f"docker exec {username} sh -c \"ip -4 address show eth0 | grep inet | awk '{{print $2}}' | cut -d'/' -f1\""
        result = subprocess.check_output(command, shell=True, text=True)
        ip_address = result.strip().replace('inet ', '')

        # update the container details of containeripaddress,containerid,imageid
        lab = ContainerModels(_id)
        lab.upgradeContainerDetails(
            container.id, ip_address, imageId[len(imageId)-32:])
        mqtt_client.publish(f"/topic/{username}",
                            MqttMsg(f"{container.id}", True).get())

        # Wait for the process to finish
        mqtt_client.publish(
            f"/topic/{username}", MqttMsg("container successfully running.....", True, isFinished=True).get())

    except Exception as e:
        mqtt_client.publish(f"/topic/{username}", str(e))
