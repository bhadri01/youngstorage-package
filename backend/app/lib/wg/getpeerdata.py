import subprocess

class GetPeerData:
    def __init__(self, wgpublickey: str) -> None:
        self.wgpublickey = wgpublickey

    def EscapeWg(self):
        return self.wgpublickey.replace("/", r"\/").replace("+", r"\+")

    def GetPeer(self):

        if self.wgpublickey:
            command = f"sudo wg | awk '/peer: {self.EscapeWg()}/,/^$/'"
            result = subprocess.run(
                command, shell=True, check=True, capture_output=True, text=True)
            wglist = []

            # splited the data into list
            for wg in result.stdout.strip().split("\n"):
                wglist.append(wg.strip().split(": "))

            wgpeer = {
                "peer": "",
                "endpoint": "",
                "allowed ips": "",
                "latest handshake": "",
                "transfer": "",
            }
            # get perfect json data
            for wg in wglist:
                if (len(wg)):
                    if wg[0] == "peer":
                        wgpeer[wg[0]] = wg[1]
                    elif wg[0] == "endpoint":
                        wgpeer[wg[0]] = str(wg[1]).split(":")[0]
                    elif wg[0] == "allowed ips":
                        wgpeer[wg[0]] = str(wg[1]).split("/")[0]
                    elif wg[0] == "latest handshake":
                        datalen = str(wg[1]).split(",")
                        for i, d in enumerate(datalen):
                            dd = d.strip().split(" ")
                            if i == 0:
                                wgpeer[wg[0]] += dd[0]
                            else:
                                wgpeer[wg[0]] += ":"+dd[0]
                    elif wg[0] == "transfer":
                        datalen = str(wg[1]).split(",")
                        trans = {
                            "received": "",
                            "sent": ""
                        }
                        for d in datalen:
                            dd = d.strip().split(" ")
                            trans[dd[2]] = dd[0]+" "+dd[1]
                        wgpeer[wg[0]] = trans
            return (wgpeer)
        else:
            return {"message": "provice key", "status": False}
