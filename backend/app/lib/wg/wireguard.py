import os
import subprocess
from ...lib.models.networkModels import WireguardNetwork
from ...database import mqtt_client
from ..mqttjson import MqttMsg


#folder name " " to "-" filling the gap
def SanitizeFolderName(foldername:str):
    if foldername:
        return "-".join(foldername.split(" "))

# creating new wg peer file for the user


def addWireguard(_id: str, name: str, IPaddress: str, deviceName: str , deviceType: str , client: bool = False):
    try:
        # source dir for the client peer files save
        source = os.path.join(os.getcwd(), "source",
                              "wgClients", name, SanitizeFolderName(deviceName))

        # if dir not exist it will create one
        if not os.path.exists(source):
            os.makedirs(source)
            print("Directory created:", source)
            # generate wg piv puv psk keys
            cmd = f"wg genkey | tee {source}/privatekey | wg pubkey > {source}/publickey && wg genpsk > {source}/presharedKey"
            subprocess.check_output(cmd, shell=True, text=True)

            # reading privatekey
            with open(os.path.join(source, "privatekey")) as file:
                privatekey = file.read().strip()
                # creating the .conf for the VPN connection
                with open(os.path.join(source, f"wg0.conf"), "w") as conf:
                    conf.write(addWgConf(IPaddress, privatekey))
                    conf.close()
                file.close()

            cmd = f"qrencode -t png -o {os.path.join(source,'wg0.png')} -r {os.path.join(source,'wg0.conf')}"
            subprocess.check_output(cmd, shell=True, text=True)

            # reading publickey
            with open(os.path.join(source, "publickey")) as file:
                publickey = file.read().strip()
                file.close()
            # this class function will add the wireguard network function
            Network = WireguardNetwork(
                _id, IPaddress, publickey, deviceName, deviceType)
            if client:
                Network.addPeer()
            else:
                Network.addLabPeer()

            # add the peer data in the host system
            add_user_to_wireguard(name, deviceName, IPaddress, publickey)

            return {"message": f"{name}-{deviceName} peer added successfully", "status": True}
        else:
            print("Directory already exists:", source)
            return {"message": f"{deviceName} already exist", "status": True}

        
    except ValueError as e:
        raise (e)
    except Exception as e:
        raise (e)


# wg conf template
def addWgConf(IPaddress, privatekey):
    return f'''[Interface]
Address = {IPaddress}/32
PrivateKey = {privatekey}

[Peer]
PublicKey = {os.getenv("WIREGUARD_PUBLIC_KEY")}
Endpoint = {os.getenv("WIREGUARD_SERVER")}
AllowedIPs = {os.getenv("AllowedIPs")}
PersistentKeepalive = 5
'''

# wg peer template to add in vpn server


def addWgPeer(IPaddress, publickey):
    return f'''[Peer]
PublicKey = {publickey}
AllowedIPs = {IPaddress}/32'''


def add_user_to_wireguard(username, tag, IPaddress, publickey):
    try:
        # Define the command to add the user configuration to wg0.conf
        command = f'echo "{os.getenv("ROOT_PASSWORD")}" | sudo -S  sh -c \'echo "\n#{username}-{tag}\n[Peer]\nPublicKey={publickey}\nAllowedIPs={IPaddress}/32" >> /etc/wireguard/wg0.conf\''

        # Execute the command using subprocess
        process = subprocess.run(
            command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        if process.returncode == 0:
            mqtt_client.publish(
                "/topic/sample", MqttMsg(f'User {username}-{tag} added successfully', True).get())
        else:
            raise Exception(
                f'Error adding user {username}. Error message: {process.stderr.decode()}')

        # Reload WireGuard to apply the changes
        reload_command = f'echo "{os.getenv("ROOT_PASSWORD")}" | sudo -S ./source/restart.sh'
        process = subprocess.run(
            reload_command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        if process.returncode == 0:
            mqtt_client.publish(
                "/topic/sample", MqttMsg(f'{process.stdout.decode().strip()}', True).get())
        else:
            raise Exception(
                f'Error adding user {username}. Error message: {process.stderr.decode()}')
    except Exception as e:
        raise (e)
