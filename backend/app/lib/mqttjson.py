import json


class MqttMsg:

    def __init__(self, message: str, status: bool, isFinished: bool = False, isError: bool = False):
        self.message = message
        self.status = status
        self.isFinished = isFinished
        self.isError = isError

    def get(self):
        msg = {"message": self.message, "status": self.status,
               "isFinished": self.isFinished, "isError": self.isError}
        return json.dumps(msg)
